import React, { useState } from 'react';
import { FaInstagram, FaYoutube, FaEnvelope } from "react-icons/fa";
import { Button } from './ui/button';
import { Input } from './ui/input';

interface LandingProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function Landing({ onLogin, onSignup }: LandingProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
  };
  // Mirror Primary Webpapge layout with RoboQuest branding + auth buttons
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:p-8">
        <div className="flex items-center space-x-10">
          <div className="h-8 w-8 rounded bg-white flex items-center justify-center overflow-hidden">
            <img src="/Logo.png" alt="RoboQuest" className="h-8 w-8 object-contain" />
          </div>
          <span className="text-xl font-medium ml-4">RoboQuest</span>
        </div>
        
<div className="flex items-center justify-center space-x-16 mt-4 text-gray-400 text-sm">
  {/* Instagram */}
  <a
    href="https://www.instagram.com/mrroboquest"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center hover:text-white"
  >
    <FaInstagram className="w-5 h-5" />
    <span>@mrroboquest</span>
  </a>

  <span style={{ display: 'inline-block', width: 28 }} />

  {/* YouTube */}
  <a
    href="https://www.youtube.com/@MrRoboQuest"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center hover:text-white"
  >
    <FaYoutube className="w-5 h-5" />
    <span>@MrRoboQuest</span>
  </a>

  <span style={{ display: 'inline-block', width: 28 }} />

  {/* Email */}
  <a
    href="mailto:roboquest1808@gmail.com"
    className="flex items-center hover:text-white"
  >
    <FaEnvelope className="w-5 h-5" />
    <span>roboquest1808@gmail.com</span>
  </a>
</div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onLogin}
            className="bg-black hover:bg-gray-100 border-white/60 text-white hover:bg-white hover:!text-black font-semibold px-5 py-2 rounded-lg shadow-sm"
            aria-label="Log in"
          >
            Log in
          </Button>
          <Button
            onClick={onSignup}
            className="bg-black hover:bg-gray-100 font-semibold px-5 py-2 rounded-lg border border-black/30 shadow-sm"
            aria-label="Sign up"
          >
            <span className="text-black">Sign up</span>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative px-6 md:px-8 pb-20 overflow-hidden">
        {/* Gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent pointer-events-none" />
        {/* Geometry / circuitry overlays behind text */}
        <img
          src="/pngtree-abstract-blue-digital-technology-lines-diagram-png-image_6474402.png"
          alt="circuits"
          className="pointer-events-none select-none hidden md:block absolute -top-10 left-1/2 -translate-x-1/2 w-[1200px] opacity-20 mix-blend-screen"
        />
        {/* Side robots for quirky feel (behind text but fully visible at edges) */}
        <img
          src="/cute-happy-3d-robot_png.png.png"
          alt="robot-left"
          className="pointer-events-none select-none hidden lg:block absolute top-28 left-0 h-64 -translate-x-1/3 opacity-95 drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)] z-0"
        />
        <img
          src="/cute-3d-robot-say-hello_png.png.png"
          alt="robot-right"
          className="pointer-events-none select-none hidden lg:block absolute top-36 right-0 h-64 translate-x-1/3 opacity-95 drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)] z-0"
        />

        <div className="relative max-w-6xl mx-auto">
          {/* About Anchor */}
          <div id="about" className="pt-2" />
          <div className="text-center mb-12" />

          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              The Learning OS
              <br />
              <span className="relative">
                for Young Makers
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-500 rounded-full" />
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Build, learn, and explore with RoboQuest. Tutorials and projects unified in one simple experience.
            </p>

            {/* Waitlist form removed per request */}
          </div>

          {/* Features Grid */}
          <div id="features" className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-black-500/20 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-black-400 rounded-sm" />
              </div>
              <h3 className="text-xl font-medium mb-3">Unified Library</h3>
              <p className="text-gray-400 leading-relaxed">Tutorials, projects, and videos in one place.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-purple-400 rounded-sm" />
              </div>
              <h3 className="text-xl font-medium mb-3">Progress Tracking</h3>
              <p className="text-gray-400 leading-relaxed">Earn achievements as you learn new skills.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-green-400 rounded-sm" />
              </div>
              <h3 className="text-xl font-medium mb-3">Kid-Friendly</h3>
              <p className="text-gray-400 leading-relaxed">A safe, simple interface for students.</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="text-center mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-4xl font-bold text-black-400 mb-2">100+</div>
                <div className="text-gray-400">Tutorials</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
                <div className="text-gray-400">Access Anywhere</div>
              </div>
            </div>
          </div>
        </div>
        {/* Contact removed per request */}
      </main>

      {/* Centered single video */
      }
      <section className="px-6 md:px-8 py-12 bg-white/5 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
            <video
              src={'/Liquid Metal.mp4'}
              className="w-full h-[220px] object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
            />
          </div>
        </div>
      </section>

      {/* Removed additional image grid per request */}

      {/* Footer */}
      <footer className="border-t border-white/10 p-6 md:p-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="h-9 w-9 rounded bg-white flex items-center justify-center overflow-hidden">
              <img src="/Logo.png" alt="RoboQuest" className="h-7 w-7 object-contain" />
            </div>
            <span className="text-xl font-medium ml-4">RoboQuest</span>
          </div>
          <div className="text-gray-400 text-sm">© {new Date().getFullYear()} RoboQuest. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

// Removed multi-video showcase per request


