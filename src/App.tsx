import { useEffect, useRef, useState } from 'react'
import { getExternalFormUrl } from './lib/external-form'
import { LightRaysBackground } from './components/LightRaysBackground'
import { usePageMotion } from './hooks/usePageMotion'
import './App.css'

const formUrl = getExternalFormUrl()

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span className={diagonal ? 'arrow diagonal' : 'arrow'} aria-hidden="true" />
}

type IconName = 'up' | 'down' | 'diagonal' | 'check' | 'sparkle' | 'plus' | 'minus'

function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    up: <><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></>,
    down: <><path d="M12 5v14"/><path d="m5 12 7 7 7-7"/></>,
    diagonal: <><path d="M5 19 19 5"/><path d="M9 5h10v10"/></>,
    check: <path d="m5 12 4.5 4.5L19 7"/>,
    sparkle: <><path d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Z"/><path d="m19 17 .6 1.4L21 19l-1.4.6L19 21l-.6-1.4L17 19l1.4-.6L19 17Z"/></>,
    plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    minus: <path d="M5 12h14"/>,
  }
  return <svg className={`ui-icon ${className}`} aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function ExternalCTA({ label = 'Demander un audit personnalisé', className = '' }: { label?: string; className?: string }) {
  const content = <>{label}<span className="button-orbit"><Arrow diagonal /></span></>
  return formUrl
    ? <a className={`contact-button ${className}`} href={formUrl} target="_blank" rel="noopener noreferrer">{content}<span className="sr-only"> — formulaire externe, nouvel onglet</span></a>
    : <button className={`contact-button ${className}`} type="button" disabled title="Le lien du formulaire externe n’a pas encore été fourni.">{content}</button>
}

function Wordmark() {
  return <a className="wordmark" href="#top" aria-label="KAERON — accueil"><img className="brand-logo" src="/brand/kaeron-wordmark.svg" width="2067" height="761" alt="KAERON" /></a>
}

function Header({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const toggle = useRef<HTMLButtonElement>(null)
  const firstLink = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    if (!open) return
    firstLink.current?.focus()
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus() }
    }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [open])
  return <header className="header"><div className="shell header-inner">
    <Wordmark />
    <nav className="desktop-nav" aria-label="Navigation principale"><a href="#parcours">La mise en place</a><a href="#pour-qui">Pour qui ?</a><a href="#faq">Questions</a></nav>
    <ExternalCTA className="header-cta" label="Demander un audit" />
    <button className="menu-toggle" type="button" ref={toggle} aria-controls="mobile-nav" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Fermer' : 'Menu'}<Icon name={open ? 'minus' : 'plus'} /></button>
  </div><nav id="mobile-nav" className="mobile-nav shell" hidden={!open} aria-label="Navigation mobile">
    <a ref={firstLink} href="#parcours" onClick={() => setOpen(false)}>La mise en place <Arrow /></a><a href="#pour-qui" onClick={() => setOpen(false)}>Pour qui ? <Arrow /></a><a href="#faq" onClick={() => setOpen(false)}>Questions <Arrow /></a><ExternalCTA />
  </nav></header>
}

function Hero({ paused }: { paused: boolean }) {
  return <section className="hero" aria-labelledby="hero-title">
    <LightRaysBackground paused={paused}/>
    <div className="shell hero-content">
      <p className="hero-course">Pour dirigeants de TPE, PME et artisans</p>
      <h1 id="hero-title">Automatisez le répétitif.<br/><em>Reprenez du temps.</em></h1>
      <p className="hero-description">Mails, pièces, relances : le suivi manuel grignote vos journées et votre budget. <strong>KAERON audite vos processus, puis installe les automatisations utiles — avec ou sans IA — pour vous rendre du temps et de la tranquillité.</strong></p>
      <div className="hero-actions"><ExternalCTA/><a className="hero-discover" href="#parcours">Découvrir le service <Icon name="down" /></a></div>
      <p className="cta-note">Premier échange · Audit proposé ensuite</p>
    </div>
  </section>
}

const phases = [
  { label: 'Audit personnalisé', title: 'Repérer ce qui vous prend du temps.', text: 'Nous examinons vos tâches, vos logiciels et vos volumes. L’audit distingue les automatismes simples des usages où l’IA est utile, puis classe les chantiers selon vos priorités.', result: 'Un périmètre priorisé et défini par écrit.', type: 'brief' },
  { label: 'Mise en place', title: 'Installer, tester, puis activer.', text: 'KAERON configure les accès autorisés et les systèmes retenus dans vos outils. Un essai sur vos données vérifie chaque action avant votre accord.', result: 'Des actions testées dans votre environnement.', type: 'practice' },
  { label: 'Service', title: 'Le travail avance selon vos règles.', text: 'Le système effectue les tâches confiées, signale les éléments manquants et suit les dossiers. Les décisions réservées restent soumises à votre validation.', result: 'Moins de suivi manuel sur le périmètre convenu.', type: 'project' },
  { label: 'Suivi', title: 'Voir le travail et ajuster.', text: 'KAERON rend compte du travail effectué, entretient les accès et corrige ses défauts. Un point à trois mois permet d’ajuster le service aux besoins observés.', result: 'Un service contrôlé dans la durée.', type: 'review' },
]

