require('dotenv').config(); // Load environment variables from .env file

const INSTANCE = process.env.INSTANCE || 'dev182150.service-now.com';
const API_KEY = process.env.SN_API_KEY || 'your_api_key_here';

// Export configuration constants
module.exports = {
  INSTANCE,
  API_KEY,
  BASE_URL: `https://${INSTANCE}/api/sn_chg_rest/change`,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-sn-apikey': API_KEY,
  },

  STATE_ASSESS: -4,
};