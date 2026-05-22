import TextRotate from "../fancy/text/text-rotate";
import styles from "./Chat.module.css";

const greetings = [
  "Hello! How can I help you?",  // πρώτο = default
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
            staggerDuration={0.1}
            staggerFrom="first"
            transition={{ type: "spring", damping: 50, stiffness: 150 }}
          />
        )}
      </div>
    </div>
  );
}