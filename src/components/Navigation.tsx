'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { ThemeStudio } from '@/components/ThemeStudio';

interface NavbarProps {
  categories?: { name: string; slug: string }[];
}

export function Navbar({ categories = [] }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Collapse the masthead as the user scrolls down; restore near the top.
  // Scroll anchoring is disabled document-wide (see globals.css), so no silent
  // scrollY adjustments can push the position around; the hysteresis band is
  // the second layer of defense and is sized to exceed the header's full
  // collapse delta (~80-100px: date bar 32px + category bar ~37px + masthead
  // shrink ~12px), so even if anchoring re-engages it cannot jump the band.
  useEffect(() => {
    const COLLAPSE_AT = 160;
    const EXPAND_BELOW = 20;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > EXPAND_BELOW : y > COLLAPSE_AT));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.classList.toggle('light', !next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setIsDark(next);
  };

  const defaultCategories = [
    { name: 'AI & Agents', slug: 'ai-agentic' },
    { name: 'FemTech & Health', slug: 'femtech-health' },
    { name: 'Ethics & Privacy', slug: 'ethics-privacy' },
    { name: 'Founders & VC', slug: 'founders-vc' },
    { name: 'Green Tech', slug: 'green-tech' },
  ];

  const navCategories = categories.length > 0 ? categories : defaultCategories;

  const navLinks = [
    { href: '/news', label: 'News' },
    { href: '/trends', label: 'Trends' },
    { href: '/timeline', label: 'Timelines' },
    { href: '/countries', label: 'Global' },
  ];

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <ThemeStudio />
      <header
        className={`sticky-header sticky top-0 z-50 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 ${scrolled ? 'header-collapsed shadow-sm' : ''
          }`}
      >
        {/* Date line — collapses away on scroll */}
        <div className="header-collapsible border-b border-stone-100 dark:border-stone-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-8 text-[11px] text-stone-500 dark:text-stone-400">
            <span className="font-medium tracking-wide">{today}</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="label !text-[10px] text-stone-500 dark:text-stone-400">Live coverage</span>
            </span>
          </div>
        </div>

        {/* Masthead — shrinks on scroll */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`header-bar flex items-center justify-between ${scrolled ? 'header-bar-compact' : 'header-bar-tall'}`}>
            <Link href="/" className="flex items-center gap-2.5 group">
              <div
                className={`header-logo rounded-xl bg-accent flex items-center justify-center text-[var(--accent-contrast)] shadow-sm group-hover:scale-105 transition-transform ${scrolled ? 'w-7 h-7' : 'w-9 h-9'
                  }`}
              >
                <Zap className={scrolled ? 'w-4 h-4 fill-current' : 'w-5 h-5 fill-current'} />
              </div>
              <span
                className={`header-title font-serif-display font-bold tracking-tight text-stone-900 dark:text-stone-50 ${scrolled ? 'text-xl' : 'text-2xl'
                  }`}
              >
                TechSignal
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${active
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-50'
                      }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Toggle theme mode"
              >
                {mounted && isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link
                href="/news"
                className="btn-accent hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
              >
                Subscribe
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Category bar — collapses away on scroll */}
        <div className="header-collapsible border-t border-stone-100 dark:border-stone-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none whitespace-nowrap">
              <span className="label !text-[10px] text-stone-400 dark:text-stone-500 shrink-0 pr-1">Topics</span>
              {navCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/topics/${cat.slug}`}
                  className="shrink-0 px-3 py-1 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-50 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-[var(--accent-contrast)]">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="font-serif-display font-bold text-lg text-stone-900 dark:text-stone-50">TechSignal</span>
          </div>
          <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            Global technology intelligence. We track emerging signals, analyze context, and explain human &amp; business impact.
          </p>
        </div>

        <div>
          <h4 className="label text-stone-900 dark:text-stone-100 mb-4">Sections</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/news" className="link-accent">News Feed</Link></li>
            <li><Link href="/trends" className="link-accent">Trend Tracker</Link></li>
            <li><Link href="/timeline" className="link-accent">Story Timelines</Link></li>
            <li><Link href="/countries" className="link-accent">Global Tech Pulse</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="label text-stone-900 dark:text-stone-100 mb-4">Topics</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/topics/ai-agentic" className="link-accent">AI &amp; Agentic Workflows</Link></li>
            <li><Link href="/topics/femtech-health" className="link-accent">FemTech &amp; Digital Health</Link></li>
            <li><Link href="/topics/ethics-privacy" className="link-accent">Ethics &amp; Data Privacy</Link></li>
            <li><Link href="/topics/founders-vc" className="link-accent">Female Founders &amp; VC</Link></li>
            <li><Link href="/topics/green-tech" className="link-accent">Green Tech &amp; Sustainability</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="label text-stone-900 dark:text-stone-100 mb-4">Our Principles</h4>
          <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
            Signal over volume. Human impact over jargon. Context over fast rewrites. Built for decision makers.
          </p>
          <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-900 text-xs text-stone-400 dark:text-stone-500">
            © {new Date().getFullYear()} TechSignal Intelligence. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export { ThemeStudio };
