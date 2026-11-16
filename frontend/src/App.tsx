import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ShykeyProvider } from './hooks/useShykey';
import { AppLayout } from './layouts/AppLayout';
import {
  ChatPage,
  CheckinPage,
  HomePage,
  MarketingPage,
  MissionPage,
  NotFoundPage,
  ProfilePage,
  ReadPage,
  WinPage,
} from './pages';

export function App() {
  return (
    <ShykeyProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<MarketingPage />} />
            <Route path="app" element={<HomePage />} />
            <Route path="mission" element={<MissionPage />} />
            <Route path="checkin" element={<CheckinPage />} />
            <Route path="win" element={<WinPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="read" element={<ReadPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ShykeyProvider>
  );
}
