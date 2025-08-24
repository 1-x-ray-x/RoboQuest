import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  HelpCircle, 
  Book, 
  Video, 
  MessageCircle, 
  Search,
  ExternalLink,
  Download,
  Users,
  Lightbulb,
  FileText,
  Code,
  Cpu,
  Gamepad2,
  Star,
  Clock,
  ArrowRight
} from 'lucide-react';

export function HelpResources() {
  const [searchQuery, setSearchQuery] = useState('');

  const quickHelp = [
    {
      title: "How do I start coding?",
      description: "Learn the basics of programming with our beginner-friendly Scratch course",
      category: "Getting Started",
      icon: <Code className="w-5 h-5" />,
      link: "/courses/scratch-basics"
    },
    {
      title: "My robot won't move",
      description: "Troubleshooting guide for common robot building problems",
      category: "Robotics",
      icon: <Cpu className="w-5 h-5" />,
      link: "/help/robot-troubleshooting"
    },
    {
      title: "How to save my project?",
      description: "Step-by-step guide to saving and sharing your awesome creations",
      category: "Projects",
      icon: <FileText className="w-5 h-5" />,
      link: "/help/save-projects"
    },
    {
      title: "Setting up Arduino IDE",
      description: "Complete guide to installing and configuring Arduino software",
      category: "Arduino",
      icon: <Download className="w-5 h-5" />,
      link: "/help/arduino-setup"
    }
  ];

  const tutorials = [
    {
      title: "Getting Started with RoboQuest",
      description: "A complete walkthrough of the platform and your first lesson",
      duration: "10 min",
      type: "video",
      difficulty: "Beginner",
      views: "15.2k"
    },
    {
      title: "Understanding Programming Concepts",
      description: "Learn about variables, loops, and functions with fun examples",
      duration: "25 min",
      type: "interactive",
      difficulty: "Beginner",
      views: "8.9k"
    },
    {
      title: "Building Your First Robot",
      description: "Step-by-step guide to assembling and programming a simple robot",
      duration: "45 min",
      type: "video",
      difficulty: "Intermediate",
      views: "12.1k"
    }
  ];

  const communityResources = [
    {
      title: "RoboQuest Community Forum",
      description: "Ask questions, share projects, and connect with other young coders",
      members: "2,340",
      posts: "8,920",
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      title: "Code Together Study Groups",
      description: "Join live study sessions with peers learning the same topics",
      members: "540",
      posts: "Weekly Sessions",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Project Showcase",
      description: "Show off your amazing creations and get inspired by others",
      members: "1,890",
      posts: "3,200+ Projects",
      icon: <Star className="w-6 h-6" />
    }
  ];

  const downloadableResources = [
    {
      title: "Python Cheat Sheet",
      description: "Quick reference for Python syntax and common functions",
      type: "PDF",
      size: "2.3 MB",
      downloads: "4.2k"
    },
    {
      title: "Arduino Component Guide",
      description: "Visual guide to common Arduino components and their uses",
      type: "PDF",
      size: "5.8 MB",
      downloads: "3.1k"
    },
    {
      title: "Scratch Block Reference",
      description: "Complete guide to all Scratch programming blocks",
      type: "PDF",
      size: "1.9 MB",
      downloads: "6.7k"
    }
  ];

  const faqItems = [
    {
      question: "How old do I need to be to use RoboQuest?",
      answer: "RoboQuest is designed for kids ages 8-16, but anyone can learn! Our courses start from complete beginner level."
    },
    {
      question: "Do I need any special equipment?",
      answer: "For programming courses, you just need a computer with internet. For robotics, we'll tell you exactly what parts you need for each project."
    },
    {
      question: "Can I work at my own pace?",
      answer: "Absolutely! All our courses are self-paced. Take your time to understand each concept before moving on."
    },
    {
      question: "What if I get stuck on something?",
      answer: "Don't worry! You can ask questions in our community forum, watch help videos, or use our built-in hints and tips."
    },
    {
      question: "How do I track my progress?",
      answer: "Your dashboard shows all your progress, including completed lessons, earned XP, and achievements. You can see how far you've come!"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-full">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h1 className="text-3xl mb-2">Help & Resources 🤝</h1>
        <p className="text-muted-foreground">Get the help you need and discover amazing resources to boost your learning!</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search for help articles, tutorials, or ask a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-base py-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Quick Help
          </CardTitle>
          <CardDescription>Common questions and quick solutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickHelp.map((item, index) => (
              <div key={index} className="p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-lg p-2 group-hover:bg-primary/20 transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm">{item.title}</h4>
                      <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex items-center gap-1 text-xs text-primary group-hover:text-primary/80">
                      <span>Learn more</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="tutorials" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full lg:w-96">
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-500" />
                Video Tutorials
              </CardTitle>
              <CardDescription>Step-by-step video guides to help you learn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tutorials.map((tutorial, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                    <div className="w-16 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm">{tutorial.title}</h4>
                        <Badge variant="outline" className="text-xs">{tutorial.difficulty}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{tutorial.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {tutorial.duration}
                        </div>
                        <span>{tutorial.views} views</span>
                      </div>
                    </div>
                    <Button size="sm">
                      <Video className="w-4 h-4 mr-2" />
                      Watch
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                Community Resources
              </CardTitle>
              <CardDescription>Connect with other learners and get help from the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communityResources.map((resource, index) => (
                  <div key={index} className="p-4 rounded-lg border hover:bg-accent/50 transition-colors group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 rounded-lg p-3 group-hover:bg-primary/20 transition-colors">
                        {resource.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm mb-1">{resource.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{resource.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{resource.members} members</span>
                          <span>{resource.posts}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-purple-500" />
                Downloadable Resources
              </CardTitle>
              <CardDescription>Handy reference guides and cheat sheets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {downloadableResources.map((resource, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-red-500" />
                        <Badge variant="secondary" className="text-xs">{resource.type}</Badge>
                      </div>
                      <h4 className="text-sm mb-1">{resource.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{resource.description}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                        <span>{resource.size}</span>
                        <span>{resource.downloads} downloads</span>
                      </div>
                      <Button size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-orange-500" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Answers to common questions about RoboQuest</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <h4 className="text-sm mb-2 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-primary" />
                      {faq.question}
                    </h4>
                    <p className="text-sm text-muted-foreground pl-6">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contact Support */}
      <Card className="bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-lg mb-2">Still need help?</h3>
          <p className="text-muted-foreground mb-4">
            Our friendly support team is here to help you succeed! Don't hesitate to reach out if you have any questions.
          </p>
          <div className="flex justify-center gap-3">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with Support
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Submit Ticket
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}