import { useRef, useCallback, lazy, Suspense, useState } from 'react'

const Editor = lazy(() => import('@monaco-editor/react').then(m => ({ default: m.default })))

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
}`

const TABS = [
  { name: 'balances.rs', active: true },
  { name: 'main.rs', active: false },
  { name: 'lib.rs', active: false },
]

export default function LandingHero() {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [tiltEnabled, setTiltEnabled] = useState(true)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!tiltEnabled) return
    const card = cardRef.current
    const glow = glowRef.current
    if (!card || !glow) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -4
    const rotateY = ((x - centerX) / centerX) * 4

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`

    glow.style.opacity = '1'
    glow.style.left = `${x}px`
    glow.style.top = `${y}px`
  }, [tiltEnabled])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    const glow = glowRef.current
    if (!card || !glow) return

    card.style.transform = ''
    glow.style.opacity = '0'
  }, [])

  return (
    <div
      className="relative max-w-4xl mx-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1200px' }}
    >
      <div
        ref={cardRef}
        className="relative rounded-2xl border border-white/[0.06] overflow-hidden transition-transform duration-150 ease-out"
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(107,138,237,0.06)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Cursor-following glow */}
        <div
          ref={glowRef}
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle, rgba(107,138,237,0.08) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            opacity: 0,
            zIndex: 10,
          }}
        />

        {/* Split view: content + real editor */}
        <div className="flex" style={{ height: '420px' }}>
          {/* Content pane */}
          <div className="flex-1 overflow-y-auto p-8 bg-base relative">
            <div className="relative z-[1]">
              <p className="text-accent text-xs font-mono mb-3 tracking-wider">LESSON 3 OF 35</p>

              <h3 className="font-heading text-2xl font-bold text-content-primary mb-4 leading-snug">
                Creating a Balances Pallet
              </h3>

              <p className="text-content-secondary text-sm leading-relaxed mb-5">
                At the heart of a blockchain is a state machine. We can create a very naive state machine
                using simple Rust abstractions, and through this help learn about Rust in the context of blockchains.
              </p>

              <div className="rounded-lg overflow-hidden border border-border bg-code p-4 mb-5">
                <pre className="font-mono text-xs leading-relaxed">
                  <code>
                    <span style={{ color: '#c678dd' }}>let</span>
                    {' '}
                    <span style={{ color: '#e06c75' }}>pallet</span>
                    {' = '}
                    <span style={{ color: '#61afef' }}>BalancesPallet</span>
                    {'::'}
                    <span style={{ color: '#61afef' }}>new</span>
                    {'();'}
                  </code>
                </pre>
              </div>

              <p className="text-content-muted text-sm leading-relaxed">
                We want to keep our code organized, so we will create a new file for our Balances Pallet called{' '}
                <code className="text-accent bg-accent/10 px-1.5 py-0.5 rounded text-xs font-mono">balances.rs</code>
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-border" />

          {/* Real editor pane */}
          <div
            className="flex-1 bg-[#0a0c10] flex flex-col"
            onMouseEnter={() => setTiltEnabled(false)}
            onMouseLeave={() => setTiltEnabled(true)}
          >
            {/* Tab bar */}
            <div className="flex items-center h-9 bg-surface/50 border-b border-border px-2 shrink-0">
              {TABS.map((tab) => (
                <span
                  key={tab.name}
                  className={`font-mono text-[11px] px-3 py-2 ${
                    tab.active
                      ? 'text-accent border-b-2 border-accent'
                      : 'text-content-muted/40'
                  }`}
                >
                  {tab.name}
                </span>
              ))}
            </div>

            {/* Monaco editor */}
            <div className="flex-1 min-h-0">
              <Suspense fallback={<div className="flex-1 bg-[#0a0c10]" />}>
                <Editor
                  language="rust"
                  defaultValue={SAMPLE_CODE}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    padding: { top: 12 },
                    renderLineHighlight: 'none',
                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                    scrollbar: {
                      vertical: 'hidden',
                      horizontal: 'auto',
                      verticalScrollbarSize: 0,
                    },
                  }}
                />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between h-8 px-4 bg-surface/30 border-t border-border text-[10px] text-content-muted/40 font-mono">
          <span>Rust State Machine · Lesson 3</span>
          <span>← Previous · Next →</span>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center mt-6">
        <a
          href="/courses/rust-state-machine"
          className="text-accent text-sm no-underline hover:text-accent-dim transition-colors inline-flex items-center gap-1.5"
        >
          Try this course →
        </a>
      </div>
    </div>
  )
}
