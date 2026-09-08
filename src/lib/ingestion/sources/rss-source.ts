import { NewsSource, RawArticle } from '../types';

export class RssNewsSource implements NewsSource {
  name: string;
  type: 'rss' = 'rss';
  feedUrl: string;

  constructor(name: string, feedUrl: string) {
    this.name = name;
    this.feedUrl = feedUrl;
  }

  async fetchArticles(): Promise<RawArticle[]> {
    try {
      const response = await fetch(this.feedUrl, {
        headers: {
          'User-Agent': 'TechSignal-Bot/1.0 (+https://techsignal.io)',
          'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed ${this.feedUrl}: ${response.status} ${response.statusText}`);
      }

      const xmlText = await response.text();
      return this.parseXmlFeed(xmlText);
    } catch (error) {
      console.error(`[RssNewsSource Error] ${this.name} (${this.feedUrl}):`, error);
      return [];
    }
  }

  private parseXmlFeed(xml: string): RawArticle[] {
    const articles: RawArticle[] = [];

    // Simple robust regex-based XML item/entry extractor supporting RSS 2.0 and Atom
    const isAtom = xml.includes('<entry>') || xml.includes('<entry ');
    const itemRegex = isAtom ? /<entry[\s\S]*?>([\s\S]*?)<\/entry>/gi : /<item[\s\S]*?>([\s\S]*?)<\/item>/gi;

    let match: RegExpExecArray | null;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];

      const title = this.extractTagContent(itemXml, 'title');
      const link = isAtom
        ? this.extractAtomLink(itemXml) || this.extractTagContent(itemXml, 'link')
        : this.extractTagContent(itemXml, 'link') || this.extractTagContent(itemXml, 'guid');
      const description = this.extractTagContent(itemXml, 'description') || this.extractTagContent(itemXml, 'summary');
      const content = this.extractTagContent(itemXml, 'content:encoded') || this.extractTagContent(itemXml, 'content') || description;
      const publishedAtStr = this.extractTagContent(itemXml, 'pubDate') || this.extractTagContent(itemXml, 'published') || this.extractTagContent(itemXml, 'updated') || this.extractTagContent(itemXml, 'dc:date');
      const author = this.extractTagContent(itemXml, 'author') || this.extractTagContent(itemXml, 'dc:creator');
      const imageUrl = this.extractImageUrl(itemXml);

      const cleanTitle = this.cleanCdataAndEntities(title);
      const cleanLink = this.cleanCdataAndEntities(link.trim());

      if (cleanTitle || cleanLink) {
        articles.push({
          sourceName: this.name,
          sourceType: 'rss',
          title: cleanTitle,
          description: this.stripHtml(this.cleanCdataAndEntities(description)),
          content: this.stripHtml(this.cleanCdataAndEntities(content)),
          link: cleanLink,
          publishedAt: publishedAtStr ? new Date(publishedAtStr) : new Date(),
          author: this.cleanCdataAndEntities(author),
          imageUrl,
        });
      }
    }

    return articles;
  }

  private extractTagContent(xml: string, tagName: string): string {
    const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
  }

  private extractAtomLink(xml: string): string {
    const regex = /<link[^>]+href=["']([^"']+)["']/i;
    const match = xml.match(regex);
    return match ? match[1] : '';
  }

  private extractImageUrl(xml: string): string | undefined {
    // Media enclosure, media:content, or img tag in content
    const mediaRegex = /<(?:media:content|enclosure)[^>]+url=["']([^"']+)["']/i;
    const mediaMatch = xml.match(mediaRegex);
    if (mediaMatch) return mediaMatch[1];

    const imgRegex = /<img[^>]+src=["']([^"']+)["']/i;
    const imgMatch = xml.match(imgRegex);
    if (imgMatch) return imgMatch[1];

    return undefined;
  }

  private cleanCdataAndEntities(text: string): string {
    if (!text) return '';
    return text
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .trim();
  }

  private stripHtml(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
}
