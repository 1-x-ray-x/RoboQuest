import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { VideoViewer } from './VideoViewer';
import { useAuth } from './AuthProvider';
import { Search, Play, Clock, Trophy, Filter, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  type: 'video';
  category: 'scratch' | 'python' | 'robotics' | 'arduino' | 'web' | 'it' | 'hacking' | 'cybersecurity' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  xpReward: number;
  views: number;
  likes: number;
  uploadedAt: string;
}

export function TutorialsLibrary() {
  const { user, session, refreshSession } = useAuth();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [filteredTutorials, setFilteredTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  
  // Edit/Delete states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showOurProjectDialog, setShowOurProjectDialog] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    youtubeId: '',
    category: '',
    difficulty: '',
    duration: '',
    xpReward: 0
  });
  const [ourProjectForm, setOurProjectForm] = useState({
    title: '',
    description: '',
    youtubeId: '',
    category: '',
    difficulty: '',
    duration: '',
    xpReward: 0
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savingOurProject, setSavingOurProject] = useState(false);

  const isAdmin = user?.email === 'rayaanm5409@gmail.com';

  useEffect(() => {
    fetchTutorials();
    const onUpdated = () => fetchTutorials();
    window.addEventListener('content-updated', onUpdated as EventListener);
    return () => window.removeEventListener('content-updated', onUpdated as EventListener);
  }, []);

  useEffect(() => {
    filterTutorials();
  }, [tutorials, searchQuery, selectedCategory, selectedDifficulty]);

  const fetchTutorials = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/content`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch tutorials');
      }

      const data = await response.json();
      setTutorials(data.content || []);
    } catch (err: any) {
      console.error('Error fetching tutorials:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterTutorials = () => {
    let filtered = [...tutorials];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tutorial =>
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.difficulty === selectedDifficulty);
    }

    setFilteredTutorials(filtered);
  };

  const handleTutorialClick = (tutorialId: string) => {
    setSelectedTutorial(tutorialId);
  };

  const handleBackToLibrary = () => {
    setSelectedTutorial(null);
  };

  const handleEditClick = (tutorial: Tutorial, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTutorial(tutorial);
    setEditForm({
      title: tutorial.title,
      description: tutorial.description,
      youtubeId: tutorial.youtubeId,
      category: tutorial.category,
      difficulty: tutorial.difficulty,
      duration: tutorial.duration,
      xpReward: tutorial.xpReward
    });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (tutorial: Tutorial, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTutorial(tutorial);
    setDeleteError(''); // Clear any previous delete errors
    setShowDeleteDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTutorial || !session?.access_token) return;

    try {
      setSaving(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/content/${editingTutorial.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editForm)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update tutorial');
      }

      // Refresh tutorials list
      await fetchTutorials();
      setShowEditDialog(false);
      setEditingTutorial(null);
    } catch (err: any) {
      console.error('Error updating tutorial:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveOurProject = async () => {
    if (!session?.access_token) return;

    try {
      setSavingOurProject(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/content/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...ourProjectForm,
            type: 'video',
            isOurContent: true
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload our project');
      }

      // Refresh tutorials list and close dialog
      await fetchTutorials();
      setShowOurProjectDialog(false);
      setOurProjectForm({
        title: '',
        description: '',
        youtubeId: '',
        category: '',
        difficulty: '',
        duration: '',
        xpReward: 0
      });
    } catch (err: any) {
      console.error('Error uploading our project:', err);
      setError(err.message);
    } finally {
      setSavingOurProject(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!editingTutorial) {
      console.log('Delete attempt - Missing tutorial');
      return;
    }

    try {
      setDeleting(true);
      
      // Try to refresh session first to ensure we have a valid token
      let currentSession = session;
      if (!currentSession?.access_token) {
        console.log('No session token, attempting to refresh...');
        try {
          const refreshResult = await refreshSession();
          currentSession = refreshResult.session;
          console.log('Session refreshed:', !!currentSession?.access_token);
        } catch (refreshError) {
          console.log('Session refresh failed:', refreshError);
          setDeleteError('Session expired. Please log in again.');
          return;
        }
      }
      
      if (!currentSession?.access_token) {
        setDeleteError('No valid session. Please log in again.');
        return;
      }
      
      // The server expects just the ID, not the full key
      const endpoint = `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/content/${editingTutorial.id}`;
      console.log('Delete attempt - Endpoint:', endpoint);
      console.log('Delete attempt - Tutorial ID:', editingTutorial.id);
      console.log('Delete attempt - Session token present:', !!currentSession.access_token);

      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentSession.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response - Status:', response.status);
      console.log('Delete response - OK:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log('Delete error response:', errorData);
        throw new Error(errorData.error || 'Failed to delete content');
      }

      // Remove from local state immediately for better UX
      setTutorials(prev => prev.filter(t => t.id !== editingTutorial.id));
      setFilteredTutorials(prev => prev.filter(t => t.id !== editingTutorial.id));
      
      // Close dialog and reset state
      setShowDeleteDialog(false);
      setEditingTutorial(null);
      setDeleteError('');
      
      // Show success message
      setSuccess('Content deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err: any) {
      console.error('Error deleting content:', err);
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (selectedTutorial) {
    return (
      <VideoViewer 
        videoId={selectedTutorial} 
        onBack={handleBackToLibrary}
        isOurContent={false}
      />
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
    it: '💻',
    hacking: '🔓',
    cybersecurity: '🛡️',
    general: '📚'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📺</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Video Tutorials
          </h1>
          <p className="text-lg text-gray-600">
            Learn coding and technology through engaging YouTube videos
          </p>
          
          {/* Admin Upload Buttons */}
          {isAdmin && (
            <div className="flex justify-center gap-4 mt-6">
              <Button 
                onClick={() => setShowEditDialog(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                📤 Upload Tutorial
              </Button>
              <Button 
                onClick={() => setShowOurProjectDialog(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                🚀 Upload Our Project
              </Button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="scratch">🎨 Scratch</SelectItem>
                    <SelectItem value="python">🐍 Python</SelectItem>
                    <SelectItem value="robotics">🤖 Robotics</SelectItem>
                    <SelectItem value="arduino">⚡ Arduino</SelectItem>
                    <SelectItem value="web">🌐 Web Dev</SelectItem>
                    <SelectItem value="it">💻 IT</SelectItem>
                    <SelectItem value="hacking">🔓 Hacking</SelectItem>
                    <SelectItem value="cybersecurity">🛡️ Cybersecurity</SelectItem>
                    <SelectItem value="general">📚 General</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">🟢 Beginner</SelectItem>
                    <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                    <SelectItem value="advanced">🔴 Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-lg">Loading tutorials...</p>
          </div>
        )}

        {/* Success State */}
        {success && (
          <div className="text-center py-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-6xl mb-2">✅</div>
              <p className="text-lg text-green-600">{success}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-lg text-red-600">Failed to load tutorials: {error}</p>
            <Button onClick={fetchTutorials} className="mt-4">
              Try Again
            </Button>
          </div>
        )}

        {/* Tutorials Grid */}
        {!loading && !error && (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {filteredTutorials.length} of {tutorials.length} tutorials
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map((tutorial) => (
                <Card 
                  key={tutorial.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer group relative"
                  onClick={() => handleTutorialClick(tutorial.id)}
                >
                  {/* Admin Actions */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
                        onClick={(e) => handleEditClick(tutorial, e)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm text-red-600 hover:text-red-700"
                        onClick={(e) => handleDeleteClick(tutorial, e)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={difficultyColors[tutorial.difficulty]}>
                        {tutorial.difficulty}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {categoryEmojis[tutorial.category] && (
                          <span className="text-lg">{categoryEmojis[tutorial.category]}</span>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {tutorial.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {tutorial.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* YouTube Thumbnail */}
                    <div className="mb-4 relative rounded-lg overflow-hidden">
                      <img 
                        src={`https://img.youtube.com/vi/${tutorial.youtubeId}/hqdefault.jpg`}
                        alt={tutorial.title}
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${tutorial.youtubeId}/mqdefault.jpg`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <Badge className="absolute top-2 left-2 bg-black bg-opacity-70 text-white">
                        {tutorial.duration}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {tutorial.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {tutorial.xpReward} XP
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTutorials.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg text-muted-foreground">
                  No tutorials found matching your criteria
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Tutorial</DialogTitle>
            <DialogDescription>
              Update the tutorial information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editForm.title}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="youtubeId">YouTube Video ID</Label>
              <Input
                id="youtubeId"
                value={editForm.youtubeId}
                onChange={(e) => setEditForm({...editForm, youtubeId: e.target.value})}
                placeholder="e.g., dQw4w9WgXcQ"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={editForm.category} onValueChange={(value) => setEditForm({...editForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scratch">Scratch</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="robotics">Robotics</SelectItem>
                    <SelectItem value="arduino">Arduino</SelectItem>
                    <SelectItem value="web">Web Dev</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="hacking">Hacking</SelectItem>
                    <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={editForm.difficulty} onValueChange={(value) => setEditForm({...editForm, difficulty: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={editForm.duration}
                  onChange={(e) => setEditForm({...editForm, duration: e.target.value})}
                  placeholder="e.g., 15 min"
                />
              </div>
              <div>
                <Label htmlFor="xpReward">XP Reward</Label>
                <Input
                  id="xpReward"
                  type="number"
                  value={editForm.xpReward}
                  onChange={(e) => setEditForm({...editForm, xpReward: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Delete Tutorial
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{editingTutorial?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {/* Delete Error Display */}
          {deleteError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-sm text-red-600">{deleteError}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowDeleteDialog(false);
              setDeleteError(''); // Clear error when dialog is closed
            }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Our Project Upload Dialog */}
      <Dialog open={showOurProjectDialog} onOpenChange={setShowOurProjectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              🚀 Upload Our Project
            </DialogTitle>
            <DialogDescription>
              Add a new project created by our team to showcase our work.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="our-title">Title</Label>
              <Input
                id="our-title"
                value={ourProjectForm.title}
                onChange={(e) => setOurProjectForm({...ourProjectForm, title: e.target.value})}
                placeholder="Enter project title"
              />
            </div>
            <div>
              <Label htmlFor="our-description">Description</Label>
              <Textarea
                id="our-description"
                value={ourProjectForm.description}
                onChange={(e) => setOurProjectForm({...ourProjectForm, description: e.target.value})}
                placeholder="Describe what this project demonstrates"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="our-youtubeId">YouTube Video ID</Label>
              <Input
                id="our-youtubeId"
                value={ourProjectForm.youtubeId}
                onChange={(e) => setOurProjectForm({...ourProjectForm, youtubeId: e.target.value})}
                placeholder="e.g., dQw4w9WgXcQ"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="our-category">Category</Label>
                <Select value={ourProjectForm.category} onValueChange={(value) => setOurProjectForm({...ourProjectForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scratch">Scratch</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="robotics">Robotics</SelectItem>
                    <SelectItem value="arduino">Arduino</SelectItem>
                    <SelectItem value="web">Web Dev</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="hacking">Hacking</SelectItem>
                    <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="our-difficulty">Difficulty</Label>
                <Select value={ourProjectForm.difficulty} onValueChange={(value) => setOurProjectForm({...ourProjectForm, difficulty: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="our-duration">Duration</Label>
                <Input
                  id="our-duration"
                  value={ourProjectForm.duration}
                  onChange={(e) => setOurProjectForm({...ourProjectForm, duration: e.target.value})}
                  placeholder="e.g., 15 min"
                />
              </div>
              <div>
                <Label htmlFor="our-xpReward">XP Reward</Label>
                <Input
                  id="our-xpReward"
                  type="number"
                  value={ourProjectForm.xpReward}
                  onChange={(e) => setOurProjectForm({...ourProjectForm, xpReward: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOurProjectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveOurProject} disabled={savingOurProject}>
              {savingOurProject ? 'Uploading...' : 'Upload Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}