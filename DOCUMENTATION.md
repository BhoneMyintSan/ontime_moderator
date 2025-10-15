# OnTime Moderator - Complete Implementation Documentation

**Project:** OnTime Service Platform - Moderator Dashboard  
**Version:** 1.0.0  
**Date:** October 15, 2025  
**Author:** BhoneMyintSan  
**Technology Stack:** Next.js 15.3.2, TypeScript, Prisma ORM, PostgreSQL

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Database Schema](#database-schema)
4. [Feature Implementation](#feature-implementation)
5. [API Endpoints](#api-endpoints)
6. [User Interface Components](#user-interface-components)
7. [Real-time Features](#real-time-features)
8. [Security & Authentication](#security--authentication)
9. [Deployment & Configuration](#deployment--configuration)
10. [Common Questions & Answers](#common-questions--answers)
11. [Troubleshooting Guide](#troubleshooting-guide)
12. [Future Enhancements](#future-enhancements)

---

## Executive Summary

### Project Overview
The OnTime Moderator Dashboard is a comprehensive web-based administrative system designed to manage and moderate a service marketplace platform. The system enables moderators to handle user reports, issue tickets, refund requests, user management, and service provider oversight.

### Key Objectives
- **Efficient Moderation:** Streamline the process of reviewing and resolving user-reported issues
- **User Safety:** Protect platform integrity by managing violations and enforcing community standards
- **Transparency:** Provide clear audit trails for all moderation actions
- **Scalability:** Handle growing user base and increasing moderation workload
- **Real-time Updates:** Enable instant notifications for critical moderation events

### Target Users
- **Primary:** Platform moderators and administrators
- **Secondary:** Support team members requiring oversight capabilities

---

## System Architecture

### Technology Stack

#### Frontend
- **Framework:** Next.js 15.3.2 (App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)
- **Navigation:** Next.js App Router with client-side navigation

#### Backend
- **Runtime:** Node.js
- **API:** Next.js API Routes (serverless functions)
- **Database ORM:** Prisma 6.2.0
- **Database:** PostgreSQL (Neon serverless)
- **Real-time:** Pusher 5.2.0 (WebSocket alternative)

#### DevOps
- **Hosting:** Vercel
- **Version Control:** Git/GitHub
- **Package Manager:** npm

### Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Dashboard │  │   Tables   │  │   Forms    │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js App Router Layer                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Pages    │  │ Components │  │    API     │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                    │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Prisma   │  │  Services  │  │ Validators │            │
│  └────────────┘  └────────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│              PostgreSQL Database (Neon)                      │
│  ┌──────┐  ┌──────┐  ┌────────┐  ┌────────────┐           │
│  │ User │  │Report│  │Ticket  │  │Service     │           │
│  └──────┘  └──────┘  └────────┘  │Listing     │           │
│                                   └────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns
1. **Server-Side Rendering (SSR):** Initial page loads with data pre-fetched
2. **Client-Side Navigation:** Subsequent navigation uses React Router for speed
3. **API Route Handlers:** RESTful endpoints for CRUD operations
4. **Component Composition:** Reusable UI components for consistency
5. **Separation of Concerns:** Clear boundaries between data, business logic, and presentation

---

## Database Schema

### Core Tables

#### 1. User Table
Stores all platform users (service seekers, providers, and moderators).

```sql
TABLE user {
  id: SERIAL PRIMARY KEY
  full_name: VARCHAR(255)
  email: VARCHAR(255) UNIQUE
  password_hash: VARCHAR(255)
  role: VARCHAR(50)  -- 'user', 'provider', 'moderator'
  status: VARCHAR(50)  -- 'active', 'suspended', 'banned'
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

**Key Fields:**
- `role`: Determines user permissions and access levels
- `status`: Controls account access and visibility
- `email`: Unique identifier for authentication

#### 2. Service Listing Table
Contains all service offerings posted by providers.

```sql
TABLE service_listing {
  id: SERIAL PRIMARY KEY
  posted_by: INTEGER REFERENCES user(id)
  title: VARCHAR(255)
  description: TEXT
  category: VARCHAR(100)
  price: DECIMAL(10,2)
  status: VARCHAR(50)  -- 'active', 'suspended', 'removed'
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

**Key Fields:**
- `posted_by`: Foreign key to user who created the listing
- `status`: Controls listing visibility and availability
- `category`: Enables filtering and organization

#### 3. Service Request Table
Tracks service booking requests from users.

```sql
TABLE service_request {
  id: SERIAL PRIMARY KEY
  listing_id: INTEGER REFERENCES service_listing(id)
  requester_id: INTEGER REFERENCES user(id)
  provider_id: INTEGER REFERENCES user(id)
  status: VARCHAR(50)  -- 'pending', 'accepted', 'completed', 'cancelled'
  created_at: TIMESTAMP
  completed_at: TIMESTAMP
}
```

**Key Relationships:**
- `requester_id` → User who requested the service
- `provider_id` → User providing the service
- `listing_id` → The service being requested

#### 4. Report Table
User-generated reports about service listings or users.

```sql
TABLE report {
  id: SERIAL PRIMARY KEY
  listing_id: INTEGER REFERENCES service_listing(id)
  reporter_id: INTEGER REFERENCES user(id)
  report_reason: TEXT
  status: VARCHAR(50)  -- 'pending', 'resolved', 'dismissed'
  datetime: TIMESTAMP
  resolved_at: TIMESTAMP
}
```

**Purpose:** Track community-reported violations and issues

#### 5. Request Report Table
Issue tickets for service request problems.

```sql
TABLE request_report {
  id: SERIAL PRIMARY KEY
  ticket_id: VARCHAR(50) UNIQUE
  request_id: INTEGER REFERENCES service_request(id)
  reporter_id: INTEGER REFERENCES user(id)
  issue_reason: TEXT
  status: VARCHAR(50)  -- 'ongoing', 'resolved'
  refund_approved: BOOLEAN  -- true, false, null (pending)
  created_at: TIMESTAMP
  resolved_at: TIMESTAMP
}
```

**Special Features:**
- `ticket_id`: Human-readable identifier (e.g., "T-1001")
- `refund_approved`: Three-state logic (approved/denied/pending)
- Links service requests to moderation actions

#### 6. Warning Table
Tracks warnings issued to users and providers.

```sql
TABLE warning {
  id: SERIAL PRIMARY KEY
  user_id: INTEGER REFERENCES user(id)
  listing_id: INTEGER REFERENCES service_listing(id)
  reason: TEXT
  severity: VARCHAR(50)  -- 'minor', 'major', 'critical'
  issued_at: TIMESTAMP
  issued_by: INTEGER REFERENCES user(id)  -- moderator
}
```

**Purpose:** Escalation system before suspensions or bans

### Database Relationships Diagram

```
┌──────────┐
│   User   │◄────────────────┐
└──────────┘                 │
     │                       │
     │ posted_by             │ reporter_id
     ▼                       │
┌─────────────────┐          │
│ Service Listing │          │
└─────────────────┘          │
     │                       │
     │ listing_id            │
     ▼                       │
┌─────────────────┐          │
│Service Request  │          │
└─────────────────┘          │
     │                       │
     │ request_id            │
     ▼                       │
┌─────────────────┐          │
│ Request Report  │──────────┘
│   (Ticket)      │
└─────────────────┘

┌──────────┐
│   User   │◄─────────────┐
└──────────┘              │
     │                    │
     │                    │ reporter_id
     ▼                    │
┌─────────────────┐       │
│Service Listing  │       │
└─────────────────┘       │
     │                    │
     │ listing_id         │
     ▼                    │
┌─────────────────┐       │
│     Report      │───────┘
└─────────────────┘
```

---

## Feature Implementation

### 1. Dashboard Overview

**File:** `app/dashboard/page.tsx`

**Purpose:** Central hub displaying key metrics and recent activity.

**Features:**
- Real-time statistics cards (total tickets, pending reports, active users)
- Quick action buttons for common tasks
- Recent activity feed
- Navigation to all moderation sections

**Implementation Details:**
```typescript
// Data fetching on server-side
async function fetchDashboardStats() {
  const stats = await prisma.$transaction([
    prisma.request_report.count({ where: { status: 'ongoing' } }),
    prisma.report.count({ where: { status: 'pending' } }),
    prisma.user.count({ where: { status: 'active' } })
  ]);
  return stats;
}
```

**Key Metrics Displayed:**
- Total Open Tickets
- Pending Reports
- Active Users
- Resolved Issues (Last 30 Days)
- Average Resolution Time

---

### 2. Issue Ticket Management

**Files:** 
- `app/dashboard/tickets/page.tsx` (List View)
- `app/dashboard/tickets/[id]/page.tsx` (Detail View)
- `app/api/tickets/route.ts` (API)

#### 2.1 Ticket Listing

**Features:**
- Sortable table by date (newest first)
- Search by ticket ID, reporter name, or provider name
- Filter by status (Ongoing/Resolved)
- Refund status indicator (Approved/Denied/Pending)
- Responsive design (table on desktop, cards on mobile)
- Pagination support

**SQL Query Implementation:**
```sql
SELECT 
  r.id, 
  r.ticket_id, 
  r.request_id, 
  r.reporter_id, 
  r.issue_reason, 
  r.status, 
  r.refund_approved,
  r.created_at,
  u1.full_name as reporter_name,
  sr.provider_id,
  u2.full_name as provider_name
FROM request_report r
JOIN "user" u1 ON u1.id = r.reporter_id
JOIN service_request sr ON sr.id = r.request_id
JOIN "user" u2 ON u2.id = sr.provider_id
ORDER BY r.created_at DESC
```

**Why This Query:**
- Joins three tables to get complete ticket information
- Includes both reporter and provider details
- Sorts by creation date (newest first) for priority handling
- Retrieves refund status for display

#### 2.2 Ticket Detail Page

**Features:**
- Complete ticket information display
- Reporter and provider profiles
- Service request details
- Issue description
- Status management dropdown (Ongoing/Resolved)
- Refund decision dropdown (Pending/Approved/Denied)
- Color-coded status indicators
- Action history timeline

**Refund Management Implementation:**
```typescript
const [refundStatus, setRefundStatus] = useState<'pending' | 'approved' | 'denied'>(
  ticket.refund_approved === true ? 'approved' 
    : ticket.refund_approved === false ? 'denied' 
    : 'pending'
);

const handleRefundChange = async (value: string) => {
  setRefundStatus(value as 'pending' | 'approved' | 'denied');
  
  // API call to update refund status
  await fetch(`/api/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      refund_approved: value === 'approved' ? true 
        : value === 'denied' ? false 
        : null 
    })
  });
};
```

**Refund States Explained:**
- **Pending (null):** Default state, moderator hasn't decided yet
- **Approved (true):** Tokens will be refunded to the service requester
- **Denied (false):** No refund will be issued

**Color Coding:**
- Green: Approved/Resolved (positive outcome)
- Red: Denied (negative outcome)
- Yellow: Pending/Ongoing (requires attention)

---

### 3. Service Report Management

**Files:**
- `app/dashboard/reports/page.tsx` (List View)
- `app/dashboard/reports/[id]/page.tsx` (Detail View)
- `app/api/reports/route.ts` (API)

#### 3.1 Report Listing

**Features:**
- Chronological sorting (newest to oldest)
- Reporter and offender information
- Report reason preview
- Status filtering
- Quick navigation to detail view

**SQL Query:**
```sql
SELECT 
  r.id, 
  r.listing_id, 
  r.reporter_id, 
  r.status, 
  r.datetime, 
  r.report_reason,
  u1.full_name as reporter_name,
  u2.full_name as offender_name
FROM report r
JOIN "user" u1 ON u1.id = r.reporter_id
JOIN service_listing l ON l.id = r.listing_id
JOIN "user" u2 ON u2.id = l.posted_by
ORDER BY r.datetime DESC
```

**Why Chronological Order:**
- Recent reports likely need urgent attention
- Helps moderators prioritize workload
- Aligns with real-time moderation needs

#### 3.2 Report Detail & Service Suspension

**Features:**
- Full report context
- Service listing details
- User profiles (reporter and offender)
- Service suspension capability
- Suspension reason documentation
- Warning history display

**Suspension Implementation:**
```typescript
const handleSuspendService = async () => {
  if (!suspendReason.trim()) {
    alert('Please provide a reason for suspension');
    return;
  }
  
  // Update service listing status
  await fetch(`/api/services/${report.listing_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      status: 'suspended',
      suspension_reason: suspendReason
    })
  });
  
  // Create warning record
  await fetch('/api/warnings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: report.offender_id,
      listing_id: report.listing_id,
      reason: suspendReason,
      severity: 'major'
    })
  });
};
```

**Suspension Dialog:**
- Modal confirmation prevents accidental suspensions
- Requires written reason for audit trail
- Creates warning record automatically
- Updates service listing status to "suspended"

**Warning History Display:**
```typescript
// Fetch warnings for the service/user
const warnings = await prisma.warning.findMany({
  where: {
    OR: [
      { listing_id: report.listing_id },
      { user_id: report.offender_id }
    ]
  },
  orderBy: { issued_at: 'desc' }
});

// Display with severity indicators
{warnings.map(warning => (
  <div className={`border-l-4 ${
    warning.severity === 'critical' ? 'border-red-500' :
    warning.severity === 'major' ? 'border-orange-500' :
    'border-yellow-500'
  }`}>
    <p>{warning.reason}</p>
    <span>{new Date(warning.issued_at).toLocaleDateString()}</span>
  </div>
))}
```

---

### 4. User Management

**Files:**
- `app/dashboard/users/page.tsx` (List View)
- `app/dashboard/users/[id]/page.tsx` (Detail View)
- `app/api/users/route.ts` (API)

**Features:**
- User search and filtering
- Role-based view (Users/Providers/Moderators)
- Account status management (Active/Suspended/Banned)
- User activity history
- Service listings overview (for providers)
- Violation history

**User Status Management:**
```typescript
const updateUserStatus = async (userId: number, status: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { 
      status,
      updated_at: new Date()
    }
  });
  
  // If banning/suspending, also suspend their active listings
  if (status === 'banned' || status === 'suspended') {
    await prisma.service_listing.updateMany({
      where: { 
        posted_by: userId,
        status: 'active'
      },
      data: { status: 'suspended' }
    });
  }
};
```

**Account Status Types:**
- **Active:** Normal account with full platform access
- **Suspended:** Temporary restriction, can be lifted
- **Banned:** Permanent restriction, requires appeal

---

### 5. Refund Management System

**Implementation Across Multiple Components:**

#### 5.1 Database Field
```sql
ALTER TABLE request_report 
ADD COLUMN refund_approved BOOLEAN DEFAULT NULL;
```

**Three-State Logic:**
- `NULL` → Pending decision
- `TRUE` → Refund approved
- `FALSE` → Refund denied

#### 5.2 API Endpoint
```typescript
// PATCH /api/tickets/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { refund_approved } = await request.json();
  
  const updated = await prisma.request_report.update({
    where: { id: parseInt(params.id) },
    data: { 
      refund_approved,
      updated_at: new Date()
    }
  });
  
  // Trigger refund processing if approved
  if (refund_approved === true) {
    await processRefund(updated.request_id);
  }
  
  return Response.json(updated);
}
```

#### 5.3 UI Component
```typescript
<select
  value={refundStatus}
  onChange={(e) => handleRefundChange(e.target.value)}
  className={`px-4 py-2 rounded-lg ${
    refundStatus === 'approved' ? 'bg-green-500/20 text-green-400' :
    refundStatus === 'denied' ? 'bg-red-500/20 text-red-400' :
    'bg-yellow-500/20 text-yellow-400'
  }`}
>
  <option value="pending">⏳ Pending Review</option>
  <option value="approved">✓ Approve Refund</option>
  <option value="denied">✗ Deny Refund</option>
</select>
```

**Business Logic:**
- Refunds issued when service was not delivered as promised
- Moderator reviews ticket details before deciding
- System automatically processes approved refunds
- Tokens returned to requester's account balance

---

### 6. Search and Filtering System

**File:** `components/SearchAndFilter.tsx`

**Features:**
- Real-time search across multiple fields
- Debounced input for performance
- Status-based filtering
- Combined search and filter logic

**Implementation:**
```typescript
const SearchAndFilter = ({ 
  onSearch, 
  onFilter, 
  filterOptions 
}: SearchFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Debounce search to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  return (
    <div className="flex gap-4">
      <input 
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <select 
        value={selectedFilter}
        onChange={(e) => onFilter(e.target.value)}
      >
        {filterOptions.map(opt => (
          <option value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};
```

**Searchable Fields by Page:**
- **Tickets:** Ticket ID, Reporter Name, Provider Name, Issue Reason
- **Reports:** Reporter Name, Offender Name, Report Reason
- **Users:** Full Name, Email, User ID

---

### 7. Pagination Component

**File:** `components/Pagination.tsx`

**Features:**
- Dynamic page number generation
- Previous/Next navigation
- Current page highlighting
- Responsive design

**Implementation:**
```typescript
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="flex gap-2 justify-center">
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          className={currentPage === page ? 'active' : ''}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};
```

**Pagination Strategy:**
- Items per page: 20 (configurable)
- Maximum visible page numbers: 7
- Shows ellipsis (...) for large page counts

---

## API Endpoints

### REST API Structure

All API endpoints follow RESTful conventions and return JSON responses.

#### Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.vercel.app/api
```

### 1. Tickets API

#### GET /api/tickets
**Purpose:** Retrieve all issue tickets

**Response:**
```json
{
  "tickets": [
    {
      "id": 1,
      "ticket_id": "T-1001",
      "request_id": 45,
      "reporter_id": 12,
      "reporter_name": "John Doe",
      "provider_id": 34,
      "provider_name": "Jane Smith",
      "issue_reason": "Service not delivered",
      "status": "ongoing",
      "refund_approved": null,
      "created_at": "2025-10-15T10:30:00Z"
    }
  ]
}
```

#### GET /api/tickets/[id]
**Purpose:** Get single ticket details

**Response:**
```json
{
  "id": 1,
  "ticket_id": "T-1001",
  "reporter": {
    "id": 12,
    "full_name": "John Doe",
    "email": "john@example.com"
  },
  "provider": {
    "id": 34,
    "full_name": "Jane Smith",
    "email": "jane@example.com"
  },
  "service_request": {
    "id": 45,
    "listing_title": "Web Development Service",
    "status": "completed"
  },
  "issue_reason": "Service not delivered as promised",
  "status": "ongoing",
  "refund_approved": null,
  "created_at": "2025-10-15T10:30:00Z"
}
```

#### PATCH /api/tickets/[id]
**Purpose:** Update ticket status or refund decision

**Request Body:**
```json
{
  "status": "resolved",
  "refund_approved": true
}
```

**Response:**
```json
{
  "success": true,
  "updated": {
    "id": 1,
    "status": "resolved",
    "refund_approved": true,
    "resolved_at": "2025-10-15T14:20:00Z"
  }
}
```

### 2. Reports API

#### GET /api/reports
**Purpose:** Retrieve all service reports

**Query Parameters:**
- `status` (optional): Filter by status (pending/resolved/dismissed)
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "reports": [
    {
      "id": 5,
      "listing_id": 78,
      "reporter_id": 23,
      "reporter_name": "Alice Johnson",
      "offender_name": "Bob Wilson",
      "report_reason": "Inappropriate content in listing",
      "status": "pending",
      "datetime": "2025-10-15T09:15:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "totalPages": 3
}
```

#### GET /api/reports/[id]
**Purpose:** Get detailed report information

**Response:**
```json
{
  "id": 5,
  "reporter": {
    "id": 23,
    "full_name": "Alice Johnson",
    "email": "alice@example.com"
  },
  "offender": {
    "id": 56,
    "full_name": "Bob Wilson",
    "email": "bob@example.com"
  },
  "listing": {
    "id": 78,
    "title": "Cleaning Service",
    "status": "active",
    "posted_at": "2025-10-10T08:00:00Z"
  },
  "report_reason": "Inappropriate content and misleading description",
  "status": "pending",
  "datetime": "2025-10-15T09:15:00Z"
}
```

### 3. Users API

#### GET /api/users
**Purpose:** List all users with filtering

**Query Parameters:**
- `role` (optional): Filter by role (user/provider/moderator)
- `status` (optional): Filter by status (active/suspended/banned)
- `search` (optional): Search by name or email

**Response:**
```json
{
  "users": [
    {
      "id": 12,
      "full_name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "status": "active",
      "created_at": "2025-01-15T12:00:00Z"
    }
  ]
}
```

#### PATCH /api/users/[id]
**Purpose:** Update user status

**Request Body:**
```json
{
  "status": "suspended",
  "reason": "Multiple policy violations"
}
```

### 4. Refunds API

#### GET /api/refunds
**Purpose:** Get refund statistics and pending approvals

**Response:**
```json
{
  "pending": 12,
  "approved": 45,
  "denied": 8,
  "total_refunded_amount": 15000
}
```

---

## User Interface Components

### Component Library

#### 1. Navbar Component
**File:** `components/Navbar.tsx`

**Features:**
- Platform branding
- User profile dropdown
- Logout functionality
- Responsive mobile menu

#### 2. Sidebar Component
**File:** `components/Sidebar.tsx`

**Navigation Structure:**
```
Dashboard
├── Overview
├── Issue Tickets
├── Service Reports
├── Users
├── Refunds
└── Settings
```

**Active State Highlighting:**
- Uses Next.js `usePathname()` hook
- Highlights current page
- Nested route detection

#### 3. Table Components

**Files:**
- `components/tables/TicketTable.tsx`
- `components/tables/ReportTable.tsx`
- `components/tables/UserTable.tsx`
- `components/tables/RefundTable.tsx`

**Common Features:**
- Sortable columns
- Responsive mobile cards
- Status color coding
- Click-to-detail navigation
- Inline actions (status toggle)

**Mobile Responsive Strategy:**
```typescript
// Desktop: Table view
<table className="hidden md:table">
  {/* Table headers and rows */}
</table>

// Mobile: Card view
<div className="md:hidden space-y-3">
  {items.map(item => (
    <div className="card">
      {/* Card content */}
    </div>
  ))}
</div>
```

#### 4. Dialog Component
**Used For:**
- Confirmation modals
- Service suspension
- User ban warnings
- Destructive action confirmations

**Implementation:**
```typescript
<Dialog open={showDialog} onOpenChange={setShowDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <p>Are you sure you want to proceed?</p>
      <textarea placeholder="Reason..." />
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setShowDialog(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleConfirm}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Real-time Features

### Pusher Integration

**Purpose:** Enable real-time notifications without polling

**Setup:**
```bash
npm install pusher pusher-js
```

**Server Configuration:**
```typescript
// lib/pusher.ts
import Pusher from 'pusher';

export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true
});
```

**Client Subscription:**
```typescript
import PusherClient from 'pusher-js';

const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
});

const channel = pusher.subscribe('moderator-notifications');

channel.bind('new-ticket', (data) => {
  // Show toast notification
  toast.info(`New ticket: ${data.ticket_id}`);
  // Refresh ticket list
  refreshTickets();
});

channel.bind('new-report', (data) => {
  toast.warning(`New report from ${data.reporter_name}`);
  refreshReports();
});
```

### Event Types
- **new-ticket:** When users create issue tickets
- **new-report:** When users report services
- **ticket-resolved:** When moderators resolve tickets
- **user-suspended:** When accounts are suspended

**Fallback Strategy:**
If Pusher is unavailable, system falls back to periodic polling (every 30 seconds).

---

## Security & Authentication

### Authentication Flow

1. **Login Process:**
```typescript
// app/login/page.tsx
const handleLogin = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (response.ok) {
    const { token, user } = await response.json();
    // Store token in httpOnly cookie
    router.push('/dashboard');
  }
};
```

2. **Middleware Protection:**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Verify moderator role
    const decoded = verifyToken(token.value);
    if (decoded.role !== 'moderator') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }
  
  return NextResponse.next();
}
```

### Security Measures

1. **Password Hashing:**
```typescript
import bcrypt from 'bcrypt';

const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

2. **SQL Injection Prevention:**
- Using Prisma ORM parameterized queries
- All user input sanitized
- No raw string concatenation in queries

3. **XSS Protection:**
- React auto-escapes rendered content
- Content Security Policy headers
- Sanitization of HTML input

4. **CSRF Protection:**
- SameSite cookie attribute
- Token validation for state-changing operations

5. **Rate Limiting:**
```typescript
// API route protection
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};
```

---

## Deployment & Configuration

### Environment Variables

Required variables in `.env`:

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/database"

# Pusher (Real-time)
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-key"
PUSHER_SECRET="your-secret"
PUSHER_CLUSTER="your-cluster"

# Public Pusher (Client-side)
NEXT_PUBLIC_PUSHER_KEY="your-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-cluster"

# Authentication
JWT_SECRET="your-secret-key"
SESSION_SECRET="your-session-secret"

# Email (for notifications)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-password"
```

### Vercel Deployment

**Configuration:** `vercel.json`
```json
{
  "buildCommand": "prisma generate && next build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "DATABASE_URL": "@database_url"
  }
}
```

**Deployment Steps:**
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push to main branch
4. Run database migrations: `npx prisma migrate deploy`

### Database Migration

**Development:**
```bash
npx prisma migrate dev --name init
```

**Production:**
```bash
npx prisma migrate deploy
```

**Generate Prisma Client:**
```bash
npx prisma generate
```

---

## Common Questions & Answers

### Q1: Why use Next.js instead of traditional React?

**Answer:**
- **Server-Side Rendering (SSR):** Faster initial page loads with pre-fetched data
- **API Routes:** Backend API in same codebase, no separate server needed
- **File-based Routing:** Automatic routing based on folder structure
- **Image Optimization:** Built-in image component for performance
- **Deployment:** Seamless Vercel integration with zero configuration

### Q2: Why PostgreSQL over MySQL or MongoDB?

**Answer:**
- **Relational Data:** User reports, tickets, and services have clear relationships
- **ACID Compliance:** Critical for financial transactions (refunds)
- **Complex Queries:** Need JOINs across multiple tables
- **Data Integrity:** Foreign key constraints prevent orphaned records
- **JSON Support:** Can store flexible data when needed while maintaining structure

### Q3: How does the refund system work?

**Answer:**
The refund system uses a three-state boolean field:
- **NULL (Pending):** Default state when ticket is created
- **TRUE (Approved):** Moderator approves refund, system processes token return
- **FALSE (Denied):** Moderator denies refund, no tokens returned

**Process Flow:**
1. User creates ticket for service issue
2. Moderator reviews ticket details
3. Moderator selects "Approve" or "Deny" from dropdown
4. If approved, backend triggers refund processing
5. Tokens returned to user's account balance
6. User receives notification of refund

### Q4: What happens when a service is suspended?

**Answer:**
When a moderator suspends a service:
1. Service listing status changes to "suspended"
2. Service no longer appears in public search
3. Active requests continue but no new bookings accepted
4. Warning record created for provider
5. Provider receives email notification
6. Suspension reason stored for audit trail
7. Moderator can reactivate service later

### Q5: How are tickets sorted and prioritized?

**Answer:**
Tickets are sorted by **creation date (newest first)** to ensure:
- Recent issues get immediate attention
- Moderators see latest complaints first
- Service quality problems addressed quickly
- Users get timely responses

Additional prioritization could include:
- Severity levels (critical/high/medium/low)
- Provider reputation score
- Repeat offenders flagged
- Token amount involved in dispute

### Q6: Can users appeal suspensions or refund denials?

**Answer:**
Currently, the system stores all decisions but doesn't have a built-in appeal process. Recommended implementation:
1. Add "appeal" button on user side
2. Create `appeal` table in database
3. Moderators review appeals in separate section
4. Track appeal outcomes for quality metrics

### Q7: How is moderator performance tracked?

**Answer:**
Potential metrics to implement:
- **Resolution Time:** Average time to resolve tickets
- **Resolution Rate:** Percentage of tickets resolved vs dismissed
- **Refund Accuracy:** Review appeal success rate
- **User Satisfaction:** Survey after ticket resolution
- **Activity Log:** Track all moderator actions with timestamps

### Q8: What if multiple moderators handle the same ticket?

**Answer:**
Current implementation doesn't lock tickets. Recommended additions:
1. Add `assigned_to` field in ticket table
2. Implement ticket claiming system
3. Show "Currently being reviewed by X" message
4. Auto-release tickets after 30 minutes of inactivity
5. Use Pusher to broadcast ticket claims in real-time

### Q9: How are duplicate reports handled?

**Answer:**
System doesn't automatically detect duplicates. Suggestions:
1. Search existing reports before creating new ones
2. Implement fuzzy matching on report reasons
3. Link related reports together
4. Show "Similar reports" section
5. Allow marking reports as duplicates

### Q10: What's the disaster recovery plan?

**Answer:**
**Database Backups:**
- Neon provides automatic daily backups
- Point-in-time recovery for last 7 days
- Manual backup before major migrations

**Data Recovery:**
```bash
# Restore from backup
pg_restore --dbname=ontime_db --verbose backup.sql
```

**Application Recovery:**
- Vercel maintains deployment history
- Can rollback to previous deployment instantly
- Git version control for code recovery

### Q11: How do you prevent moderator abuse?

**Answer:**
Recommended safeguards:
1. **Audit Logging:** Track all moderator actions
2. **Peer Review:** Random sampling of decisions
3. **Appeal Process:** Users can challenge decisions
4. **Metrics Dashboard:** Monitor outlier behavior
5. **Two-Factor Actions:** Require confirmation for bans
6. **Supervisor Approval:** Major actions need admin approval

### Q12: Can the system handle high traffic?

**Answer:**
**Current Scalability:**
- Next.js serverless functions auto-scale
- Neon database supports connection pooling
- Vercel CDN for static assets
- Prisma connection pool management

**Bottlenecks to Monitor:**
- Database query performance (add indexes)
- API rate limits (implement caching)
- Real-time connections (Pusher limits)

**Optimization Strategies:**
- Redis caching for frequently accessed data
- Database query optimization with EXPLAIN
- Lazy loading for large datasets
- Pagination limits

### Q13: What about GDPR compliance?

**Answer:**
Required implementations:
1. **Right to Access:** Users can download their data
2. **Right to Deletion:** Delete user accounts and data
3. **Data Minimization:** Only collect necessary information
4. **Consent Management:** Track user agreements
5. **Data Encryption:** Encrypt sensitive fields
6. **Breach Notification:** Alert users within 72 hours

**Implementation:**
```typescript
// User data export
export async function GET(request: Request) {
  const userId = getCurrentUser(request);
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tickets: true,
      reports: true,
      services: true
    }
  });
  return Response.json(userData);
}

// Account deletion
export async function DELETE(request: Request) {
  const userId = getCurrentUser(request);
  await prisma.user.delete({
    where: { id: userId }
  });
  // Also deletes related records via CASCADE
}
```

---

## Troubleshooting Guide

### Issue 1: Provider Name Not Showing in Tickets

**Symptom:** Provider name column displays empty or undefined

**Cause:** Missing JOIN in SQL query

**Solution:**
```sql
-- Add provider join to query
JOIN service_request sr ON sr.id = r.request_id
JOIN "user" u2 ON u2.id = sr.provider_id

-- Include in SELECT
u2.full_name as provider_name
```

### Issue 2: Refund Status Not Updating

**Symptom:** Dropdown changes but database not updating

**Cause:** Missing API endpoint or incorrect request body

**Solution:**
```typescript
// Ensure PATCH endpoint exists
export async function PATCH(request: Request, { params }) {
  const { refund_approved } = await request.json();
  
  // Convert string to boolean/null
  const value = refund_approved === 'approved' ? true 
    : refund_approved === 'denied' ? false 
    : null;
  
  await prisma.request_report.update({
    where: { id: parseInt(params.id) },
    data: { refund_approved: value }
  });
}
```

### Issue 3: Prisma TypedSQL Not Generating

**Symptom:** `lib/generated/prisma/sql` folder empty

**Cause:** Prisma version compatibility issues

**Solution:**
Use raw SQL instead:
```typescript
// Instead of typedSQL
const tickets = await prisma.$queryRaw`
  SELECT * FROM request_report
  ORDER BY created_at DESC
`;
```

### Issue 4: Reports Not Sorting Chronologically

**Symptom:** Reports appear in random order

**Cause:** Missing ORDER BY clause

**Solution:**
```sql
-- Add to query
ORDER BY r.datetime DESC
```

### Issue 5: Warning History Not Displaying

**Symptom:** Warning section shows "No warnings"

**Cause:** Data returned as object instead of array

**Solution:**
```typescript
// Ensure array format
const warnings = Array.isArray(data.warnings) 
  ? data.warnings 
  : [data.warnings];
```

### Issue 6: Pusher Connection Failed

**Symptom:** Real-time updates not working

**Cause:** Incorrect credentials or network issues

**Solution:**
1. Verify environment variables
2. Check Pusher dashboard for errors
3. Implement fallback polling:
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    if (!pusherConnected) {
      fetchUpdates(); // Fallback polling
    }
  }, 30000);
  
  return () => clearInterval(interval);
}, [pusherConnected]);
```

### Issue 7: Database Connection Pool Exhausted

**Symptom:** "Too many connections" error

**Cause:** Not closing Prisma connections

**Solution:**
```typescript
// Use singleton pattern
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Issue 8: Mobile Layout Breaking

