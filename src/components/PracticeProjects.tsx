import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ProjectWorkspace } from './ProjectWorkspace';
import { ProjectCard } from './practice/ProjectCard';
import { ExternalProjectDialog } from './practice/ExternalProjectDialog';
import { useProgress } from '../hooks/useProgress';
import { filterProjects, isProjectCompleted } from './practice/utils';
import { Search } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import type { Project } from './practice/types';

export function PracticeProjects() {
  const { progress } = useProgress();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showExternalDialog, setShowExternalDialog] = useState(false);
  const [externalProject, setExternalProject] = useState<Project | null>(null);

  useEffect(() => {
    setProjects(getLocalProjects());
  }, []);

  useEffect(() => {
    const filtered = filterProjects(projects, searchQuery, selectedCategory, selectedDifficulty);
    setFilteredProjects(filtered);
  }, [projects, searchQuery, selectedCategory, selectedDifficulty]);

  const getLocalProjects = (): Project[] => [
    // Python Projects
    {
      id: 'python-basic-calculator',
      title: 'Basic Calculator',
      description: 'Build a simple calculator that can perform basic arithmetic operations',
      category: 'python',
      difficulty: 'beginner',
      estimatedTime: '1-2 hours',
      xpReward: 50,
      type: 'coding',
      language: 'Python',
      source: 'codewars',
      externalUrl: 'https://www.codewars.com/kata/search/python?q=calculator'
    },
    {
      id: 'python-password-generator',
      title: 'Password Generator',
      description: 'Create a secure password generator with customizable length and character sets',
      category: 'python',
      difficulty: 'beginner',
      estimatedTime: '2-3 hours',
      xpReward: 75,
      type: 'coding',
      language: 'Python',
      source: 'hackerrank',
      externalUrl: 'https://www.hackerrank.com/domains/python'
    },
    {
      id: 'python-todo-app',
      title: 'Todo List Application',
      description: 'Build a command-line todo list with add, delete, and mark complete functionality',
      category: 'python',
      difficulty: 'beginner',
      estimatedTime: '3-4 hours',
      xpReward: 100,
      type: 'coding',
      language: 'Python',
      source: 'leetcode',
      externalUrl: 'https://leetcode.com/problemset/all/'
    },
    {
      id: 'python-number-guessing',
      title: 'Number Guessing Game',
      description: 'Create a game where the computer picks a random number and the user tries to guess it',
      category: 'python',
      difficulty: 'beginner',
      estimatedTime: '1-2 hours',
      xpReward: 50,
      type: 'coding',
      language: 'Python',
      source: 'codingame',
      externalUrl: 'https://www.codingame.com/start/easy'
    },
    {
      id: 'python-rock-paper-scissors',
      title: 'Rock Paper Scissors',
      description: 'Implement the classic rock paper scissors game with user input',
      category: 'python',
      difficulty: 'beginner',
      estimatedTime: '1-2 hours',
      xpReward: 50,
      type: 'coding',
      language: 'Python',
      source: 'edabit',
      externalUrl: 'https://edabit.com/challenges/python3'
    },
    {
      id: 'python-tic-tac-toe',
      title: 'Tic Tac Toe Game',
      description: 'Build a complete tic tac toe game with win detection and board display',
      category: 'python',
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      xpReward: 125,
      type: 'coding',
      language: 'Python',
      source: 'freecodecamp',
      externalUrl: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/'
    },
    {
      id: 'python-snake-game',
      title: 'Snake Game',
      description: 'Create the classic snake game using Python and a simple graphics library',
      category: 'python',
      difficulty: 'intermediate',
      estimatedTime: '4-5 hours',
      xpReward: 150,
      type: 'coding',
      language: 'Python',
      source: 'exercism',
      externalUrl: 'https://exercism.org/tracks/python/exercises'
    },
    {
      id: 'python-data-analysis',
      title: 'Data Analysis Project',
      description: 'Analyze a dataset using pandas and create visualizations with matplotlib',
      category: 'python',
      difficulty: 'intermediate',
      estimatedTime: '5-6 hours',
      xpReward: 175,
      type: 'coding',
      language: 'Python',
      source: 'kaggle',
      externalUrl: 'https://www.kaggle.com/code'
    },
    // Web Development Projects
    {
      id: 'html-personal-portfolio',
      title: 'Personal Portfolio Website',
      description: 'Create a responsive personal portfolio using HTML, CSS, and JavaScript',
      category: 'web',
      difficulty: 'beginner',
      estimatedTime: '4-5 hours',
      xpReward: 150,
      type: 'coding',
      language: 'HTML/CSS/JS',
      source: 'freecodecamp',
      externalUrl: 'https://www.freecodecamp.org/learn/responsive-web-design/'
    },
    {
      id: 'js-weather-app',
      title: 'Weather Application',
      description: 'Build a weather app that fetches data from a weather API and displays it beautifully',
      category: 'web',
      difficulty: 'intermediate',
      estimatedTime: '5-6 hours',
      xpReward: 175,
      type: 'coding',
      language: 'JavaScript',
      source: 'codewars',
      externalUrl: 'https://www.codewars.com/kata/search/javascript?q=api'
    },
    {
      id: 'js-todo-app-web',
      title: 'Web-based Todo App',
      description: 'Create a full-featured todo application with local storage and modern UI',
      category: 'web',
      difficulty: 'intermediate',
      estimatedTime: '4-5 hours',
      xpReward: 150,
      type: 'coding',
      language: 'JavaScript',
      source: 'hackerrank',
      externalUrl: 'https://www.hackerrank.com/domains/javascript'
    },
    {
      id: 'react-quiz-app',
      title: 'Quiz Application',
      description: 'Build an interactive quiz app with React, featuring multiple choice questions and scoring',
      category: 'web',
      difficulty: 'intermediate',
      estimatedTime: '6-7 hours',
      xpReward: 200,
      type: 'coding',
      language: 'React',
      source: 'leetcode',
      externalUrl: 'https://leetcode.com/problemset/all/'
    },
    {
      id: 'js-password-strength',
      title: 'Password Strength Checker',
      description: 'Create a tool that analyzes password strength and provides feedback',
      category: 'web',
      difficulty: 'beginner',
      estimatedTime: '2-3 hours',
      xpReward: 75,
      type: 'coding',
      language: 'JavaScript',
      source: 'edabit',
      externalUrl: 'https://edabit.com/challenges/javascript'
    },
    // Algorithm Challenges
    {
      id: 'algo-fibonacci',
      title: 'Fibonacci Sequence',
      description: 'Implement different approaches to generate Fibonacci numbers efficiently',
      category: 'algorithms',
      difficulty: 'beginner',
      estimatedTime: '1-2 hours',
      xpReward: 75,
      type: 'coding',
      language: 'Any',
      source: 'codewars',
      externalUrl: 'https://www.codewars.com/kata/search?q=fibonacci'
    },
    {
      id: 'algo-palindrome',
      title: 'Palindrome Checker',
      description: 'Create functions to check if strings or numbers are palindromes',
      category: 'algorithms',
      difficulty: 'beginner',
      estimatedTime: '1-2 hours',
      xpReward: 50,
      type: 'coding',
      language: 'Any',
      source: 'hackerrank',
      externalUrl: 'https://www.hackerrank.com/domains/algorithms'
    },
    {
      id: 'algo-sorting',
      title: 'Sorting Algorithms',
      description: 'Implement bubble sort, merge sort, and quick sort algorithms',
      category: 'algorithms',
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      xpReward: 150,
      type: 'coding',
      language: 'Any',
      source: 'leetcode',
      externalUrl: 'https://leetcode.com/problemset/all/'
    },
    {
      id: 'algo-binary-search',
      title: 'Binary Search Implementation',
      description: 'Create an efficient binary search algorithm with proper edge case handling',
      category: 'algorithms',
      difficulty: 'intermediate',
      estimatedTime: '2-3 hours',
      xpReward: 100,
      type: 'coding',
      language: 'Any',
      source: 'exercism',
      externalUrl: 'https://exercism.org/tracks'
    },
    // Game Development
    {
      id: 'game-memory-card',
      title: 'Memory Card Game',
      description: 'Build a memory card matching game with flip animations and scoring',
      category: 'games',
      difficulty: 'intermediate',
      estimatedTime: '4-5 hours',
      xpReward: 175,
      type: 'coding',
      language: 'JavaScript',
      source: 'codingame',
      externalUrl: 'https://www.codingame.com/start/easy'
    },
    {
      id: 'game-puzzle-solver',
      title: 'Puzzle Solver',
      description: 'Create an algorithm to solve sliding puzzles or similar logic games',
      category: 'games',
      difficulty: 'advanced',
      estimatedTime: '6-8 hours',
      xpReward: 250,
      type: 'coding',
      language: 'Python',
      source: 'codecombat',
      externalUrl: 'https://codecombat.com/play'
    },
    // Data Science
    {
      id: 'data-visualization',
      title: 'Data Visualization Dashboard',
      description: 'Create interactive charts and graphs using D3.js or Chart.js',
      category: 'data',
      difficulty: 'intermediate',
      estimatedTime: '5-6 hours',
      xpReward: 200,
      type: 'coding',
      language: 'JavaScript',
      source: 'kaggle',
      externalUrl: 'https://www.kaggle.com/code'
    },
    {
      id: 'data-csv-parser',
      title: 'CSV Data Parser',
      description: 'Build a tool to parse and analyze CSV files with data validation',
      category: 'data',
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      xpReward: 125,
      type: 'coding',
      language: 'Python',
      source: 'edabit',
      externalUrl: 'https://edabit.com/challenges/python3'
    },
    // Additional Projects
    {
      id: 'api-rest-client',
      title: 'REST API Client',
      description: 'Create a tool to test and interact with REST APIs',
      category: 'web',
      difficulty: 'intermediate',
      estimatedTime: '4-5 hours',
      xpReward: 175,
      type: 'coding',
      language: 'JavaScript',
      source: 'codewars',
      externalUrl: 'https://www.codewars.com/kata/search/javascript?q=api'
    },
    {
      id: 'file-upload-system',
      title: 'File Upload System',
      description: 'Build a secure file upload system with validation and storage',
      category: 'web',
      difficulty: 'advanced',
      estimatedTime: '6-7 hours',
      xpReward: 225,
      type: 'coding',
      language: 'Node.js',
      source: 'hackerrank',
      externalUrl: 'https://www.hackerrank.com/domains/nodejs'
    },
    {
      id: 'chat-application',
      title: 'Real-time Chat App',
      description: 'Create a chat application with WebSocket connections',
      category: 'web',
      difficulty: 'advanced',
      estimatedTime: '8-10 hours',
      xpReward: 300,
      type: 'coding',
      language: 'JavaScript',
      source: 'leetcode',
      externalUrl: 'https://leetcode.com/problemset/all/'
    },
    {
      id: 'ecommerce-cart',
      title: 'E-commerce Shopping Cart',
      description: 'Build a shopping cart with product management and checkout',
      category: 'web',
      difficulty: 'intermediate',
      estimatedTime: '5-6 hours',
      xpReward: 200,
      type: 'coding',
      language: 'React',
      source: 'freecodecamp',
      externalUrl: 'https://www.freecodecamp.org/learn/front-end-development-libraries/'
    },
    {
      id: 'blog-platform',
      title: 'Blog Platform',
      description: 'Create a full-featured blog with user authentication and content management',
      category: 'web',
      difficulty: 'advanced',
      estimatedTime: '10-12 hours',
      xpReward: 350,
      type: 'coding',
      language: 'Full Stack',
      source: 'exercism',
      externalUrl: 'https://exercism.org/tracks'
    },
    {
      id: 'task-manager',
      title: 'Task Management System',
      description: 'Build a project management tool with task assignment and progress tracking',
      category: 'web',
      difficulty: 'advanced',
      estimatedTime: '8-10 hours',
      xpReward: 300,
      type: 'coding',
      language: 'Full Stack',
      source: 'codecombat',
      externalUrl: 'https://codecombat.com/play'
    },
    {
      id: 'social-media-feed',
      title: 'Social Media Feed',
      description: 'Create a social media feed with posts, likes, and comments',
      category: 'web',
      difficulty: 'advanced',
      estimatedTime: '10-12 hours',
      xpReward: 350,
      type: 'coding',
      language: 'Full Stack',
      source: 'kaggle',
      externalUrl: 'https://www.kaggle.com/code'
    },
    {
      id: 'music-player',
      title: 'Music Player App',
      description: 'Build a music player with playlist management and audio controls',
      category: 'web',
      difficulty: 'intermediate',
      estimatedTime: '5-6 hours',
      xpReward: 200,
      type: 'coding',
      language: 'JavaScript',
      source: 'edabit',
      externalUrl: 'https://edabit.com/challenges/javascript'
    },
    {
      id: 'calculator-advanced',
      title: 'Advanced Calculator',
      description: 'Create a scientific calculator with trigonometric functions and history',
      category: 'web',
      difficulty: 'intermediate',
      estimatedTime: '4-5 hours',
      xpReward: 175,
      type: 'coding',
      language: 'JavaScript',
      source: 'codewars',
      externalUrl: 'https://www.codewars.com/kata/search/javascript?q=calculator'
    },
    {
      id: 'paint-app',
      title: 'Digital Paint Application',
      description: 'Build a drawing app with different brushes and color palettes',
      category: 'web',
      difficulty: 'intermediate',
      estimatedTime: '6-7 hours',
      xpReward: 225,
      type: 'coding',
      language: 'JavaScript',
      source: 'hackerrank',
      externalUrl: 'https://www.hackerrank.com/domains/javascript'
    },
    {
      id: 'sudoku-solver',
      title: 'Sudoku Solver',
      description: 'Create an algorithm to solve Sudoku puzzles automatically',
      category: 'algorithms',
      difficulty: 'advanced',
      estimatedTime: '6-8 hours',
      xpReward: 250,
      type: 'coding',
      language: 'Python',
      source: 'leetcode',
      externalUrl: 'https://leetcode.com/problemset/all/'
    },
    {
      id: 'chess-engine',
      title: 'Chess Game Engine',
      description: 'Build a chess game with move validation and AI opponent',
      category: 'games',
      difficulty: 'advanced',
      estimatedTime: '15-20 hours',
      xpReward: 500,
      type: 'coding',
      language: 'Python',
      source: 'exercism',
      externalUrl: 'https://exercism.org/tracks'
    },
    {
      id: 'machine-learning-basic',
      title: 'Basic ML Model',
      description: 'Create a simple machine learning model for classification',
      category: 'data',
      difficulty: 'advanced',
      estimatedTime: '8-10 hours',
      xpReward: 300,
      type: 'coding',
      language: 'Python',
      source: 'kaggle',
      externalUrl: 'https://www.kaggle.com/code'
    },
    {
      id: 'blockchain-simple',
      title: 'Simple Blockchain',
      description: 'Implement a basic blockchain with proof of work',
      category: 'algorithms',
      difficulty: 'advanced',
      estimatedTime: '10-12 hours',
      xpReward: 400,
      type: 'coding',
      language: 'Python',
      source: 'freecodecamp',
      externalUrl: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/'
    },
    {
      id: 'compiler-basic',
      title: 'Basic Compiler',
      description: 'Build a simple compiler for a basic programming language',
      category: 'algorithms',
      difficulty: 'advanced',
      estimatedTime: '20-25 hours',
      xpReward: 600,
      type: 'coding',
      language: 'Any',
      source: 'codecombat',
      externalUrl: 'https://codecombat.com/play'
    }
  ];

  const handleProjectClick = (project: Project) => {
    if (project.externalUrl && project.source !== 'internal') {
      setExternalProject(project);
      setShowExternalDialog(true);
    } else {
      setSelectedProject(project.id);
    }
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const handleGoToExternal = () => {
    if (externalProject?.externalUrl) {
      window.open(externalProject.externalUrl, '_blank');
    }
    setShowExternalDialog(false);
  };

  if (selectedProject) {
    return <ProjectWorkspace projectId={selectedProject} onBack={handleBackToProjects} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💻</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Practice Projects
          </h1>
          <p className="text-lg text-gray-600">
            {projects.length} hands-on coding projects to improve your skills
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search projects..."
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
                    <SelectItem value="python">🐍 Python</SelectItem>
                    <SelectItem value="web">🌐 Web Dev</SelectItem>
                    <SelectItem value="algorithms">🧮 Algorithms</SelectItem>
                    <SelectItem value="games">🎮 Games</SelectItem>
                    <SelectItem value="data">📊 Data Science</SelectItem>
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

        {/* Projects Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={handleProjectClick}
                isCompleted={isProjectCompleted(project.id, progress?.completedProjects)}
              />
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <p className="text-lg">Loading projects...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-lg text-red-600">Failed to load projects: {error}</p>
            <Button onClick={() => setProjects(getLocalProjects())} className="mt-4">
              Try Again
            </Button>
          </div>
        )}

      {/* External Project Dialog */}
      <ExternalProjectDialog
          project={externalProject}
        isOpen={showExternalDialog}
        onClose={() => setShowExternalDialog(false)}
        onGoToExternal={handleGoToExternal}
      />
      </div>
    </div>
  );
}