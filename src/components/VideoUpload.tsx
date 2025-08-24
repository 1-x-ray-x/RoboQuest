import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from './AuthProvider';
import { Upload, Video, CheckCircle, AlertCircle, Youtube } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function VideoUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const { session } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video',
    category: 'scratch',
    difficulty: 'beginner',
    duration: '',
    youtubeId: '',
    xpReward: 50,
    // When true, upload goes to "Our Projects"; otherwise to Tutorials
    isOurContent: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const extractYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const handleYouTubeUrlChange = (value: string) => {
    const videoId = extractYouTubeId(value);
    handleInputChange('youtubeId', videoId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.access_token) {
      setError('You must be logged in to upload content');
      return;
    }

    if (!formData.youtubeId) {
      setError('Please provide a YouTube video ID or URL');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/content/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setSuccess('Tutorial uploaded successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'video',
        category: 'scratch',
        difficulty: 'beginner',
        duration: '',
        youtubeId: '',
        xpReward: 50,
        isOurContent: false
      });

      // Notify listing pages to refetch
      try {
        window.dispatchEvent(new CustomEvent('content-updated', { detail: { isOurContent: result?.content?.isOurContent === true } }));
      } catch {}

      onUploadComplete?.();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-500" />
              Upload Tutorial Content
            </CardTitle>
            <CardDescription>
              Add new videos, tutorials, and learning materials to RoboQuest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              
              {success && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter tutorial title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtubeUrl">YouTube Video URL or ID</Label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                  <Input
                    id="youtubeUrl"
                    placeholder="https://www.youtube.com/watch?v=VIDEO_ID or just VIDEO_ID"
                    value={formData.youtubeId}
                    onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {formData.youtubeId && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                    <div className="relative w-full pb-[56.25%] h-0 rounded-lg overflow-hidden">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${formData.youtubeId}`}
                        title="Video preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">🎬 Video Tutorial</SelectItem>
                      <SelectItem value="interactive">⚡ Interactive Lesson</SelectItem>
                      <SelectItem value="document">📄 Written Guide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scratch">🎨 Scratch Programming</SelectItem>
                      <SelectItem value="python">🐍 Python</SelectItem>
                      <SelectItem value="robotics">🤖 Robotics</SelectItem>
                      <SelectItem value="arduino">⚡ Arduino</SelectItem>
                      <SelectItem value="web">🌐 Web Development</SelectItem>
                      <SelectItem value="it">💻 IT</SelectItem>
                      <SelectItem value="hacking">🔓 Hacking</SelectItem>
                      <SelectItem value="cybersecurity">🛡️ Cybersecurity</SelectItem>
                      <SelectItem value="general">📚 General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Upload destination toggle */}
              <div className="space-y-2">
                <Label>Upload Destination</Label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('isOurContent', false)}
                    className={`px-3 py-2 rounded-md border text-sm ${!formData.isOurContent ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200'}`}
                  >
                    Tutorials
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('isOurContent', true)}
                    className={`px-3 py-2 rounded-md border text-sm ${formData.isOurContent ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-gray-200'}`}
                  >
                    Our Projects
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Choose where this upload should appear. Only admins can upload.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Difficulty Level</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">🟢 Beginner</SelectItem>
                      <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                      <SelectItem value="advanced">🔴 Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 15 min"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="xpReward">XP Reward</Label>
                  <Input
                    id="xpReward"
                    type="number"
                    placeholder="50"
                    value={formData.xpReward}
                    onChange={(e) => handleInputChange('xpReward', parseInt(e.target.value))}
                    min="10"
                    max="500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Tutorial'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}