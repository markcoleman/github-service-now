require('dotenv').config(); // Load environment variables from .env file
const axios = require('axios');

// Create an Axios instance for your ServiceNow Change Management API
const serviceNowClient = axios.create({
  baseURL: 'https://dev182150.service-now.com/api/sn_chg_rest/change',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-sn-apikey': process.env.SN_API_KEY, // API key read from the environment variable
  }
});

async function getChangeRequestBySysId(sysId) {
  try {
    // Append the sys_id to the base URL to fetch that record
    const response = await serviceNowClient.get(`/${sysId}`);
    console.log('Change Request:', response.data);
  } catch (error) {
    console.error('Error fetching change request:', error.response ? error.response.data : error.message);
  }
}

// Replace with your actual sys_id
getChangeRequestBySysId('fdeb2205c3331210578d1533e40131a9');