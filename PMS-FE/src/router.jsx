import { Navigate, createBrowserRouter } from 'react-router-dom';
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
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'book', element: <BookingPage /> },
      { path: 'experiences', element: <ExperiencesPage /> },
    ],
  },
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'rooms', element: <RoomsPage /> },
      { path: 'guests', element: <GuestsPage /> },
      { path: 'reservations', element: <ReservationsPage /> },
      { path: 'programs', element: <ProgramsPage /> },
      { path: 'payments', element: <PaymentsPage /> },
      { path: 'marketing', element: <MarketingPage /> },
      { path: 'integrations', element: <IntegrationsPage /> },
      { path: 'files', element: <FilesPage /> },
      { path: 'website', element: <WebsitePage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/dashboard',
    element: <Navigate to="/admin" replace />,
  },
]);

export default router;