function PhaseVisual({ type }: { type: string }) {
  if (type === 'brief') return <div className="phase-visual visual-brief" aria-hidden="true"><span className="visual-caption">Du quotidien aux priorités</span><div className="brief-inputs"><span>Vos tâches</span><span>Vos logiciels</span><span>Vos règles</span></div><div className="sample-sheet"><div className="sheet-heading"><span className="file-symbol" aria-hidden="true"><span className="arrow diagonal" /></span><strong>Le point de départ</strong></div><div className="brief-field"><span>Contexte</span><i/></div><div className="brief-field"><span>Objectif</span><i/></div><div className="brief-field"><span>Priorités</span><i/></div></div></div>
  if (type === 'practice') return <div className="phase-visual visual-practice" aria-hidden="true"><span className="visual-caption">Installer, puis vérifier</span><div className="prompt-bubble"><span>Vos règles</span><p>Un objectif précis.<br/>Le contexte qui compte.</p></div><div className="review-bubble"><div><span className="file-symbol"><Icon name="sparkle" /></span><strong>Votre validation</strong></div><p>Pertinence <i/> Exactitude <i/> Limites</p></div></div>
  if (type === 'project') return <div className="phase-visual visual-project" aria-hidden="true"><span className="visual-caption">Suivre un dossier jusqu’au bout</span><div className="project-stack"><div className="project-layer layer-back"/><div className="project-layer layer-middle"/><div className="sample-sheet project-front"><span className="sheet-reference">TRAVAIL OPÉRATIONNEL</span><strong>Du signal<br/>au résultat vérifié.</strong><div className="project-sections"><span>Actions</span><span>Attentes</span><span>Résultat</span></div></div></div></div>
  return <div className="phase-visual visual-review" aria-hidden="true"><span className="visual-caption">Rendre le travail accompli visible</span><div className="sample-sheet review-sheet"><div className="sheet-heading"><span className="file-symbol"><Icon name="check" /></span><strong>Faire le point</strong></div><div className="review-line"><Icon name="check" />Travail réalisé</div><div className="review-line"><Icon name="check" />Attentes suivies</div><div className="review-line"><Icon name="check" />Incidents traités</div><div className="review-foot">Point sur le périmètre à 3 mois</div></div></div>
}

function Programme() {
  return <section id="parcours" className="programme section-space"><div className="shell">
    <div className="section-intro" data-reveal><p className="eyebrow">De l’audit au service</p><h2>L’audit d’abord.<br/><span className="accent-word">Les bons systèmes ensuite.</span></h2><p>Nous partons de votre travail réel et de vos logiciels. <br/>Vous validez les priorités avant toute installation.</p></div>
    <div className="phase-grid">{phases.map((phase,index)=><article className={`phase-card phase-${phase.type}`} key={phase.type}>
      <PhaseVisual type={phase.type}/><div className="phase-copy"><div className="phase-label"><span>0{index+1}</span>{phase.label}</div><h3>{phase.title}</h3><p>{phase.text}</p><div className="phase-result"><Icon name="diagonal" />{phase.result}</div></div>
    </article>)}</div>
    <p className="programme-note">Illustrations du fonctionnement. Le périmètre, les logiciels, les décisions, les volumes et les conditions sont convenus avant la mise en service.</p>
  </div></section>
}

