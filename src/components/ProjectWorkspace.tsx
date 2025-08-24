import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { useAuth } from './AuthProvider';
import { useProgress } from '../hooks/useProgress';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  Trophy, 
  Code,
  RotateCcw,
  Lightbulb,
  Target,
  BookOpen
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  xpReward: number;
  type: 'coding' | 'visual';
  language?: string;
  instructions: string[];
  startingCode?: string;
  solution?: string;
  tests?: Array<{
    description: string;
    input: string;
    expectedOutput: string;
  }>;
}

interface ProjectWorkspaceProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectWorkspace({ projectId, onBack }: ProjectWorkspaceProps) {
  const { session } = useAuth();
  const { progress } = useProgress();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [completing, setCompleting] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/project/${projectId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }

      const data = await response.json();
      setProject(data.project);
      setUserCode(data.project.startingCode || '');
    } catch (err: any) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeElapsed(0);
  };

  const resetCode = () => {
    if (project?.startingCode) {
      setUserCode(project.startingCode);
    }
  };

  const runCode = () => {
    if (!project || project.type !== 'coding') return;

    // Simple code validation for demonstration
    const results: string[] = [];
    
    if (project.tests) {
      project.tests.forEach((test, index) => {
        // This is a simplified test runner - in a real app you'd use a proper code execution environment
        if (project.language === 'python' && userCode.includes('print(')) {
          results.push(`✅ Test ${index + 1}: ${test.description} - PASSED`);
        } else if (project.language === 'html' && userCode.includes('<')) {
          results.push(`✅ Test ${index + 1}: ${test.description} - PASSED`);
        } else {
          results.push(`❌ Test ${index + 1}: ${test.description} - FAILED`);
        }
      });
    } else {
      results.push('✅ Code syntax looks good!');
    }
    
    setTestResults(results);
  };

  const markStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
      if (stepIndex === currentStep && currentStep < (project?.instructions.length || 0) - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const getProjectProgress = () => {
    if (!project) return 0;
    return Math.round((completedSteps.length / project.instructions.length) * 100);
  };

  const isProjectCompleted = () => {
    return project && completedSteps.length === project.instructions.length;
  };

  const isAlreadyCompleted = () => {
    return progress?.completedProjects?.includes(projectId) || false;
  };

  const handleCompleteProject = async () => {
    if (!session?.access_token || !project || !isProjectCompleted()) return;

    try {
      setCompleting(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/project/${project.id}/complete`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ timeSpent: timeElapsed, userCode })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to complete project');
      }

      const result = await response.json();
      // Refresh the page to show updated progress
      window.location.reload();
    } catch (err: any) {
      console.error('Error completing project:', err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-lg">Loading project workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Button onClick={onBack} variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-lg text-red-600">Project not found or failed to load</p>
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

  const projectProgress = getProjectProgress();
  const completed = isProjectCompleted();
  const alreadyCompleted = isAlreadyCompleted();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Button onClick={onBack} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Instructions & Info */}
          <div className="space-y-6">
            {/* Project Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={difficultyColors[project.difficulty]}>
                    {project.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {project.category}
                  </Badge>
                  {project.language && (
                    <Badge variant="outline">
                      {project.language}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <CardDescription>
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span>Estimated Time:</span>
                    <span className="font-medium">{project.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>XP Reward:</span>
                    <span className="font-medium text-yellow-600">
                      <Trophy className="w-4 h-4 inline mr-1" />
                      {project.xpReward} XP
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Timer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold mb-4">
                    {formatTime(timeElapsed)}
                  </div>
                  <div className="flex gap-2 justify-center">
                    {!isTimerRunning ? (
                      <Button onClick={startTimer} className="bg-green-500 hover:bg-green-600" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                    ) : (
                      <Button onClick={pauseTimer} className="bg-yellow-500 hover:bg-yellow-600" size="sm">
                        <Clock className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button onClick={resetTimer} variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.instructions.map((instruction, index) => {
                    const isCompleted = completedSteps.includes(index);
                    const isCurrent = index === currentStep;
                    const isNext = index <= Math.max(...completedSteps, -1) + 1;

                    return (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border transition-all ${
                          isCompleted 
                            ? 'bg-green-50 border-green-200' 
                            : isCurrent 
                            ? 'bg-blue-50 border-blue-300' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isCurrent 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1">
                            <div className={`text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                              {instruction}
                            </div>
                            {!isCompleted && isNext && (
                              <Button 
                                size="sm" 
                                className="mt-2"
                                onClick={() => markStepComplete(index)}
                              >
                                Mark Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Code Editor & Output */}
          <div className="space-y-6">
            {project.type === 'coding' ? (
              <>
                {/* Code Editor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Code Editor
                      {project.language && (
                        <Badge variant="outline">{project.language}</Badge>
                      )}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button onClick={runCode} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Play className="w-4 h-4 mr-1" />
                        Run
                      </Button>
                      <Button onClick={resetCode} variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Reset
                      </Button>
                      {project.solution && (
                        <Button 
                          onClick={() => setShowSolution(!showSolution)} 
                          variant="outline" 
                          size="sm"
                        >
                          <Lightbulb className="w-4 h-4 mr-1" />
                          {showSolution ? 'Hide' : 'Show'} Solution
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      className="font-mono text-sm min-h-64 bg-gray-50"
                      placeholder="Write your code here..."
                    />
                  </CardContent>
                </Card>

                {/* Test Results */}
                {testResults.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Test Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {testResults.map((result, index) => (
                          <div 
                            key={index}
                            className={`p-2 rounded text-sm font-mono ${
                              result.includes('✅') 
                                ? 'bg-green-50 text-green-800' 
                                : 'bg-red-50 text-red-800'
                            }`}
                          >
                            {result}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Solution */}
                {showSolution && project.solution && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Solution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-100 p-4 rounded text-sm font-mono overflow-x-auto">
                        {project.solution}
                      </pre>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              // Visual projects (like Scratch)
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Visual Project Workspace</CardTitle>
                  <CardDescription>
                    Open Scratch or your preferred visual programming tool to complete this project.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <div className="text-4xl mb-4">🎨</div>
                    <p className="text-lg mb-4">Create your visual project!</p>
                    <p className="text-sm text-muted-foreground">
                      Use the instructions on the left to guide your creative process.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completion */}
            {completed && !alreadyCompleted && (
              <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-xl font-bold mb-2">Project Complete! 🎉</h3>
                  <p className="mb-4">
                    Great job! You've finished building {project.title}.
                  </p>
                  <Button 
                    onClick={handleCompleteProject}
                    disabled={completing}
                    className="bg-white text-green-600 hover:bg-gray-100"
                  >
                    {completing ? 'Submitting...' : `Claim ${project.xpReward} XP Reward`}
                  </Button>
                </CardContent>
              </Card>
            )}

            {alreadyCompleted && (
              <Card className="bg-green-100 border-green-200">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <h3 className="text-xl font-bold mb-2 text-green-800">Already Completed!</h3>
                  <p className="text-green-700">
                    You've already completed this project and earned {project.xpReward} XP.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}