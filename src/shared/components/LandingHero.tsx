import { useRef, useCallback, useState, useEffect } from 'react'

const CODE_LINES = [
  { num: 1, tokens: [{ text: 'use', color: '#c678dd' }, { text: ' std::collections::', color: '#abb2bf' }, { text: 'HashMap', color: '#e5c07b' }, { text: ';', color: '#abb2bf' }] },
  { num: 2, tokens: [] },
  { num: 3, tokens: [{ text: 'pub struct', color: '#c678dd' }, { text: ' ', color: '#abb2bf' }, { text: 'BalancesPallet', color: '#e5c07b' }, { text: ' {', color: '#abb2bf' }] },
  { num: 4, tokens: [{ text: '    ', color: '' }, { text: 'balances', color: '#e06c75' }, { text: ': ', color: '#abb2bf' }, { text: 'HashMap', color: '#e5c07b' }, { text: '<', color: '#abb2bf' }, { text: 'String', color: '#e5c07b' }, { text: ', ', color: '#abb2bf' }, { text: 'u128', color: '#e5c07b' }, { text: '>,', color: '#abb2bf' }] },
  { num: 5, tokens: [{ text: '}', color: '#abb2bf' }] },
  { num: 6, tokens: [] },
  { num: 7, tokens: [{ text: 'impl', color: '#c678dd' }, { text: ' ', color: '#abb2bf' }, { text: 'BalancesPallet', color: '#e5c07b' }, { text: ' {', color: '#abb2bf' }] },
  { num: 8, tokens: [{ text: '    ', color: '' }, { text: 'pub fn', color: '#c678dd' }, { text: ' ', color: '#abb2bf' }, { text: 'new', color: '#61afef' }, { text: '() -> ', color: '#abb2bf' }, { text: 'Self', color: '#e5c07b' }, { text: ' {', color: '#abb2bf' }] },
  { num: 9, tokens: [{ text: '        ', color: '' }, { text: 'Self', color: '#e5c07b' }, { text: ' {', color: '#abb2bf' }] },
  { num: 10, tokens: [{ text: '            ', color: '' }, { text: 'balances', color: '#e06c75' }, { text: ': ', color: '#abb2bf' }, { text: 'HashMap', color: '#e5c07b' }, { text: '::', color: '#abb2bf' }, { text: 'new', color: '#61afef' }, { text: '(),', color: '#abb2bf' }] },
  { num: 11, tokens: [{ text: '        }', color: '#abb2bf' }] },
  { num: 12, tokens: [{ text: '    }', color: '#abb2bf' }] },
  { num: 13, tokens: [] },
  { num: 14, tokens: [{ text: '    ', color: '' }, { text: 'pub fn', color: '#c678dd' }, { text: ' ', color: '#abb2bf' }, { text: 'set_balance', color: '#61afef' }, { text: '(&', color: '#abb2bf' }, { text: 'mut self', color: '#c678dd' }, { text: ', who: &', color: '#abb2bf' }, { text: 'str', color: '#e5c07b' }, { text: ', amount: ', color: '#abb2bf' }, { text: 'u128', color: '#e5c07b' }, { text: ') {', color: '#abb2bf' }] },
  { num: 15, tokens: [{ text: '        ', color: '' }, { text: 'self', color: '#c678dd' }, { text: '.balances.insert(', color: '#abb2bf' }] },
  { num: 16, tokens: [{ text: '            who.', color: '#abb2bf' }, { text: 'to_string', color: '#61afef' }, { text: '(), amount', color: '#abb2bf' }] },
  { num: 17, tokens: [{ text: '        );', color: '#abb2bf' }] },
  { num: 18, tokens: [{ text: '    }', color: '#abb2bf' }] },
  { num: 19, tokens: [] },
  { num: 20, tokens: [{ text: '    ', color: '' }, { text: 'pub fn', color: '#c678dd' }, { text: ' ', color: '#abb2bf' }, { text: 'transfer', color: '#61afef' }, { text: '(', color: '#abb2bf' }] },
  { num: 21, tokens: [{ text: '        &', color: '#abb2bf' }, { text: 'mut self', color: '#c678dd' }, { text: ',', color: '#abb2bf' }] },
  { num: 22, tokens: [{ text: '        from: &', color: '#abb2bf' }, { text: 'str', color: '#e5c07b' }, { text: ',', color: '#abb2bf' }] },
  { num: 23, tokens: [{ text: '        to: &', color: '#abb2bf' }, { text: 'str', color: '#e5c07b' }, { text: ',', color: '#abb2bf' }] },
  { num: 24, tokens: [{ text: '        amount: ', color: '#abb2bf' }, { text: 'u128', color: '#e5c07b' }] },
  { num: 25, tokens: [{ text: '    ) -> ', color: '#abb2bf' }, { text: 'Result', color: '#e5c07b' }, { text: '<(), &\'static ', color: '#abb2bf' }, { text: 'str', color: '#e5c07b' }, { text: '> {', color: '#abb2bf' }] },
]

