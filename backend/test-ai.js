require('dotenv').config();

async function checkAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ ERROR: No GEMINI_API_KEY found in your .env file.");
    return;
  }

  console.log("Scanning Google AI Studio for authorized models...\n");

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (data.error) {
      console.error("❌ GOOGLE API REJECTED THE KEY:");
      console.error(data.error.message);
      return;
    }

    // Filter only for models that support text generation (which is what we need)
    const textModels = data.models.filter(m => 
      m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")
    );

    console.log("✅ YOUR KEY CAN USE THESE EXACT MODEL NAMES:");
    console.log("-------------------------------------------------");
    textModels.forEach(m => {
      // Stripping the "models/" prefix so we get the exact string needed for our code
      const exactName = m.name.replace('models/', '');
      console.log(`"${exactName}"`);
    });
    console.log("-------------------------------------------------\n");

  } catch (err) {
    console.error("❌ Network failure:", err.message);
  }
}

checkAvailableModels();