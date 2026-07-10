import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { WatchPartyProvider } from './context/WatchPartyContext';

import ToastContainer from './components/common/ToastContainer';
import Navbar from './components/common/Navbar';
import LoginView from './components/auth/LoginView';
import OtpView from './components/auth/OtpView';
import CatalogView from './components/catalog/CatalogView';
import DownloadsView from './components/downloads/DownloadsView';
import UploadView from './components/upload/UploadView';
import PlansView from './components/plans/PlansView';
import CommentsView from './components/comments/CommentsView';
import WatchPartyView from './components/watchparty/WatchPartyView';
import ProfileView from './components/profile/ProfileView';
import PlayerView from './components/player/PlayerView';

function MainContent() {
  const { currentUser, activeView } = useAuth();
  const { state } = useApp();

  if (!currentUser || activeView === 'login' || activeView === 'otp') {
    if (activeView === 'otp') return <OtpView />;
    return <LoginView />;
  }

  const views = {
    catalog:    <CatalogView />,
    downloads:  <DownloadsView />,
    upload:     <UploadView />,
    plans:      <PlansView />,
    comments:   <CommentsView />,
    watchparty: <WatchPartyView />,
    profile:    <ProfileView />,
    player:     <PlayerView />,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        {views[state.currentView] ?? <CatalogView />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppProvider>
            <WatchPartyProvider>
              <MainContent />
              <ToastContainer />
            </WatchPartyProvider>
          </AppProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
