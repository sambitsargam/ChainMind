#!/usr/bin/env node

// Development mode setup for ChainMind
console.log('🧠 ChainMind Development Setup');
console.log('================================');

// Check environment
require('dotenv').config();

const requiredEnvVars = [
    'NODIT_API_KEY',
    'OPENAI_API_KEY',
    'ETHEREUM_RPC_URL'
];

const optionalEnvVars = [
    'POLYGON_RPC_URL',
    'ARBITRUM_RPC_URL',
    'OPTIMISM_RPC_URL',
    'EXECUTOR_PRIVATE_KEY',
    'VAULT_ADDRESS',
    'EXECUTOR_ADDRESS'
];

console.log('\n📋 Environment Check:');
console.log('Required variables:');
requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
        console.log(`  ✅ ${envVar}: ${envVar.includes('KEY') ? value.substring(0, 10) + '...' : 'SET'}`);
    } else {
        console.log(`  ❌ ${envVar}: NOT SET`);
    }
});

console.log('\nOptional variables:');
optionalEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    if (value) {
        console.log(`  ✅ ${envVar}: ${envVar.includes('KEY') || envVar.includes('ADDRESS') ? value.substring(0, 10) + '...' : 'SET'}`);
    } else {
        console.log(`  ⚠️  ${envVar}: NOT SET (will use defaults)`);
    }
});

console.log('\n🚀 Next Steps:');
console.log('1. If you see any ❌ required variables, please add them to your .env file');
console.log('2. Get an OpenAI API key from: https://platform.openai.com/api-keys');
console.log('3. Get RPC URLs from: https://alchemy.com or https://infura.io');
console.log('4. Start the AI agent: npm run start:ai');
console.log('5. Start the frontend: npm run start:frontend');

console.log('\n📚 Nodit API Documentation:');
console.log('Check the official Nodit documentation for the correct API endpoints:');
console.log('- https://developer.nodit.io/docs');
console.log('- https://docs.nodit.io');
console.log('- GitHub: https://github.com/noditlabs');

console.log('\n🔧 Development Mode:');
console.log('The application can run in development mode with mock data');
console.log('if the Nodit API is not immediately available.');

console.log('\n✨ Ready to start development!');
