import { test } from '@playwright/test';
import fs from 'fs';

test('capture complete screenshot suites across theme and device combinations', async ({ page, browser }) => {
  const dirs = [
    'public/screenshots',
    'public/screenshots/desktop/dark',
    'public/screenshots/desktop/light',
    'public/screenshots/mobile/dark',
    'public/screenshots/mobile/light',
    'screenshots',
    'screenshots/desktop/dark',
    'screenshots/desktop/light',
    'screenshots/mobile/dark',
    'screenshots/mobile/light'
  ];

  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const routes = [
    { name: '1_homepage', path: '/' },
    { name: '2_article_analysis', path: '/news/agentic-ai-redefining-enterprise-workflows-2025' },
    { name: '3_trend_tracker', path: '/trends' },
    { name: '4_story_timeline', path: '/timeline' },
    { name: '5_global_map', path: '/countries' }
  ];

  // 1. Desktop Dark
  const deskDarkCtx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: 'dark'
  });
  const deskDarkPage = await deskDarkCtx.newPage();
  for (const r of routes) {
    await deskDarkPage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'networkidle' });
    await deskDarkPage.evaluate(() => {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    });
    await deskDarkPage.screenshot({ path: `public/screenshots/desktop/dark/${r.name}.png` });
    await deskDarkPage.screenshot({ path: `screenshots/desktop/dark/${r.name}.png` });
    await deskDarkPage.screenshot({ path: `public/screenshots/${r.name}.png` });
    await deskDarkPage.screenshot({ path: `screenshots/${r.name}.png` });
  }

  // 2. Desktop Light
  const deskLightCtx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: 'light'
  });
  const deskLightPage = await deskLightCtx.newPage();
  for (const r of routes) {
    await deskLightPage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'networkidle' });
    await deskLightPage.evaluate(() => {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    });
    await deskLightPage.screenshot({ path: `public/screenshots/desktop/light/${r.name}.png` });
    await deskLightPage.screenshot({ path: `screenshots/desktop/light/${r.name}.png` });
  }

  // 3. Mobile Dark
  const mobDarkCtx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark'
  });
  const mobDarkPage = await mobDarkCtx.newPage();
  for (const r of routes) {
    await mobDarkPage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'networkidle' });
    await mobDarkPage.evaluate(() => {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    });
    await mobDarkPage.screenshot({ path: `public/screenshots/mobile/dark/${r.name}.png` });
    await mobDarkPage.screenshot({ path: `screenshots/mobile/dark/${r.name}.png` });
  }

  // 4. Mobile Light
  const mobLightCtx = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
    colorScheme: 'light'
  });
  const mobLightPage = await mobLightCtx.newPage();
  for (const r of routes) {
    await mobLightPage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'networkidle' });
    await mobLightPage.evaluate(() => {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    });
    await mobLightPage.screenshot({ path: `public/screenshots/mobile/light/${r.name}.png` });
    await mobLightPage.screenshot({ path: `screenshots/mobile/light/${r.name}.png` });
  }
});
