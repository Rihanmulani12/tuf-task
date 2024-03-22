import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Submitfrom.css";

const SubmitForm = () => {
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("");
  const [stdin, setStdin] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username: username,
      language: language,
      stdin: stdin,
      code: code,
    };

    try {
      const response = await fetch("https://tuf-backend-gh8r.onrender.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Submission successful:", data);
      navigate("/page2"); // Redirect to page2 after successful submission
    } catch (error) {
      console.error("Error submitting code snippet:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div class="input-group">
        <input
          className="input-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <div class="select-wrapper">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input"
          >
            <option value="">Select a language</option>
            <option value="c++">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>
      </div>
      <textarea
        className="input-std"
        value={stdin}
        onChange={(e) => setStdin(e.target.value)}
        placeholder="Standard Input"
      ></textarea>
      <textarea
        className="input-sourcecode"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Source Code"
      ></textarea>
      <button type="submit" className="button">
        Submit
      </button>
    </form>
  );
};

export default SubmitForm;
