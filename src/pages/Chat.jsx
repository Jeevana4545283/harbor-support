import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../lib/api.js";


import { getSessionId } from "../lib/session.js";

const sessionId = getSessionId();

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi, I'm Harbor's support assistant. What do you need help with?" },
  ]);
  const [input, setInput] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const data = await sendMessage({ message: text, sessionId, userEmail: email });
      setMessages((m) => [...m, { role: "bot", text: data.reply, meta: data }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "bot", error: true, text: "We couldn't reach support right now. Check your connection and send your message again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="chat">
      <div className="chat-head">
        <h1>Chat with support</h1>
        <label className="email">
          Email for ticket updates
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
      </div>

      <div className="chat-log" role="log" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role} ${m.error ? "error" : ""}`}>
            <p>{m.text}</p>
            {m.meta && (
              <div className="tags">
                <span className="tag">{m.meta.intent}</span>
                {m.meta.urgency === "high" && <span className="tag warn">urgent</span>}
                {m.meta.ticketId && <span className="tag warn">Ticket #{m.meta.ticketId} created</span>}
                {m.meta.escalated && !m.meta.ticketId && <span className="tag warn">Sent to a human agent</span>}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="bubble bot typing" aria-label="Assistant is typing"><i /><i /><i /></div>}
        <div ref={endRef} />
      </div>

      <div className="composer">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Describe your issue, e.g. How can I get a refund?"
          aria-label="Your message"
        />
        <button onClick={handleSend} disabled={loading || !input.trim()}>Send message</button>
      </div>
    </section>
  );
}
