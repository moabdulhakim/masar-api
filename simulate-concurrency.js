const axios = require('axios');

const RIDE_ID = '57b5eb4d-610f-4c18-9fd4-f212dc292d0c';
const DRIVER_1_ID = '7448a874-197d-4f16-9f05-d11dc03780bf'; // Ahmed
const DRIVER_2_ID = '7e60b206-f982-4be2-bc38-b72016c56a1d'; // Omar

const BASE_URL = 'http://localhost:3000';

async function simulateRaceCondition() {
    console.log('🚀 Starting Race Condition Simulation...');

    const request1 = axios.post(`${BASE_URL}/api/v1/rides/${RIDE_ID}/accept/${DRIVER_1_ID}`);
    const request2 = axios.post(`${BASE_URL}/api/v1/rides/${RIDE_ID}/accept/${DRIVER_2_ID}`);

    try {
        const results = await Promise.allSettled([request1, request2]);

        results.forEach((result, index) => {
            const driver = index === 0 ? 'Ahmed' : 'Omar';
            if (result.status === 'fulfilled') {
                console.log(`✅ ${driver} WON the ride! Status: ${result.value.status}`);
            } else {
                console.log(`❌ ${driver} FAILED. Reason: ${result.reason.response?.data?.message || result.reason.message}`);
            }
        });

    } catch (error) {
        console.error('Unexpected Error:', error);
    }
}

simulateRaceCondition();

/*
[Running] node "...\simulate-concurrency.js"
🚀 Starting Race Condition Simulation...
❌ Ahmed FAILED. Reason: This ride is already taken or cancelled
✅ Omar WON the ride! Status: 201

[Done] exited with code=0 in 1.591 seconds
*/