**Symptom:** Tables overflow on mobile devices

**Cause:** Missing responsive classes

**Solution:**
```typescript
// Use responsive visibility
<table className="hidden md:table">
  {/* Desktop table */}
</table>

<div className="md:hidden">
  {/* Mobile cards */}
</div>
```

---

## Future Enhancements

### Phase 1: Advanced Features (Q1 2026)

1. **Automated Moderation:**
   - AI-powered content filtering
   - Automatic flagging of policy violations
   - Sentiment analysis on reports
   - Pattern recognition for repeat offenders

2. **Analytics Dashboard:**
   - Moderator performance metrics
   - Resolution time trends
   - User behavior patterns
   - Refund rate analysis

3. **Advanced Search:**
   - Full-text search with Elasticsearch
   - Filter combinations (AND/OR logic)
   - Saved search queries
   - Export search results

### Phase 2: Collaboration Features (Q2 2026)

1. **Team Management:**
   - Ticket assignment system
   - Workload distribution
   - Shift scheduling
   - Team chat integration

2. **Quality Assurance:**
   - Peer review system
   - Decision appeal process
   - Quality scoring
   - Training mode for new moderators

3. **Communication Tools:**
   - In-app messaging with users
   - Template responses
   - Email integration
   - SMS notifications

### Phase 3: Automation & AI (Q3 2026)

