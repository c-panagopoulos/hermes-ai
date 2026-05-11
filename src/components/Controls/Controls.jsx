import styles from "./Controls.module.css";
import TextareaAutosize from "react-textarea-autosize";
import { useState, useRef, useEffect } from "react";

import { Send } from "../animate-ui/icons/send";

export function Controls({ isDisabled = false, onSend }) {
  const textAreaRef = useRef(null)
  const [content, setContent] = useState("");

  useEffect(()=> {
    if (!isDisabled) {
      textAreaRef.current.focus()
    }
  }, [isDisabled])

  function handleContentChange(event) {
    setContent(event.target.value);
  }

  function handleContentSend() {
    if (content.length > 0) {
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
          placeholder="Γράψε το ερώτημά σου..."
          ref={textAreaRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleEnterPress}
          disabled={isDisabled}
          minRows={1}
          maxRows={4}
        />
      </div>
      <button className={styles.Button}
        disabled={isDisabled}
        onClick={handleContentSend}
        >
        <Send animateOnHover />
      </button>
    </div>
  );
}


