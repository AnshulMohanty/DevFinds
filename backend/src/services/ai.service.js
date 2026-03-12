const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateDeveloperAnswer = async (query, contextData, isProMode = false) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Optimization: Keeping instructions extremely tight to save tokens
    const systemInstruction = isProMode
      ? `Staff SDE Mode: Provide a bold TL;DR, Root Cause, Implementation (code block), and Trade-offs.`
      : `Dev Assistant Mode: Answer the query briefly using only the provided context.`;

    // CRITICAL: Trimming context to the top 3 results only to stay under Free Tier token limits
    const safeContextData = contextData.slice(0, 3);
    const contextString = safeContextData
      .map(d => `Source: ${d.source}\nContent: ${d.content.substring(0, 600)}`) // Trimming content length
      .join('\n\n');

    const prompt = `${systemInstruction}\n\nQuery: ${query}\n\nContext:\n${contextString}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("🔥 GEMINI API ERROR:", error.message);
    
    // UI-friendly message for quota issues
    if (error.message.includes('429')) {
      return "⚡ **Neural Engine Cooling Down.** You've reached the free tier rate limit. Please wait 30-60 seconds and try again.";
    }
    
    return `Synthesis Error: ${error.message}`;
  }
};

module.exports = { generateDeveloperAnswer };