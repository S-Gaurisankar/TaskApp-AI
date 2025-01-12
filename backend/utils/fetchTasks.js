const fetch = require('node-fetch');
const TASKS_API_URL = process.env.TASKS_API;

const fetchTasks = async (query = '') => {
    try {
        const url = query ? `${TASKS_API_URL}/query?${new URLSearchParams(query)}` : TASKS_API_URL;
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status} ${response.statusText}: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return null;
    }
}

module.exports = fetchTasks;