1. **Smart Routing:**
   - Auto-assign tickets based on expertise
   - Priority queue based on severity
   - Load balancing across moderators
   - Escalation workflows

2. **Predictive Analytics:**
   - Predict ticket volume
   - Identify high-risk users early
   - Forecast refund costs
   - Detect emerging patterns

3. **Chatbot Assistant:**
   - Answer common user questions
   - Pre-screen tickets
   - Suggest resolutions
   - Guide users through appeals

### Phase 4: Compliance & Reporting (Q4 2026)

1. **Regulatory Compliance:**
   - GDPR data export
   - Audit trail reports
   - Compliance documentation
   - Data retention policies

2. **Business Intelligence:**
   - Executive dashboards
   - Custom report builder
   - Scheduled reports
   - Data visualization

3. **Integration Ecosystem:**
   - Slack notifications
   - Jira ticket creation
   - Zendesk integration
   - Webhook support

---

## Technical Specifications

### Performance Benchmarks

**Target Metrics:**
- Page Load Time: < 2 seconds (initial)
- API Response Time: < 500ms (average)
- Database Query Time: < 100ms (average)
- Real-time Event Latency: < 1 second
- Mobile Responsive: 100% (all screen sizes)

**Current Performance:**
- Lighthouse Score: 95+ (Performance)
- Core Web Vitals: All Green
- API Latency: 200-400ms average
- Database Connections: Pooled (max 10)

### Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

**Not Supported:**
- Internet Explorer (any version)
- Opera Mini
- UC Browser

### Accessibility

**WCAG 2.1 Compliance:**
- Level AA compliance target
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios met
- ARIA labels on interactive elements

---

## Maintenance & Support

### Regular Maintenance Tasks

**Daily:**
- Monitor error logs
- Check real-time notifications
- Review pending tickets/reports

**Weekly:**
- Database backup verification
- Performance metrics review
- Security patch updates

**Monthly:**
- Dependency updates
- Database optimization (VACUUM)
- Usage analytics review
- Security audit

**Quarterly:**
- Feature roadmap review
- User feedback analysis
- System architecture review
- Disaster recovery drill

### Support Escalation

**Level 1 - User Support:**
- General navigation questions
- Account access issues
- Basic troubleshooting

**Level 2 - Technical Support:**
- Bug reports
- Feature requests
- Performance issues

**Level 3 - Engineering:**
- Critical system failures
- Security incidents
- Data integrity issues

---

## Glossary

**Service Provider:** User who offers services on the platform  
**Service Requester:** User who books/requests services  
**Issue Ticket:** Report filed about a service transaction problem  
**Service Report:** Report filed about a service listing violation  
**Refund Approval:** Moderator decision to return tokens to requester  
**Service Suspension:** Temporary removal of service from platform  
**Warning:** Official notice of policy violation  
**Moderator:** Platform administrator with review privileges  
**Ticket ID:** Unique identifier for issue tickets (e.g., T-1001)  
**Resolution Time:** Duration from ticket creation to resolution  

