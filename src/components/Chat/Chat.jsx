import Markdown from 'react-markdown'
import styles from "./Chat.module.css";
import { Grid } from 'ldrs/react'
import 'ldrs/react/Grid.css'
import { useEffect, useRef } from 'react';

const WELCOME_MESSAGE= {
  role: "assistant",
  content: "Γεια! Πώς μπορώ να σε βοηθήσω;"
}

export function Chat({ messages, isLoading }) {
  const messagesEndRef = useRef(null)

  useEffect(() => {
   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages] )

  return (
    <div className={styles.Chat}>
      <div className={styles.Header}>
        <img src="/chat-bot2.png" alt="logo icon" />
      <header>Hermes AI Chatbot</header>
      </div>
      {[WELCOME_MESSAGE, ...messages].map(({ role, content }, index) => (
        <div key={index} className={styles.Message} data-role={role}>
          <Markdown>{content}</Markdown>
        </div>
      ))}
      {isLoading && (
  <div className={styles.TypingIndicator}>
    <Grid size="20" speed="1.5" color="white" />
    <span>Αναζητώ απάντηση...</span>
  </div>
)}
      <div ref={messagesEndRef}/>
    </div>
  );
}