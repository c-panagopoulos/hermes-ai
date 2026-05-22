import { useState, useRef } from "react";
import FadeContent from "./FadeContent";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a14",
    display: "flex",
    justifyContent: "center",
    padding: "2.5rem 1rem",
  },
  container: {
    width: "100%",
    maxWidth: "580px",
  },
  label: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "1rem",
  },
  dropZone: (isDragging) => ({
    border: `1.5px dashed ${isDragging ? "rgba(59,130,246,0.8)" : "#1e3a5f"}`,
    borderRadius: "12px",
    padding: "2.5rem",
    textAlign: "center",
    cursor: "pointer",
    background: isDragging ? "rgba(59,130,246,0.05)" : "#111827",
    transition: "all 0.2s",
  }),
  cloudIcon: {
    fontSize: "36px",
    marginBottom: "0.5rem",
  },
  dropTitle: {
    color: "white",
    fontWeight: 500,
    margin: "0 0 4px",
    fontSize: "15px",
  },
  dropSub: {
    color: "#6b7280",
    fontSize: "13px",
    margin: "0 0 1rem",
  },
  badgesRow: {
    display: "flex",
    gap: "6px",
    justifyContent: "center",
  },
  badge: {
    fontSize: "11px",
    padding: "3px 8px",
    borderRadius: "99px",
    background: "rgba(59,130,246,0.08)",
    color: "rgba(59,130,246,0.8)",
    border: "0.5px solid #1e3a5f",
  },
  fileList: {
    marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  fileRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    background: "#111827",
    border: "0.5px solid #1e3a5f",
    borderRadius: "8px",
  },
  fileName: {
    flex: 1,
    fontSize: "13px",
    color: "white",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  fileSize: {
    fontSize: "12px",
    color: "#6b7280",
  },
};

const statusStyle = {
  loading: { color: "#6b7280", text: "Uploading…" },
  success: { color: "rgba(59,130,246,1)", text: "✓ Ingested" },
  error:   { color: "#f87171", text: "✗ Failed" },
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

    setFiles((prev) => [...prev, { id, name: file.name, size, status: "loading" }]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ingest`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const newStatus = response.ok ? "success" : "error";
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
      );
    } catch {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "error" } : f))
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
    <>
    <FadeContent blur={true} duration={700} easing="ease-out" initialOpacity={0}>
    <div style={styles.page}>
      <div style={styles.container}>
        <p style={styles.label}>
          Upload documents to the knowledge base. Supported: PDF, TXT.
        </p>

        <div
          style={styles.dropZone(isDragging)}
          onClick={() => fileInputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div style={styles.cloudIcon}>☁️</div>
          <p style={styles.dropTitle}>Drop files here to upload</p>
          <p style={styles.dropSub}>or click to browse from your computer</p>
          <div style={styles.badgesRow}>
            {["PDF", "TXT", "Max 10MB"].map((label) => (
              <span key={label} style={styles.badge}>{label}</span>
            ))}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files[0]; if (f) uploadFile(f); }}
        />

        {files.length > 0 && (
          <div style={styles.fileList}>
            {files.map((f) => (
              <div key={f.id} style={styles.fileRow}>
                <span>{getIcon(f.name)}</span>
                <span style={styles.fileName}>{f.name}</span>
                <span style={styles.fileSize}>{f.size}</span>
                <span style={{ fontSize: "12px", color: statusStyle[f.status].color }}>
                  {statusStyle[f.status].text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </FadeContent></>);
}