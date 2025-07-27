#!/usr/bin/env node

// Quick test script to verify Nodit API connection
const axios = require('axios');
require('dotenv').config();

async function testNoditAPI() {
    const apiKey = process.env.NODIT_API_KEY;
    
    console.log('🧠 Testing Nodit API Connection...');
    console.log(`API Key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET'}`);
    
    if (!apiKey) {
        console.error('❌ NODIT_API_KEY not found in environment');
        process.exit(1);
    }
    
    // List of possible Nodit API endpoints to try
    const endpoints = [
        'https://api.nodit.io',
        'https://nodit.io/api',
        'https://api.noditlabs.com',
        'https://noditlabs.com/api',
        'https://web3-api.nodit.io'
    ];
    
    for (const baseUrl of endpoints) {
        console.log(`\n🔍 Testing endpoint: ${baseUrl}`);
        
        const testPaths = [
            '/v1/health',
            '/health',
            '/status',
            '/api/v1/health',
            '/api/health',
            '/'
        ];
        
        for (const path of testPaths) {
            try {
                console.log(`  Testing: ${baseUrl}${path}`);
                
                const response = await axios.get(`${baseUrl}${path}`, {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'X-API-KEY': apiKey,
                        'Content-Type': 'application/json'
                    },
                    timeout: 5000
                });
                
                console.log(`  ✅ Success! Status: ${response.status}`);
                if (response.data) {
                    console.log(`  Response:`, JSON.stringify(response.data, null, 2));
                }
                return; // Success, exit function
                
            } catch (error) {
                if (error.code === 'ENOTFOUND') {
                    console.log(`  ❌ DNS Error - endpoint not found`);
                    break; // Try next endpoint
                } else if (error.response) {
                    console.log(`  ⚠️  HTTP ${error.response.status}: ${error.response.statusText}`);
                    if (error.response.status === 401) {
                        console.log(`  (Authentication issue - API key might be invalid)`);
                    }
                } else {
                    console.log(`  ❌ ${error.message}`);
                }
            }
        }
    }
    
    console.log('\n❌ All endpoints failed. Please check:');
    console.log('1. Your internet connection');
    console.log('2. The Nodit API key is correct');
    console.log('3. The Nodit service is available');
    console.log('4. Check Nodit documentation for correct API endpoints');
}

// Run the test
testNoditAPI().catch(console.error);
