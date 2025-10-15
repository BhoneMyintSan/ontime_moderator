# OnTime Moderator

## Overview
OnTime Moderator is a comprehensive moderation and management dashboard for the OnTime service platform. Built with Next.js 15, React, and TypeScript, it provides moderators with powerful tools to manage service listings, handle user reports, resolve issue tickets, monitor user activity, and maintain platform integrity.

## Key Features

### 🎯 Service Management
- **Comprehensive Service Listings**: View and manage all service listings with detailed information
- **Warning System**: Issue warnings to service providers for policy violations (one warning per service)
- **Service Suspension**: Suspend or activate services based on moderation decisions
- **Report Tracking**: Monitor user reports filed against services
- **Issue Ticket Integration**: Track and manage service-related issue tickets
- **Interactive Tables**: Click anywhere on a service row/card to view full details
- **Advanced Filtering**: Filter services by status (Active, Suspended), with reports, or with tickets

### 📊 Dashboard Analytics
- **Real-time Statistics**: Monitor total users, reports, tickets, and services
- **Activity Metrics**: Track active users, pending reports, resolved tickets, and active services
- **Quick Actions**: Navigate to critical sections with one click
- **Visual Data Cards**: Color-coded statistics with intuitive icons

### 🎫 Issue Ticket Management
- **Ticket Listing**: View all service request-related issue tickets
- **Status Tracking**: Monitor ticket status (ongoing, resolved)
- **Reporter Information**: Access details about ticket reporters
- **Quick Navigation**: View service details directly from tickets
- **Filtering Options**: Filter tickets by status and search functionality

### 📝 Report Management
- **User Reports**: Handle reports filed by users against services
- **Report Details**: View comprehensive report information including reporter details
- **Status Management**: Update report status (pending, resolved)
- **Service Integration**: Direct link to reported services for context
- **Resolution Tracking**: Mark reports as resolved with timestamp tracking

### 👥 User Management
- **User Directory**: Comprehensive list of all platform users
- **Account Status**: Monitor and manage user account status (active, suspended, banned)
- **Activity Tracking**: View user engagement and token balance
- **Profile Management**: Access detailed user profiles and history
- **Search & Filter**: Find users quickly with advanced search capabilities

### 🎨 Modern UI/UX
- **Responsive Design**: Fully responsive interface for desktop, tablet, and mobile devices
- **Dark Theme**: Professional dark theme optimized for long usage sessions
- **Interactive Elements**: Hover effects, smooth transitions, and visual feedback
- **Gradient Accents**: Modern gradient backgrounds and glow effects
- **Compact Layout**: Optimized spacing for better content visibility
- **Smart Navigation**: Searchable navbar with intelligent suggestions

## Tech Stack

### Frontend
- **Next.js 15.3.2**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Accessible component library
- **Lucide React**: Modern icon library

### Backend & Database
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Relational database
- **Next.js API Routes**: Serverless API endpoints

### Authentication & Real-time
- **Clerk**: User authentication and management
- **Pusher** (Optional): Real-time notifications support

## Project Structure

```
ontime_moderator/
├── app/
│   ├── api/                    # API routes
│   │   ├── services/          # Service management endpoints
│   │   ├── tickets/           # Ticket management endpoints
│   │   ├── reports/           # Report management endpoints
│   │   ├── users/             # User management endpoints
│   │   ├── refunds/           # Refund management endpoints
│   │   └── warning/           # Warning system endpoints
│   ├── dashboard/             # Dashboard pages
│   │   ├── layout.tsx         # Dashboard layout with sidebar and navbar
│   │   ├── page.tsx           # Main dashboard with statistics
│   │   ├── services/          # Service management pages
│   │   │   ├── page.tsx       # Service listing with filters
│   │   │   └── [id]/          # Service detail page
│   │   ├── tickets/           # Ticket management pages
│   │   │   ├── page.tsx       # Ticket listing
│   │   │   └── [id]/          # Ticket detail page
│   │   ├── reports/           # Report management pages
│   │   │   ├── page.tsx       # Report listing
│   │   │   └── [id]/          # Report detail page
│   │   ├── users/             # User management pages
│   │   │   ├── page.tsx       # User listing
│   │   │   └── [id]/          # User detail page
│   │   ├── refund/            # Refund management
│   │   ├── search/            # Global search results
│   │   └── settings/          # Application settings
│   ├── login/                 # Authentication pages
│   └── get_started/           # Onboarding pages
├── components/
│   ├── Navbar.tsx             # Top navigation with search
│   ├── Sidebar.tsx            # Side navigation menu
│   ├── Pagination.tsx         # Reusable pagination component
│   ├── SearchAndFilter.tsx    # Search and filter controls
│   ├── tables/                # Table components
│   │   ├── ServiceTable.tsx   # Interactive service table
│   │   ├── TicketTable.tsx    # Interactive ticket table
│   │   ├── ReportTable.tsx    # Interactive report table
│   │   ├── UserTable.tsx      # Interactive user table
│   │   └── RefundTable.tsx    # Refund table
│   ├── cards/
│   │   └── VolunteerCard.tsx  # Volunteer opportunity cards
│   └── ui/                    # Shadcn UI components
├── lib/
│   ├── prisma.ts              # Prisma client instance
│   ├── types.ts               # TypeScript type definitions
│   ├── pusher.ts              # Pusher configuration (optional)
│   └── generated/             # Generated Prisma client
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── sql/                   # Custom SQL queries
├── store/
│   └── reportStore.ts         # State management
└── data/
    └── mock*.ts               # Mock data for development

```

