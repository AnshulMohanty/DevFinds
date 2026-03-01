const BaseProvider = require('./BaseProvider');

class RedditProvider extends BaseProvider {
  constructor() {
    super('Reddit');
    this.apiUrl = 'https://www.reddit.com/search.json';
    
    // Self-note: Reddit API block kar deta hai agar request bot jaisi lage.
    // Custom User-Agent header bhejna padega to bypass the 429 Too Many Requests error.
  }

  /**
   * Fetches top 10 relevant posts from Reddit
   */
  async search(query) {
    try {
      const encodedQuery = encodeURIComponent(query);
      const url = `${this.apiUrl}?q=${encodedQuery}&limit=10&sort=relevance`;

      const response = await fetch(url, {
        headers: {
          // A unique identifier so Reddit knows we are a legitimate app, not a malicious scraper
          'User-Agent': 'nodejs:devfinds-app:v1.0 (by /u/AnshulMohanty)',
        },
      });

      if (!response.ok) {
        console.error(`Reddit API Error: ${response.statusText}`);
        return [];
      }

      const parsed = await response.json();
      // Reddit nests its data deep inside 'data.children'
      return parsed.data.children || [];
    } catch (error) {
      console.error(`Reddit Search Error: ${error.message}`);
      return [];
    }
  }

  /**
   * Normalizes Reddit's nested JSON into our standard format
   */
  normalize(rawData) {
    if (!rawData || rawData.length === 0) return [];

    return rawData.map((child) => {
      const post = child.data;
      return {
        title: post.title,
        url: `https://www.reddit.com${post.permalink}`, // Reddit only gives relative paths
        source: this.name, // "Reddit"
        score: post.score, // Upvotes
        views: 0, // Reddit doesn't expose views here
        answers: post.num_comments, 
        tags: [post.subreddit], // We use the subreddit name (e.g., "reactjs") as a tag
        createdAt: new Date(post.created_utc * 1000).toISOString(), // Convert UNIX seconds to JS Date
      };
    });
  }
}

module.exports = RedditProvider;