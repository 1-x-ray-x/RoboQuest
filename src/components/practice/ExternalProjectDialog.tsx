import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { SOURCE_LABELS } from './constants';
import type { Project } from './types';

interface ExternalProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onGoToExternal: () => void;
}

export function ExternalProjectDialog({ 
  isOpen, 
  onClose, 
  project, 
  onGoToExternal 
}: ExternalProjectDialogProps) {
  if (!project) return null;

  const sourceName = SOURCE_LABELS[project.source];

  const getPlatformDescription = (source: string) => {
    const descriptions: { [key: string]: { title: string; features: string[] } } = {
      'exercism': {
        title: 'Interactive coding challenges',
        features: ['Automated testing and feedback', 'Mentor code reviews', 'Progress tracking and badges', 'Community support']
      },
      'codewars': {
        title: 'Coding challenges and katas',
        features: ['Gamified learning experience', 'Multiple difficulty levels', 'Community solutions', 'Ranking system']
      },
      'hackerrank': {
        title: 'Competitive programming platform',
        features: ['Algorithm challenges', 'Data structures practice', 'Interview preparation', 'Skill assessments']
      },
      'leetcode': {
        title: 'Technical interview preparation',
        features: ['Problem-solving challenges', 'Company-specific questions', 'Discussion forums', 'Solution explanations']
      },
      'codingame': {
        title: 'Gamified coding challenges',
        features: ['Visual programming games', 'Multiplayer competitions', 'AI bot battles', 'Interactive learning']
      },
      'edabit': {
        title: 'Quick coding exercises',
        features: ['Bite-sized challenges', 'Multiple languages', 'Difficulty progression', 'Instant feedback']
      },
      'freecodecamp': {
        title: 'Comprehensive learning platform',
        features: ['Structured curriculum', 'Interactive tutorials', 'Real-world projects', 'Certifications']
      },
      'kaggle': {
        title: 'Data science and ML platform',
        features: ['Datasets and competitions', 'Notebooks and tutorials', 'Community collaboration', 'Real-world projects']
      },
      'codecombat': {
        title: 'Game-based coding learning',
        features: ['RPG-style progression', 'Multiple programming languages', 'Adventure-based challenges', 'Visual feedback']
      },
      'youtube': {
        title: 'Video tutorials and guides',
        features: ['Step-by-step instructions', 'Visual demonstrations', 'Community support', 'Free access']
      }
    };
    return descriptions[source] || {
      title: 'External learning platform',
      features: ['Interactive exercises', 'Progress tracking', 'Community support', 'Skill development']
    };
  };

  const platformInfo = getPlatformDescription(project.source);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Practice on {sourceName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <ExternalLink className="w-12 h-12 mx-auto mb-3 text-blue-500" />
            <p className="text-muted-foreground">
              This practice exercise is hosted on {sourceName}. You'll be redirected to their platform 
              to access the full coding environment and interactive exercises.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">{platformInfo.title}:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {platformInfo.features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onGoToExternal} className="flex-1">
              Go to {sourceName}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}