## Database Schema

### Key Models
- **service_listing**: Service offerings with warnings, reports, and status
- **warning**: Moderation warnings (one per service, unique constraint)
- **report**: User reports against services
- **request_report**: Issue tickets for service requests
- **service_request**: Service transactions
- **user**: Platform users with account status
- **payment**: Payment transactions
- **review**: Service reviews
- **reward**: Platform rewards system

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BhoneMyintSan/ontime_moderator.git
   cd ontime_moderator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
   CLERK_SECRET_KEY="sk_..."
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/login"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"

   # Pusher (Optional - for real-time features)
   PUSHER_APP_ID="..."
   PUSHER_KEY="..."
   PUSHER_SECRET="..."
   PUSHER_CLUSTER="..."
   ```

4. **Set up the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage Guidelines

### Navigation
- Use the **Sidebar** to navigate between main sections (Dashboard, Tickets, Reports, Users, Services)
- Use the **Navbar search** to quickly find users, tickets, or reports (supports keyboard shortcuts: `/` or `Ctrl/Cmd+K`)
- Click on any item in tables/cards to view detailed information

### Service Management Workflow
1. Navigate to **Services** section
2. Use filters to find specific services (All, Active, Suspended, With Reports, With Tickets)
3. Click on a service to view details
4. From the detail page, you can:
   - Add a warning (if no warning exists)
   - Suspend or activate the service
   - View all reports and tickets associated with the service
   - Resolve reports or tickets directly

### Warning System
- Each service can only have **one warning** at a time
- Warnings include severity level (mild/severe), reason, and detailed comment
- Attempting to add a second warning will show a clear error message

### Report Handling
1. Navigate to **Reports** section
2. Click on a report to view full details
3. Review the report reason and additional details
4. Navigate to the reported service using "View Service" button
5. Mark as resolved when action is taken

### Ticket Management
1. Navigate to **Issues Ticket** section
2. Filter by status (All, Ongoing, Resolved)
3. Click on a ticket to view details
4. Access the related service request for context
5. Mark as resolved when issue is addressed

## API Endpoints

### Services
- `GET /api/services` - List all services with statistics
- `GET /api/services/[id]` - Get service details with reports and tickets
- `POST /api/services` - Create a warning for a service
- `PUT /api/services/[id]` - Update service status

### Tickets
- `GET /api/tickets` - List all issue tickets
- `GET /api/tickets/[id]` - Get ticket details
- `PATCH /api/tickets/[id]` - Update ticket status

### Reports
- `GET /api/reports` - List all reports
- `GET /api/reports/[id]` - Get report details
- `PATCH /api/reports/[id]` - Update report status

### Users
- `GET /api/users` - List all users
- `GET /api/users/[id]` - Get user details
- `PATCH /api/users/[id]` - Update user status

## Development

### Building for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Known Issues & Limitations
- Warning API is deprecated - use Services POST endpoint for creating warnings
- Each service can only have one warning (database unique constraint)
- Pusher real-time features are optional and may need separate configuration

## Future Enhancements
- [ ] Advanced analytics and reporting dashboards
- [ ] Bulk action support for multiple services
- [ ] Email notification system for moderators
- [ ] Activity log and audit trail
- [ ] Export functionality for reports and statistics
- [ ] Advanced search with filters across all entities
- [ ] Role-based access control for different moderator levels

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Support
For issues, questions, or contributions, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation in the `/docs` folder (if available)

---

**Version:** 1.0.0  
**Last Updated:** October 15, 2025  
**Maintained by:** OnTime Development Team