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
import { Search, Play, Clock, Trophy, Filter, Plus, Edit, Trash2, AlertTriangle, Youtube, ExternalLink } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface OurProject {
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
  isOurContent: boolean;
}

export function OurProjects() {
  const { user, session } = useAuth();
  const [projects, setProjects] = useState<OurProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<OurProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  // Edit/Delete states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<OurProject | null>(null);
  const [editForm, setEditForm] = useState({
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

  const isAdmin = user?.email === 'rayaanm5409@gmail.com';

  useEffect(() => {
    fetchOurProjects();
    const onUpdated = (e: any) => {
      // Only refetch for Our Projects updates or if unspecified
      if (!e?.detail || e.detail.isOurContent === true) {
        fetchOurProjects();
      }
    };
    window.addEventListener('content-updated', onUpdated as EventListener);
    return () => window.removeEventListener('content-updated', onUpdated as EventListener);
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery, selectedCategory, selectedDifficulty]);

  const fetchOurProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/our-content`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch our projects');
      }

      const data = await response.json();
      setProjects(data.content || []);
    } catch (err: any) {
      console.error('Error fetching our projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(project => project.difficulty === selectedDifficulty);
    }

    setFilteredProjects(filtered);
  };

  const handleProjectClick = (projectId: string) => {
    setSelectedProject(projectId);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const handleEditClick = (project: OurProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setEditForm({
      title: project.title,
      description: project.description,
      youtubeId: project.youtubeId,
      category: project.category,
      difficulty: project.difficulty,
      duration: project.duration,
      xpReward: project.xpReward
    });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (project: OurProject, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setDeleteError(''); // Clear any previous delete errors
    setShowDeleteDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProject || !session?.access_token) return;

    try {
      setSaving(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/content/${editingProject.id}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({...editForm, isOurContent: true})
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      // Refresh projects list
      await fetchOurProjects();
      setShowEditDialog(false);
      setEditingProject(null);
    } catch (err: any) {
      console.error('Error updating project:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!editingProject || !session?.access_token) return;

    try {
      setDeleting(true);
      setDeleteError(''); // Clear any previous delete errors
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4b9cf438/content/${editingProject.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      // Refresh projects list
      await fetchOurProjects();
      setShowDeleteDialog(false);
      setEditingProject(null);
      setDeleteError(''); // Clear error on success
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleVisitChannel = () => {
    window.open('https://www.youtube.com/@MrRoboQuest', '_blank');
  };

  if (selectedProject) {
    return (
      <VideoViewer 
        videoId={selectedProject} 
        onBack={handleBackToProjects}
        isOurContent={true}
      />
    );
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const categoryEmojis: { [key: string]: string } = {
    general: '📚',
    tutorial: '🎓',
    project: '🛠️',
    tips: '💡'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Our Projects
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Exclusive content from the RoboQuest team
          </p>
          
          {/* YouTube Channel Button */}
          <Button
            onClick={handleVisitChannel}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full h-14 w-14 p-0"
            title="Visit our YouTube channel"
          >
            <Youtube className="w-6 h-6" />
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Visit our YouTube channel for more content!
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search our content..."
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
                    <SelectItem value="general">📚 General</SelectItem>
                    <SelectItem value="tutorial">🎓 Tutorial</SelectItem>
                    <SelectItem value="project">🛠️ Project</SelectItem>
                    <SelectItem value="tips">💡 Tips</SelectItem>
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
            <p className="text-lg">Loading our projects...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-lg text-red-600">Failed to load projects: {error}</p>
            <Button onClick={fetchOurProjects} className="mt-4">
              Try Again
            </Button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProjects.length} of {projects.length} projects
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card 
                  key={project.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer group border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 relative"
                  onClick={() => handleProjectClick(project.id)}
                >
                  {/* Admin Actions - Only show for admin */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm"
                        onClick={(e) => handleEditClick(project, e)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm text-red-600 hover:text-red-700"
                        onClick={(e) => handleDeleteClick(project, e)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={difficultyColors[project.difficulty]}>
                        {project.difficulty}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {categoryEmojis[project.category] && (
                          <span className="text-lg">{categoryEmojis[project.category]}</span>
                        )}
                        <Badge className="bg-blue-500 text-white">
                          RoboQuest
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* YouTube Thumbnail */}
                    <div className="mb-4 relative rounded-lg overflow-hidden">
                      <img 
                        src={`https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`}
                        alt={project.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <Badge className="absolute top-2 left-2 bg-black bg-opacity-70 text-white">
                        RoboQuest
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {project.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {project.xpReward} XP
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-lg text-muted-foreground">
                  No projects found matching your criteria
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </>
        )}

        {/* Empty State for No Content */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📹</div>
            <p className="text-lg text-muted-foreground mb-4">
              No RoboQuest content uploaded yet
            </p>
            <p className="text-sm text-muted-foreground">
              {isAdmin ? 'Use the upload button to add our exclusive content' : 'Check back soon for amazing content!'}
            </p>
          </div>
        )}
      </div>

      {/* Edit Dialog - Only for admin */}
      {isAdmin && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update the project information below.
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
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="tips">Tips</SelectItem>
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
      )}

      {/* Delete Dialog - Only for admin */}
      {isAdmin && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Delete Project
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{editingProject?.title}"? This action cannot be undone.
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
      )}
    </div>
  );
}