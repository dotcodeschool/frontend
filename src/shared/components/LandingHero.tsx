import { useRef, useCallback } from 'react'

export default function LandingHero() {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current
    const glow = glowRef.current
    if (!card || !glow) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`

    // Move glow to follow cursor
    glow.style.opacity = '1'
    glow.style.left = `${x}px`
    glow.style.top = `${y}px`
  }, [])

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
      {/* The card */}
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

        {/* Split view: content + editor */}
        <div className="flex" style={{ minHeight: '340px' }}>
          {/* Content pane */}
          <div className="flex-1 p-8 bg-base relative">
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
                    <span className="text-[#c678dd]">let</span>
                    <span className="text-[#abb2bf]"> </span>
                    <span className="text-[#e06c75]">pallet</span>
                    <span className="text-[#abb2bf]"> = </span>
                    <span className="text-[#61afef]">BalancesPallet</span>
                    <span className="text-[#abb2bf]">::</span>
                    <span className="text-[#61afef]">new</span>
                    <span className="text-[#abb2bf]">();</span>
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

          {/* Editor pane */}
          <div className="flex-1 bg-[#0a0c10] flex flex-col">
            {/* Tab bar */}
            <div className="flex items-center h-9 bg-surface/50 border-b border-border px-2 shrink-0">
              <span className="font-mono text-[11px] text-accent border-b-2 border-accent px-3 py-2">balances.rs</span>
              <span className="font-mono text-[11px] text-content-muted/40 px-3 py-2">main.rs</span>
              <span className="font-mono text-[11px] text-content-muted/40 px-3 py-2">lib.rs</span>
            </div>

            {/* Code with line numbers */}
            <div className="flex-1 p-4 overflow-hidden">
              <div className="font-mono text-[12px] leading-[1.9]">
                {[
                  { num: 1, content: <><span className="text-[#c678dd]">use</span><span className="text-[#abb2bf]"> </span><span className="text-[#e5c07b]">std</span><span className="text-[#abb2bf]">::</span><span className="text-[#e5c07b]">collections</span><span className="text-[#abb2bf]">::</span><span className="text-[#e5c07b]">HashMap</span><span className="text-[#abb2bf]">;</span></> },
                  { num: 2, content: null },
                  { num: 3, content: <><span className="text-[#c678dd]">pub struct</span><span className="text-[#abb2bf]"> </span><span className="text-[#e5c07b]">BalancesPallet</span><span className="text-[#abb2bf]"> {'{'}</span></> },
                  { num: 4, content: <><span className="text-[#abb2bf]">    </span><span className="text-[#e06c75]">balances</span><span className="text-[#abb2bf]">: </span><span className="text-[#e5c07b]">HashMap</span><span className="text-[#abb2bf]">&lt;</span><span className="text-[#e5c07b]">String</span><span className="text-[#abb2bf]">, </span><span className="text-[#e5c07b]">u128</span><span className="text-[#abb2bf]">&gt;,</span></> },
                  { num: 5, content: <span className="text-[#abb2bf]">{'}'}</span> },
                  { num: 6, content: null },
                  { num: 7, content: <><span className="text-[#c678dd]">impl</span><span className="text-[#abb2bf]"> </span><span className="text-[#e5c07b]">BalancesPallet</span><span className="text-[#abb2bf]"> {'{'}</span></> },
                  { num: 8, content: <><span className="text-[#abb2bf]">    </span><span className="text-[#c678dd]">pub fn</span><span className="text-[#abb2bf]"> </span><span className="text-[#61afef]">new</span><span className="text-[#abb2bf]">() -&gt; </span><span className="text-[#e5c07b]">Self</span><span className="text-[#abb2bf]"> {'{'}</span></> },
                  { num: 9, content: <><span className="text-[#abb2bf]">        </span><span className="text-[#e5c07b]">Self</span><span className="text-[#abb2bf]"> {'{'}</span></> },
                  { num: 10, content: <><span className="text-[#abb2bf]">            </span><span className="text-[#e06c75]">balances</span><span className="text-[#abb2bf]">: </span><span className="text-[#e5c07b]">HashMap</span><span className="text-[#abb2bf]">::</span><span className="text-[#61afef]">new</span><span className="text-[#abb2bf]">(),</span></> },
                  { num: 11, content: <><span className="text-[#abb2bf]">        {'}'}</span></> },
                  { num: 12, content: <><span className="text-[#abb2bf]">    {'}'}</span></> },
                ].map(({ num, content }) => (
                  <div key={num} className="flex">
                    <span className="w-8 text-right pr-4 text-content-muted/30 select-none shrink-0">{num}</span>
                    <span>{content ?? '\u00A0'}</span>
                  </div>
                ))}
                <div className="flex">
                  <span className="w-8 text-right pr-4 text-content-muted/30 select-none shrink-0">13</span>
                  <span className="text-[#61afef] animate-pulse">▎</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between h-8 px-4 bg-surface/30 border-t border-border text-[10px] text-content-muted/40 font-mono">
          <span>Rust State Machine · Lesson 3</span>
          <span>← Previous · Next →</span>
        </div>
      </div>

      {/* Click to explore CTA */}
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