function LearningExperience() {
  return <section className="experience"><div className="shell experience-panel">
    <div className="experience-copy" data-reveal>
      <p className="eyebrow">Trois exemples · Du temps repris sur le répétitif</p>
      <h2>Des tâches qui avancent.<br/><span>Vous gardez la main.</span></h2>
      <p>Tri des mails, dépôt des pièces, préparation des factures : trois exemples de travail à étudier pendant l’audit. Automatisation classique ou IA, le choix dépend de vos outils, de vos règles et des validations que vous gardez.</p>
      <div className="experience-tag">Vos outils · Votre accord avant la mise en service</div>
    </div>
    <div className="learning-cards">
      <div className="learning-card" data-reveal>
        <div className="learning-card-top"><span>Les mails</span><strong>Tri <small>IA</small></strong></div>
        <h3>Trier les mails sans perdre le fil.</h3>
        <p>Les mails sont triés et les réponses préparées. Vous validez avant l’envoi.</p>
        <div className="learning-card-bottom"><span>Envoi après validation</span><Arrow diagonal/></div>
      </div>
      <div className="learning-card" data-reveal>
        <div className="learning-card-top"><span>Les justificatifs</span><strong>Dépôt <small>IA</small></strong></div>
        <h3>Retrouver les pièces au bon endroit.</h3>
        <p>Factures et reçus sont déposés dans votre comptabilité ; leur arrivée est vérifiée.</p>
        <div className="learning-card-bottom"><span>Arrivée vérifiée</span><Arrow diagonal/></div>
      </div>
      <div className="learning-card" data-reveal>
        <div className="learning-card-top"><span>Vos factures</span><strong>Facturation <small>IA</small></strong></div>
        <h3>Préparer sans courir après les pièces.</h3>
        <p>Les éléments du mois sont réunis, les pièces manquantes demandées et les factures présentées pour validation.</p>
        <div className="learning-card-bottom"><span>Émission après votre accord</span><Arrow diagonal/></div>
      </div>
    </div>
  </div></section>
}

const profiles = [
  { id: '01', title: 'Quand l’administratif remplit la journée.', text: 'Vous dirigez une petite équipe et les mails, pièces et relances reviennent à vous. L’audit repère ce qui peut avancer selon des règles validées.', type: 'Petites entreprises' },
  { id: '02', title: 'Quand un dossier change trop de mains.', text: 'Vos dossiers passent entre plusieurs personnes. KAERON relie les étapes et signale ce qui attend une validation.', type: 'PME et équipes' },
  { id: '03', title: 'Quand les papiers suivent le chantier.', text: 'Devis, reçus, factures : l’administratif vous reprend du temps de métier. L’audit cherche ce qui peut être préparé ou suivi automatiquement.', type: 'Artisans et indépendants' },
]

function Audience() {
  return <section id="pour-qui" className="audience section-space"><div className="shell">
    <div className="section-heading" data-reveal><div><p className="eyebrow">Votre quotidien d’abord</p><h2>Quand le répétitif prend<br/>sur votre vrai travail.</h2></div><p>L’audit part de vos interruptions et de vos outils, que vous dirigiez une petite équipe, une PME ou votre activité d’artisan.</p></div>
    <div className="profiles">{profiles.map(profile => <article className="profile" key={profile.id} data-reveal><div className="profile-top"><span>{profile.type}</span><span className="profile-number">{profile.id}</span></div><h3>{profile.title}</h3><p>{profile.text}</p></article>)}</div>
    <div className="prerequisites"><div><span className="tiny-label">Un audit à votre mesure</span><h3>Vos outils, vos règles. <br/>Un périmètre adapté.</h3></div><ul><li><Icon name="check" />Les tâches qui reviennent, le temps qu’elles prennent et le résultat que vous attendez.</li><li><Icon name="check" />Vos logiciels et comptes, avec les accès autorisés nécessaires au travail envisagé.</li><li><Icon name="check" />Les décisions que vous gardez : réponses, dépenses ou facturation à valider selon votre activité.</li><li><Icon name="check" />Les volumes, les règles et les données à préciser avant les essais et la mise en service.</li></ul></div>
  </div></section>
}

const questions = [
  { q: 'Quelles tâches automatiser, avec ou sans IA ?', a: 'Mails, justificatifs d’achat, facturation, relances ou propositions commerciales peuvent être étudiés. Certaines étapes suivent des règles simples ; d’autres peuvent bénéficier de l’IA pour traiter un contenu. L’audit regarde vos outils, vos volumes et les validations nécessaires avant de retenir les tâches adaptées.' },
  { q: 'Que se passe-t-il pendant l’audit personnalisé ?', a: 'Nous examinons vos processus réels, vos logiciels, vos volumes et les tâches qui vous prennent du temps. Nous distinguons l’automatisation classique des usages où l’IA est utile, puis priorisons les chantiers, les validations et les responsabilités. Une synthèse et une proposition chiffrée précèdent toute installation.' },
  { q: 'Quel est le tarif de l’audit et de l’installation ?', a: 'L’audit coûte 390 € HT, déduits si la commande suit sous 60 jours après la synthèse. À titre d’exemple, un socle et un processus ciblé représentent 1 800 € HT de mise en place et 420 € HT par mois. Ces prix concernent les logiciels déjà qualifiés, pour le périmètre et les volumes convenus au devis. Suivi, hébergement, entretien et support sont compris ; les licences de vos logiciels restent à votre charge.' },
  { q: 'Gardons-nous le contrôle des décisions ?', a: 'Oui. Vous fixez ce que KAERON fait seul et ce qui demande votre validation. Une décision porte sur le contenu, la version et les destinataires présentés ; s’ils changent, KAERON redemande. Les droits sont appliqués par personne et par entreprise. Un responsable peut suspendre une responsabilité à tout moment : les nouvelles actions s’arrêtent, les étapes en cours s’interrompent quand c’est sûr. Les actions déjà réalisées restent dans vos logiciels.' },
  { q: 'Où vont nos données et nos documents ?', a: 'Les originaux restent dans vos logiciels. KAERON conserve seulement les copies utiles au service pour les durées fixées au contrat. L’hébergement du service et la base sont en Europe, chez des sociétés américaines. Les traitements d’IA passent par OpenRouter puis le fournisseur retenu : leur traitement en Union européenne n’est pas garanti. KAERON n’entraîne aucun modèle avec vos données sans accord écrit. Les échanges Telegram ou WhatsApp ne sont pas chiffrés de bout en bout.' },
  { q: 'Que se passe-t-il après le premier échange ?', a: 'Nous vérifions si votre besoin entre dans l’offre, quels logiciels sont concernés et quelles décisions vous gardez. Si le besoin convient, l’audit personnalisé prépare les priorités et une proposition chiffrée. Un logiciel encore non qualifié ou un besoin spécifique nécessite une étude bornée et un devis. Vous validez le périmètre, les accès et les essais avant la mise en service ; l’abonnement commence alors.' },
]

