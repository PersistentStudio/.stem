import StemCore from "./stemcore";

// Initialize the core
const stemCore = StemCore.getInstance('your-api-key');

// Login
await stemCore.login('user@example.com', 'password');

// Create a learning path
const learningPath = await stemCore.createLearningPath(['math.stem', 'cs.stem']);

// Listen for achievements
stemCore.on('achievement:award', (achievement) => {
  console.log(`New achievement earned: ${achievement.title}`);
});

// Update progress
await stemCore.updateProgress('math.stem', 'calculus-101', 0.75);