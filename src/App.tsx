import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CoursesModule } from './components/CoursesModule';
import { TutorialsLibrary } from './components/TutorialsLibrary';
import { PracticeProjects } from './components/PracticeProjects';
import { ProgressTracker } from './components/ProgressTracker';
import { AchievementsBadges } from './components/AchievementsBadges';
import { Settings } from './components/Settings';
import { VideoUpload } from './components/VideoUpload';
import { OurProjects } from './components/OurProjects';
import { OurFounders } from './components/OurFounders';
import { Button } from './components/ui/button';
import { LogOut, Upload } from 'lucide-react';
import { Landing } from './components/Landing';

function AuthenticatedApp() {
  const { user, signOut, loading, isPasswordRecovery } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showUpload, setShowUpload] = useState(false);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    setShowUpload(false);
  };

  // Check URL for password reset redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    const type = urlParams.get('type');

    // If this is a password recovery redirect, the AuthProvider will handle it
    if (type === 'recovery' && accessToken && refreshToken) {
      // Clear the URL parameters for security
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-lg">Loading your RoboQuest adventure...</p>
        </div>
      </div>
    );
  }

  // If user is in password recovery mode, show the login form which will display password update
  if (isPasswordRecovery) {
    return <AuthScreen />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  const isAdmin = user.email === 'rayaanm5409@gmail.com';

  const renderContent = () => {
    if (showUpload) {
      return <VideoUpload onUploadComplete={() => setShowUpload(false)} />;
    }

    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'courses':
        return <CoursesModule />;
      case 'tutorials':
        return <TutorialsLibrary />;
      case 'practice':
        return <PracticeProjects />;
      case 'progress':
        return <ProgressTracker />;
      case 'achievements':
        return <AchievementsBadges />;
      case 'our-projects':
        return <OurProjects />;
      case 'founders':
        return <OurFounders />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isAdmin={isAdmin}
      />
      <main className="flex-1 overflow-auto relative">
        {/* Top Bar - Only show upload button for admin */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUpload(!showUpload)}
              className="bg-white/80 backdrop-blur-sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              {showUpload ? 'Back' : 'Upload'}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className="bg-white/80 backdrop-blur-sm text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
        
        {renderContent()}
      </main>
    </div>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState<'landing'|'login'|'signup'>('landing');

  if (mode === 'landing') {
    return <Landing onLogin={() => setMode('login')} onSignup={() => setMode('signup')} />;
  }

  const CloseBar = () => (
    <div className="absolute top-4 right-4 z-50">
      <button
        onClick={() => setMode('landing')}
        className="rounded-md border border-border bg-white/80 backdrop-blur px-2 py-1 text-sm hover:bg-white"
        aria-label="Close and go back"
      >
        ×
      </button>
    </div>
  );

  if (mode === 'login') {
    return (
      <div className="relative">
        <CloseBar />
        <LoginForm onToggleMode={() => setMode('signup')} />
      </div>
    );
  }
  return (
    <div className="relative">
      <CloseBar />
      <SignupForm onToggleMode={() => setMode('login')} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}

function Root() {
  const { user, loading, isPasswordRecovery } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-lg">Loading your RoboQuest adventure...</p>
        </div>
      </div>
    );
  }

  if (isPasswordRecovery || !user) {
    return <AuthScreen />;
  }

  return <AuthenticatedApp />;
}