
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";

export default function Admin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminUser, setAdminUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  async function verifyAdmin(user) {
    if (!user) {
      setAdminUser(null);
      return false;
    }

    const { data, error } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data) {
      await supabase.auth.signOut();
      setAdminUser(null);
      setError(error?.message || "Admin access denied.");
      return false;
    }

    setAdminUser(user);
    return true;
  }

  async function loadTickets() {
    setDataLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("tickets")
      .select("id, message, intent, urgency, status, created_at, user_email")
      .order("created_at", { ascending: false });

    if (error) {
      setError("Unable to load tickets: " + error.message);
    } else {
      setTickets(data || []);
    }

    setDataLoading(false);
  }

  useEffect(() => {
    async function initialize() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (user) {
        const valid = await verifyAdmin(user);
        if (valid) await loadTickets();
      }

      setLoading(false);
    }

    initialize();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT") {
          setAdminUser(null);
          setTickets([]);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      const valid = await verifyAdmin(data.user);
      if (valid) await loadTickets();
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setAdminUser(null);
    setTickets([]);
    setPassword("");
  }

  const total = tickets.length;
  const open = tickets.filter(
    (t) => (t.status || "").toLowerCase() === "open"
  ).length;
  const high = tickets.filter(
    (t) => (t.urgency || "").toLowerCase() === "high"
  ).length;
  const resolved = tickets.filter(
    (t) => (t.status || "").toLowerCase() === "resolved"
  ).length;

  const intents = ["billing", "bug", "account", "technical", "other"];
  const intentCounts = intents.map((intent) => ({
    name: intent,
    count: tickets.filter(
      (t) => (t.intent || "").toLowerCase() === intent
    ).length,
  }));

  const maxIntent = Math.max(1, ...intentCounts.map((x) => x.count));

  if (loading) {
    return <section className="placeholder">Checking admin access...</section>;
  }

  if (!adminUser) {
    return (
      <section className="placeholder">
        <h1>Harbor Admin Login</h1>
        <p>Sign in with your administrator account.</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br /><br />
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </section>
    );
  }

  return (
    <section className="admin-dashboard">
      <div className="admin-heading">
        <div>
          <h1>Harbor Admin Dashboard</h1>
          <p>Welcome, {adminUser.email}</p>
        </div>
        <div>
          <button onClick={loadTickets} disabled={dataLoading}>
            {dataLoading ? "Refreshing..." : "Refresh"}
          </button>
          {" "}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="admin-stats">
        <article className="admin-stat">
          <span>Total Tickets</span>
          <h2>{total}</h2>
        </article>
        <article className="admin-stat">
          <span>Open Tickets</span>
          <h2>{open}</h2>
        </article>
        <article className="admin-stat">
          <span>High Priority</span>
          <h2>{high}</h2>
        </article>
        <article className="admin-stat">
          <span>Resolved</span>
          <h2>{resolved}</h2>
        </article>
      </div>

      <div className="admin-panel">
        <h2>Tickets by Category</h2>
        {intentCounts.map((item) => (
          <div className="admin-bar-row" key={item.name}>
            <span>{item.name}</span>
            <div className="admin-bar-track">
              <div
                className="admin-bar-fill"
                style={{
                  width: `${(item.count / maxIntent) * 100}%`,
                }}
              />
            </div>
            <strong>{item.count}</strong>
          </div>
        ))}
      </div>

      <div className="admin-panel">
        <h2>Recent Tickets</h2>

        {dataLoading ? (
          <p>Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Message</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>#{ticket.id}</td>
                    <td>{ticket.message}</td>
                    <td>{ticket.intent}</td>
                    <td>{ticket.urgency}</td>
                    <td>{ticket.status}</td>
                    <td>
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
