"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Browse", icon: "⌂" },
  { href: "/plan/onboarding", label: "Plan My Day", icon: "☀" },
  { href: "/about", label: "About", icon: "♡" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="mobile-header">
        <Link className="brand brand-mobile" href="/" onClick={() => setOpen(false)}>
          <span className="brand-mark">E</span>
          <span>EnjoyLife</span>
        </Link>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <aside className={`sidebar ${open ? "sidebar-open" : ""}`} id="main-navigation">
        <Link className="brand desktop-brand" href="/">
          <span className="brand-mark">E</span>
          <span>EnjoyLife</span>
        </Link>
        <p className="brand-subtitle">Good days, made gently.</p>
        <nav aria-label="Main navigation">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.replace("/onboarding", ""));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${active ? "nav-link-active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <span aria-hidden="true">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-note">
          <span aria-hidden="true">🌿</span>
          <p>Take your time. There is no rush here.</p>
        </div>
      </aside>
      {open ? (
        <button
          className="nav-scrim"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
