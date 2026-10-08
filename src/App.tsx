import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ImgHTMLAttributes } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { contact, film, portfolio } from './portfolio'
import type { PortfolioItem } from './portfolio'
import { drawings } from './linework'

gsap.registerPlugin(ScrollTrigger)

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={diagonal ? 'icon diagonal' : 'icon'}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.4" /></svg>
}
function Play() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="icon"><path d="m9 5 11 7-11 7Z" stroke="currentColor" strokeWidth="1.4" /></svg>
}
function Brand() {
  return <span className="brand"><span className="brand-mark" aria-hidden="true"><img src="/images/logo.jpg" alt="" /></span><span className="brand-name">SAC<span>ARCHITECTURE</span></span></span>
}
function AssetImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false)
  return failed ? <span className="image-error" role="img" aria-label={props.alt}>Image unavailable. Please refresh to try again.</span> : <img {...props} onError={() => setFailed(true)} />
}
function Blueprint({ id }: { id: string }) {
  const drawing = drawings[id]
  return <svg className="blueprint" viewBox="0 0 1440 1440" preserveAspectRatio="xMidYMid slice" aria-hidden="true" fill="none">
    {Object.entries(drawing).map(([group, paths]) => <g key={group} className={group}>{paths.map((d, i) => <path key={i} d={d} pathLength="1" vectorEffect="non-scaling-stroke" />)}</g>)}
  </svg>
}

const stories = [
  { id: 'towers', eyebrow: 'Scale & connection', title: 'A shared\npoint of view.', body: 'A skyline of individual forms, brought together by a continuous terrace. Follow the lines that connect the whole.', note: 'Connected towers', tags: 'Vertical rhythm / Shared space' },
  { id: 'office', eyebrow: 'Light & proportion', title: 'Presence,\nin every detail.', body: 'Stone frames meet a transparent façade. As daylight fades, light reveals the geometry of an urban landmark.', note: 'Office building at dusk', tags: 'Façade / Material / Light' },
  { id: 'forest', eyebrow: 'Architecture & nature', title: 'Room\nto breathe.', body: 'Long horizontal planes settle among the trees. A quieter expression of space, texture and the landscape beyond.', note: 'Forest residence', tags: 'Landscape / Residential' },
]

