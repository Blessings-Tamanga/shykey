import { Outlet, useLocation } from 'react-router-dom';

export function AppLayout() {
  const { pathname } = useLocation();
  const className = pathname === '/' ? 'app-frame marketing-frame' : 'app-frame';
  return <div className={className}><Outlet /></div>;
}
