const BaseProvider = require('./BaseProvider');

class DevToProvider extends BaseProvider {
  constructor() {
    super('DevTo');
    this.apiUrl = 'https://dev.to/api/articles';
    
    // Self-note: Dev.to ka API kaafi seedha hai aur public access allow karta hai. 
    // Isme 'public_reactions_count' ko hum score manenge taaki SO ke upvotes se match ho sake.
  }

  /**
   * Fetches top 10 relevant articles from Dev.to
   */
  async search(query) {
    try {
      const encodedQuery = encodeURIComponent(query);
      // Dev.to allows searching via the 'q' parameter, limiting to 10 per page
      const url = `${this.apiUrl}?q=${encodedQuery}&per_page=10`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Dev.to API Error: ${response.statusText}`);
        return []; // Graceful degradation
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error(`Dev.to Search Error: ${error.message}`);
      return [];
    }
  }

  /**
   * Normalizes Dev.to JSON into our standard DevFinds format
   */
  normalize(rawData) {
    if (!rawData || rawData.length === 0) return [];

    return rawData.map((post) => {
      return {
        title: post.title,
        url: post.url,
        source: this.name, // "DevTo"
        score: post.public_reactions_count, // Mapping Dev.to likes to our generic "score"
        views: 0, // Dev.to API doesn't expose view counts in this endpoint, so we default to 0
        answers: post.comments_count, // Mapping comments to "answers"
        tags: post.tag_list,
        createdAt: new Date(post.created_at).toISOString(),
      };
    });
  }
}

module.exports = DevToProvider;