require('dotenv').config(); // Load environment variables from .env file
const axios = require('axios');

// Create an Axios instance for your ServiceNow Change Management API
const serviceNowClient = axios.create({
  baseURL: 'https://dev182150.service-now.com/api/sn_chg_rest/change',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-sn-apikey': process.env.SN_API_KEY,
  }
});

// Helper function to format a Date as "YYYY-MM-DD HH:mm:ss"
function formatDate(date) {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  const seconds = ('0' + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Generate random planned start and end dates
const now = new Date();
const randomStartOffset = Math.floor(Math.random() * 60); // 0-59 minutes offset
const plannedStartDate = new Date(now.getTime() + randomStartOffset * 60 * 1000);
const randomDuration = Math.floor(Math.random() * 30) + 1; // 1-30 minutes duration
const plannedEndDate = new Date(plannedStartDate.getTime() + randomDuration * 60 * 1000);

// Get the current run time for randomizing descriptions
const runTime = new Date().toISOString();

async function createChangeRequest() {
  // Define the payload for creating the change request
  const changeRequestData = {
    short_description: `Node.js Sample Change Request at ${runTime}`,
    description: `This change request was submitted via the Change Management API at ${runTime}.`,
    assignment_group: 'Help Desk',
    service: 'SAP Payroll',
    justification: 'We need this',
    implementation_plan: 'how to run it via node',
    risk_and_impact: 'hello world',
    backout_plan: 'back out',
    test_plan: 'Tested',
    planned_start_date: formatDate(plannedStartDate),
    planned_end_date: formatDate(plannedEndDate)
  };

  try {
    // Create the change request (POST)
    const response = await serviceNowClient.post('', changeRequestData);
    console.log('Change Request created successfully:', response.data);
    // Assuming the created record returns a sys_id in the response
    return response.data.result.sys_id;
  } catch (error) {
    console.error('Error creating Change Request:', error.response ? error.response.data : error.message);
    return null;
  }
}

async function submitChangeForApproval(sysId) {
  console.log(sysId)
  if (!sysId) {
    console.error('No sys_id provided to submit for approval.');
    return;
  }

  try {
    // Update the change request (PUT)
    const response = await serviceNowClient.patch(`/${sysId}`, {
      state: 0
    });
    console.log('Change Request submitted for approval:', response.data);
    const response2 = await serviceNowClient.patch(`/${sysId}`, {
      state: 2
    });
    console.log('Change Request submitted for approval:', response2.data);
  } catch (error) {
    console.error('Error submitting change for approval:', error.response ? error.response.data : error.message);
  }
}

// Create the change request and then submit it for approval
(async () => {
  const sysId = await createChangeRequest();
  await submitChangeForApproval(sysId.value);
})();