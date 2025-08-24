import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useAuth } from './AuthProvider';
import { useProgress } from '../hooks/useProgress';
import { 
  Trophy, 
  Award, 
  Star, 
  Download, 
  Share,
  Lock,
  CheckCircle,
  Target,
  Zap,
  BookOpen,
  Code,
  Calendar,
  Users,
  Flame
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'learning' | 'social' | 'streak' | 'milestone';
  requirement: number;
  earned: boolean;
  progress: number;
  earnedDate?: string;
}

export function AchievementsBadges() {
  const { user } = useAuth();
  const { progress, loading, error } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-lg">Loading achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-lg text-red-600">Error loading achievements: {error}</p>
        </div>
      </div>
    );
  }

  const userName = user?.firstName || 'Student';
  const currentXP = progress?.totalXP || 0;
  const lessonsCompleted = progress?.lessonsCompleted || 0;
  const projectsBuilt = progress?.projectsBuilt || 0;
  const coursesCompleted = progress?.coursesCompleted?.length || 0;
  const streakDays = progress?.streakDays || 0;

  const achievements: Achievement[] = [
    // Learning Category
    {
      id: 'first_lesson',
      title: 'Getting Started',
      description: 'Complete your first lesson',
      icon: '🎯',
      category: 'learning',
      requirement: 1,
      earned: lessonsCompleted >= 1,
      progress: Math.min(lessonsCompleted, 1),
      earnedDate: lessonsCompleted >= 1 ? '2024-01-15' : undefined
    },
    {
      id: 'lesson_master',
      title: 'Dedicated Learner',
      description: 'Complete 10 lessons',
      icon: '📚',
      category: 'learning',
      requirement: 10,
      earned: lessonsCompleted >= 10,
      progress: Math.min(lessonsCompleted, 10)
    },
    {
      id: 'lesson_expert',
      title: 'Learning Expert',
      description: 'Complete 50 lessons',
      icon: '🎓',
      category: 'learning',
      requirement: 50,
      earned: lessonsCompleted >= 50,
      progress: Math.min(lessonsCompleted, 50)
    },

    // Milestone Category
    {
      id: 'first_project',
      title: 'Builder',
      description: 'Complete your first project',
      icon: '🛠️',
      category: 'milestone',
      requirement: 1,
      earned: projectsBuilt >= 1,
      progress: Math.min(projectsBuilt, 1)
    },
    {
      id: 'first_course',
      title: 'Course Master',
      description: 'Complete your first full course',
      icon: '🏆',
      category: 'milestone',
      requirement: 1,
      earned: coursesCompleted >= 1,
      progress: Math.min(coursesCompleted, 1)
    },
    {
      id: 'level_up',
      title: 'Rising Star',
      description: 'Reach Level 5',
      icon: '⭐',
      category: 'milestone',
      requirement: 5,
      earned: (progress?.level || 0) >= 5,
      progress: Math.min(progress?.level || 0, 5)
    },

    // XP Category
    {
      id: 'xp_collector',
      title: 'XP Collector',
      description: 'Earn 500 XP',
      icon: '⚡',
      category: 'milestone',
      requirement: 500,
      earned: currentXP >= 500,
      progress: Math.min(currentXP, 500)
    },
    {
      id: 'xp_master',
      title: 'XP Master',
      description: 'Earn 2000 XP',
      icon: '💎',
      category: 'milestone',
      requirement: 2000,
      earned: currentXP >= 2000,
      progress: Math.min(currentXP, 2000)
    },

    // Streak Category
    {
      id: 'week_streak',
      title: 'Consistent Learner',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      category: 'streak',
      requirement: 7,
      earned: streakDays >= 7,
      progress: Math.min(streakDays, 7)
    },
    {
      id: 'month_streak',
      title: 'Dedication Master',
      description: 'Maintain a 30-day learning streak',
      icon: '🎯',
      category: 'streak',
      requirement: 30,
      earned: streakDays >= 30,
      progress: Math.min(streakDays, 30)
    },

    // Social Category
    {
      id: 'sharer',
      title: 'Knowledge Sharer',
      description: 'Share your first achievement',
      icon: '📤',
      category: 'social',
      requirement: 1,
      earned: false,
      progress: 0
    },
    {
      id: 'helper',
      title: 'Community Helper',
      description: 'Help 5 other learners',
      icon: '🤝',
      category: 'social',
      requirement: 5,
      earned: false,
      progress: 0
    }
  ];

  const categories = [
    { id: 'all', label: 'All Achievements', icon: Trophy },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'milestone', label: 'Milestones', icon: Target },
    { id: 'streak', label: 'Streaks', icon: Flame },
    { id: 'social', label: 'Social', icon: Users }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((earnedCount / totalCount) * 100);

  const handleDownloadCertificate = (achievement: Achievement) => {
    // In a real app, this would generate and download a PDF certificate
    alert(`Certificate for "${achievement.title}" would be downloaded here!`);
  };

  const handleShareAchievement = (achievement: Achievement) => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: `RoboQuest Achievement: ${achievement.title}`,
        text: `I just earned the "${achievement.title}" achievement on RoboQuest! ${achievement.description}`,
        url: window.location.href
      });
    } else {
      alert(`Share: I just earned "${achievement.title}" on RoboQuest!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Achievements & Badges
          </h1>
          <p className="text-lg text-gray-600">
            Celebrate your learning milestones, {userName}!
          </p>
        </div>

        {/* Achievement Overview */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold">{earnedCount}</div>
                <div className="text-yellow-100">Achievements Earned</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{completionPercentage}%</div>
                <div className="text-yellow-100">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{totalCount - earnedCount}</div>
                <div className="text-yellow-100">Still to Unlock</div>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={completionPercentage} className="h-3 bg-yellow-400" />
            </div>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                
                return (
                  <Button
                    key={category.id}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <Card 
              key={achievement.id}
              className={`transition-all hover:shadow-lg ${
                achievement.earned 
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <CardHeader className="text-center pb-3">
                <div className={`text-4xl mb-2 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                  {achievement.earned ? achievement.icon : '🔒'}
                </div>
                <CardTitle className={`text-lg ${achievement.earned ? 'text-yellow-800' : 'text-gray-600'}`}>
                  {achievement.title}
                </CardTitle>
                <CardDescription className={achievement.earned ? 'text-yellow-600' : 'text-gray-500'}>
                  {achievement.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm">
                      {achievement.progress} / {achievement.requirement}
                    </span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.requirement) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Status and Actions */}
                {achievement.earned ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Earned!</span>
                      {achievement.earnedDate && (
                        <span className="text-xs text-muted-foreground">
                          on {achievement.earnedDate}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleDownloadCertificate(achievement)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Certificate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleShareAchievement(achievement)}
                      >
                        <Share className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <Lock className="w-4 h-4" />
                      <span className="text-sm">Not yet earned</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {achievement.requirement - achievement.progress} more to unlock
                    </div>
                  </div>
                )}

                {/* Category Badge */}
                <div className="mt-3">
                  <Badge variant="outline" className="text-xs">
                    {achievement.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg text-muted-foreground">
              No achievements found in this category
            </p>
          </div>
        )}

        {/* Motivational Footer */}
        <Card className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Keep Going, {userName}! 🌟</h3>
            <p className="text-blue-100 mb-4">
              Every lesson completed and project built brings you closer to your next achievement.
            </p>
            <p className="text-sm text-blue-200">
              You're making amazing progress on your coding journey!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}