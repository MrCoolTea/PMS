import { createBrowserRouter } from 'react-router-dom';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
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
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);

export default router;