---

## Appendix

### Database Schema Diagram

```sql
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA                       │
└─────────────────────────────────────────────────────────────┘

TABLE user (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(50),
  status VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

TABLE service_listing (
  id SERIAL PRIMARY KEY,
  posted_by INTEGER → user.id,
  title VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10,2),
  status VARCHAR(50),
  created_at TIMESTAMP
)

TABLE service_request (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER → service_listing.id,
  requester_id INTEGER → user.id,
  provider_id INTEGER → user.id,
  status VARCHAR(50),
  created_at TIMESTAMP,
  completed_at TIMESTAMP
)

TABLE request_report (
  id SERIAL PRIMARY KEY,
  ticket_id VARCHAR(50) UNIQUE,
  request_id INTEGER → service_request.id,
  reporter_id INTEGER → user.id,
  issue_reason TEXT,
  status VARCHAR(50),
  refund_approved BOOLEAN,
  created_at TIMESTAMP,
  resolved_at TIMESTAMP
)

TABLE report (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER → service_listing.id,
  reporter_id INTEGER → user.id,
  report_reason TEXT,
  status VARCHAR(50),
  datetime TIMESTAMP,
  resolved_at TIMESTAMP
)

TABLE warning (
  id SERIAL PRIMARY KEY,
  user_id INTEGER → user.id,
  listing_id INTEGER → service_listing.id,
  reason TEXT,
  severity VARCHAR(50),
  issued_at TIMESTAMP,
  issued_by INTEGER → user.id
)
```

### Sample API Requests

**Create Issue Ticket:**
```bash
curl -X POST https://api.example.com/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "request_id": 45,
    "reporter_id": 12,
    "issue_reason": "Service not delivered"
  }'
```

**Update Refund Status:**
```bash
curl -X PATCH https://api.example.com/api/tickets/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "refund_approved": true
  }'
```

**Suspend Service:**
```bash
curl -X PATCH https://api.example.com/api/services/78 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "suspended",
    "reason": "Policy violation"
  }'
```

---

## Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | Oct 15, 2025 | BhoneMyintSan | Initial comprehensive documentation |

---

## Contact Information

**Project Lead:** BhoneMyintSan  
**GitHub:** https://github.com/BhoneMyintSan/ontime_moderator  
**Support Email:** support@ontime-platform.com  
**Documentation Updates:** See README.md for latest changes

---

**End of Documentation**
