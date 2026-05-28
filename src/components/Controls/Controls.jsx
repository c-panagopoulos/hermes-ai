import styles from "./Controls.module.css";
import TextareaAutosize from "react-textarea-autosize";
import { useState, useRef, useEffect } from "react";

import { SendIcon } from "../animate-ui/icons/send";

export function Controls({ isDisabled = false, onSend }) {
  const textAreaRef = useRef(null);
  const [content, setContent] = useState("");
  const [sendAnimate, setSendAnimate] = useState(false);

useEffect(() => {
  if (!isDisabled) {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      textAreaRef.current.focus();
    }
  }
}, [isDisabled]);

  function handleContentChange(event) {
    setContent(event.target.value);
  }

  function handleContentSend() {
    if (content.length > 0) {
      setSendAnimate(true);
      setTimeout(() => setSendAnimate(false), 600);
      onSend(content);
      setContent("");
    }
  }

  function handleEnterPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleContentSend();
    }
  }

  return (
    <div className={styles.Controls}>
      <div className={styles.TextAreaContainer}>
        <TextareaAutosize
          className={styles.TextArea}
          placeholder="Type your message..."
          ref={textAreaRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleEnterPress}
          disabled={isDisabled}
          minRows={1}
          maxRows={4}
        />
      </div>
      <button
        className={styles.Button}
        disabled={isDisabled}
        onClick={handleContentSend}
        aria-label="Send message"
      >
        <SendIcon
          animate={sendAnimate}
          color="currentColor"
          strokeWidth={1.5}
        />
      </button>
    </div>
  );
}
