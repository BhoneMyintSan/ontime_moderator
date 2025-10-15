import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

interface TicketUpdateData {
  status?: string;
  refund_approved?: boolean;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    if (!params || !params.id) {
      return NextResponse.json(
        { status: 'error', message: 'Ticket ID is required' },
        { status: 400 }
      );
    }

    const ticketId = parseInt(params.id, 10);
    if (isNaN(ticketId)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid ticket ID' },
        { status: 400 }
      );
    }
    // Fetch ticket detail using Prisma relations and additional lookup for listing title
    const issue = await prisma.request_report.findUnique({
      where: { id: ticketId },
      select: {
        id: true,
        ticket_id: true,
        reporter_id: true,
        created_at: true,
        status: true,
        request_id: true,
        user: { select: { id: true, full_name: true } },
        service_request: {
          select: {
            id: true,
            listing_id: true,
            status_detail: true,
            user_service_request_provider_idTouser: { select: { id: true, full_name: true } },
          },
        },
      },
    });

    if (!issue) {
      return NextResponse.json(
        { status: 'error', message: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Fetch listing title separately (no direct relation on service_request model)
    const listingId = issue.service_request?.listing_id ?? null;
    let listingTitle: string = '';
    if (listingId !== null) {
      const listing = await prisma.service_listing.findUnique({
        where: { id: listingId },
        select: { id: true, title: true },
      });
      listingTitle = listing?.title ?? '';
    }

    const rawStatus = (issue.status ?? issue.service_request?.status_detail ?? '').toString().toLowerCase();
    const status = rawStatus && ['resolved', 'completed', 'closed'].includes(rawStatus) ? 'resolved' : 'ongoing';

    const data = {
      id: issue.id,
      ticket_id: issue.ticket_id,
      reporter_id: issue.reporter_id,
      reporter_name: issue.user?.full_name ?? '',
      request_id: issue.request_id,
      listing_id: listingId ?? 0,
      listing_title: listingTitle,
      provider_id: issue.service_request?.user_service_request_provider_idTouser?.id ?? '',
      provider_name: issue.service_request?.user_service_request_provider_idTouser?.full_name ?? '',
      created_at: issue.created_at ? new Date(issue.created_at).toISOString() : '',
      status,
    };

    return NextResponse.json({
      status: 'success',
      message: 'Ticket retrieved successfully',
      data
    });
  } catch (error) {
    console.error('Error in GET /api/tickets/[id]:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    
    if (!params || !params.id) {
      return NextResponse.json(
        { status: 'error', message: 'Ticket ID is required' }, 
        { status: 400 }
      );
    }

    const ticketId = parseInt(params.id);
    
    if (isNaN(ticketId)) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid ticket ID' }, 
        { status: 400 }
      );
    }

    const body: TicketUpdateData = await request.json();
    
    if (!body.status) {
      return NextResponse.json(
        { status: 'error', message: 'Status is required' }, 
        { status: 400 }
      );
    }

    // Map frontend status to database status
    const statusMapping: { [key: string]: 'completed' | 'pending' } = {
      'resolved': 'completed',
      'ongoing': 'pending'
    };

    const uiStatus = body.status.toLowerCase();
    const dbStatus = statusMapping[uiStatus];
    if (!dbStatus) {
      return NextResponse.json(
        { status: 'error', message: 'Invalid status value' }, 
        { status: 400 }
      );
    }

    // First, get the request_report to find the actual service_request ID and ticket_id
    const requestReport = await prisma.request_report.findUnique({
      where: { id: ticketId },
      select: { 
        request_id: true,
        ticket_id: true 
      }
    });

    if (!requestReport) {
      return NextResponse.json(
        { status: 'error', message: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Use transaction to update service_request, request_report, completion status, and handle refund
    const result = await prisma.$transaction(async (tx) => {
      // Update the actual service_request, not the request_report
      const updatedTicket = await tx.service_request.update({
        where: { id: requestReport.request_id },
        data: { 
          status_detail: dbStatus,
          updated_at: new Date()
        },
        include: {
          user_service_request_requester_idTouser: {
            select: {
              id: true,
              full_name: true,
              token_balance: true,
            }
          },
          user_service_request_provider_idTouser: {
            select: {
              id: true,
              full_name: true,
            }
          },
          payment: true,
        }
      });

      // Also update the request_report status to match
      await tx.request_report.update({
        where: { id: ticketId },
        data: { status: uiStatus }
      });

      let refundInfo = null;

      // If status is resolved, update service_request_completion and handle refund decision
      if (uiStatus === 'resolved') {
        console.log("Setting requester_completed and provider_completed to true for request:", requestReport.request_id);
        
        // Get the completion record - it must exist
        const existingCompletion = await tx.service_request_completion.findFirst({
          where: { request_id: requestReport.request_id }
        });

        if (!existingCompletion) {
          throw new Error(`Fatal error: service_request_completion record not found for request_id ${requestReport.request_id}`);
        }

        // Update the completion record
        await tx.service_request_completion.update({
          where: { id: existingCompletion.id },
          data: {
            requester_completed: true,
            provider_completed: true,
            is_active: false // Mark as inactive since issue is resolved
          }
        });

        // Handle refund decision (approved or denied)
        if (body.refund_approved === true || body.refund_approved === false) {
          console.log(`Processing refund decision for ticket ${ticketId}: ${body.refund_approved ? 'APPROVED' : 'DENIED'}`);

          // Find the payment record for this service request
          const payment = updatedTicket.payment.find(p => p.service_request_id === requestReport.request_id);

          if (!payment) {
            throw new Error("Payment record not found for this service request");
          }

          // Check if already processed
          if (payment.status === "refunded" || payment.status === "released") {
            throw new Error(`Payment has already been ${payment.status}`);
          }

          const requester = updatedTicket.user_service_request_requester_idTouser;
          const provider = updatedTicket.user_service_request_provider_idTouser;
          const tokenAmount = payment.amount_tokens;

          if (body.refund_approved === true) {
            // REFUND APPROVED: Return tokens to requester
            console.log(`Refunding ${tokenAmount} tokens to requester ${requester.id}`);

            // 1. Update service_request status to 'cancelled' and activity to 'inactive'
            await tx.service_request.update({
              where: { id: requestReport.request_id },
              data: {
                status_detail: "cancelled",
                activity: "inactive",
                updated_at: new Date()
              }
            });

            // 2. Update payment status to 'refunded'
            await tx.payment.update({
              where: { id: payment.id },
              data: {
                status: "refunded",
                updated_at: new Date()
              }
            });

            // 3. Add tokens back to the requester's balance
            const updatedRequester = await tx.user.update({
              where: { id: requester.id },
              data: {
                token_balance: {
                  increment: tokenAmount
                }
              }
            });

            // 4. Create a transaction record for the refund
            await tx.transaction.create({
              data: {
                user_id: requester.id,
                type: "refund",
                amount: tokenAmount,
                created_at: new Date()
              }
            });

            // 5. Create event for the refund
            const event = await tx.event.create({
              data: {
                target_id: requestReport.request_id,
                type: "request",
                description: "refund_approved",
                created_at: new Date()
              }
            });

            // 6. Create notifications for both users
            const requesterMessage = `Your refund of ${tokenAmount} tokens has been approved and processed for ticket #${requestReport.ticket_id}`;
            const providerMessage = `Refund of ${tokenAmount} tokens was approved for ticket #${requestReport.ticket_id}. Payment has been returned to the requester.`;
            
            await tx.notification.create({
              data: {
                message: requesterMessage,
                recipient_user_id: requester.id,
                action_user_id: null,
                event_id: event.id,
                is_read: false
              }
            });

            await tx.notification.create({
              data: {
                message: providerMessage,
                recipient_user_id: provider.id,
                action_user_id: null,
                event_id: event.id,
                is_read: false
              }
            });

            refundInfo = {
              decision: 'approved',
              token_amount: tokenAmount,
              requester_new_balance: updatedRequester.token_balance,
              requester_id: requester.id,
              requester_message: requesterMessage,
              provider_id: provider.id,
              provider_message: providerMessage
            };

          } else {
            // REFUND DENIED: Release tokens to provider
            console.log(`Refund denied. Releasing ${tokenAmount} tokens to provider ${provider.id}`);

            // 1. Update service_request status to 'completed' and activity to 'inactive'
            await tx.service_request.update({
              where: { id: requestReport.request_id },
              data: {
                status_detail: "completed",
                activity: "inactive",
                updated_at: new Date()
              }
            });

            // 2. Update payment status to 'released'
            await tx.payment.update({
              where: { id: payment.id },
              data: {
                status: "released",
                updated_at: new Date()
              }
            });

            // 3. Add tokens to the provider's balance
            const updatedProvider = await tx.user.update({
              where: { id: provider.id },
              data: {
                token_balance: {
                  increment: tokenAmount
                }
              }
            });

            // 4. Create a transaction record for the payment release
            await tx.transaction.create({
              data: {
                user_id: provider.id,
                type: "payment",
                amount: tokenAmount,
                created_at: new Date()
              }
            });

            // 5. Create event for the refund denial
            const event = await tx.event.create({
              data: {
                target_id: requestReport.request_id,
                type: "request",
                description: "refund_denied",
                created_at: new Date()
              }
            });

            // 6. Create notifications for both users
            const requesterMessage = `Your refund request for ticket #${requestReport.ticket_id} has been denied. Payment of ${tokenAmount} tokens has been released to the provider.`;
            const providerMessage = `Refund request was denied for ticket #${requestReport.ticket_id}. You have received ${tokenAmount} tokens.`;
            
            await tx.notification.create({
              data: {
                message: requesterMessage,
                recipient_user_id: requester.id,
                action_user_id: null,
                event_id: event.id,
                is_read: false
              }
            });

            await tx.notification.create({
              data: {
                message: providerMessage,
                recipient_user_id: provider.id,
                action_user_id: null,
                event_id: event.id,
                is_read: false
              }
            });

            refundInfo = {
              decision: 'denied',
              token_amount: tokenAmount,
              provider_new_balance: updatedProvider.token_balance,
              requester_id: requester.id,
              requester_message: requesterMessage,
              provider_id: provider.id,
              provider_message: providerMessage
            };
          }
        }
      }

      return { updatedTicket, refundInfo };
    });

    // Emit Pusher notifications for both users if refund was processed
    if (result.refundInfo) {
      try {
        const { emit } = await import("@/lib/pusher");
        
        // Notify requester
        await emit(`user-${result.refundInfo.requester_id}`, "new-notification", {
          message: result.refundInfo.requester_message,
          event_type: result.refundInfo.decision === 'approved' ? "refund_approved" : "refund_denied",
          ticket_id: ticketId,
          token_amount: result.refundInfo.token_amount,
        });
        
        // Notify provider
        await emit(`user-${result.refundInfo.provider_id}`, "new-notification", {
          message: result.refundInfo.provider_message,
          event_type: result.refundInfo.decision === 'approved' ? "refund_approved" : "refund_denied",
          ticket_id: ticketId,
          token_amount: result.refundInfo.token_amount,
        });
        
        console.log("Pusher notifications sent to both users for refund decision");
      } catch (pusherError) {
        console.error("Failed to send Pusher notifications:", pusherError);
        // Don't fail the request if Pusher fails
      }
    }

    // Re-fetch the issue to build consistent response shape
    const updatedIssue = await prisma.request_report.findUnique({
      where: { id: ticketId },
      select: {
        id: true,
        ticket_id: true,
        reporter_id: true,
        created_at: true,
        status: true,
        request_id: true,
        user: { select: { id: true, full_name: true } },
        service_request: {
          select: {
            id: true,
            listing_id: true,
            status_detail: true,
            user_service_request_provider_idTouser: { select: { id: true, full_name: true } },
          },
        },
      },
    });

    if (!updatedIssue) {
      return NextResponse.json(
        { status: 'error', message: 'Ticket not found after update' },
        { status: 404 }
      );
    }

    const updatedListingId = updatedIssue.service_request?.listing_id ?? null;
    let updatedListingTitle: string = '';
    if (updatedListingId !== null) {
      const listing = await prisma.service_listing.findUnique({
        where: { id: updatedListingId },
        select: { id: true, title: true },
      });
      updatedListingTitle = listing?.title ?? '';
    }

    const mappedStatus = uiStatus;

    const responseData = {
      id: updatedIssue.id,
      ticket_id: updatedIssue.ticket_id,
      reporter_id: updatedIssue.reporter_id,
      reporter_name: updatedIssue.user?.full_name ?? '',
      request_id: updatedIssue.request_id,
      listing_id: updatedListingId ?? 0,
      listing_title: updatedListingTitle,
      provider_id: updatedIssue.service_request?.user_service_request_provider_idTouser?.id ?? '',
      provider_name: updatedIssue.service_request?.user_service_request_provider_idTouser?.full_name ?? '',
      created_at: updatedIssue.created_at ? new Date(updatedIssue.created_at).toISOString() : '',
      status: mappedStatus,
      ...(result.refundInfo && {
        refund_processed: true,
        refund_decision: result.refundInfo.decision,
        token_amount: result.refundInfo.token_amount,
        ...(result.refundInfo.decision === 'approved' && {
          requester_new_balance: result.refundInfo.requester_new_balance
        }),
        ...(result.refundInfo.decision === 'denied' && {
          provider_new_balance: result.refundInfo.provider_new_balance
        })
      })
    };

    const successMessage = result.refundInfo 
      ? `Ticket resolved. Refund ${result.refundInfo.decision}: ${result.refundInfo.token_amount} tokens ${result.refundInfo.decision === 'approved' ? 'returned to requester' : 'released to provider'}`
      : 'Ticket updated successfully';

    return NextResponse.json({
      status: 'success',
      message: successMessage,
      data: responseData,
    });
  } catch (error) {
    console.error('Error in PATCH /api/tickets/[id]:', error);
    
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { status: 'error', message: 'Ticket not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { status: 'error', message: 'Failed to update ticket' },
      { status: 500 }
    );
  }
}
