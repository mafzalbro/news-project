const { chromium } = require('playwright');
const fs = require('fs');

async function run() {
  const browser = await chromium.launch();

  // Create directories
  fs.mkdirSync('public/screenshots/desktop_dark', { recursive: true });
  fs.mkdirSync('public/screenshots/mobile_dark', { recursive: true });
  fs.mkdirSync('screenshots/desktop_dark', { recursive: true });
  fs.mkdirSync('screenshots/mobile_dark', { recursive: true });

  const routes = [
    { name: '1_homepage', path: '/' },
    { name: '2_article_analysis', path: '/news/agentic-ai-workflow-automation-breakthrough' },
    { name: '3_trend_tracker', path: '/trends' },
    { name: '4_story_timeline', path: '/timeline' },
    { name: '5_global_map', path: '/countries' }
  ];

  // Desktop context
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const desktopPage = await desktopContext.newPage();

  for (const r of routes) {
    await desktopPage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'networkidle' });
    await desktopPage.screenshot({ path: `public/screenshots/desktop_dark/${r.name}.png`, fullPage: false });
    await desktopPage.screenshot({ path: `screenshots/desktop_dark/${r.name}.png`, fullPage: false });
    console.log(`Saved desktop dark: ${r.name}`);
  }

  // Mobile context (375x812 - iPhone 12 Pro size)
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();

  for (const r of routes) {
    await mobilePage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'networkidle' });
    await mobilePage.screenshot({ path: `public/screenshots/mobile_dark/${r.name}.png`, fullPage: false });
    await mobilePage.screenshot({ path: `screenshots/mobile_dark/${r.name}.png`, fullPage: false });
    console.log(`Saved mobile dark: ${r.name}`);
  }

  // Also store top-level copies for easy access
  for (const r of routes) {
    await mobilePage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'networkidle' });
    await mobilePage.screenshot({ path: `public/screenshots/mobile_${r.name}.png`, fullPage: false });
    await mobilePage.screenshot({ path: `screenshots/mobile_${r.name}.png`, fullPage: false });
  }

  await browser.close();
}

run().catch(console.error);