function FAQ() {
  return <section id="faq" className="faq section-space"><div className="shell faq-layout"><div className="faq-heading"><p className="eyebrow">Questions fréquentes</p><h2>Vos questions <br/>avant l’audit.</h2><p>Ce qui peut être automatisé, ce que vous validez et ce que cela coûte.</p></div><div className="faq-list">{questions.map((question, index) => <details key={question.q}><summary><span className="faq-index">0{index + 1}</span><span>{question.q}</span><Icon name="plus" className="faq-icon" /></summary><p>{question.a}</p></details>)}</div></div></section>
}

function Closing() {
  return <footer id="contact"><div className="shell">
    <div className="closing" data-reveal><div><p className="eyebrow">Votre prochaine étape</p><h2>Parlons des tâches<br/><em>qui vous prennent du temps.</em></h2><p>Racontez-nous ce qui revient chaque semaine, les outils que vous utilisez et ce qui freine votre équipe. Un premier échange cadre le besoin ; l’audit personnalisé établit ensuite les priorités et le périmètre à valider avant l’installation.</p><ExternalCTA/><p className="cta-note">Premier échange pour cadrer votre besoin avant l’audit.</p>{!formUrl && <p className="preview-notice">Le formulaire externe n’est pas encore connecté dans cet aperçu.</p>}</div><div className="conversation-card"><Icon name="diagonal" className="conversation-sign" /><p>Vos tâches.<br/>Vos priorités.<br/><strong>Votre audit.</strong></p><span>Premier échange · Audit personnalisé</span></div></div>
    <div className="footer-bottom"><Wordmark/><div className="footer-info"><p>KAERON · Audit et automatisation pour entreprises<br/>Des processus analysés, des systèmes adaptés<br/><span className="footer-ref">Vos outils · Vos décisions</span></p><nav className="footer-legal" aria-label="Informations légales"><a href="/mentions-legales/">Mentions légales</a><a href="/confidentialite/">Confidentialité</a><a href="/cgu/">Conditions d'utilisation</a></nav></div><a className="back-top" href="#top">Retour en haut <Icon name="up" /></a></div>
    <p className="scope-note">Les processus, les accès, les décisions et les volumes sont définis dans l’audit et la proposition. Les systèmes retenus sont testés avant la mise en service ; leur exploitation et le support suivent les conditions convenues.</p>
  </div></footer>
}

function StickyContact({ menuOpen }: { menuOpen: boolean }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const hero = document.querySelector('.hero')
    const contact = document.getElementById('contact')
    if (!hero || !contact || typeof IntersectionObserver === 'undefined') return
    let heroVisible = true
    let contactVisible = false
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting
        if (entry.target === contact) contactVisible = entry.isIntersecting
      }
      setVisible(!heroVisible && !contactVisible)
    })
    observer.observe(hero); observer.observe(contact)
    return () => observer.disconnect()
  }, [])
  if (!visible || menuOpen) return null
  return <div className="sticky-contact"><ExternalCTA />{!formUrl && <span className="sticky-contact-note">Formulaire en attente de connexion</span>}</div>
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  usePageMotion(false)
  return <><a className="skip-link" href="#contenu">Aller au contenu</a><div id="top"/><Header open={menuOpen} setOpen={setMenuOpen}/><main id="contenu"><Hero paused={false}/><Programme/><LearningExperience/><Audience/><FAQ/></main><Closing/><StickyContact menuOpen={menuOpen}/></>
}
