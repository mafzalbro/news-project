import { NewsSource } from '../types';
import { RssNewsSource } from './rss-source';

export interface SourceConfig {
  id: string;
  name: string;
  type: 'rss' | 'api' | 'google-news';
  feedUrl: string;
  category: string;
  enabled: boolean;
}

export const sourceConfigurations: SourceConfig[] = [
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    type: 'rss',
    feedUrl: 'https://techcrunch.com/feed/',
    category: 'founders-vc',
    enabled: true,
  },
  {
    id: 'ars-technica',
    name: 'Ars Technica',
    type: 'rss',
    feedUrl: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'general-tech',
    enabled: true,
  },
  {
    id: 'wired',
    name: 'Wired',
    type: 'rss',
    feedUrl: 'https://www.wired.com/feed/rss',
    category: 'ethics-privacy',
    enabled: true,
  },
  {
    id: 'mit-tech-review',
    name: 'MIT Technology Review',
    type: 'rss',
    feedUrl: 'https://www.technologyreview.com/feed/',
    category: 'ai-agentic',
    enabled: true,
  },
  {
    id: 'venturebeat',
    name: 'VentureBeat',
    type: 'rss',
    feedUrl: 'https://venturebeat.com/feed/',
    category: 'ai-agentic',
    enabled: true,
  },
  {
    id: 'the-verge',
    name: 'The Verge',
    type: 'rss',
    feedUrl: 'https://www.theverge.com/rss/index.xml',
    category: 'general-tech',
    enabled: true,
  },
  {
    id: 'hacker-news',
    name: 'Hacker News',
    type: 'rss',
    feedUrl: 'https://news.ycombinator.com/rss',
    category: 'founders-vc',
    enabled: true,
  },
  {
    id: 'readwrite',
    name: 'ReadWrite',
    type: 'rss',
    feedUrl: 'https://readwrite.com/feed/',
    category: 'general-tech',
    enabled: true,
  },
  {
    id: 'ieee-spectrum',
    name: 'IEEE Spectrum',
    type: 'rss',
    feedUrl: 'https://spectrum.ieee.org/feeds/feed.rss',
    category: 'green-tech',
    enabled: true,
  },
  {
    id: 'greenbiz',
    name: 'GreenBiz',
    type: 'rss',
    feedUrl: 'https://www.greenbiz.com/rss.xml',
    category: 'green-tech',
    enabled: true,
  },
  {
    id: 'tech-eu',
    name: 'TechEU',
    type: 'rss',
    feedUrl: 'https://tech.eu/feed/',
    category: 'founders-vc',
    enabled: true,
  },
  {
    id: 'rest-of-world',
    name: 'Rest of World',
    type: 'rss',
    feedUrl: 'https://restofworld.org/feed/latest/',
    category: 'general-tech',
    enabled: true,
  },
];

/**
 * Creates and returns configured active NewsSource instances.
 */
export function getRegisteredNewsSources(): NewsSource[] {
  return sourceConfigurations
    .filter((config) => config.enabled)
    .map((config) => new RssNewsSource(config.name, config.feedUrl));
}
