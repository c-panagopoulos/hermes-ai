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
        headers: {"Content-Type": "application/json"},
      })
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.log("failed to fetch history")
    }
  }
  fetchHistory()
}, [])

  const [messages, setMessages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

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
      body: JSON.stringify({ content, history: messages })
    })
    const data = await response.json()
    addMessage({ content: data.message, role: "assistant" });
  } catch (error) {
    addMessage({
      content: "Sorry, I couldn't process your request. Please try again!",
      role: "system",
    });
  } finally {
    setIsLoading(false);
  }
}

  return (
    <>
    <StarsBackground
      starColor="#FFF"
      className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]"
    />
    <div className={styles.App} style={{ width: '90%', maxWidth: '900px' }}>
      <header className={styles.Header}>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} isLoading={isLoading}/>
      </div>
      <Controls isDisabled={isLoading} onSend={handleContentSend} />
    </div>
    </>
  );
}

export default App;
