import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { useAuth } from './AuthProvider';
import { useProgress } from '../hooks/useProgress';
import { 
  BookOpen, 
  Trophy, 
  Zap, 
  Target, 
  PlayCircle, 
  Code, 
  TrendingUp,
  Star,
  Clock,
  Award,
  ChevronRight,
  Calendar,
  Flame,
  Wifi,
  WifiOff
} from 'lucide-react';

interface DashboardProps {
  onNavigate?: (section: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const { progress, loading, error, isOffline } = useProgress();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-lg">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const userName = user?.user_metadata?.firstName || user?.email?.split('@')[0] || 'Coder';
  const currentLevel = progress?.level || 0;
  const currentXP = progress?.totalXP || 0;
  const dailyGoal = progress?.dailyGoal || 2;
  const dailyProgress = progress?.dailyProgress || 0;
  const dailyGoalProgress = Math.min((dailyProgress / dailyGoal) * 100, 100);

  const stats = [
    {
      title: 'Current Level',
      value: currentLevel,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: currentLevel === 0 ? 'Complete a course to level up!' : `Level ${currentLevel} achieved!`
    },
    {
      title: 'Total XP',
      value: currentXP,
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Experience points earned'
    },
    {
      title: 'Lessons Completed',
      value: progress?.lessonsCompleted || 0,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Tutorials and modules finished'
    },
    {
      title: 'Projects Built',
      value: progress?.projectsBuilt || 0,
      icon: Code,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Hands-on projects completed'
    }
  ];

  const achievements = [
    { 
      id: 1, 
      title: 'Getting Started', 
      description: 'Complete your first lesson', 
      earned: (progress?.lessonsCompleted || 0) >= 1,
      icon: '🎯'
    },
    { 
      id: 2, 
      title: 'First Steps', 
      description: 'Reach Level 1', 
      earned: (progress?.level || 0) >= 1,
      icon: '🚀'
    },
    { 
      id: 3, 
      title: 'Builder', 
      description: 'Complete your first project', 
      earned: (progress?.projectsBuilt || 0) >= 1,
      icon: '🛠️'
    },
    { 
      id: 4, 
      title: 'Dedicated Learner', 
      description: 'Complete 10 lessons', 
      earned: (progress?.lessonsCompleted || 0) >= 10,
      icon: '📚'
    },
    { 
      id: 5, 
      title: 'Course Master', 
      description: 'Complete a full course', 
      earned: (progress?.coursesCompleted?.length || 0) >= 1,
      icon: '🏆'
    },
    { 
      id: 6, 
      title: 'XP Collector', 
      description: 'Earn 500 XP', 
      earned: (progress?.totalXP || 0) >= 500,
      icon: '⚡'
    }
  ];

  const quickActions = [
    {
      title: 'Continue Learning',
      description: 'Pick up where you left off',
      icon: PlayCircle,
      color: 'from-blue-500 to-purple-500',
      action: () => onNavigate?.('tutorials')
    },
    {
      title: 'Practice Coding',
      description: 'Work on hands-on projects',
      icon: Code,
      color: 'from-purple-500 to-pink-500',
      action: () => onNavigate?.('practice')
    },
    {
      title: 'View Progress',
      description: 'Check your learning analytics',
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-500',
      action: () => onNavigate?.('progress')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Offline/Online Status */}
        {isOffline && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <WifiOff className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Offline Mode:</strong> Some features may be limited. Your progress will sync when connection is restored.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && !isOffline && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              <strong>Connection Issue:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-5xl">🤖</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userName}! 🚀
              </h1>
              <p className="text-lg text-gray-600">
                Ready to continue your coding adventure?
              </p>
            </div>
          </div>

          {/* Level Progress */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {currentLevel === 0 ? 'Starting Your Journey' : `Level ${currentLevel}`}
                  </h3>
                  <p className="text-blue-100">
                    {currentLevel === 0 
                      ? 'Complete your first course to reach Level 1!' 
                      : `You've completed ${progress?.coursesCompleted?.length || 0} courses`
                    }
                  </p>
                </div>
                <div className="text-3xl">
                  <Trophy className="w-8 h-8" />
                </div>
              </div>
              <div className="text-sm text-blue-100">
                Levels are earned by completing full courses. Each course = 1 level up!
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Goal Progress */}
        <Card className="mb-8 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-semibold">Daily Goal</h3>
                  <p className="text-orange-100">
                    {dailyProgress} / {dailyGoal} lessons completed today
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{Math.round(dailyGoalProgress)}%</div>
                <div className="text-orange-100 text-sm">Complete</div>
              </div>
            </div>
            <Progress value={dailyGoalProgress} className="h-3 bg-orange-400" />
            <div className="mt-2 text-sm text-orange-100">
              {dailyProgress >= dailyGoal 
                ? '🎉 Daily goal achieved! Great work!' 
                : `${dailyGoal - dailyProgress} more lessons to reach your daily goal`
              }
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Jump into your favorite learning activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full h-auto p-4 text-left hover:shadow-md transition-shadow bg-gradient-to-r ${action.color} hover:text-white group justify-start`}
                    onClick={action.action}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <action.icon className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-semibold">{action.title}</div>
                        <div className="text-sm opacity-75">{action.description}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Achievements
              </CardTitle>
              <CardDescription>
                Your latest badges and accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      achievement.earned
                        ? 'bg-yellow-50 border-yellow-200 border'
                        : 'bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className={`text-2xl ${achievement.earned ? '' : 'grayscale'}`}>
                      {achievement.earned ? achievement.icon : '🔒'}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${achievement.earned ? 'text-yellow-800' : 'text-gray-600'}`}>
                        {achievement.title}
                      </div>
                      <div className={`text-sm ${achievement.earned ? 'text-yellow-600' : 'text-gray-500'}`}>
                        {achievement.description}
                      </div>
                    </div>
                    {achievement.earned && (
                      <Badge className="bg-yellow-500 text-white">Earned!</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Streak */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Learning Streak
            </CardTitle>
            <CardDescription>
              Keep your streak alive by learning something new every day!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🔥</div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {progress?.streakDays || 0} days
                  </p>
                  <p className="text-sm text-muted-foreground">Current streak</p>
                </div>
              </div>
              <Button 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                onClick={() => onNavigate?.('tutorials')}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Continue Streak
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}