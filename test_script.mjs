import { chromium } from '@playwright/test';
import fs from 'fs';

async function run() {
  const browser = await chromium.launch();

  fs.mkdirSync('public/screenshots/desktop', { recursive: true });
  fs.mkdirSync('public/screenshots/mobile', { recursive: true });
  fs.mkdirSync('screenshots/desktop', { recursive: true });
  fs.mkdirSync('screenshots/mobile', { recursive: true });

  const routes = [
    { name: '1_homepage', path: '/' },
    { name: '2_article_analysis', path: '/news/agentic-ai-workflow-automation-breakthrough' },
    { name: '3_trend_tracker', path: '/trends' },
    { name: '4_story_timeline', path: '/timeline' },
    { name: '5_global_map', path: '/countries' }
  ];

  // 5 Desktop / Light viewport screenshots
  const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const desktopPage = await desktopContext.newPage();

  for (const r of routes) {
    await desktopPage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'networkidle' });
    await desktopPage.screenshot({ path: `public/screenshots/desktop/${r.name}.png`, fullPage: false });
    await desktopPage.screenshot({ path: `screenshots/desktop/${r.name}.png`, fullPage: false });
    console.log(`Desktop captured: ${r.name}`);
  }

  // 5 Mobile responsiveness screenshots
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();

  for (const r of routes) {
    await mobilePage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'networkidle' });
    await mobilePage.screenshot({ path: `public/screenshots/mobile/${r.name}.png`, fullPage: false });
    await mobilePage.screenshot({ path: `screenshots/mobile/${r.name}.png`, fullPage: false });
    console.log(`Mobile captured: ${r.name}`);
  }

  await browser.close();
}

run().catch(console.error);
