const axios = require('axios');

class TavilyProvider {
  async search(query) {
    try {
      if (!process.env.TAVILY_API_KEY) {
        console.warn("⚠️ TAVILY_API_KEY is missing. Skipping Meta-Search.");
        return [];
      }

      // Tavily is optimized specifically for LLM context retrieval
      const response = await axios.post('https://api.tavily.com/search', {
        api_key: process.env.TAVILY_API_KEY,
        query: query,
        search_depth: "advanced", // Deep scrape for high-quality context
        max_results: 6, // Top 6 best results from across the web
        include_answer: false // We will let Gemini generate the answer, not Tavily
      });

      return response.data.results || [];
    } catch (error) {
      console.error("Tavily Meta-Search Error:", error.message);
      return []; // Fails gracefully so StackOverflow can take over
    }
  }

  normalize(items) {
    return items.map(item => {
      // Extract the website name (e.g., 'github.com', 'react.dev') from the URL
      let domainName = 'web';
      try {
        domainName = new URL(item.url).hostname.replace('www.', '');
      } catch (e) { /* ignore invalid URLs */ }

      return {
        title: item.title,
        url: item.url,
        content: item.content, // This is the juicy context for Gemini
        source: domainName,
        score: Math.round((item.score || 0.5) * 100), // Convert Tavily's 0-1 score to 0-100
        comments: 0
      };
    });
  }
}

module.exports = TavilyProvider;