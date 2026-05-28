import TextRotate from "../fancy/text/text-rotate";
import styles from "./Chat.module.css";

const greetings = [
  "Hello! How can I help you?",
  "Γεια! Πώς μπορώ να σε βοηθήσω;",
  "Hola! ¿Cómo puedo ayudarte?",
  "Bonjour! Comment puis-je vous aider?",
  "Ciao! Come posso aiutarti?",
  "Hallo! Wie kann ich dir helfen?",
];

export default function WelcomeMessage({ hasStarted }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div className={styles.Message} data-role="assistant">
        {hasStarted ? (
          <p style={{ margin: 0 }}>Hello! How can I help you?</p>
        ) : (
          <TextRotate
            texts={greetings}
            auto={true}
            rotationInterval={5000}
            splitBy="words"
            staggerDuration={0.08}
            staggerFrom="first"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.4 }}
          />
        )}
      </div>
    </div>
  );
}
