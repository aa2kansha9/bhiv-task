const { LogicEngine, createExampleEngine, exampleRules } = require('./engine.js');
const testData = require('./tests.json');

console.log('=== Logic Engine Test Runner ===\n');

// Test 1: Basic engine creation
console.log('1. Testing basic engine creation...');
const engine = createExampleEngine();
console.log(`   Loaded ${engine.rules.length} rules\n`);

// Test 2: Run test cases from tests.json
console.log('2. Running test cases from tests.json...\n');

testData.testCases.forEach((testCase, index) => {
    console.log(`   Test: ${testCase.name}`);
    console.log(`   Input: ${JSON.stringify(testCase.input)}`);
    
    // Create a fresh engine for each test
    const testEngine = createExampleEngine();
    
    // Add any custom rules specified in the test
    if (testCase.rulesToAdd) {
        testCase.rulesToAdd.forEach(rule => testEngine.addRule(rule));
    }
    
    // Run evaluation
    const result = testEngine.evaluate(testCase.input);
    
    // Check results
    let passed = true;
    const issues = [];
    
    // Check tags
    const expectedTags = testCase.expectedTags || [];
    const actualTags = result.tags || [];
    
    if (expectedTags.length !== actualTags.length) {
        passed = false;
        issues.push(`Tags count mismatch: expected ${expectedTags.length}, got ${actualTags.length}`);
    } else {
        for (const tag of expectedTags) {
            if (!actualTags.includes(tag)) {
                passed = false;
                issues.push(`Missing tag: ${tag}`);
                break;
            }
        }
    }
    
    // Check alerts
    if (result.alerts.length !== (testCase.expectedAlerts || 0)) {
        passed = false;
        issues.push(`Alerts count mismatch: expected ${testCase.expectedAlerts}, got ${result.alerts.length}`);
    }
    
    // Check triggered rules
    if (result.summary.triggeredRules !== (testCase.expectedTriggeredRules || 0)) {
        passed = false;
        issues.push(`Triggered rules mismatch: expected ${testCase.expectedTriggeredRules}, got ${result.summary.triggeredRules}`);
    }
    
    console.log(`   Result: ${passed ? '✅ PASS' : '❌ FAIL'}`);
    if (!passed) {
        console.log(`   Issues: ${issues.join(', ')}`);
    }
    console.log(`   Summary: ${result.summary.triggeredRules} rules triggered, ${result.tags.length} tags, ${result.alerts.length} alerts`);
    console.log('   ---\n');
});

// Test 3: Manual test
console.log('3. Running manual test...\n');
const manualEngine = new LogicEngine();

// Add a custom rule
manualEngine.addRule({
    id: 'manual_test',
    condition: {
        type: 'threshold',
        field: 'count',
        operator: 'greaterThan',
        threshold: 5
    },
    actions: {
        addTags: ['count-high'],
        raiseAlert: {
            message: 'Count exceeded threshold',
            severity: 'low'
        }
    }
});

const manualResult = manualEngine.evaluate({ count: 10, name: 'test-item' });
console.log('   Manual test input: { count: 10, name: "test-item" }');
console.log('   Result tags:', manualResult.tags);
console.log('   Result alerts:', manualResult.alerts.length > 0 ? 'Alert generated' : 'No alerts');
console.log('   Full result summary:', JSON.stringify(manualResult.summary, null, 2));

console.log('\n=== All Tests Complete ===');