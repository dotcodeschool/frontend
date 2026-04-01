import { signIn, signOut } from "auth-astro/client";
import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";

type User = {
  name: string;
  avatarUrl: string;
};

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (session?.user) {
          setUser({
            name: session.user.name ?? session.user.email ?? "User",
            avatarUrl: session.user.image ?? "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <div className="w-7 h-7 rounded-full bg-elevated animate-pulse" />;
  }

  if (!user) {
    return (
      <a
        href="/auth/login"
        className="flex items-center gap-1.5 text-content-muted text-xs border border-border px-3 py-1.5 rounded-md hover:text-content-secondary hover:border-content-muted transition-colors no-underline"
      >
        <FaGithub className="text-sm" />
        Sign in
      </a>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-1.5 rounded-full hover:ring-2 hover:ring-accent/30 transition-all"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-7 h-7 rounded-full"
          />
        ) : (
          <div
            className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-xs font-medium"
            style={{ color: "var(--bg-base)" }}
          >
            {user.name[0]?.toUpperCase()}
          </div>
        )}
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-9 w-48 bg-surface border border-border rounded-md shadow-lg py-1 z-50">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-sm font-medium text-content-primary truncate">
              {user.name}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="block w-full text-left px-3 py-2 text-sm text-content-muted hover:text-content-secondary hover:bg-elevated transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
