import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface UserProgress {
  level: number;
  totalXP: number;
  streakDays: number;
  coursesCompleted: string[];
  achievements: string[];
  lessonsCompleted: number;
  projectsBuilt: number;
  dailyGoal: number;
  dailyProgress: number;
  coursesInProgress: { [key: string]: number[] };
  completedTutorials: string[];
  completedProjects: string[];
}

interface UserSettings {
  language: string;
  theme: string;
  soundEffects: boolean;
  backgroundMusic: boolean;
  notifications: boolean;
  emailUpdates: boolean;
  parentalNotifications: boolean;
}

// Default fallback data when backend is not available
const defaultProgress: UserProgress = {
  level: 0,
  totalXP: 0,
  streakDays: 0,
  coursesCompleted: [],
  achievements: [],
  lessonsCompleted: 0,
  projectsBuilt: 0,
  dailyGoal: 2,
  dailyProgress: 0,
  coursesInProgress: {},
  completedTutorials: [],
  completedProjects: []
};

const defaultSettings: UserSettings = {
  language: 'en',
  theme: 'light',
  soundEffects: true,
  backgroundMusic: false,
  notifications: true,
  emailUpdates: false,
  parentalNotifications: true
};

export function useProgress() {
  const { user, session } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const fetchUserData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    // If no session token, use default data
    if (!session?.access_token) {
      console.log('No session token available, using default progress data');
      setProgress(defaultProgress);
      setSettings(defaultSettings);
      setLoading(false);
      setIsOffline(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/user/progress`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        // Check if it's a network error or server error
        if (response.status >= 500) {
          throw new Error('Server is temporarily unavailable');
        } else if (response.status === 404) {
          throw new Error('API endpoint not found');
        } else {
          throw new Error(`Failed to fetch user data (${response.status})`);
        }
      }

      const data = await response.json();
      setProgress(data.progress || defaultProgress);
      setSettings(data.settings || defaultSettings);
      setIsOffline(false);
      
    } catch (err: any) {
      console.log('Backend API error, using fallback data:', err.message);
      
      // Set default data as fallback
      setProgress(defaultProgress);
      setSettings(defaultSettings);
      setIsOffline(true);
      
      // Set a user-friendly error message
      if (err.message.includes('fetch')) {
        setError('Cannot connect to server. Using offline mode.');
      } else {
        setError(`Backend unavailable: ${err.message}. Using offline mode.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (updates: Partial<UserProgress>) => {
    if (!user || !session?.access_token || isOffline) {
      // Update local state only when offline
      if (progress) {
        const updatedProgress = { ...progress, ...updates };
        setProgress(updatedProgress);
        return updatedProgress;
      }
      return null;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/user/progress`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      const data = await response.json();
      setProgress(data.progress);
      return data.progress;
    } catch (err: any) {
      console.log('Error updating progress, updating locally only:', err);
      
      // Fallback to local update
      if (progress) {
        const updatedProgress = { ...progress, ...updates };
        setProgress(updatedProgress);
        return updatedProgress;
      }
      
      throw err;
    }
  };

  const completeLesson = async (lessonId: string, xpGained: number) => {
    if (!progress) return;

    const newTotalXP = progress.totalXP + xpGained;
    const newLevel = Math.floor(newTotalXP / 200) + 1; // Level up every 200 XP
    
    return await updateProgress({
      totalXP: newTotalXP,
      level: newLevel,
      lessonsCompleted: progress.lessonsCompleted + 1,
      dailyProgress: progress.dailyProgress + 1
    });
  };

  const completeProject = async (projectId: string, xpGained: number) => {
    if (!progress) return;

    const newTotalXP = progress.totalXP + xpGained;
    const newLevel = Math.floor(newTotalXP / 200) + 1;
    
    return await updateProgress({
      totalXP: newTotalXP,
      level: newLevel,
      projectsBuilt: progress.projectsBuilt + 1,
      dailyProgress: progress.dailyProgress + 1
    });
  };

  const unlockAchievement = async (achievementId: string) => {
    if (!progress || progress.achievements.includes(achievementId)) return;

    const newAchievements = [...progress.achievements, achievementId];
    return await updateProgress({
      achievements: newAchievements
    });
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      // Reset state when user logs out
      setProgress(null);
      setSettings(null);
      setLoading(false);
      setError(null);
      setIsOffline(false);
    }
  }, [user, session?.access_token]);

  return {
    progress,
    settings,
    loading,
    error,
    isOffline,
    updateProgress,
    completeLesson,
    completeProject,
    unlockAchievement,
    refetch: fetchUserData
  };
}