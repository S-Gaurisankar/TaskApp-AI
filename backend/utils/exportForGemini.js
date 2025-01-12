const formatTasksForGemini = (tasks, promptType) => {
    if (!tasks || tasks.length === 0) {
        return "No tasks found matching your criteria.";
    }   

    let formattedResponse = "";

    switch (promptType) {
        case "highPriority":
            formattedResponse = "Here are your high priority tasks:\n";
            break;
        case "overdue":
            formattedResponse = "Here are your overdue tasks:\n";
            break;
        case "all":
            formattedResponse = "Here is a summary of all tasks:\n";
            break;
        case "due":
            formattedResponse = "Here are the tasks due on the specified date:\n"
            break;
        default:
            if (promptType.startsWith("department:")) {
                const department = promptType.split(":")[1].trim();
                formattedResponse = `Here are tasks from the ${department} department:\n`;
            } else {
                formattedResponse = "Here is the data:\n" + JSON.stringify(tasks, null, 2);
                return formattedResponse;
            }
    }

    tasks.forEach(task => {
        formattedResponse += `- [${task.task}] (${task.jira_ticket}) - Status: ${task.status}, Due: ${task.due_date}`;
        if (promptType === 'all' || promptType.startsWith("department:") || promptType === "due") {
            formattedResponse += `, Progress: ${task.progress_percentage}%`;
        }
        formattedResponse += '\n';
    });

    return formattedResponse;
}

module.exports = formatTasksForGemini;