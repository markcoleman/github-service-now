# ServiceNow Change Request Node Application

This Node.js application creates and submits a change request on a ServiceNow instance using the Change Management API. It generates a change request with randomized planned dates and run-time–based descriptions, and then transitions the change request to the “Assesses” state.

## Prerequisites

- Node.js (v12 or later)
- npm
- A ServiceNow Developer instance (see below)
- VS Code (optional, for devcontainer support)
- Docker (for devcontainer)

## Setup

1. Clone the Repository

Clone this repository to your local machine.

2. Install Dependencies

Run the following command in the project directory:

```
npm install
```

3. Create a .env File

Create a .env file in the project root with the following content:

```bash
# .env
SN_API_KEY=your_actual_api_key_here
INSTANCE=your_instance_name_here  # e.g., dev182150.service-now.com
STATE_ASSESS=-4
```

Replace the values with your ServiceNow instance details and API key.

4. DevContainer Setup (Optional)

If you are using VS Code with DevContainers:

1. Install the Remote - Containers extension.
1. Ensure you have Docker installed.
1. Open the project in VS Code.
1. Press F1 and select Remote-Containers: Reopen in Container.
1. The container will build and open, using the provided configuration.

## Running the Application

To run the application, execute:

```bash
node submitChangeRequest.js
```

This will:
- Create a new change request in your ServiceNow instance with randomized planned start/end dates and descriptions.
- Transition the change request to the “Assesses” state (state value set to -4).

Creating a ServiceNow Dev Instance
1. Go to the ServiceNow Developer Site.
1. Sign up for a free developer account.
1. Once logged in, request a new personal developer instance.
1. Use the instance URL (e.g., dev182150.service-now.com) and set up API credentials as required.

What This Application Does
- Creates a Change Request:
Generates a change request with a unique description and planned dates.
- Submits for Assessment:
Updates the change request state to “Assesses” (state value -4) using the ServiceNow Change Management API.
- Configuration:
All configuration options (instance, API key, and state values) are managed via environment variables in the .env file and a separate configuration module.

Feel free to modify the code or configuration to suit your specific requirements.

Happy coding!