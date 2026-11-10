import { useState, useEffect } from "react";
import { Chat } from "./components/Chat/Chat";
import { Controls } from "./components/Controls/Controls";
import styles from "./App.module.css";
import { StarsBackground } from "./components/animate-ui/components/backgrounds/stars";

function App() {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    async function startSession() {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/session/start`,
        {
          method: "POST",
        },
      );
      const data = await response.json();
      setSessionId(data.sessionId);
    }
    startSession();
  }, []);

  const [messages, setMessages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isStreaming, setIsStreaming] = useState(false);

  const [hasEscalated, setHasEscalated] = useState(false);

  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  async function handleContentSend(content) {
    addMessage({ content, role: "user" });
    setIsLoading(true);
    setIsStreaming(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, history: messages, sessionId }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullMessage = "";
      let escalate = false;
      let firstToken = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text
          .split("\n")
          .filter((line) => line.startsWith("data: "));

        for (const line of lines) {
          const data = JSON.parse(line.replace("data: ", ""));

          if (data.done) {
            escalate = data.escalate;
          } else if (data.token) {
            fullMessage += data.token;

            if (firstToken) {
              setIsLoading(false);
              addMessage({ content: fullMessage, role: "assistant" });
              firstToken = false;
            } else {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  content: fullMessage,
                  role: "assistant",
                };
                return updated;
              });
            }
          }
        }
      }

      if (escalate) {
        setHasEscalated(true);
        // Webhook is skipped when VITE_WEBHOOK_URL is unset (n8n temporarily disabled).
        if (import.meta.env.VITE_WEBHOOK_URL) {
          const fullHistory = [
            ...messages,
            { content, role: "user" },
            { content: fullMessage, role: "assistant" },
          ];
          try {
            await fetch(`${import.meta.env.VITE_WEBHOOK_URL}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: fullMessage,
                history: fullHistory,
              }),
            });
          } catch (err) {
            console.error("Webhook failed:", err);
          }
        }
      }
    } catch (error) {
      addMessage({
        content: "Sorry, I couldn't process your request. Please try again!",
        role: "system",
      });
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  async function handleEndChat() {
    await fetch(`${import.meta.env.VITE_API_URL}/api/session/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, escalated: hasEscalated }),
    });

    setMessages([]);
    setSessionId(null);
    setHasEscalated(false);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/session/start`,
      {
        method: "POST",
      },
    );
    const data = await response.json();
    setSessionId(data.sessionId);
  }

  return (
    <>
      <StarsBackground
        starColor="#FFF"
        className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]"
        speed={90}
      />
      <div className={styles.App} style={{ width: "90%", maxWidth: "900px" }}>
        <header className={styles.Header}></header>
        <div className={styles.ChatContainer}>
          <Chat
            messages={messages}
            isLoading={isLoading}
            onEndChat={handleEndChat}
          />
        </div>
        <Controls
          isDisabled={isLoading || isStreaming}
          onSend={handleContentSend}
        />
      </div>
    </>
  );
}

export default App;
