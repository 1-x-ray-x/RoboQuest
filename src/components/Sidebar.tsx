import React from 'react';
import { Button } from './ui/button';
import { 
  Home, 
  BookOpen, 
  Video, 
  Code, 
  TrendingUp, 
  Award, 
  Settings,
  Trophy,
  FolderOpen,
  Users
} from 'lucide-react';
import logoImage from '/public/Transparent Logo.png';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isAdmin?: boolean;
}

export function Sidebar({ activeSection, onSectionChange, isAdmin = false }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Overview & quick actions'
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: BookOpen,
      description: 'Structured learning paths'
    },
    {
      id: 'tutorials',
      label: 'Tutorials',
      icon: Video,
      description: 'YouTube video library'
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: Code,
      description: 'Hands-on exercises'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: TrendingUp,
      description: 'Analytics & stats'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Award,
      description: 'Badges & certificates'
    },
    {
      id: 'our-projects',
      label: 'Our Projects',
      icon: FolderOpen,
      description: 'RoboQuest channel content'
    },
    {
      id: 'founders',
      label: 'Our Founders',
      icon: Users,
      description: 'Meet the team behind RoboQuest'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Account preferences'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-border h-full flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img 
            src={logoImage} 
            alt="RoboQuest Logo" 
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="font-bold text-lg">RoboQuest</h1>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? 'Admin Dashboard' : 'Learning Platform'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start h-auto p-3 text-left ${
                  isActive && 'bg-primary text-primary-foreground'
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.label}</div>
                    <div className={`text-xs truncate ${
                      isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-center">
          <div className="text-2xl mb-2">🚀</div>
          <p className="text-xs text-muted-foreground">
            Keep learning and building amazing things!
          </p>
          {isAdmin && (
            <p className="text-xs text-blue-600 mt-1 font-medium">
              Admin Mode Active
            </p>
          )}
        </div>
      </div>
    </div>
  );
}