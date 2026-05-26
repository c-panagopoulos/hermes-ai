import { useState, useRef } from "react";
import FadeContent from "../ui/FadeContent";
import styles from "./Documents.module.css";

const statusStyle = {
  loading: { className: styles.statusLoading, text: "Uploading…" },
  success: { className: styles.statusSuccess, text: "✓ Ingested" },
  error: { className: styles.statusError, text: "✗ Failed" },
};

export default function Documents() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  async function uploadFile(file) {
    const id = Date.now() + Math.random();
    const size =
      file.size < 1024 * 1024
        ? Math.round(file.size / 1024) + " KB"
        : (file.size / 1024 / 1024).toFixed(1) + " MB";

    setFiles((prev) => [
      ...prev,
      { id, name: file.name, size, status: "loading" },
    ]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ingest`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
      const newStatus = response.ok ? "success" : "error";
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f)),
      );
    } catch {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "error" } : f)),
      );
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  const getIcon = (name) =>
    name.split(".").pop().toLowerCase() === "pdf" ? "📄" : "📝";

  return (
    <FadeContent
      blur={true}
      duration={700}
      easing="ease-out"
      initialOpacity={0}
    >
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.label}>
            Upload documents to the knowledge base. Supported: PDF, TXT.
          </p>

          <div
            className={`${styles.dropZone} ${isDragging ? styles.dragging : ""}`}
            onClick={() => fileInputRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className={styles.cloudIcon}>☁️</div>
            <p className={styles.dropTitle}>Drop files here to upload</p>
            <p className={styles.dropSub}>
              or click to browse from your computer
            </p>
            <div className={styles.badgesRow}>
              {["PDF", "TXT", "Max 10MB"].map((label) => (
                <span key={label} className={styles.badge}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files[0];
              if (f) uploadFile(f);
            }}
          />

          {files.length > 0 && (
            <div className={styles.fileList}>
              {files.map((f) => (
                <div key={f.id} className={styles.fileRow}>
                  <span>{getIcon(f.name)}</span>
                  <span className={styles.fileName}>{f.name}</span>
                  <span className={styles.fileSize}>{f.size}</span>
                  <span className={statusStyle[f.status].className}>
                    {statusStyle[f.status].text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FadeContent>
  );
}
