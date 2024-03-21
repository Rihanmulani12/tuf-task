import React, { useState, useEffect } from "react";
import "./Snippetlist.css";

const SnippetList = () => {
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch("http://localhost:3001/snippets");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSnippets(data);
      } catch (error) {
        console.error("Error fetching code snippets:", error);
      }
    };

    fetchSnippets();
  }, []);

  return (
    <div className="submission-list">
      {snippets.map((snippet, index) => (
        <div className="submission-item" key={index}>
          <div className="item-header">
            <span className="username">{snippet.username}</span>
            <span className="language">{snippet.language}</span>
          </div>
          <div className="item-content">
            <div className="content-row">
              <span className="label">Standard Input:</span>
              <span className="value">{snippet.stdin}</span>
            </div>
            <div className="content-row">
              <span className="label">Code Snippet:</span>
              <span className="value">{snippet.codeSnippet}</span>
            </div>
            <div className="content-row">
              <span className="label">Timestamp:</span>
              <span className="value">{snippet.timestamp}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SnippetList;
