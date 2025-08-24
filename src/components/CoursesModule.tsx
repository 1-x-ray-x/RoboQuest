import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useAuth } from './AuthProvider';
import { useProgress } from '../hooks/useProgress';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Trophy, 
  Users,
  ExternalLink,
  ArrowRight,
  Star
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
  externalUrl: string;
  provider: string;
  modules: Array<{
    id: number;
    title: string;
    type: string;
    duration: string;
    completed: boolean;
  }>;
}

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
}

function CourseViewer({ course, onBack }: CourseViewerProps) {
  const { session } = useAuth();
  const { progress } = useProgress();
  const [showExternalDialog, setShowExternalDialog] = useState(false);
  const [showEmbeddedContent, setShowEmbeddedContent] = useState(false);

  const getUserProgress = () => {
    if (!progress) return { completedModules: [], progressPercentage: 0 };
    
    const completedModules = progress.coursesInProgress?.[course.id] || [];
    const progressPercentage = completedModules.length > 0 ? 50 : 0; // Simplified progress
    
    return { completedModules, progressPercentage };
  };

  const { completedModules, progressPercentage } = getUserProgress();
  const isCompleted = progress?.coursesCompleted?.includes(course.id) || false;

  const handleStartCourse = () => {
    setShowEmbeddedContent(true);
  };

  const handleGoToExternal = () => {
    window.open(course.externalUrl, '_blank');
  };



  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const categoryEmojis: { [key: string]: string } = {
    scratch: '🎨',
    python: '🐍',
    web: '🌐',
    robotics: '🤖'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline" className="mb-6">
          ← Back to Courses
        </Button>

        {/* Course Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={difficultyColors[course.difficulty]}>
                    {course.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {categoryEmojis[course.category]} {course.category}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {course.provider}
                  </Badge>
                </div>
                <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                <CardDescription className="text-base">
                  {course.description}
                </CardDescription>
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.estimatedHours}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.provider}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Beginner friendly
                  </span>
                </div>
              </div>
              <div className="ml-4">
                {isCompleted ? (
                  <Button disabled className="bg-green-500">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </Button>
                ) : completedModules.length > 0 ? (
                  <Button onClick={handleStartCourse} className="bg-blue-600 hover:bg-blue-700">
                    <Play className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                ) : (
                  <Button onClick={handleStartCourse} className="bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-2" />
                    Start Course
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              {progressPercentage > 0 && (
                <div className="text-sm text-muted-foreground">
                  You've started this course! Continue learning on {course.provider}.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Embedded Course Content */}
        {showEmbeddedContent && (
        <Card>
          <CardHeader>
              <CardTitle>Course Content - {course.provider}</CardTitle>
            <CardDescription>
                Interactive learning content embedded from {course.provider}. You can also open this course in a new tab for the full experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleGoToExternal}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in {course.provider}
                  </Button>
                  <Button variant="outline" onClick={() => setShowEmbeddedContent(false)}>
                    Close Content
                  </Button>
                        </div>
                <div className="border rounded-lg overflow-hidden" style={{ height: '600px' }}>
                  <iframe
                    src={course.externalUrl}
                    className="w-full h-full border-0"
                    title={`${course.title} - ${course.provider}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                    </div>
            </div>
          </CardContent>
        </Card>
        )}



        {/* External Platform Dialog */}
        <Dialog open={showExternalDialog} onOpenChange={setShowExternalDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Continue on {course.provider}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <ExternalLink className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                <p className="text-muted-foreground">
                  This course is hosted on {course.provider}. You'll be redirected to their platform to access the full curriculum and interactive exercises.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What you'll get:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Interactive coding exercises</li>
                  <li>• Step-by-step tutorials</li>
                  <li>• Progress tracking</li>
                  <li>• Certificate of completion</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowExternalDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleGoToExternal} className="flex-1">
                  Go to {course.provider}
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export function CoursesModule() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { progress } = useProgress();

  useEffect(() => {
    // Use local course data instead of API
    setCourses(getLocalCourses());
  }, []);

  const getLocalCourses = (): Course[] => [
    // Python Courses
    {
      id: 'python-basics',
      title: 'Python Fundamentals',
      description: 'Learn Python basics with interactive exercises and real-world projects',
      category: 'python',
      difficulty: 'beginner',
      estimatedHours: '20-30 hours',
      moduleCount: 15,
      externalUrl: 'https://codedex.io/python',
      provider: 'Codedex',
      modules: generateModules(15, 'Python Basics')
    },
    {
      id: 'python-intermediate',
      title: 'Python Intermediate',
      description: 'Advanced Python concepts including OOP, decorators, and async programming',
      category: 'python',
      difficulty: 'intermediate',
      estimatedHours: '25-35 hours',
      moduleCount: 18,
      externalUrl: 'https://codedex.io/python/intermediate',
      provider: 'Codedex',
      modules: generateModules(18, 'Python Intermediate')
    },
    {
      id: 'python-advanced',
      title: 'Python Advanced',
      description: 'Master advanced Python topics like metaprogramming and performance optimization',
      category: 'python',
      difficulty: 'advanced',
      estimatedHours: '30-40 hours',
      moduleCount: 20,
      externalUrl: 'https://codedex.io/python/advanced',
      provider: 'Codedex',
      modules: generateModules(20, 'Python Advanced')
    },
    // Web Development Courses
    {
      id: 'html-css-basics',
      title: 'HTML & CSS Fundamentals',
      description: 'Build beautiful websites with HTML5 and modern CSS3',
      category: 'web',
      difficulty: 'beginner',
      estimatedHours: '15-25 hours',
      moduleCount: 12,
      externalUrl: 'https://codedex.io/html-css',
      provider: 'Codedex',
      modules: generateModules(12, 'HTML & CSS')
    },
    {
      id: 'javascript-basics',
      title: 'JavaScript Essentials',
      description: 'Learn JavaScript from scratch with modern ES6+ features',
      category: 'web',
      difficulty: 'beginner',
      estimatedHours: '20-30 hours',
      moduleCount: 16,
      externalUrl: 'https://codedex.io/javascript',
      provider: 'Codedex',
      modules: generateModules(16, 'JavaScript')
    },
    {
      id: 'react-fundamentals',
      title: 'React.js Fundamentals',
      description: 'Build modern web applications with React hooks and context',
      category: 'web',
      difficulty: 'intermediate',
      estimatedHours: '25-35 hours',
      moduleCount: 18,
      externalUrl: 'https://codedex.io/react',
      provider: 'Codedex',
      modules: generateModules(18, 'React')
    },
    {
      id: 'nodejs-backend',
      title: 'Node.js Backend Development',
      description: 'Create robust backend APIs with Node.js and Express',
      category: 'web',
      difficulty: 'intermediate',
      estimatedHours: '30-40 hours',
      moduleCount: 20,
      externalUrl: 'https://codedex.io/nodejs',
      provider: 'Codedex',
      modules: generateModules(20, 'Node.js')
    },
    // Scratch Courses
    {
      id: 'scratch-basics',
      title: 'Scratch Programming',
      description: 'Learn programming concepts through visual block-based coding',
      category: 'scratch',
      difficulty: 'beginner',
      estimatedHours: '10-15 hours',
      moduleCount: 10,
      externalUrl: 'https://scratch.mit.edu/',
      provider: 'MIT Scratch',
      modules: generateModules(10, 'Scratch')
    },
    {
      id: 'scratch-games',
      title: 'Scratch Game Development',
      description: 'Create fun games and animations with Scratch',
      category: 'scratch',
      difficulty: 'beginner',
      estimatedHours: '15-20 hours',
      moduleCount: 12,
      externalUrl: 'https://scratch.mit.edu/',
      provider: 'MIT Scratch',
      modules: generateModules(12, 'Scratch Games')
    },
    // Robotics Courses
    {
      id: 'robotics-basics',
      title: 'Robotics Fundamentals',
      description: 'Introduction to robotics concepts and basic programming',
      category: 'robotics',
      difficulty: 'beginner',
      estimatedHours: '20-30 hours',
      moduleCount: 14,
      externalUrl: 'https://codedex.io/robotics',
      provider: 'Codedex',
      modules: generateModules(14, 'Robotics')
    },
    {
      id: 'arduino-programming',
      title: 'Arduino Programming',
      description: 'Learn to program Arduino microcontrollers for robotics projects',
      category: 'robotics',
      difficulty: 'intermediate',
      estimatedHours: '25-35 hours',
      moduleCount: 16,
      externalUrl: 'https://codedex.io/arduino',
      provider: 'Codedex',
      modules: generateModules(16, 'Arduino')
    },
    // Exercism Courses
    {
      id: 'exercism-python',
      title: 'Exercism Python Track',
      description: 'Master Python through 100+ coding exercises and mentorship',
      category: 'python',
      difficulty: 'intermediate',
      estimatedHours: '40-60 hours',
      moduleCount: 100,
      externalUrl: 'https://exercism.org/tracks/python',
      provider: 'Exercism',
      modules: generateModules(100, 'Exercism Python')
    },
    {
      id: 'exercism-javascript',
      title: 'Exercism JavaScript Track',
      description: 'Complete JavaScript mastery with 100+ exercises',
      category: 'web',
      difficulty: 'intermediate',
      estimatedHours: '40-60 hours',
      moduleCount: 100,
      externalUrl: 'https://exercism.org/tracks/javascript',
      provider: 'Exercism',
      modules: generateModules(100, 'Exercism JS')
    },
    {
      id: 'exercism-rust',
      title: 'Exercism Rust Track',
      description: 'Learn Rust programming with comprehensive exercises',
      category: 'python',
      difficulty: 'advanced',
      estimatedHours: '50-70 hours',
      moduleCount: 100,
      externalUrl: 'https://exercism.org/tracks/rust',
      provider: 'Exercism',
      modules: generateModules(100, 'Exercism Rust')
    },
    // Additional Codedex Courses
    {
      id: 'codedex-java',
      title: 'Java Programming',
      description: 'Learn Java fundamentals and object-oriented programming',
      category: 'python',
      difficulty: 'intermediate',
      estimatedHours: '30-40 hours',
      moduleCount: 22,
      externalUrl: 'https://codedex.io/java',
      provider: 'Codedex',
      modules: generateModules(22, 'Java')
    },
    {
      id: 'codedex-cpp',
      title: 'C++ Programming',
      description: 'Master C++ with memory management and advanced features',
      category: 'python',
      difficulty: 'advanced',
      estimatedHours: '40-50 hours',
      moduleCount: 25,
      externalUrl: 'https://codedex.io/cpp',
      provider: 'Codedex',
      modules: generateModules(25, 'C++')
    },
    {
      id: 'codedex-sql',
      title: 'SQL Database Design',
      description: 'Learn database design and SQL querying',
      category: 'web',
      difficulty: 'intermediate',
      estimatedHours: '20-30 hours',
      moduleCount: 16,
      externalUrl: 'https://codedex.io/sql',
      provider: 'Codedex',
      modules: generateModules(16, 'SQL')
    },
    {
      id: 'codedex-git',
      title: 'Git Version Control',
      description: 'Master Git for collaborative software development',
      category: 'web',
      difficulty: 'beginner',
      estimatedHours: '10-15 hours',
      moduleCount: 8,
      externalUrl: 'https://codedex.io/git',
      provider: 'Codedex',
      modules: generateModules(8, 'Git')
    },
    {
      id: 'codedex-docker',
      title: 'Docker Containerization',
      description: 'Learn containerization and deployment with Docker',
      category: 'web',
      difficulty: 'intermediate',
      estimatedHours: '15-25 hours',
      moduleCount: 12,
      externalUrl: 'https://codedex.io/docker',
      provider: 'Codedex',
      modules: generateModules(12, 'Docker')
    },
    {
      id: 'codedex-aws',
      title: 'AWS Cloud Computing',
      description: 'Deploy applications on Amazon Web Services',
      category: 'web',
      difficulty: 'advanced',
      estimatedHours: '30-40 hours',
      moduleCount: 20,
      externalUrl: 'https://codedex.io/aws',
      provider: 'Codedex',
      modules: generateModules(20, 'AWS')
    },
    {
      id: 'codedex-kubernetes',
      title: 'Kubernetes Orchestration',
      description: 'Master container orchestration with Kubernetes',
      category: 'web',
      difficulty: 'advanced',
      estimatedHours: '25-35 hours',
      moduleCount: 18,
      externalUrl: 'https://codedex.io/kubernetes',
      provider: 'Codedex',
      modules: generateModules(18, 'Kubernetes')
    },
    {
      id: 'codedex-machine-learning',
      title: 'Machine Learning Basics',
      description: 'Introduction to ML with Python and TensorFlow',
      category: 'python',
      difficulty: 'advanced',
      estimatedHours: '40-50 hours',
      moduleCount: 24,
      externalUrl: 'https://codedex.io/machine-learning',
      provider: 'Codedex',
      modules: generateModules(24, 'Machine Learning')
    },
    {
      id: 'codedex-data-science',
      title: 'Data Science with Python',
      description: 'Analyze data with pandas, numpy, and matplotlib',
      category: 'python',
      difficulty: 'intermediate',
      estimatedHours: '35-45 hours',
      moduleCount: 22,
      externalUrl: 'https://codedex.io/data-science',
      provider: 'Codedex',
      modules: generateModules(22, 'Data Science')
    },
    {
      id: 'codedex-cybersecurity',
      title: 'Cybersecurity Fundamentals',
      description: 'Learn ethical hacking and security best practices',
      category: 'python',
      difficulty: 'intermediate',
      estimatedHours: '30-40 hours',
      moduleCount: 20,
      externalUrl: 'https://codedex.io/cybersecurity',
      provider: 'Codedex',
      modules: generateModules(20, 'Cybersecurity')
    },
    {
      id: 'codedex-blockchain',
      title: 'Blockchain Development',
      description: 'Build decentralized applications with Solidity',
      category: 'web',
      difficulty: 'advanced',
      estimatedHours: '35-45 hours',
      moduleCount: 22,
      externalUrl: 'https://codedex.io/blockchain',
      provider: 'Codedex',
      modules: generateModules(22, 'Blockchain')
    }
  ];

  const generateModules = (count: number, prefix: string) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `${prefix} - Module ${i + 1}`,
      type: i % 3 === 0 ? 'Video' : i % 3 === 1 ? 'Exercise' : 'Quiz',
      duration: `${Math.floor(Math.random() * 30) + 15} min`,
      completed: false
    }));
  };

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  if (selectedCourse) {
    return <CourseViewer course={selectedCourse} onBack={handleBackToCourses} />;
  }

  const getCourseProgress = (courseId: string) => {
    if (!progress) return 0;
    const completedModules = progress.coursesInProgress?.[courseId]?.length || 0;
    return completedModules > 0 ? 50 : 0; // Simplified progress
  };

  const isCourseCompleted = (courseId: string) => {
    return progress?.coursesCompleted?.includes(courseId) || false;
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const categoryEmojis = {
    scratch: '🎨',
    python: '🐍',
    web: '🌐',
    robotics: '🤖'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Learning Courses
          </h1>
          <p className="text-lg text-gray-600">
            {courses.length} structured learning paths with real platforms and certifications
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-lg">Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-lg text-red-600">Failed to load courses: {error}</p>
            <Button onClick={fetchCourses} className="mt-4">
              Try Again
            </Button>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const courseProgress = getCourseProgress(course.id);
              const isCompleted = isCourseCompleted(course.id);
              const hasStarted = courseProgress > 0;

              return (
                <Card 
                  key={course.id} 
                  className="hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => handleCourseClick(course)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={difficultyColors[course.difficulty]}>
                        {course.difficulty}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {course.provider}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Course Info */}
                    <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                      <div className="flex items-center justify-center h-20">
                        <div className="text-center">
                          <div className="text-3xl mb-2">{categoryEmojis[course.category]}</div>
                          <div className="text-sm font-medium">{course.category}</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    {hasStarted && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium">Progress</span>
                          <span className="text-xs font-medium">{Math.round(courseProgress)}%</span>
                        </div>
                        <Progress value={courseProgress} className="h-1" />
                      </div>
                    )}

                    {/* Course Stats */}
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.estimatedHours}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.provider}
                      </span>
                    </div>

                    {/* Action Button */}
                    <Button 
                      className={`w-full ${
                        isCompleted 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : hasStarted 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course);
                      }}
                    >
                      {isCompleted ? (
                        <>
                          <Trophy className="w-4 h-4 mr-2" />
                          Completed
                        </>
                      ) : hasStarted ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </>
                      ) : (
                        <>
                          <Star className="w-4 h-4 mr-2" />
                          Start Course
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}