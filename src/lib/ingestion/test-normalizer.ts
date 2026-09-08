import fs from 'fs';
import path from 'path';
import { RssNewsSource } from './sources/rss-source';
import { normalizeArticle } from './normalizer/article-normalizer';

async function runNormalizerUnitTests() {
  console.log('🧪 RUNNING TICKET 2: ARTICLE NORMALIZER & VALIDATION UNIT TESTS...\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
    }
  }

  const fixturesDir = path.join(process.cwd(), 'src/lib/ingestion/__fixtures__');

  // Test 1: RSS Basic Normalization
  const rssXml = fs.readFileSync(path.join(fixturesDir, 'rss-basic.xml'), 'utf-8');
  const rssSource = new RssNewsSource('TechCrunch', 'http://localhost/rss-basic.xml');
  // @ts-expect-error accessing private method for fixture testing
  const rawRss = rssSource.parseXmlFeed(rssXml);
  assert(rawRss.length === 1, 'RSS Basic: Extracted 1 raw article from fixture');

  const normRss = normalizeArticle(rawRss[0]);
  assert(normRss.title === 'OpenAI Releases GPT-5 Enterprise Architecture', 'RSS Basic: Title normalized');
  assert(normRss.canonicalUrl === 'https://techcrunch.com/2026/03/30/openai-gpt5', 'RSS Basic: URL normalized and tracking params stripped');
  assert(normRss.description === 'OpenAI announced new frontier AI model capabilities for enterprise workflow automation.', 'RSS Basic: HTML stripped from description');
  assert(normRss.authorName === 'Sarah Jenkins', 'RSS Basic: Author extracted');
  assert(normRss.contentHash.length === 64, 'RSS Basic: Deterministic 64-char SHA-256 contentHash generated');

  // Test 2: Atom Basic Normalization
  const atomXml = fs.readFileSync(path.join(fixturesDir, 'atom-basic.xml'), 'utf-8');
  const atomSource = new RssNewsSource('Ars Technica', 'http://localhost/atom-basic.xml');
  // @ts-expect-error accessing private method for fixture testing
  const rawAtom = atomSource.parseXmlFeed(atomXml);
  assert(rawAtom.length === 1, 'Atom Basic: Extracted 1 raw entry from fixture');

  const normAtom = normalizeArticle(rawAtom[0]);
  assert(normAtom.title === 'Quantum Computing Lab Achieves 10,000 Logical Qubit Milestone', 'Atom Basic: Title normalized');
  assert(normAtom.authorName === 'Dr. Elena Rostova', 'Atom Basic: Author extracted');

  // Test 3: CDATA & HTML Cleaning
  const cdataXml = fs.readFileSync(path.join(fixturesDir, 'rss-cdata.xml'), 'utf-8');
  const cdataSource = new RssNewsSource('Wired', 'http://localhost/rss-cdata.xml');
  // @ts-expect-error accessing private method for fixture testing
  const rawCdata = cdataSource.parseXmlFeed(cdataXml);
  const normCdata = normalizeArticle(rawCdata[0]);
  assert(!normCdata.title.includes('<![CDATA['), 'CDATA: CDATA block removed from title');
  assert(!normCdata.description.includes('<strong>') && normCdata.description.includes('multi-gigawatt'), 'CDATA & HTML: HTML tags stripped while text content preserved');

  // Test 4: Missing Optional Fields
  const missingXml = fs.readFileSync(path.join(fixturesDir, 'rss-missing-fields.xml'), 'utf-8');
  const missingSource = new RssNewsSource('The Verge', 'http://localhost/rss-missing-fields.xml');
  // @ts-expect-error accessing private method for fixture testing
  const rawMissing = missingSource.parseXmlFeed(missingXml);
  const normMissing = normalizeArticle(rawMissing[0]);
  assert(normMissing.authorName === 'Editorial Team', 'Missing Fields: Default author set when missing');
  assert(normMissing.imageUrl === null, 'Missing Fields: Optional imageUrl handles null safely');

  // Test 5: Malformed Data Safety
  const malformedXml = fs.readFileSync(path.join(fixturesDir, 'rss-malformed.xml'), 'utf-8');
  const malformedSource = new RssNewsSource('TechCrunch', 'http://localhost/rss-malformed.xml');
  // @ts-expect-error accessing private method for fixture testing
  const rawMalformed = malformedSource.parseXmlFeed(malformedXml);

  let caughtErrorCount = 0;
  const validNormalized = [];
  for (const raw of rawMalformed) {
    try {
      validNormalized.push(normalizeArticle(raw));
    } catch {
      caughtErrorCount++;
    }
  }
  assert(caughtErrorCount === 1, 'Malformed Data: Malformed item safely rejected by validation');
  assert(validNormalized.length === 1, 'Malformed Data: Valid item alongside malformed item preserved');

  // Test 6: Content Hash Determinism
  const hash1 = normalizeArticle(rawRss[0]).contentHash;
  const hash2 = normalizeArticle(rawRss[0]).contentHash;
  assert(hash1 === hash2, 'Hash Determinism: Same normalized article produces identical SHA-256 hash');

  const modifiedRaw = { ...rawRss[0], title: 'Different Title' };
  const hash3 = normalizeArticle(modifiedRaw).contentHash;
  assert(hash1 !== hash3, 'Hash Sensitivity: Changed content produces distinct SHA-256 hash');

  console.log(`\nUNIT TEST RESULTS: ${passed}/${total} PASSED\n`);
  if (passed !== total) {
    process.exit(1);
  }
}

runNormalizerUnitTests().catch(console.error);
