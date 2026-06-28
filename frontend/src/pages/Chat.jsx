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

        // Connect socket
        const socket = io(SOCKET_URL);
        socketRef.current = socket;

        socket.emit("joinConversation", conversationId);

        socket.on("newMessage", (message) => {
          setMessages((prev) => {
            // Avoid duplicate if we already added it optimistically
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

    return () => {
      socketRef.current?.disconnect();
    };
  }, [conversationId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const textToSend = text;
    setText("");
    setSending(true);

    try {
      // Always persist via HTTP first — this is the source of truth
      const message = await chatAPI.sendMessage(conversationId, textToSend);

      // Add to own view immediately
      setMessages((prev) => [...prev, message]);

      // Emit via socket so the other person gets it in real time
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

  if (loading) return <div className="d-flex justify-content-center py-5"><div className="spinner-border text-success" /></div>;

  return (
    <div className="d-flex flex-column" style={{ height: "calc(100vh - 60px)" }}>
      {/* Header */}
      <div className="bg-white border-bottom px-4 py-3 d-flex align-items-center gap-3">
        <button onClick={() => navigate("/inbox")} className="btn btn-link text-success p-0">
          ← Back
        </button>
        <h6 className="fw-semibold mb-0">Chat</h6>
      </div>

      {/* Messages */}
      <div className="flex-grow-1 overflow-auto px-3 py-4" style={{ background: "#f8f9fa" }}>
        {error && <div className="alert alert-danger small">{error}</div>}

        {messages.length === 0 ? (
          <div className="text-center text-muted py-5">
            <p>No messages yet. Say hi! 👋</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-2 max-w-lg mx-auto" style={{ maxWidth: 640 }}>
            {messages.map((msg) => {
              const isOwn = msg.senderId === user?.id;
              return (
                <div key={msg._id} className={`d-flex ${isOwn ? "justify-content-end" : "justify-content-start"}`}>
                  <div
                    className={`px-3 py-2 rounded-3 ${isOwn ? "bg-success text-white" : "bg-white border"}`}
                    style={{ maxWidth: "70%", wordBreak: "break-word" }}
                  >
                    <p className="mb-0 small">{msg.text}</p>
                    <p className={`mb-0 mt-1 small ${isOwn ? "text-white opacity-75" : "text-muted"}`} style={{ fontSize: "0.7rem" }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
      <div className="bg-white border-top px-3 py-3">
        <form onSubmit={handleSend} className="d-flex gap-2" style={{ maxWidth: 640, margin: "0 auto" }}>
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
            className="btn btn-success px-4"
          >
            {sending ? <span className="spinner-border spinner-border-sm" /> : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;