const { GoogleGenAI } = require('@google/genai');

// Initialize the new Google Gen AI SDK. It automatically picks up process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

/**
 * Synthesizes a developer-grade answer using strictly provided context (RAG)
 * @param {string} query - The user's original search query
 * @param {Array} contextData - The scraped data from Tavily and StackOverflow
 * @returns {Promise<string>} - The Markdown formatted answer
 */
const generateDeveloperAnswer = async (query, contextData) => {
  try {
    // 1. Format the raw scraped data into a readable string for the AI
    const contextString = contextData
      .slice(0, 8) // Only take the top 8 results to save tokens and keep it fast
      .map((item, index) => `[Source ${index + 1}: ${item.source}] Title: ${item.title}\nContent: ${item.content}`)
      .join('\n\n---\n\n');

    // 2. The User Prompt (What the user asked + the data we found)
    const prompt = `
      USER QUERY: "${query}"
      
      RETRIEVED WEB CONTEXT:
      ${contextString}
    `;

    // 3. Call Gemini 2.5 Flash (Optimized for speed and coding tasks)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // The "God-Tier" System Prompt to enforce strict SDE behavior
        systemInstruction: `You are an elite, no-nonsense Senior Staff Engineer answering a junior developer's question. 
        
        CRITICAL RULES:
        1. You MUST synthesize your answer using ONLY the 'RETRIEVED WEB CONTEXT' provided. 
        2. Do NOT use your outside training data to guess. If the answer or code is not in the context, you must strictly reply with: "Current web context does not contain a verified solution for this specific issue."
        3. Do NOT just summarize the articles. Deconstruct the problem, find the root cause, and provide the exact code fix found in the context.
        4. Cite your sources inline using [Source X].
        
        FORMAT YOUR RESPONSE STRICTLY AS FOLLOWS (using Markdown):
        ### The "Why"
        (1-2 sentences explaining the root cause of the issue or the core concept)
        
        ### The Optimal Solution
        (Brief explanation of how to fix it or implement it)
        
        ### Production-Ready Code
        (The exact code block snippet using markdown code fences. Include the language tag.)
        
        ### Edge Cases / Warnings
        (Any warnings, deprecations, or edge cases mentioned in the context. If none, omit this section.)`,
        temperature: 0.2, // Low temperature ensures highly deterministic, factual output (less "creative" guessing)
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini AI Synthesis Error:", error);
    return "The AI engine is currently unavailable. Please refer to the source links below.";
  }
};

module.exports = { generateDeveloperAnswer };