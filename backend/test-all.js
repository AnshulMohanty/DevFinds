// DevFinds/backend/test-all.js
const StackOverflowProvider = require('./src/services/providers/StackOverflowProvider');
const DevToProvider = require('./src/services/providers/DevToProvider');
const RedditProvider = require('./src/services/providers/RedditProvider');

// Self-note: Yaha hum Promise.allSettled use kar rahe hain taaki agar koi ek API
// down ho (jaise Reddit), toh poora search fail na ho aur SO/Dev.to ka data aa jaye.

async function runMasterTest() {
  console.log('🚀 Initializing DevFinds Search Engine Core...\n');
  
  const providers = [
    new StackOverflowProvider(),
    new DevToProvider(),
    new RedditProvider()
  ];

  const query = 'jwt authentication nodejs';
  console.log(`📡 Searching the web for: "${query}"...\n`);

  // 1. Fire off all three requests concurrently (at the exact same time)
  const fetchPromises = providers.map(provider => provider.search(query));
  
  const startTime = Date.now();
  const results = await Promise.allSettled(fetchPromises);
  const endTime = Date.now();

  console.log(`⏱️  Fetch completed in ${endTime - startTime}ms\n`);

  let allCleanData = [];

  // 2. Loop through the results, normalize them, and combine them into one master array
  results.forEach((result, index) => {
    const provider = providers[index];
    
    if (result.status === 'fulfilled') {
      const rawData = result.value;
      const cleanData = provider.normalize(rawData);
      
      console.log(`✅ ${provider.name}: Fetched and cleaned ${cleanData.length} results.`);
      allCleanData = [...allCleanData, ...cleanData];
    } else {
      console.log(`❌ ${provider.name}: Failed to fetch data.`);
    }
  });

  // 3. Optional SDE touch: Sort the combined data by "score" (highest upvotes first)
  allCleanData.sort((a, b) => b.score - a.score);

  console.log(`\n🏆 --- TOP 3 MASTER RESULTS OUT OF ${allCleanData.length} ---`);
  console.log(allCleanData.slice(0, 3)); // Print top 3 combined results
}

// Execute
runMasterTest();
