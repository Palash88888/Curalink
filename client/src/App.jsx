
import React, { useState } from 'react';

export default function App() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const sendMessage = async () => {
    const res = await fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    setReply(data.reply);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Curalink AI </h1>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <p>{reply}</p>
    </div>
  );
}
