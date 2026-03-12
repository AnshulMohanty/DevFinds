class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let current = this.root;
    for (let char of word.toLowerCase()) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    current.isEndOfWord = true;
  }

  // DFS to find all words from a given node
  _findWords(node, prefix, results) {
    if (results.length >= 5) return; // Limit to 5 suggestions
    if (node.isEndOfWord) results.push(prefix);
    
    for (let char in node.children) {
      this._findWords(node.children[char], prefix + char, results);
    }
  }

  suggest(prefix) {
    if (!prefix) return [];
    let current = this.root;
    let lowerPrefix = prefix.toLowerCase();
    
    for (let char of lowerPrefix) {
      if (!current.children[char]) return [];
      current = current.children[char];
    }
    
    let results = [];
    this._findWords(current, lowerPrefix, results);
    return results;
  }
}

export default Trie;