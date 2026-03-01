class BaseProvider {
  constructor(name) {
    this.name = name;
    // Self-note: Ye base class/blueprint hai. Future me agar Hashnode ya GitHub API add karna hoga -> same structure 
  }

  /**
   * Fetches raw data from the external API.
   * @param {string} query - The search term from the user
   */
  async search(query) {
    throw new Error(`Method 'search()' must be implemented by the ${this.name} provider`);
  }

  /**
   * external API's messy JSON converts into our standard DevFinds format.
   * @param {Array} rawData - The raw array of results from the API
   */
  normalize(rawData) {
    throw new Error(`Method 'normalize()' must be implemented by the ${this.name} provider`);
  }
}

module.exports = BaseProvider;