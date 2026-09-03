import { test } from '@playwright/test';
import fs from 'fs';

test('capture light mode and mobile screenshots', async ({ page, browser }) => {
  fs.mkdirSync('public/screenshots/light', { recursive: true });
  fs.mkdirSync('public/screenshots/mobile', { recursive: true });
  fs.mkdirSync('screenshots/light', { recursive: true });
  fs.mkdirSync('screenshots/mobile', { recursive: true });

  const routes = [
    { name: '1_homepage', path: '/' },
    { name: '2_article_analysis', path: '/news/agentic-ai-workflow-automation-breakthrough' },
    { name: '3_trend_tracker', path: '/trends' },
    { name: '4_story_timeline', path: '/timeline' },
    { name: '5_global_map', path: '/countries' }
  ];

  // 5 Desktop Light-mode screenshots (using light color scheme preferred)
  const lightCtx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: 'light'
  });
  const lightPage = await lightCtx.newPage();

  for (const r of routes) {
    await lightPage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'networkidle' });
    await lightPage.screenshot({ path: `public/screenshots/light/${r.name}.png`, fullPage: false });
    await lightPage.screenshot({ path: `screenshots/light/${r.name}.png`, fullPage: false });
  }

  // 5 Mobile responsiveness screenshots
  const mobileCtx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileCtx.newPage();

  for (const r of routes) {
    await mobilePage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'networkidle' });
    await mobilePage.screenshot({ path: `public/screenshots/mobile/${r.name}.png`, fullPage: false });
    await mobilePage.screenshot({ path: `screenshots/mobile/${r.name}.png`, fullPage: false });
  }
});
