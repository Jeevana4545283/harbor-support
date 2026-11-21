import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/chat", label: "Chat" },
  { to: "/faq", label: "FAQ" },
  { to: "/tickets", label: "My tickets" },
  { to: "/admin", label: "Admin" },
];

export default function Navbar() {
  return (
    <header className="nav">
      <Link to="/" className="brand">Harbor Support</Link>
      <nav aria-label="Main">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
