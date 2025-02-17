const axios = require('axios');
const config = require('./config');

// Create an Axios instance for the ServiceNow Change Management API
const serviceNowClient = axios.create({
  baseURL: config.BASE_URL,
  headers: config.HEADERS,
});

/**
 * Format a Date object as "YYYY-MM-DD HH:mm:ss"
 * @param {Date} date 
 * @returns {string}
 */
const formatDate = (date) => {
  const pad = (n) => ('0' + n).slice(-2);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

/**
 * Generates random planned start and end dates.
 * @returns {{ plannedStartDate: string, plannedEndDate: string }}
 */
const generatePlannedDates = () => {
  const now = new Date();
  const randomStartOffset = Math.floor(Math.random() * 60); // 0-59 minutes offset
  const plannedStart = new Date(now.getTime() + randomStartOffset * 60 * 1000);
  const randomDuration = Math.floor(Math.random() * 30) + 1; // 1-30 minutes duration
  const plannedEnd = new Date(plannedStart.getTime() + randomDuration * 60 * 1000);
  return {
    plannedStartDate: formatDate(plannedStart),
    plannedEndDate: formatDate(plannedEnd),
  };
};

/**
 * Creates a new change request.
 * @returns {Promise<string|null>} Returns the sys_id if successful, or null on failure.
 */
const createChangeRequest = async () => {
  const { plannedStartDate, plannedEndDate } = generatePlannedDates();
  const runTime = new Date().toISOString();

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
    planned_start_date: plannedStartDate,
    planned_end_date: plannedEndDate,
  };

  try {
    const response = await serviceNowClient.post('', changeRequestData);
    console.info('Change Request created successfully:', response.data);
    // Return the sys_id from the created record (adjust the path if necessary)
    return response.data.result.sys_id.value;
  } catch (error) {
    console.error('Error creating Change Request:', error.response ? error.response.data : error.message);
    return null;
  }
};

/**
 * Submits the change request for assessment by updating its state.
 * @param {string} sysId 
 * @param {number} stateValue - The state value to set (default is STATE_ASSESS from config)
 * @returns {Promise<boolean>} Returns true if successful.
 */
const submitChangeForAssessment = async (sysId, stateValue = config.STATE_ASSESS) => {
  if (!sysId) {
    console.error('No sys_id provided to update state.');
    return false;
  }

  try {
    const response = await serviceNowClient.patch(`/${sysId}`, { state: stateValue });
    console.info(`Change Request transitioned to state ${stateValue}:`, response.data);
    return true;
  } catch (error) {
    console.error('Error transitioning change state:', error.response ? error.response.data : error.message);
    return false;
  }
};

/**
 * Main function to create a change request and then submit it for assessment.
 */
const main = async () => {
  try {
    const sysId = await createChangeRequest();
    if (!sysId) {
      console.error('Change request creation failed. Aborting.');
      return;
    }
    await submitChangeForAssessment(sysId);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
};

main();