import { lazy, Suspense, useCallback, useRef, useState } from "react";

import {
  DCS_THEME_NAME,
  dcsDarkTheme,
} from "@/features/courses/components/code-editor/editor-theme";

const Editor = lazy(() =>
  import("@monaco-editor/react").then((m) => ({ default: m.default })),
);

const SAMPLE_CODE = `use std::collections::HashMap;

pub struct BalancesPallet {
    balances: HashMap<String, u128>,
}

impl BalancesPallet {
    pub fn new() -> Self {
        Self {
            balances: HashMap::new(),
        }
    }

    pub fn set_balance(&mut self, who: &str, amount: u128) {
        self.balances.insert(who.to_string(), amount);
    }

    pub fn balance(&self, who: &str) -> u128 {
        *self.balances.get(who).unwrap_or(&0)
    }

    pub fn transfer(
        &mut self,
        from: &str,
        to: &str,
        amount: u128,
    ) -> Result<(), &'static str> {
        let from_balance = self.balance(from);
        let to_balance = self.balance(to);

        if from_balance < amount {
            return Err("insufficient balance");
        }

        self.set_balance(from, from_balance - amount);
        self.set_balance(to, to_balance + amount);
        Ok(())
    }
}`;

const TABS = [
  { name: "balances.rs", active: true },
  { name: "main.rs", active: false },
  { name: "lib.rs", active: false },
];

export default function LandingHero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [tiltEnabled, setTiltEnabled] = useState(true);
  const themeRegistered = useRef(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!tiltEnabled) return;
      const card = cardRef.current;
      const glow = glowRef.current;
      if (!card || !glow) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
      glow.style.opacity = "1";
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
    },
    [tiltEnabled],
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    card.style.transform = "";
    glow.style.opacity = "0";
  }, []);

  const handleBeforeMount = (monaco: any) => {
    if (!themeRegistered.current) {
      monaco.editor.defineTheme(DCS_THEME_NAME, dcsDarkTheme);
      themeRegistered.current = true;
    }
  };

  return (
    <div
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1200px" }}
    >
      <div
        ref={cardRef}
        className="relative rounded-2xl border border-white/[0.06] overflow-hidden"
        style={{
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(107,138,237,0.06)",
          transformStyle: "preserve-3d",
          willChange: "transform",
          transition: "transform 0.15s ease-out",
        }}
      >
        {/* Cursor glow */}
        <div
          ref={glowRef}
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(107,138,237,0.08) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            opacity: 0,
            zIndex: 10,
            transition: "opacity 0.3s",
          }}
        />

        {/* Split view: content + real editor */}
        <div className="flex" style={{ height: "420px" }}>
          {/* Content pane */}
          <div
            className="flex-1 overflow-y-auto p-8"
            style={{ background: "var(--bg-base)" }}
          >
            <p className="text-accent text-xs font-mono mb-3 tracking-wider">
              LESSON 3 OF 35
            </p>
            <h3
              className="font-heading text-2xl font-bold mb-4 leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              Creating a Balances Pallet
            </h3>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              At the heart of a blockchain is a state machine. We can create a
              very naive state machine using simple Rust abstractions, and
              through this help learn about Rust in the context of blockchains.
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              We want to keep our code organized, so we will create a new file
              for our Balances Pallet called{" "}
              <code
                className="px-1.5 py-0.5 rounded text-xs font-mono"
                style={{
                  color: "var(--accent)",
                  background: "var(--accent-bg)",
                }}
              >
                balances.rs
              </code>
            </p>
          </div>

          {/* Divider */}
          <div className="w-px" style={{ background: "#1e2230" }} />

          {/* Real Monaco editor */}
          <div
            className="flex-1 flex flex-col"
            style={{ background: "#0a0c10" }}
            onMouseEnter={() => setTiltEnabled(false)}
            onMouseLeave={() => setTiltEnabled(true)}
          >
            {/* Tab bar */}
            <div
              className="flex items-center h-9 border-b px-2 shrink-0"
              style={{
                background: "#111318",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              {TABS.map((tab) => (
                <span
                  key={tab.name}
                  className="font-mono px-3 py-2"
                  style={{
                    fontSize: "11px",
                    color: tab.active ? "#6b8aed" : "#6b7394",
                    borderBottom: tab.active
                      ? "2px solid #6b8aed"
                      : "2px solid transparent",
                  }}
                >
                  {tab.name}
                </span>
              ))}
            </div>

            {/* Monaco */}
            <div className="flex-1 min-h-0">
              <Suspense
                fallback={
                  <div className="flex-1" style={{ background: "#0a0c10" }} />
                }
              >
                <Editor
                  language="rust"
                  defaultValue={SAMPLE_CODE}
                  theme={DCS_THEME_NAME}
                  beforeMount={handleBeforeMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    padding: { top: 12 },
                    renderLineHighlight: "none",
                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                    scrollbar: {
                      vertical: "auto",
                      horizontal: "auto",
                      verticalScrollbarSize: 4,
                      horizontalScrollbarSize: 4,
                    },
                  }}
                />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between h-8 px-4 border-t font-mono"
          style={{
            background: "#111318",
            borderColor: "rgba(255,255,255,0.06)",
            fontSize: "10px",
            color: "#9ba3be",
          }}
        >
          <span>Rust State Machine · Lesson 3</span>
          <span>← Previous · Next →</span>
        </div>
      </div>

      <div className="text-center mt-6">
        <a
          href="/courses/rust-state-machine"
          className="text-sm no-underline inline-flex items-center gap-1.5"
          style={{ color: "var(--accent)" }}
        >
          Try this course →
        </a>
      </div>
    </div>
  );
}
