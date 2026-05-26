import Markdown from "react-markdown";
import styles from "./Chat.module.css";
import { Grid } from "ldrs/react";
import "ldrs/react/Grid.css";
import { useEffect, useRef } from "react";
import AnimatedContent from "../ui/AnimatedContent";
import { CircleX } from "../animate-ui/icons/circle-x";
import WelcomeMessage from "./WelcomeMessage";

export function Chat({ messages, isLoading, onEndChat }) {
  const messagesEndRef = useRef(null);
  const hasStarted = messages.length > 0;

  const chatRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.Chat}>
      <div className={styles.Header}>
        <header>
          <img src="/chat-bot6.png" alt="Hermes logo" />
        </header>

        <button
          className={styles.endChat}
          onClick={onEndChat}
          aria-label="End chat"
        >
          <CircleX animateOnHover color="currentColor" strokeWidth={1.5} />
        </button>
      </div>
      <div className={styles.Divider} />

      <WelcomeMessage hasStarted={hasStarted} />

      {[...messages].map(({ role, content }, index) => (
        <AnimatedContent
          key={index}
          distance={30}
          direction="vertical"
          reverse={false}
          duration={0.4}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          style={{
            display: "flex",
            justifyContent: role === "user" ? "flex-end" : "flex-start",
          }}
        >
          <div className={styles.Message} data-role={role}>
            <Markdown>{content}</Markdown>
          </div>
        </AnimatedContent>
      ))}

      {isLoading && (
        <div className={styles.TypingIndicator}>
          <Grid size="20" speed="1.5" color="white" />
          <span>Αναζητώ απάντηση...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
