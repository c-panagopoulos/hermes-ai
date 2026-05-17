import { useState, useEffect } from "react";
import { Chat } from "./components/Chat/Chat";
import { Controls } from "./components/Controls/Controls";
import styles from "./App.module.css";
import { StarsBackground } from "./components/animate-ui/components/backgrounds/stars";

function App() {
  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await fetch("http://localhost:3000/api/history", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.log("failed to fetch history");
      }
    }
    fetchHistory();
  }, []);

  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    async function startSession() {
      const response = await fetch("http://localhost:3000/api/session/start", {
        method: "POST",
      });
      const data = await response.json();
      setSessionId(data.sessionId);
    }
    startSession();
  }, []);

  const [messages, setMessages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [hasEscalated, setHasEscalated] = useState(false);

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  async function handleContentSend(content) {
    addMessage({ content, role: "user" });
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, history: messages, sessionId }),
      });
      const data = await response.json();
      addMessage({ content: data.message, role: "assistant" });

      if (data.escalate) {
        setHasEscalated(true);
        const fullHistory = [
          ...messages,
          { content, role: "user" },
          { content: data.message, role: "assistant" },
        ];
        try {
          await fetch(
            "https://fedora.osiris-darter.ts.net:8444/webhook/fbecaa32-bac1-44f8-8dfe-56c6be91fd3c",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: data.message,
                history: fullHistory,
              }),
            },
          );
        } catch (err) {
          console.error("Webhook failed:", err);
        }
      }
    } catch (error) {
      addMessage({
        content: "Sorry, I couldn't process your request. Please try again!",
        role: "system",
      });
    } finally {
      setIsLoading(false);
    }
  }

async function handleEndChat() {
  await fetch("http://localhost:3000/api/session/end", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, escalated: hasEscalated }),
  });
  // Reset state
  setMessages([]);
  setSessionId(null);
  setHasEscalated(false);
  // Ξεκίνα νέο session
  const response = await fetch("http://localhost:3000/api/session/start", {
    method: "POST",
  });
  const data = await response.json();
  setSessionId(data.sessionId);
}

  return (
    <>
      <StarsBackground
        starColor="#FFF"
        className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]"
      />
      <div className={styles.App} style={{ width: "90%", maxWidth: "900px" }}>
        <header className={styles.Header}></header>
        <div className={styles.ChatContainer}>
          <Chat messages={messages} isLoading={isLoading} />
        </div>
        <Controls isDisabled={isLoading} onSend={handleContentSend} />
        <button
          onClick={handleEndChat}
          style={{
            position: "relative",
            zIndex: 10,
            color: "white",
            background: "red",
            padding: "8px 16px",
          }}
        >
          End Chat
        </button>
      </div>
    </>
  );
}

export default App;
