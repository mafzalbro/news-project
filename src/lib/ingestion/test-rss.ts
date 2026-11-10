import { RssNewsSource } from './sources/rss-source';

async function testRssIngestion() {
  console.log('🧪 TESTING TICKET 1: RSS NEWS SOURCE ADAPTER...\n');

  // Test TechCrunch RSS Feed
  const techCrunchSource = new RssNewsSource('TechCrunch', 'https://techcrunch.com/feed/');

  console.log(`Fetching RSS feed from: ${techCrunchSource.name} (${techCrunchSource.feedUrl})...`);
  const articles = await techCrunchSource.fetchArticles();

  console.log(`\n✅ FETCHED ${articles.length} RAW ARTICLES FROM ${techCrunchSource.name.toUpperCase()}:`);

  if (articles.length > 0) {
    const sample = articles[0];
    console.log('\n--- SAMPLE RAW ARTICLE ---');
    console.log(`Title:       ${sample.title}`);
    console.log(`Link:        ${sample.link}`);
    console.log(`Published:   ${sample.publishedAt}`);
    console.log(`Author:      ${sample.author || 'N/A'}`);
    console.log(`Image URL:   ${sample.imageUrl || 'N/A'}`);
    console.log(`Description: ${(sample.description || '').slice(0, 150)}...`);
    console.log('---------------------------\n');
  } else {
    console.log('⚠️ Feed returned 0 items or offline mode. Testing fallback mock RSS XML parsing...');

    // Sample RSS XML string for offline fallback test
    const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>TechSignal Test Feed</title>
        <item>
          <title><![CDATA[OpenAI Unveils New Autonomous Agent Benchmarks]]></title>
          <link>https://techcrunch.com/2026/03/30/openai-agent-benchmarks</link>
          <description><![CDATA[<p>Evaluations show multi-agent systems outperforming single-prompt LLMs in complex coding workflows.</p>]]></description>
          <pubDate>Mon, 30 Mar 2026 12:00:00 GMT</pubDate>
          <dc:creator>Alex Rivers</dc:creator>
        </item>
      </channel>
    </rss>`;

    const adapter = new RssNewsSource('TestFeed', 'http://localhost/mock.xml');
    // @ts-expect-error accessing private method for test verification
    const parsed = adapter.parseXmlFeed(mockXml);

    console.log(`\n✅ FALLBACK PARSER SUCCESS: Parsed ${parsed.length} article(s):`);
    console.log(`Title: ${parsed[0].title}`);
    console.log(`Link:  ${parsed[0].link}`);
    console.log(`Date:  ${parsed[0].publishedAt}`);
  }
}

testRssIngestion().catch(console.error);