function Chapter({ story, index, onOpen, motionPaused }: { story: typeof stories[number]; index: number; onOpen: (index: number) => void; motionPaused: boolean }) {
  const root = useRef<HTMLElement>(null)
  const [mode, setMode] = useState<'scroll' | 'drawing' | 'render'>('scroll')
  const [stage, setStage] = useState(0)
  const itemIndex = portfolio.findIndex(item => item.id === story.id)
  const item = portfolio[itemIndex]

  useLayoutEffect(() => {
    const node = root.current!
    const mm = gsap.matchMedia()
    mm.add({ desktop: '(min-width: 900px)', motion: '(prefers-reduced-motion: no-preference)', reduce: '(prefers-reduced-motion: reduce)' }, context => {
      const { desktop, motion } = context.conditions!
      const paths = node.querySelectorAll('.blueprint path')
      const render = node.querySelector('.chapter-render')
      const svg = node.querySelector('.blueprint')
      const bar = node.querySelector('.chapter-progress-fill')
      if (mode !== 'scroll' || !motion || motionPaused) {
        gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 0 })
        gsap.set(render, { opacity: mode === 'drawing' ? 0 : 1, clipPath: 'inset(0% 0% 0% 0%)' })
        gsap.set(svg, { opacity: mode === 'drawing' ? 1 : 0 })
        gsap.set(bar, { scaleX: 1 })
        setStage(mode === 'drawing' ? 1 : 3)
        if (desktop && motion && !motionPaused) {
          const pin = ScrollTrigger.create({ trigger: node, start: 'top 88px', end: '+=1600', pin: node.querySelector('.chapter-inner'), invalidateOnRefresh: true })
          return () => pin.kill()
        }
        return
      }
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 })
      gsap.set(render, { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' })
      gsap.set(svg, { opacity: 1 })
      gsap.set(bar, { scaleX: 0 })
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: node, start: desktop ? 'top 88px' : 'top 75%', end: desktop ? '+=1600' : 'bottom 55%',
        pin: desktop ? node.querySelector('.chapter-inner') : false,
        scrub: .65, invalidateOnRefresh: true,
        onUpdate: self => setStage(self.progress < .24 ? 0 : self.progress < .51 ? 1 : self.progress < .82 ? 2 : 3),
      } })
      timeline.to(node.querySelectorAll('.silhouette path'), { strokeDashoffset: 0, duration: .24, stagger: { amount: .08 }, ease: 'none' }, 0)
        .to(node.querySelectorAll('.structure path'), { strokeDashoffset: 0, duration: .2, stagger: { amount: .09 }, ease: 'none' }, .18)
        .to(node.querySelectorAll('.facade path'), { strokeDashoffset: 0, duration: .18, stagger: { amount: .1 }, ease: 'none' }, .31)
        .to(render, { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: .38, ease: 'none' }, .5)
        .to(svg, { opacity: 0, duration: .2, ease: 'none' }, .73)
        .to(bar, { scaleX: 1, duration: 1, ease: 'none' }, 0)
      return () => timeline.kill()
    }, root)
    return () => mm.revert()
  }, [mode, story.id, motionPaused])

  return <section className="chapter" ref={root} aria-labelledby={`chapter-${story.id}`}>
    <div className="chapter-inner">
      <div className="chapter-copy">
        <div className="eyebrow"><span className="chapter-number">0{index + 1}</span>{story.eyebrow}</div>
        <h3 id={`chapter-${story.id}`}>{story.title.split('\n').map((line, i) => <span key={i}>{line}</span>)}</h3>
        <p>{story.body}</p>
        <button className="text-link" onClick={() => onOpen(itemIndex)}>View visualization <Arrow diagonal /></button>
        <div className="chapter-stages" aria-label="Drawing stages">{['Outline', 'Detail', 'Material', 'Vision'].map((label, i) => <span key={label} className={stage === i ? 'active' : ''} aria-current={stage === i ? 'step' : undefined}><i />{label}</span>)}</div>
        <div className="chapter-progress" aria-hidden="true"><span className="chapter-progress-fill" /></div>
        <span className="drawing-note">An artistic study of visible form.</span>
      </div>
      <div className="drawing-panel">
        <div className="drawing-top"><span>STUDY / 0{index + 1}</span><span className="crosshair" aria-hidden="true">+</span><span>SAC ARCHITECTURE</span></div>
        <div className="drawing-canvas">
          <div className="drawing-grid" aria-hidden="true" />
          <AssetImage className="chapter-render" src={item.image} alt={item.alt} width={1440} height={1440} loading="lazy" />
          <Blueprint id={story.id} />
          <span className="corner corner-tl" /><span className="corner corner-br" />
        </div>
        <div className="drawing-bottom"><span>{story.note}</span><div className="view-switch" aria-label={`View mode for ${story.note}`}>
          {(['scroll', 'drawing', 'render'] as const).map(value => <button key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{value === 'scroll' ? 'Auto' : value === 'drawing' ? 'Lines' : 'Image'}</button>)}
        </div></div>
      </div>
    </div>
  </section>
}

type ModalState = { kind: 'image'; index: number } | { kind: 'film' } | null

