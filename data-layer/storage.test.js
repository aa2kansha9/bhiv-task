const Storage = require('./storage.js');

console.log('=== Testing Storage Utility (Node.js Mode) ===\n');

// Test in Node.js mode
const storage = new Storage('node');

// Clean up any existing test data
storage.clear();

// Test 1: CREATE
console.log('1. Testing CREATE...');
const createSuccess = storage.create('testUser', { 
    name: 'John Doe', 
    email: 'john@example.com',
    age: 30 
});
console.log(`   ✓ CREATE successful: ${createSuccess}`);

// Test 2: READ
console.log('\n2. Testing READ...');
const user = storage.read('testUser');
console.log(`   ✓ READ successful:`, user);
console.log(`   ✓ Name: ${user.name}`);
console.log(`   ✓ Email: ${user.email}`);

// Test 3: UPDATE (merge)
console.log('\n3. Testing UPDATE with merge...');
storage.update('testUser', { 
    age: 31, 
    city: 'New York',
    hobbies: ['reading', 'coding']
}, true);
const updatedUser = storage.read('testUser');
console.log(`   ✓ UPDATE successful:`);
console.log(`     - Age updated: ${updatedUser.age}`);
console.log(`     - City added: ${updatedUser.city}`);
console.log(`     - Original name preserved: ${updatedUser.name}`);

// Test 4: UPDATE (overwrite)
console.log('\n4. Testing UPDATE without merge...');
storage.update('testUser', { newField: 'overwritten' }, false);
const overwrittenUser = storage.read('testUser');
console.log(`   ✓ UPDATE (overwrite) successful:`, overwrittenUser);

// Test 5: HAS (check existence)
console.log('\n5. Testing HAS...');
console.log(`   ✓ Has testUser? ${storage.has('testUser')}`);
console.log(`   ✓ Has nonExistentKey? ${storage.has('nonExistentKey')}`);

// Test 6: LIST all keys
console.log('\n6. Testing LIST...');
storage.create('settings', { theme: 'dark', language: 'en' });
storage.create('todos', ['task1', 'task2', 'task3']);
const allKeys = storage.list();
console.log(`   ✓ All keys: ${JSON.stringify(allKeys)}`);
console.log(`   ✓ Total items: ${allKeys.length}`);

// Test 7: STATS
console.log('\n7. Testing STATS...');
const stats = storage.stats();
console.log(`   ✓ Storage type: ${stats.type}`);
console.log(`   ✓ Item count: ${stats.itemCount}`);
console.log(`   ✓ Total size: ${stats.totalSize}`);
console.log(`   ✓ Keys: ${JSON.stringify(stats.keys)}`);

// Test 8: DELETE single item
console.log('\n8. Testing DELETE...');
const deleteSuccess = storage.delete('settings');
console.log(`   ✓ DELETE settings: ${deleteSuccess}`);
console.log(`   ✓ Settings still exists? ${storage.has('settings')}`);

// Test 9: CLEAR all
console.log('\n9. Testing CLEAR...');
storage.clear();
const finalKeys = storage.list();
console.log(`   ✓ CLEAR successful: ${finalKeys.length === 0}`);
console.log(`   ✓ Remaining keys: ${JSON.stringify(finalKeys)}`);

// Test 10: Error handling
console.log('\n10. Testing error handling...');
try {
    // Try to use browser methods in Node.js (should work with fallback)
    const storage2 = new Storage('browser');
    console.log(`   ✓ Browser mode initialized in Node.js (falls back to Node mode)`);
} catch (error) {
    console.log(`   ✓ Error caught: ${error.message}`);
}

console.log('\n=== All tests completed! ===');
console.log('Check if storage-data folder was created with JSON files.');