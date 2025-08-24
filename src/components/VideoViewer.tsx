import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from './AuthProvider';
import { useProgress } from '../hooks/useProgress';
import { ArrowLeft, CheckCircle, Star, Trophy, Clock, Play } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  type: 'video';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  xpReward: number;
  views: number;
  likes: number;
  uploadedAt: string;
  isOurContent?: boolean;
}

interface VideoViewerProps {
  videoId: string;
  onBack: () => void;
  isOurContent?: boolean;
}

export function VideoViewer({ videoId, onBack, isOurContent = false }: VideoViewerProps) {
  const { session } = useAuth();
  const { progress } = useProgress();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  useEffect(() => {
    if (progress && video) {
      setCompleted(progress.completedTutorials?.includes(video.id) || false);
    }
  }, [progress, video]);

  const fetchVideo = async () => {
    try {
      setLoading(true);
      const endpoint = isOurContent ? 'our-content' : 'content';
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/${endpoint}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }

      const data = await response.json();
      const foundVideo = data.content.find((v: Video) => v.id === videoId);
      
      if (!foundVideo) {
        throw new Error('Video not found');
      }
      
      setVideo(foundVideo);
      
      // Record view
      await recordView();
    } catch (err: any) {
      console.error('Error fetching video:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const recordView = async () => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/content/${videoId}/view`,
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

  const handleCompleteVideo = async () => {
    if (!session?.access_token || !video || completed) return;

    try {
      setCompleting(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/tutorial/${video.id}/complete`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to complete video');
      }

      const result = await response.json();
      setCompleted(true);
      
      // Refresh page to show updated progress
      window.location.reload();
    } catch (err: any) {
      console.error('Error completing video:', err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-lg">Loading video...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Button onClick={onBack} variant="outline" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {isOurContent ? 'Our Projects' : 'Tutorials'}
          </Button>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-lg text-red-600">Video not found or failed to load</p>
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

  const categoryEmojis: { [key: string]: string } = {
    scratch: '🎨',
    python: '🐍',
    robotics: '🤖',
    arduino: '⚡',
    web: '🌐',
    general: '📚',
    tutorial: '🎓',
    project: '🛠️',
    tips: '💡'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Button onClick={onBack} variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {isOurContent ? 'Our Projects' : 'Tutorials'}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="aspect-video relative rounded-t-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}?modestbranding=1&rel=0`}
                    title={video.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={difficultyColors[video.difficulty]}>
                      {video.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {categoryEmojis[video.category]} {video.category}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {video.duration}
                    </Badge>
                    <Badge variant="outline">
                      <Trophy className="w-3 h-3 mr-1" />
                      {video.xpReward} XP
                    </Badge>
                    {video.isOurContent && (
                      <Badge className="bg-blue-500 text-white">
                        RoboQuest
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold mb-3">{video.title}</h1>
                  <p className="text-muted-foreground leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Info Sidebar */}
          <div className="space-y-6">
            {/* Completion Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completed ? (
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <p className="font-medium text-green-800 mb-2">Completed!</p>
                    <p className="text-sm text-green-600">
                      You've earned {video.xpReward} XP
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Play className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                    <p className="font-medium mb-3">Watch and Learn</p>
                    <Button 
                      onClick={handleCompleteVideo}
                      disabled={completing}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    >
                      {completing ? 'Completing...' : `Complete (+${video.xpReward} XP)`}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle>🎯 Learning Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Understand key {video.category} concepts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Apply learned techniques in practice</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Build confidence in {video.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Content */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Trophy className="w-4 h-4 mr-2" />
                    Practice Exercises
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Star className="w-4 h-4 mr-2" />
                    Take a Course
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Play className="w-4 h-4 mr-2" />
                    More Tutorials
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Video Stats */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Video Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <Badge className={difficultyColors[video.difficulty]} variant="outline">
                      {video.difficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{video.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>XP Reward:</span>
                    <span className="font-medium text-yellow-600">{video.xpReward} XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{categoryEmojis[video.category]} {video.category}</span>
                  </div>
                  {video.isOurContent && (
                    <div className="flex justify-between">
                      <span>Source:</span>
                      <Badge className="bg-blue-500 text-white text-xs">RoboQuest</Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}