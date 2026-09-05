'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, TrendingUp, GitCommit, Globe, Flame, Sun, Moon, Layers, Menu, X } from 'lucide-react';

interface NavbarProps {
  categories?: { name: string; slug: string }[];
}

export function Navbar({ categories = [] }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      setIsDark(false);
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const defaultCategories = [
    { name: 'AI & Agents', slug: 'ai-agentic' },
    { name: 'FemTech & Health', slug: 'femtech-health' },
    { name: 'Ethics & Privacy', slug: 'ethics-privacy' },
    { name: 'Founders & VC', slug: 'founders-vc' },
    { name: 'Green Tech', slug: 'green-tech' },
  ];

  const navCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  TechSignal
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-mono uppercase tracking-widest text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/60 px-1.5 py-0.5 rounded">
                  Intelligence
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/news"
              className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors"
            >
              News
            </Link>
            <Link
              href="/trends"
              className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors flex items-center space-x-1.5"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Trends</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </Link>
            <Link
              href="/timeline"
              className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors flex items-center space-x-1.5"
            >
              <GitCommit className="w-4 h-4" />
              <span>Story Timelines</span>
            </Link>
            <Link
              href="/countries"
              className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors flex items-center space-x-1.5"
            >
              <Globe className="w-4 h-4" />
              <span>Global Map</span>
            </Link>
          </nav>

          {/* Actions: Theme Toggle, Live Badge & Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              title="Toggle Theme"
              aria-label="Toggle theme mode"
            >
              {mounted && isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              )}
              <span className="hidden sm:inline">
                {!mounted ? 'Theme' : isDark ? 'Light' : 'Dark'}
              </span>
            </button>

            <Link
              href="/trends"
              className="hidden sm:flex px-3.5 py-1.5 text-xs font-semibold rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-all items-center space-x-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Signals Live</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-fadeIn">
            <Link
              href="/news"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md"
            >
              News Feed
            </Link>
            <Link
              href="/trends"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-cyan-500" />
                <span>Trend Tracker</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                LIVE
              </span>
            </Link>
            <Link
              href="/timeline"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md"
            >
              <GitCommit className="w-4 h-4 text-indigo-500" />
              <span>Story Timelines</span>
            </Link>
            <Link
              href="/countries"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md"
            >
              <Globe className="w-4 h-4 text-cyan-500" />
              <span>Global Map</span>
            </Link>
          </nav>
        )}

        {/* Sub-header Categories Bar with Smooth Horizontal Touch Scroll */}
        <div className="flex items-center space-x-3 overflow-x-auto py-2.5 border-t border-slate-200 dark:border-slate-900 scrollbar-none text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
          <span className="text-slate-400 dark:text-slate-500 uppercase font-mono tracking-wider shrink-0 flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 inline mr-1" />
            <span>Topics:</span>
          </span>
          {navCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/topics/${cat.slug}`}
              className="shrink-0 bg-slate-100/70 dark:bg-slate-900/80 hover:bg-cyan-50 dark:hover:bg-cyan-950/60 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors font-mono text-[11px]"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm py-12 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded bg-cyan-500 flex items-center justify-center font-bold text-white text-sm">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-slate-100">TechSignal</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Global Technology Intelligence Platform. We track emerging signals, analyze context, and explain human & business impact.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-200 mb-3 text-xs uppercase tracking-wider font-mono">Intelligence</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/news" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Breaking News Feed</Link></li>
            <li><Link href="/trends" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Trend Tracker</Link></li>
            <li><Link href="/timeline" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Story Timelines</Link></li>
            <li><Link href="/countries" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Global Tech Pulse</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-200 mb-3 text-xs uppercase tracking-wider font-mono">Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/topics/ai-agentic" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">AI & Agentic Workflows</Link></li>
            <li><Link href="/topics/femtech-health" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">FemTech & Digital Health</Link></li>
            <li><Link href="/topics/ethics-privacy" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Ethics & Data Privacy</Link></li>
            <li><Link href="/topics/founders-vc" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Female Founders & VC</Link></li>
            <li><Link href="/topics/green-tech" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Green Tech & Sustainability</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-200 mb-3 text-xs uppercase tracking-wider font-mono">Principles</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Signal over volume. Human impact over jargon. Context over fast rewrites. Built for decision makers.
          </p>
          <div className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} TechSignal Intelligence. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
