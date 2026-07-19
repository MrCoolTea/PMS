import { Navigate, createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout.jsx';
import { PublicLayout } from './layouts/public/PublicLayout.jsx';
import { HomePage } from './pages/public/HomePage.jsx';
import { BookingPage } from './pages/public/BookingPage.jsx';
import { ExperiencesPage } from './pages/public/ExperiencesPage.jsx';
import { LoginPage } from './pages/login/page.jsx';
import { DashboardLayout } from './layouts/dashboard/DashboardLayout.jsx';
import { DashboardPage } from './pages/dashboard/page.jsx';
import { RoomsPage } from './pages/properties/page.jsx';
import { GuestsPage } from './pages/tenants/page.jsx';
import { ReservationsPage } from './pages/leases/page.jsx';
import { PaymentsPage } from './pages/payments/page.jsx';
import { ProgramsPage } from './pages/maintenance/page.jsx';
import { ReportsPage } from './pages/reports/page.jsx';
import { MarketingPage } from './pages/communications/page.jsx';
import { FilesPage } from './pages/files/page.jsx';
import { SettingsPage } from './pages/settings/page.jsx';
import { IntegrationsPage } from './pages/integrations/page.jsx';
import { WebsitePage } from './pages/website/page.jsx';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
            handle: {
              title: 'Home',
              description: 'Discover rooms, amenities, and guest experiences.',
            },
          },
          {
            path: 'book',
            element: <BookingPage />,
            handle: {
              title: 'Book',
              description: 'Reserve rooms and plan your stay.',
            },
          },
          {
            path: 'experiences',
            element: <ExperiencesPage />,
            handle: {
              title: 'Experiences',
              description: 'Browse resort activities and guest programs.',
            },
          },
        ],
      },
      {
        path: '/admin/login',
        element: <LoginPage />,
        handle: {
          title: 'Admin Login',
          description: 'Sign in to the resort management dashboard.',
        },
      },
      {
        path: '/admin',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
            handle: {
              title: 'Dashboard',
              description: 'Monitor resort operations from the admin dashboard.',
            },
          },
          {
            path: 'rooms',
            element: <RoomsPage />,
            handle: {
              title: 'Rooms',
              description: 'Manage room inventory and availability.',
            },
          },
          {
            path: 'guests',
            element: <GuestsPage />,
            handle: {
              title: 'Guests',
              description: 'View and manage guest profiles.',
            },
          },
          {
            path: 'reservations',
            element: <ReservationsPage />,
            handle: {
              title: 'Reservations',
              description: 'Track bookings, arrivals, and departures.',
            },
          },
          {
            path: 'programs',
            element: <ProgramsPage />,
            handle: {
              title: 'Programs',
              description: 'Coordinate scheduled resort programs and activities.',
            },
          },
          {
            path: 'payments',
            element: <PaymentsPage />,
            handle: {
              title: 'Payments',
              description: 'Review transactions and payment status.',
            },
          },
          {
            path: 'marketing',
            element: <MarketingPage />,
            handle: {
              title: 'Marketing',
              description: 'Manage campaigns and guest communications.',
            },
          },
          {
            path: 'integrations',
            element: <IntegrationsPage />,
            handle: {
              title: 'Integrations',
              description: 'Configure OTA and channel integrations.',
            },
          },
          {
            path: 'files',
            element: <FilesPage />,
            handle: {
              title: 'Files',
              description: 'Organize documents, media, and shared assets.',
            },
          },
          {
            path: 'website',
            element: <WebsitePage />,
            handle: {
              title: 'Website',
              description: 'Customize your public resort website.',
            },
          },
          {
            path: 'reports',
            element: <ReportsPage />,
            handle: {
              title: 'Reports',
              description: 'Analyze occupancy, revenue, and operations.',
            },
          },
          {
            path: 'settings',
            element: <SettingsPage />,
            handle: {
              title: 'Settings',
              description: 'Adjust resort and account settings.',
            },
          },
        ],
      },
      {
        path: '/dashboard',
        element: <Navigate to="/admin" replace />,
      },
    ],
  },
]);

export default router;
