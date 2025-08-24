import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, Trophy, CheckCircle, ExternalLink, Code } from 'lucide-react';
import { DIFFICULTY_COLORS, CATEGORY_EMOJIS, TYPE_ICONS, SOURCE_LABELS } from './constants';
import type { Project } from './types';

interface ProjectCardProps {
  project: Project;
  isCompleted: boolean;
  onClick: (project: Project) => void;
}

export function ProjectCard({ project, isCompleted, onClick }: ProjectCardProps) {
  const getPlatformName = (source: string) => {
    const platformNames: { [key: string]: string } = {
      'exercism': 'Exercism',
      'codewars': 'Codewars',
      'hackerrank': 'HackerRank',
      'leetcode': 'LeetCode',
      'codingame': 'Codingame',
      'edabit': 'Edabit',
      'freecodecamp': 'freeCodeCamp',
      'kaggle': 'Kaggle',
      'codecombat': 'CodeCombat',
      'youtube': 'YouTube',
      'internal': 'Internal'
    };
    return platformNames[source] || source;
  };

  const isExternalPlatform = project.source !== 'internal';

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => onClick(project)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={DIFFICULTY_COLORS[project.difficulty]}>
            {project.difficulty}
          </Badge>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {SOURCE_LABELS[project.source]}
            </Badge>
            {isExternalPlatform && (
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            )}
          </div>
        </div>
        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors flex items-center gap-2">
          <span>{TYPE_ICONS[project.type]}</span>
          {project.title}
          {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Project Preview */}
        <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-center h-20">
            <div className="text-center">
              <div className="text-3xl mb-2">
                {CATEGORY_EMOJIS[project.category as keyof typeof CATEGORY_EMOJIS] || '📚'}
              </div>
              <div className="text-sm font-medium">{project.category}</div>
              {project.language && (
                <Badge variant="outline" className="text-xs mt-1">
                  {project.language}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {project.estimatedTime}
          </span>
          <span className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            {project.xpReward} XP
          </span>
        </div>

        {/* Action Button */}
        <Button 
          className={`w-full ${
            isCompleted 
              ? 'bg-green-500 hover:bg-green-600' 
              : isExternalPlatform
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed
            </>
          ) : isExternalPlatform ? (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Practice on {getPlatformName(project.source)}
            </>
          ) : (
            <>
              <Code className="w-4 h-4 mr-2" />
              Start Practice
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}