import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { chatAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const msgs = await chatAPI.getMessages(conversationId);
        setMessages(msgs);

        const socket = io(SOCKET_URL);
        socketRef.current = socket;
        socket.emit("joinConversation", conversationId);

        socket.on("newMessage", (message) => {
          setMessages((prev) => {
            const exists = prev.some((m) => m._id === message._id);
            return exists ? prev : [...prev, message];
          });
        });
      } catch {
        setError("Failed to load chat.");
      } finally {
        setLoading(false);
      }
    };

    init();
    return () => { socketRef.current?.disconnect(); };
  }, [conversationId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const textToSend = text;
    setText("");
    setSending(true);
    try {
      const message = await chatAPI.sendMessage(conversationId, textToSend);
      setMessages((prev) => [...prev, message]);
      if (socketRef.current?.connected) {
        socketRef.current.emit("sendMessage", { conversationId, message });
      }
    } catch {
      setError("Failed to send message.");
      setText(textToSend);
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border text-success" />
    </div>
  );

  return (
    <div className="d-flex flex-column" style={{ height: "calc(100vh - 76px)" }}>
      {/* Header */}
      <div className="card border-0 border-bottom rounded-0 px-4 py-3 d-flex flex-row align-items-center gap-3">
        <button
          onClick={() => navigate("/inbox")}
          className="btn btn-link text-success p-0 text-decoration-none fw-medium"
        >
          ← Back
        </button>
        <h6 className="fw-semibold mb-0">Chat</h6>
      </div>

      {/* Messages */}
      <div
        className="flex-grow-1 overflow-auto px-3 py-4"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        {error && <div className="alert alert-danger small">{error}</div>}

        {messages.length === 0 ? (
          <div className="text-center text-muted py-5">
            <p>No messages yet. Say hi! 👋</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2 mx-auto" style={{ maxWidth: 640 }}>
            {messages.map((msg) => {
              const isOwn = msg.senderId === user?.id;
              return (
                <div
                  key={msg._id}
                  className={`d-flex ${isOwn ? "justify-content-end" : "justify-content-start"}`}
                >
                  <div
                    style={{
                      maxWidth: "70%",
                      wordBreak: "break-word",
                      padding: "10px 14px",
                      borderRadius: isOwn ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                      backgroundColor: isOwn
                        ? "var(--color-primary)"
                        : "var(--color-surface)",
                      color: isOwn ? "#fff" : "var(--color-text)",
                      border: isOwn ? "none" : "1px solid var(--color-border)",
                    }}
                  >
                    <p className="mb-0 small">{msg.text}</p>
                    <p
                      className="mb-0 mt-1"
                      style={{
                        fontSize: "0.7rem",
                        opacity: 0.7,
                        color: isOwn ? "#fff" : "var(--color-text-secondary)",
                      }}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="border-top px-3 py-3"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <form
          onSubmit={handleSend}
          className="d-flex gap-2 mx-auto"
          style={{ maxWidth: 640 }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sending}
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="btn btn-success px-4 fw-semibold"
          >
            {sending ? <span className="spinner-border spinner-border-sm" /> : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;