const URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

// Mock used until the n8n workflow is ready (same shape as the real response)
function mockReply(message) {
  const m = message.toLowerCase();
  const urgent = /(urgent|charged twice|fraud|hacked)/.test(m);
  const bug = /(bug|error|crash|not working|broken)/.test(m);
  if (urgent)
    return { reply: "I've flagged this as urgent and passed it to a human agent. You'll hear back shortly.", intent: "billing", urgency: "high", escalated: true, ticketId: 102 };
  if (bug)
    return { reply: "Sorry about that. I've opened a ticket so our team can investigate.", intent: "bug", urgency: "medium", escalated: true, ticketId: 103 };
  return { reply: "You can request a refund within 30 days of purchase from Account > Orders > Request refund.", intent: "billing", urgency: "low", escalated: false, ticketId: null };
}

export async function sendMessage({ message, sessionId, userEmail }) {
  if (!URL) {
    await new Promise((r) => setTimeout(r, 900));
    return mockReply(message);
  }
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId, userEmail }),
  });
  if (!res.ok) throw new Error(`Support service returned ${res.status}`);
  return res.json();
}
