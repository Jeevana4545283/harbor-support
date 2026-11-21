
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { getSessionId } from "../lib/session.js";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTickets() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("tickets")
        .select("id, message, intent, urgency, status, created_at")
        .eq("session_id", getSessionId())
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setTickets(data || []);
      }

      setLoading(false);
    }

    fetchTickets();
  }, []);

  if (loading) {
    return <section className="placeholder">Loading your tickets...</section>;
  }

  if (error) {
    return <section className="placeholder">
      <h1>My Tickets</h1>
      <p>Unable to load tickets: {error}</p>
    </section>;
  }

  return (
    <section className="tickets-page">
      <h1>My Tickets</h1>
      <p>Track your support requests and their current status.</p>

      <div className="ticket-count">
        Total tickets: <strong>{tickets.length}</strong>
      </div>

      {tickets.length === 0 ? (
        <div className="placeholder">
          <h2>No tickets yet</h2>
          <p>Your support tickets will appear here when you contact our team.</p>
        </div>
      ) : (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <article className="ticket-card" key={ticket.id}>
              <div className="ticket-top">
                <h2>Ticket #{ticket.id}</h2>
                <span className={`ticket-status ${ticket.status?.toLowerCase().replaceAll(" ", "-")}`}>
                  {ticket.status || "Open"}
                </span>
              </div>

              <p>{ticket.message}</p>

              <div className="ticket-details">
                <span>Category: {ticket.intent}</span>
                <span>Priority: {ticket.urgency}</span>
                <span>
                  Created: {new Date(ticket.created_at).toLocaleDateString()}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
