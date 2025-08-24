export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  xpReward: number;
  type: 'coding' | 'hardware' | 'visual';
  language?: string;
  source: 'exercism' | 'youtube' | 'internal' | 'codewars' | 'hackerrank' | 'leetcode' | 'codingame' | 'edabit' | 'freecodecamp' | 'kaggle' | 'codecombat';
  externalUrl?: string;
  youtubeId?: string;
  instructions?: string[];
  startingCode?: string;
  solution?: string;
  tests?: Array<{
    description: string;
    input: string;
    expectedOutput: string;
  }>;
}