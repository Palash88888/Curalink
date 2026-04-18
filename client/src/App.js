import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [publications, setPublications] = useState([]);
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const API_URL = "https://curalink-backend.onrender.com/api/chat"; 
  // 🔥 CHANGE ONLY THIS FOR DEPLOYMENT

  const suggestions = [
    "Latest treatment for lung cancer",
    "Clinical trials for diabetes",
    "Top researchers in Alzheimer's disease",
    "Recent studies on heart disease"
  ];

  // AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // SEND MESSAGE
  const sendMessage = async (customInput) => {
    const finalInput = customInput || input;
    if (!finalInput) return;

    setMessages((prev) => [...prev, { role: "user", text: finalInput }]);
    setHistory((prev) => [finalInput, ...prev.slice(0, 5)]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query: finalInput }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.response }
      ]);

      setPublications(data.publications || []);
      setTrials(data.trials || []);

    } catch (err) {
      console.log(err);

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Error connecting to server" }
      ]);
    }

    setLoading(false);
  };

  const newSession = () => {
    setMessages([]);
    setPublications([]);
    setTrials([]);
    setInput("");
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>🧬 Curalink</h2>

        <button className="new-btn" onClick={newSession}>
          + New Session
        </button>

        <div className="history">
          <p>Recent</p>
          {history.map((h, i) => (
            <div key={i} onClick={() => sendMessage(h)}>
              {h}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div className="main">

        <h1>Curalink Research</h1>

        {/* SUGGESTIONS */}
        <div className="suggestions">
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>

        {/* CHAT */}
        <div className="chat-box">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`}>
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="msg bot typing">
              <span></span><span></span><span></span>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* INPUT */}
        <div className="input-bar">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask medical question..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={() => sendMessage()}>➤</button>
        </div>

        {/* PUBLICATIONS */}
        <div className="cards">
          {publications.map((p, i) => (
            <div key={i} className="card">
              <h3>{p.title}</h3>
              <p>{p.abstract?.slice(0, 100)}...</p>
              <p><b>{p.year}</b> | {p.source}</p>
            </div>
          ))}
        </div>

        {/* TRIALS */}
        <div className="cards">
          {trials.map((t, i) => (
            <div key={i} className="card">
              <h3>{t.title}</h3>
              <p>{t.status}</p>
              <p>{t.location}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;