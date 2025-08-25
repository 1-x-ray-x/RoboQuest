import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

export default function App() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      toast.success("Successfully joined the waitlist!");
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center space-x-2">
          <div className="bg-white text-black px-2 py-1 rounded text-sm font-medium">
            OS
          </div>
          <span className="text-xl font-medium">NUCLi</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#about" className="text-gray-300 hover:text-white transition-colors">
            About
          </a>
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </a>
          <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative px-6 md:px-8 pb-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent pointer-events-none" />
        
        <div className="relative max-w-6xl mx-auto">
          {/* Join Waitlist Banner */}
          <div className="text-center mb-12">
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="text-sm text-gray-300">Now in Beta</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              The Operating System
              <br />
              <span className="relative">
                for Brands
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-red-500 rounded-full" />
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Transform your brand's digital presence with NUCLi OS. 
              The revolutionary platform that unifies all your brand operations in one intelligent system.
            </p>

            {/* Waitlist Form */}
            <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto mb-12">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40"
                />
                <Button 
                  type="submit" 
                  className="bg-white text-black hover:bg-gray-100 font-medium px-8"
                >
                  Join Waitlist
                </Button>
              </div>
            </form>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-blue-400 rounded-sm" />
              </div>
              <h3 className="text-xl font-medium mb-3">Unified Dashboard</h3>
              <p className="text-gray-400 leading-relaxed">
                Manage all your brand assets, campaigns, and operations from a single, intuitive interface.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-purple-400 rounded-sm" />
              </div>
              <h3 className="text-xl font-medium mb-3">AI-Powered Insights</h3>
              <p className="text-gray-400 leading-relaxed">
                Leverage advanced AI to optimize your brand strategy and predict market trends.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-green-400 rounded-sm" />
              </div>
              <h3 className="text-xl font-medium mb-3">Real-time Collaboration</h3>
              <p className="text-gray-400 leading-relaxed">
                Seamlessly collaborate with your team and stakeholders in real-time across all projects.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="text-center mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
                <div className="text-gray-400">Brands on Waitlist</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">99.9%</div>
                <div className="text-gray-400">Uptime Guarantee</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
                <div className="text-gray-400">Support Available</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Brand?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of forward-thinking brands who are already building the future with NUCLi OS.
            </p>
            <Button 
              onClick={() => document.querySelector('input[type="email"]')?.focus()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-8 py-3 text-lg"
            >
              Get Early Access
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 p-6 md:p-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="bg-white text-black px-2 py-1 rounded text-sm font-medium">
              OS
            </div>
            <span className="text-xl font-medium">NUCLi</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#terms" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </a>
            <div className="text-gray-400 text-sm">
              © 2025 NUCLi OS. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}