const TABS = [
  { name: 'balances.rs', active: true },
  { name: 'main.rs', active: false },
  { name: 'lib.rs', active: false },
]

export default function LandingHero() {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [visibleLines, setVisibleLines] = useState(0)

  // Typewriter effect — reveal lines one by one
  useEffect(() => {
    if (visibleLines >= CODE_LINES.length) return
    const delay = visibleLines === 0 ? 400 : 40 + Math.random() * 60
    const timer = setTimeout(() => setVisibleLines(v => v + 1), delay)
    return () => clearTimeout(timer)
  }, [visibleLines])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
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
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1200px' }}
    >
      <div
        ref={cardRef}
        className="relative rounded-2xl border border-white/[0.06] overflow-hidden"
        style={{
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(107,138,237,0.06)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Cursor glow */}
        <div
          ref={glowRef}
          className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(107,138,237,0.08) 0%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            opacity: 0,
            zIndex: 10,
            transition: 'opacity 0.3s',
          }}
        />

        {/* Split view */}
        <div className="flex" style={{ height: '420px' }}>
          {/* Content pane */}
          <div className="flex-1 overflow-y-auto p-8" style={{ background: 'var(--bg-base)' }}>
            <p className="text-accent text-xs font-mono mb-3 tracking-wider">LESSON 3 OF 35</p>
            <h3 className="font-heading text-2xl font-bold mb-4 leading-snug" style={{ color: 'var(--text-primary)' }}>
              Creating a Balances Pallet
            </h3>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
              At the heart of a blockchain is a state machine. We can create a very naive state machine
              using simple Rust abstractions, and through this help learn about Rust in the context of blockchains.
            </p>
            <div className="rounded-lg overflow-hidden border p-4 mb-5" style={{ borderColor: 'var(--border)', background: 'var(--code-bg)' }}>
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
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              We want to keep our code organized, so we will create a new file called{' '}
              <code className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ color: 'var(--accent)', background: 'var(--accent-bg)' }}>balances.rs</code>
            </p>
          </div>

          {/* Divider */}
          <div className="w-px" style={{ background: 'var(--border)' }} />

          {/* Editor pane */}
          <div className="flex-1 flex flex-col" style={{ background: '#0a0c10' }}>
            {/* Tab bar */}
            <div className="flex items-center h-9 border-b px-2 shrink-0" style={{ background: 'rgba(17,19,24,0.7)', borderColor: 'var(--border)' }}>
              {TABS.map((tab) => (
                <span
                  key={tab.name}
                  className="font-mono px-3 py-2"
                  style={{
                    fontSize: '11px',
                    color: tab.active ? 'var(--accent)' : 'rgba(107,138,237,0.3)',
                    borderBottom: tab.active ? '2px solid var(--accent)' : '2px solid transparent',
                  }}
                >
                  {tab.name}
                </span>
              ))}
            </div>

            {/* Code with typewriter */}
            <div className="flex-1 py-3 overflow-hidden font-mono" style={{ fontSize: '12.5px', lineHeight: '1.85' }}>
              {CODE_LINES.slice(0, visibleLines).map(({ num, tokens }) => (
                <div key={num} className="flex px-4">
                  <span className="w-8 text-right pr-4 select-none shrink-0" style={{ color: 'rgba(84,91,120,0.4)' }}>
                    {num}
                  </span>
                  <span>
                    {tokens.length === 0
                      ? '\u00A0'
                      : tokens.map((t, i) => (
                          <span key={i} style={{ color: t.color || undefined }}>{t.text}</span>
                        ))
                    }
                  </span>
                </div>
              ))}
              {visibleLines < CODE_LINES.length && (
                <div className="flex px-4">
                  <span className="w-8 text-right pr-4 select-none shrink-0" style={{ color: 'rgba(84,91,120,0.4)' }}>
                    {visibleLines + 1}
                  </span>
                  <span className="animate-pulse" style={{ color: '#61afef' }}>▎</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between h-8 px-4 border-t font-mono" style={{ background: 'rgba(17,19,24,0.4)', borderColor: 'var(--border)', fontSize: '10px', color: 'rgba(84,91,120,0.5)' }}>
          <span>Rust State Machine · Lesson 3</span>
          <span>← Previous · Next →</span>
        </div>
      </div>

      <div className="text-center mt-6">
        <a
          href="/courses/rust-state-machine"
          className="text-sm no-underline inline-flex items-center gap-1.5"
          style={{ color: 'var(--accent)' }}
        >
          Try this course →
        </a>
      </div>
    </div>
  )
}
