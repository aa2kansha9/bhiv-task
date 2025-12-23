const { LogicEngine, createExampleEngine } = require('./engine.js');

console.log('=== Logic Engine Usage Examples ===\n');

// Method 1: Use pre-configured example engine
console.log('1. Using pre-configured example engine:');
const engine = createExampleEngine();
const result = engine.evaluate({ temperature: 35, humidity: 50 });

console.log('Input:', { temperature: 35, humidity: 50 });
console.log('Result tags:', result.tags);
console.log('Result alerts:', result.alerts);
console.log('Result summary:', result.summary);
console.log('Full output:', JSON.stringify(result, null, 2));
console.log('\n---\n');

// Method 2: Create custom engine
console.log('2. Creating custom engine with rules:');
const customEngine = new LogicEngine();

// Add a threshold rule
customEngine.addRule({
    id: 'temp_monitor',
    name: 'Temperature Monitor',
    condition: {
        type: 'threshold',
        field: 'temperature',
        operator: 'greaterThan',
        threshold: 30
    },
    actions: {
        addTags: ['overheating'],
        raiseAlert: {
            message: 'Temperature too high',
            severity: 'high'
        }
    }
});

// Add a keyword rule
customEngine.addRule({
    id: 'urgent_detector',
    condition: {
        type: 'keyword',
        field: 'message',
        keywords: ['urgent', 'emergency'],
        match: 'any'
    },
    actions: {
        addTags: ['priority']
    }
});

// Evaluate data
const output = customEngine.evaluate({
    temperature: 35,
    message: 'System emergency detected'
});

console.log('Input:', { temperature: 35, message: 'System emergency detected' });
console.log('Output tags:', output.tags);
console.log('Output alerts:', output.alerts.map(a => a.message));
console.log('Rules triggered:', output.summary.triggeredRules);
console.log('\n=== Example Complete ===');