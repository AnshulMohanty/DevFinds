// DevFinds/backend/src/services/providers/StackOverflowProvider.js
const BaseProvider = require('./BaseProvider');

class StackOverflowProvider extends BaseProvider {
  constructor() {
    super('StackOverflow');
    // Base API URL for StackOverflow advanced search
    this.apiUrl = 'https://api.stackexchange.com/2.3/search/advanced';
    
    // Self-note: Public API use kar rahe hain toh rate limit 300 requests/day hai. 
    // TODO: Baad me production me StackExchange API key leni padegi rate limit 10,000 karne ke liye.
  }

  /**
   * Fetches top 10 relevant questions from StackOverflow
   */
  async search(query) {
    try {
      // Encode query so spaces become %20 (e.g., "react hooks" -> "react%20hooks")
      const encodedQuery = encodeURIComponent(query);
      
      // Build URL: Sort by relevance, descending order, limit to 10 results
      const url = `${this.apiUrl}?order=desc&sort=relevance&q=${encodedQuery}&site=stackoverflow&pagesize=10`;

      const response = await fetch(url);

      if (!response.ok) {
        // Self-note: Agar SO down ho gaya toh humara app crash nahi hona chahiye. 
        // Isliye return empty array taaki baki providers (Reddit/Dev.to) ka data chala jaye.
        console.error(`StackOverflow API Error: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      
      // Return the raw array of items
      return data.items || [];
    } catch (error) {
      console.error(`StackOverflow Search Error: ${error.message}`);
      return [];
    }
  }

  /**
   * Normalizes the messy StackOverflow JSON into our clean DevFinds format
   */
  normalize(rawData) {
    if (!rawData || rawData.length === 0) return [];

    // Filter out garbage and map the good stuff
    return rawData
      .filter((post) => post.is_answered === true && post.answer_count > 0) // No BS filter: Only keep answered questions
      .map((post) => {
        return {
          title: post.title,
          url: post.link,
          source: this.name, // "StackOverflow"
          score: post.score, // Upvotes
          views: post.view_count,
          answers: post.answer_count,
          tags: post.tags,
          createdAt: new Date(post.creation_date * 1000).toISOString(), // SO returns UNIX timestamps in seconds, JS needs milliseconds
        };
      });
  }
}

module.exports = StackOverflowProvider;