import { Link } from "react-router-dom";

const options = [
  { to: "/chat", title: "Ask the assistant", text: "Answers from our help docs in seconds. Urgent or complex issues go to a person." },
  { to: "/faq", title: "Browse the FAQ", text: "Refunds, billing, accounts and shipping, all in one place." },
  { to: "/tickets", title: "Check a ticket", text: "See where your open requests stand." },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Tell us what went wrong. We'll sort it out.</h1>
        <p>Type your question and get an answer from our help docs. If it needs a person, we open a ticket for you automatically.</p>
        <Link to="/chat" className="btn">Start a chat</Link>
      </section>
      <section className="options">
        {options.map((o) => (
          <Link key={o.to} to={o.to} className="option">
            <h2>{o.title}</h2>
            <p>{o.text}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
