import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useAuth } from './AuthProvider';
import { useProgress } from '../hooks/useProgress';
import { 
  TrendingUp, 
  Trophy, 
  BookOpen, 
  Code, 
  Target, 
  Calendar,
  Zap,
  Award,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

export function ProgressTracker() {
  const { user } = useAuth();
  const { progress, loading, error } = useProgress();

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-lg text-red-600">Error loading progress: {error}</p>
        </div>
      </div>
    );
  }

  const userName = user?.firstName || 'Student';
  const currentLevel = progress?.level || 0;
  const currentXP = progress?.totalXP || 0;
  const coursesCompleted = progress?.coursesCompleted?.length || 0;
  const lessonsCompleted = progress?.lessonsCompleted || 0;
  const projectsBuilt = progress?.projectsBuilt || 0;
  const dailyGoal = progress?.dailyGoal || 2;
  const dailyProgress = progress?.dailyProgress || 0;
  const streakDays = progress?.streakDays || 0;

  const stats = [
    {
      title: 'Current Level',
      value: currentLevel,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '+1 this month'
    },
    {
      title: 'Total XP',
      value: currentXP,
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+150 this week'
    },
    {
      title: 'Courses Completed',
      value: coursesCompleted,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: coursesCompleted > 0 ? 'Recently completed' : 'None yet'
    },
    {
      title: 'Projects Built',
      value: projectsBuilt,
      icon: Code,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: projectsBuilt > 0 ? 'Keep building!' : 'Start your first'
    }
  ];

  const weeklyProgress = [
    { day: 'Mon', lessons: Math.max(0, dailyProgress - 6) },
    { day: 'Tue', lessons: Math.max(0, dailyProgress - 5) },
    { day: 'Wed', lessons: Math.max(0, dailyProgress - 4) },
    { day: 'Thu', lessons: Math.max(0, dailyProgress - 3) },
    { day: 'Fri', lessons: Math.max(0, dailyProgress - 2) },
    { day: 'Sat', lessons: Math.max(0, dailyProgress - 1) },
    { day: 'Sun', lessons: dailyProgress }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Progress Analytics
          </h1>
          <p className="text-lg text-gray-600">
            Track your learning journey and celebrate your achievements, {userName}!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Goal Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Daily Learning Goal
              </CardTitle>
              <CardDescription>
                Track your daily learning progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Today's Progress</span>
                  <span className="text-sm font-medium">{dailyProgress} / {dailyGoal} lessons</span>
                </div>
                <Progress value={(dailyProgress / dailyGoal) * 100} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  {dailyProgress >= dailyGoal 
                    ? '🎉 Goal achieved! Keep up the great work!' 
                    : `${dailyGoal - dailyProgress} more lessons to reach your goal`
                  }
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Streak */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                Learning Streak
              </CardTitle>
              <CardDescription>
                Your consecutive learning days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl">🔥</div>
                <div>
                  <p className="text-3xl font-bold text-orange-600">{streakDays}</p>
                  <p className="text-sm text-muted-foreground">
                    {streakDays === 0 ? 'Start your streak today!' 
                     : streakDays === 1 ? 'Day streak' 
                     : 'Days streak'}
                  </p>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {streakDays >= 7 ? '🏆 Amazing consistency!' 
                 : streakDays >= 3 ? '🎯 Building momentum!' 
                 : 'Keep learning daily to build your streak!'}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                Weekly Activity
              </CardTitle>
              <CardDescription>
                Your learning activity this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-8">{day.day}</span>
                    <div className="flex-1">
                      <Progress value={(day.lessons / Math.max(dailyGoal, 1)) * 100} className="h-2" />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">
                      {day.lessons} lessons
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                Learning Categories
              </CardTitle>
              <CardDescription>
                Your focus areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">🎨 Scratch Programming</span>
                      <span className="text-sm text-muted-foreground">40%</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">🐍 Python</span>
                      <span className="text-sm text-muted-foreground">30%</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">🤖 Robotics</span>
                      <span className="text-sm text-muted-foreground">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">⚡ Arduino</span>
                      <span className="text-sm text-muted-foreground">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Recent Achievements
            </CardTitle>
            <CardDescription>
              Your latest milestones and accomplishments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="text-2xl">🎯</div>
                <div>
                  <div className="font-semibold text-yellow-800">Getting Started</div>
                  <div className="text-sm text-yellow-600">Completed first lesson</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl">⚡</div>
                <div>
                  <div className="font-semibold text-blue-800">XP Collector</div>
                  <div className="text-sm text-blue-600">Earned 100+ XP</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl">📚</div>
                <div>
                  <div className="font-semibold text-green-800">Dedicated Learner</div>
                  <div className="text-sm text-green-600">5+ lessons completed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}