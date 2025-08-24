import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useAuth } from './AuthProvider';
import { useProgress } from '../hooks/useProgress';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  Trophy, 
  BookOpen, 
  Video, 
  Code, 
  Zap,
  Target,
  Lock
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: string;
  moduleCount: number;
  modules: Array<{
    id: number;
    title: string;
    type: string;
    duration: string;
    completed: boolean;
  }>;
}

interface CourseViewerProps {
  courseId: string;
  onBack: () => void;
}

export function CourseViewer({ courseId, onBack }: CourseViewerProps) {
  const { session } = useAuth();
  const { progress } = useProgress();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completingModule, setCompletingModule] = useState<number | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/course/${courseId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }

      const data = await response.json();
      setCourse(data.course);
    } catch (err: any) {
      console.error('Error fetching course:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCompletedModules = () => {
    if (!progress?.coursesInProgress) return [];
    return progress.coursesInProgress[courseId] || [];
  };

  const getCourseProgress = () => {
    if (!course) return 0;
    const completedModules = getCompletedModules();
    return Math.round((completedModules.length / course.moduleCount) * 100);
  };

  const isModuleCompleted = (moduleId: number) => {
    return getCompletedModules().includes(moduleId);
  };

  const isModuleUnlocked = (moduleId: number) => {
    const completedModules = getCompletedModules();
    // First module is always unlocked, subsequent modules unlock after previous one is completed
    return moduleId === 1 || completedModules.includes(moduleId - 1);
  };

  const handleCompleteModule = async (moduleId: number) => {
    if (!session?.access_token || !course || isModuleCompleted(moduleId)) return;

    try {
      setCompletingModule(moduleId);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/course/${course.id}/module/${moduleId}/complete`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to complete module');
      }

      const result = await response.json();
      
      // Refresh the page to show updated progress
      window.location.reload();
    } catch (err: any) {
      console.error('Error completing module:', err);
    } finally {
      setCompletingModule(null);
    }
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-red-500" />;
      case 'interactive': return <Zap className="w-5 h-5 text-blue-500" />;
      case 'hands-on': return <Code className="w-5 h-5 text-green-500" />;
      case 'practice': return <Target className="w-5 h-5 text-purple-500" />;
      case 'project': return <Trophy className="w-5 h-5 text-yellow-500" />;
      default: return <BookOpen className="w-5 h-5 text-gray-500" />;
    }
  };

  const getModuleTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'interactive': return 'bg-blue-100 text-blue-800';
      case 'hands-on': return 'bg-green-100 text-green-800';
      case 'practice': return 'bg-purple-100 text-purple-800';
      case 'project': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-lg">Loading course...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button onClick={onBack} variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-lg text-red-600">Course not found or failed to load</p>
          </div>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const courseProgress = getCourseProgress();
  const completedModules = getCompletedModules();
  const isCompleted = completedModules.length >= course.moduleCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        {/* Course Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={difficultyColors[course.difficulty]}>
                    {course.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {course.category}
                  </Badge>
                  {isCompleted && (
                    <Badge className="bg-green-500 text-white">
                      <Trophy className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                <CardDescription className="text-base mb-4">
                  {course.description}
                </CardDescription>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.moduleCount} modules
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.estimatedHours}
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4" />
                    Level up when completed
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm font-medium">{courseProgress}%</span>
              </div>
              <Progress value={courseProgress} className="h-3" />
              <div className="text-sm text-muted-foreground">
                {completedModules.length} of {course.moduleCount} modules completed
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Course Modules</h2>
          
          {course.modules.map((module, index) => {
            const isCompleted = isModuleCompleted(module.id);
            const isUnlocked = isModuleUnlocked(module.id);
            const isCurrentlyCompleting = completingModule === module.id;

            return (
              <Card 
                key={module.id}
                className={`transition-all ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : isUnlocked 
                    ? 'hover:shadow-md cursor-pointer' 
                    : 'opacity-60 bg-gray-50'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isUnlocked 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : isUnlocked ? (
                            <span className="font-bold">{module.id}</span>
                          ) : (
                            <Lock className="w-5 h-5" />
                          )}
                        </div>
                        {index < course.modules.length - 1 && (
                          <div className={`absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${
                            isCompleted ? 'bg-green-300' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getModuleIcon(module.type)}
                          <h3 className="font-semibold">{module.title}</h3>
                          <Badge className={getModuleTypeColor(module.type)} variant="outline">
                            {module.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{module.duration}</span>
                          {isCompleted && (
                            <span className="text-green-600 font-medium">✓ Completed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      {isCompleted ? (
                        <Button variant="outline" disabled>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </Button>
                      ) : isUnlocked ? (
                        <Button 
                          onClick={() => handleCompleteModule(module.id)}
                          disabled={isCurrentlyCompleting}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          {isCurrentlyCompleting ? (
                            'Completing...'
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Start Module
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button variant="outline" disabled>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Course Completion */}
        {isCompleted && (
          <Card className="mt-8 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="p-6 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
              <p className="text-lg mb-4">
                You've completed the {course.title} course!
              </p>
              <p className="text-green-100">
                You've earned a new level and can now tackle more advanced courses.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}