function MediaDialog({ modal, onClose, onNavigate }: { modal: Exclude<ModalState, null>; onClose: () => void; onNavigate: (index: number) => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [videoError, setVideoError] = useState(false)
  const [waiting, setWaiting] = useState(true)
  useEffect(() => {
    const element = dialog.current!
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element.showModal()
    return () => {
      element.close()
      document.body.style.overflow = overflow
      previous?.focus({ preventScroll: true })
    }
  }, [])
  const item = modal.kind === 'image' ? portfolio[modal.index] : null
  return <dialog className="media-dialog" ref={dialog} aria-labelledby="media-title" onCancel={e => { e.preventDefault(); onClose() }} onClick={e => { if (e.target === e.currentTarget) onClose() }} onKeyDown={e => {
    if (modal.kind === 'image' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      e.preventDefault(); onNavigate((modal.index + (e.key === 'ArrowRight' ? 1 : portfolio.length - 1)) % portfolio.length)
    }
  }}>
    <div className="dialog-header"><div><span className="eyebrow">SAC / {item ? 'Portfolio' : 'Motion study'}</span><h2 id="media-title">{item?.title ?? film.title}</h2></div><button autoFocus className="close-button" aria-label="Close viewer" onClick={onClose}>✕</button></div>
    {item ? <AssetImage key={item.id} className="viewer-image" src={item.image} alt={item.alt} width={item.width} height={item.height} /> : film.src && !videoError ? <div className="video-wrap">
      {waiting && <p role="status" className="video-loading">Loading film…</p>}
      <video controls muted playsInline preload="metadata" poster={film.poster} src={film.src} onCanPlay={() => setWaiting(false)} onError={() => { setVideoError(true); setWaiting(false) }} aria-label={film.title} />
    </div> : <div className="film-fallback"><AssetImage src={film.poster} alt={portfolio[0].alt} width={1440} height={1440} /><div className="film-message"><span className="eyebrow">Connected towers</span><h3>{videoError ? 'The film couldn’t load.' : 'A still moment.'}</h3><p>{videoError ? 'The architectural visualization is still here to explore. Please try the film again later.' : 'The architectural film is not available yet. Explore the original visualization and the drawing studies in the meantime.'}</p><button className="button button-light" onClick={onClose}>Return to the experience <Arrow /></button></div></div>}
    <div className="dialog-footer"><span>{item ? `${item.category} · Architectural visualization` : 'Architectural visualization · SAC Architecture'}</span>{modal.kind === 'image' && <div className="viewer-nav"><button aria-label="Previous image" onClick={() => onNavigate((modal.index + portfolio.length - 1) % portfolio.length)}><span className="reverse"><Arrow /></span></button><span>{String(modal.index + 1).padStart(2, '0')} / 09</span><button aria-label="Next image" onClick={() => onNavigate((modal.index + 1) % portfolio.length)}><Arrow /></button></div>}</div>
  </dialog>
}

function HeroVideo({ motionPaused }: { motionPaused: boolean }) {
  const video = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    const element = video.current
    if (!element || failed) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = true
    const sync = () => {
      if (paused || motionPaused || preference.matches || !visible || document.hidden) element.pause()
      else void element.play().catch(() => setPlaying(false))
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }, { threshold: .1 })
    observer.observe(element)
    preference.addEventListener('change', sync)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => { observer.disconnect(); preference.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); element.pause() }
  }, [paused, motionPaused, failed])
  return <>
    <div className="hero-visual hero-video-visual" aria-hidden="true">
      <div className="hero-image-wrap">
        {failed ? <img src="/media/portfolio-poster.jpg" alt="" /> : <video ref={video} src="/media/portfolio-hero.mp4" poster="/media/portfolio-poster.jpg" muted loop playsInline preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />}
      </div>
    </div>
    {!failed && <button className="hero-video-toggle" aria-label={playing ? 'Pause background video' : 'Play background video'} onClick={() => {
      if (playing) setPaused(true)
      else { setPaused(false); if (!motionPaused) void video.current?.play().catch(() => setPlaying(false)) }
    }}>{playing ? 'Ⅱ Pause video' : '▷ Play video'}</button>}
  </>
}

