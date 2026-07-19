import { Outlet } from 'react-router-dom';
import { RouteHead } from '../components/RouteHead.jsx';

export function RootLayout() {
  return (
    <>
      <RouteHead />
      <Outlet />
    </>
  );
}
