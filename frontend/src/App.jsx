/* eslint-disable no-unused-vars */
import  { useState } from "react";
import { TASK_APP_API_URL } from "../.env";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(""); // Clear previous response

    try {
      // const res = await fetch("http://localhost:3000/generate", {
      const res = await fetch("https://taskappai.onrender.com/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data from API");
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      setResponse("Error: Unable to connect to the API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>AI Task Interface</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          style={{
            width: "100%",
            height: "100px",
            padding: "10px",
            fontSize: "16px",
          }}
        ></textarea>
        <br />
        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Generating..." : "Submit"}
        </button>
      </form>
      <div>
        <h2>Response:</h2>
        <pre
          style={{
            backgroundColor: "#f4f4f4",
            padding: "10px",
            borderRadius: "5px",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {response || "No response yet."}
        </pre>
      </div>
    </div>
  );
}

export default App;