export default function App() {
  const [modal, setModal] = useState<ModalState>(null)
  const [filter, setFilter] = useState<'All' | PortfolioItem['category']>('All')
  const [menu, setMenu] = useState(false)
  const [motionPaused, setMotionPaused] = useState(false)
  useLayoutEffect(() => {
    if (motionPaused) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('.hero h1, .journey-intro h2, .chapter-copy h3, .section-heading h2, .expertise-intro h2, .contact-main h2').forEach(heading => {
        gsap.fromTo(heading, { x: -36, opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 92%', toggleActions: 'play none none reverse' } })
      })
      gsap.utils.toArray<HTMLElement>('.hero-copy > p, .journey-intro p, .chapter-copy > p, .section-heading > p, .expertise-intro > p, .contact-bottom > p').forEach(paragraph => {
        gsap.fromTo(paragraph, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .8, delay: .15, ease: 'power2.out', scrollTrigger: { trigger: paragraph, start: 'top 94%', toggleActions: 'play none none reverse' } })
      })
    })
    return () => mm.revert()
  }, [motionPaused])
  useEffect(() => { document.documentElement.dataset.motion = motionPaused ? 'reduced' : 'auto'; return () => { delete document.documentElement.dataset.motion } }, [motionPaused])
  const displayed = portfolio.filter(item => filter === 'All' || item.category === filter)
  const openImage = (index: number) => setModal({ kind: 'image', index })

  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header"><a className="brand-link" href="#" aria-label="SAC Architecture home"><Brand /></a><button className="menu-button" aria-expanded={menu} aria-controls="main-nav" onClick={() => setMenu(!menu)}>{menu ? 'Close' : 'Menu'} <span aria-hidden="true">{menu ? '−' : '+'}</span></button><nav id="main-nav" className={menu ? 'nav open' : 'nav'} aria-label="Main navigation"><a href="#work" onClick={() => setMenu(false)}>Work <span>09</span></a><a href="#expertise" onClick={() => setMenu(false)}>Expertise</a><a className="nav-contact" href="#contact" onClick={() => setMenu(false)}>Discuss a project <Arrow diagonal /></a></nav></header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy"><div className="eyebrow"><span className="status-dot" />ARCHITECTURE, IMAGINED.</div><h1 id="hero-title">Your vision.<br /><span>Our design.</span></h1><p>From the first line to a new perspective.<br />Architecture and visualization that bring<br className="desktop-break" /> your ideas into focus.</p><div className="hero-actions"><a className="button button-light" href="#work">Explore projects <Arrow diagonal /></a><button className="film-button" onClick={() => setModal({ kind: 'film' })}><span className="play-circle"><Play /></span>Watch film</button></div><div className="hero-footnote"><span>ARCHITECTURE</span><i /><span>INTERIORS</span><i /><span>3D VISUALIZATION</span></div></div>
        <HeroVideo motionPaused={motionPaused} />
        <div className="hero-bottom"><a href="#journey"><span className="scroll-indicator" aria-hidden="true">↓</span>SCROLL TO REVEAL</a><span>FROM LINE TO LIVING SPACE</span><a href="#work">Skip to portfolio <Arrow /></a></div>
      </section>
      <section className="journey-intro" id="journey" aria-labelledby="journey-title"><span className="eyebrow">THE DESIGN, UNFOLDING</span><h2 id="journey-title">Every space begins<br />with <em>a line.</em></h2><div><p>Discover the geometry behind the image. Scroll through three studies in scale, light and place.</p><span className="small-label">03 STUDIES / SCROLL TO EXPLORE</span></div></section>
      <div className="chapters">{stories.map((story, i) => <Chapter key={story.id} story={story} index={i} onOpen={openImage} motionPaused={motionPaused} />)}</div>
      <section className="portfolio-section" id="work" aria-labelledby="work-title"><div className="section-heading"><div><span className="eyebrow">THE PORTFOLIO</span><h2 id="work-title">Spaces. Perspectives.<br /><span>Possibilities.</span></h2></div><p>An exploration of architectural form,<br />from intimate residences to the skyline.</p></div><div className="portfolio-toolbar"><div className="filters" aria-label="Filter portfolio">{(['All', 'Large scale', 'Residential'] as const).map(label => <button key={label} aria-pressed={filter === label} onClick={() => setFilter(label)}>{label === 'All' ? 'All work' : label}<span>{String(label === 'All' ? 9 : portfolio.filter(item => item.category === label).length).padStart(2, '0')}</span></button>)}</div><span className="portfolio-count" aria-live="polite">{String(displayed.length).padStart(2, '0')} VISUALIZATIONS</span></div><div className="portfolio-grid">{displayed.map(item => <button className="project-card" key={item.id} onClick={() => openImage(portfolio.indexOf(item))} aria-label={`View ${item.title}`}><div className={`project-image ${item.id === 'skyline' ? 'portrait' : ''}`}><AssetImage src={item.image} alt={item.alt} width={item.width} height={item.height} loading="lazy" /><span className="project-open"><Arrow diagonal /></span></div><div className="project-caption"><div><h3>{item.title}</h3><span>{item.category} / Visualization</span></div><span className="project-index">{String(portfolio.indexOf(item) + 1).padStart(2, '0')}</span></div></button>)}</div></section>
      <section className="expertise-section" id="expertise" aria-labelledby="expertise-title"><div className="expertise-intro"><span className="eyebrow">OUR EXPERTISE</span><h2 id="expertise-title">Considered spaces.<br /><span>Clearer visions.</span></h2><p>From shaping a building to exploring the atmosphere within. Discover the ways we can help bring your vision into view.</p><a className="text-link" href="#contact">Start a conversation <Arrow diagonal /></a></div><div className="services">{[
        ['Architecture', 'Form, proportion and purpose. Architectural design that starts with the way a space will be experienced.'],
        ['Interiors', 'Material, light and the details of everyday life. A considered approach to the spaces within.'],
        ['Exteriors', 'The relationship between a building and its surroundings, explored through façades, finishes and landscape.'],
        ['3D visualization', 'Your ideas made visible. Architectural imagery to explore, communicate and present a design.'],
      ].map(([title, description], i) => <details key={title} open={i === 0 ? true : undefined}><summary><span className="service-number">0{i + 1}</span><h3>{title}</h3><span className="service-plus" aria-hidden="true">+</span></summary><p>{description}</p></details>)}</div></section>
      <section className="contact-section" id="contact" aria-labelledby="contact-title"><div className="eyebrow">LET’S BEGIN WITH YOUR VISION</div><div className="contact-main"><h2 id="contact-title">What do you<br />have <em>in mind?</em></h2><a className="contact-circle" href={contact.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Discuss a project with SAC on WhatsApp"><Arrow diagonal /></a></div><div className="contact-bottom"><p>A new project. A different perspective.<br />Let’s explore the possibilities together.</p><div><a href={contact.whatsapp} target="_blank" rel="noopener noreferrer">Discuss a project on WhatsApp <Arrow diagonal /></a><a href={contact.instagram} target="_blank" rel="noopener noreferrer">Follow @_sac_architects <Arrow diagonal /></a></div></div></section>
    </main>
    <footer><a className="brand-link" href="#" aria-label="SAC Architecture home"><Brand /></a><span>YOUR VISION. OUR DESIGN.</span><button className="motion-toggle" aria-pressed={motionPaused} onClick={() => setMotionPaused(!motionPaused)}>{motionPaused ? 'Motion reduced' : 'Reduce motion'}</button><a href="#">Back to top ↑</a></footer>
    {modal && <MediaDialog modal={modal} onClose={() => setModal(null)} onNavigate={index => setModal({ kind: 'image', index })} />}
  </>
}
