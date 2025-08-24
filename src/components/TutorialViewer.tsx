import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useAuth } from './AuthProvider';
import { useProgress } from '../hooks/useProgress';
import { ArrowLeft, CheckCircle, Star, Eye, Trophy, Clock, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  type: 'interactive' | 'video' | 'document';
  category: 'scratch' | 'python' | 'robotics' | 'arduino' | 'web' | 'it' | 'hacking' | 'cybersecurity' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  xpReward: number;
  views: number;
  likes: number;
  uploadedAt: string;
  content?: {
    sections: Array<{
      title: string;
      content: string;
    }>;
  };
}

interface TutorialViewerProps {
  tutorialId: string;
  onBack: () => void;
}

export function TutorialViewer({ tutorialId, onBack }: TutorialViewerProps) {
  const { session } = useAuth();
  const { progress } = useProgress();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    fetchTutorial();
  }, [tutorialId]);

  useEffect(() => {
    if (progress && tutorial) {
      setCompleted(progress.completedTutorials?.includes(tutorial.id) || false);
    }
  }, [progress, tutorial]);

  const fetchTutorial = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/content/${tutorialId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tutorial');
      }

      const data = await response.json();
      setTutorial(data.content);
      
      // Record view
      await recordView();
    } catch (err: any) {
      console.error('Error fetching tutorial:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const recordView = async () => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/content/${tutorialId}/view`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (err) {
      console.log('Error recording view:', err);
    }
  };

  const handleCompleteTutorial = async () => {
    if (!session?.access_token || !tutorial || completed) return;

    try {
      setCompleting(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/tutorial/${tutorial.id}/complete`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to complete tutorial');
      }

      const result = await response.json();
      setCompleted(true);
      
      // Refresh page to show updated progress
      window.location.reload();
    } catch (err: any) {
      console.error('Error completing tutorial:', err);
    } finally {
      setCompleting(false);
    }
  };

  const goToNextSection = () => {
    if (tutorial && currentSection < tutorial.content!.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-lg">Loading tutorial...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button onClick={onBack} variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tutorials
          </Button>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-lg text-red-600">Tutorial not found or failed to load</p>
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

  const categoryEmojis = {
    scratch: '🎨',
    python: '🐍',
    robotics: '🤖',
    arduino: '⚡',
    web: '🌐',
    general: '📚'
  };

  const sections = tutorial.content?.sections || [];
  const currentSectionData = sections[currentSection];
  const sectionProgress = sections.length > 0 ? ((currentSection + 1) / sections.length) * 100 : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tutorials
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{tutorial.title}</CardTitle>
                <CardDescription className="text-base mb-4">
                  {tutorial.description}
                </CardDescription>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className={difficultyColors[tutorial.difficulty]}>
                    {tutorial.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    {categoryEmojis[tutorial.category]} {tutorial.category}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {tutorial.duration}
                  </Badge>
                  <Badge variant="outline">
                    <Trophy className="w-3 h-3 mr-1" />
                    {tutorial.xpReward} XP
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {tutorial.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {tutorial.likes} likes
                  </span>
                </div>
              </div>
              <div className="ml-4">
                {completed ? (
                  <Button disabled className="bg-green-500">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </Button>
                ) : (
                  <Button 
                    onClick={handleCompleteTutorial}
                    disabled={completing}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  >
                    {completing ? 'Completing...' : `Complete (+${tutorial.xpReward} XP)`}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          {sections.length > 0 && (
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">
                    {currentSection + 1} of {sections.length} sections
                  </span>
                </div>
                <Progress value={sectionProgress} className="h-2" />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Tutorial Content */}
        {sections.length > 0 ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {currentSectionData.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none mb-6">
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {currentSectionData.content}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline"
                  onClick={goToPreviousSection}
                  disabled={currentSection === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                  Section {currentSection + 1} of {sections.length}
                </span>

                <Button 
                  onClick={goToNextSection}
                  disabled={currentSection === sections.length - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  This tutorial is being updated with interactive content.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Objectives */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Learning Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Understand the core concepts covered in this tutorial</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Apply the learned skills in practical exercises</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Build confidence in {tutorial.category} programming</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}