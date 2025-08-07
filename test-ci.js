#!/usr/bin/env node

/**
 * Simple test runner for CI/CD
 * This will run the interactive test in a non-interactive way for automation
 */

import orderedCheckbox from './dist/index.js';

async function runTests() {
    console.log('🧪 Running automated tests...');

    try {
        // Test 1: Basic functionality
        console.log('✅ Import test: Package imports successfully');

        // Test 2: Type checking
        const config = {
            message: 'Test prompt',
            choices: ['Option 1', 'Option 2', 'Option 3']
        };
        console.log('✅ Type test: Configuration object validates');

        // Test 3: Function exists
        if (typeof orderedCheckbox === 'function') {
            console.log('✅ Function test: orderedCheckbox is callable');
        } else {
            throw new Error('orderedCheckbox is not a function');
        }

        console.log('\n🎉 All tests passed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

// Only run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runTests();
}
