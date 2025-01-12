require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');
const cors = require('cors');
const { parse } = require('date-fns');
const formatTasksForGemini = require('./utils/exportForGemini');
const fetchTasks = require('./utils/fetchTasks');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const TASKS_API_URL = process.env.TASKS_API;

app.post('/generate', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        if (!userPrompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        let tasks = null;
        let geminiFormattedResponse = "";
        let promptType = "";

        if (userPrompt.toLowerCase().includes("high priority")) {
            tasks = await fetchTasks({ priority: "Critical" });
            geminiFormattedResponse = formatTasksForGemini(tasks, "highPriority");
            promptType = "highPriority";
        } else if (userPrompt.toLowerCase().includes("overdue")) {
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            tasks = await fetchTasks({ due_date: { $lt: todayString }, status: { $ne: "Completed" } });
            geminiFormattedResponse = formatTasksForGemini(tasks, "overdue");
            promptType = "overdue";
        } else if (userPrompt.toLowerCase().includes("all tasks") || userPrompt.toLowerCase().includes("all the tasks")) {
            tasks = await fetchTasks();
            geminiFormattedResponse = formatTasksForGemini(tasks, "all");
            promptType = "all";
        } else if (userPrompt.toLowerCase().includes("department")) {
            const department = userPrompt.toLowerCase().split("department")[1].trim();
            tasks = await fetchTasks({ department: department });
            geminiFormattedResponse = formatTasksForGemini(tasks, `department:${department}`);
            promptType = `department:${department}`;
        }  else {
            tasks = await fetchTasks();
            geminiFormattedResponse = formatTasksForGemini(tasks, "other");
        }

        const geminiPrompt = `You are a task management assistant. Given the following task data:\n\n${geminiFormattedResponse}\n\nRespond to the user's prompt: ${userPrompt}\nIf the user's prompt is not related to tasks, respond with "I'm sorry, I cannot help with that."\nIf the prompt is unclear to you respond with "I'm sorry. Please be more specific and try again."`;

        const generationConfig = {
            temperature: 0.2,
            top_p: 0.95,
            top_k: 40,
            max_output_tokens: 8192,
        };

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: geminiPrompt }] }],
            generationConfig
        });

        const response = result.response.text();
        res.json({ response });

    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});