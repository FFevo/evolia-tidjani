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

function ExternalCTA({ label = 'Demander mon audit gratuit', className = '' }: { label?: string; className?: string }) {
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
    <ExternalCTA className="header-cta" label="Audit gratuit" />
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
      <h1 id="hero-title">Consacrez votre temps<br/>à votre métier.<em>On s’occupe du répétitif.</em></h1>
      <p className="hero-description">Factures fournisseurs, devis, mails, demandes de visite : l’administratif vous éloigne de vos clients et de votre travail. <strong>KAERON audite votre organisation, puis automatise ce qui peut l’être. Les décisions importantes restent entre vos mains.</strong></p>
      <div className="hero-actions"><ExternalCTA/><a className="hero-discover" href="#parcours">Découvrir la démarche <Icon name="down" /></a></div>
      <p className="cta-note">Premier échange et audit personnalisé gratuits</p>
    </div>
  </section>
}

const phases = [
  { label: 'Audit personnalisé', title: 'Comprendre ce qui vous prend du temps.', text: 'Nous examinons les tâches qui reviennent, vos logiciels et vos volumes. Ensemble, nous retenons ce qui peut être automatisé, avec des règles simples ou l’IA selon le besoin.', result: 'Des priorités et un périmètre définis par écrit.', type: 'brief' },
  { label: 'Mise en place', title: 'Installer dans vos outils, puis tester.', text: 'KAERON configure les solutions retenues et les validations nécessaires. Vous examinez les résultats des essais avant de donner votre accord pour la mise en service.', result: 'Des tâches testées avant leur activation.', type: 'practice' },
  { label: 'Au quotidien', title: 'Le répétitif avance selon vos règles.', text: 'Tri, classement, préparation ou suivi : les tâches convenues avancent dans vos outils. Les réponses, les factures et les décisions prévues restent soumises à votre validation.', result: 'Moins de suivi manuel sur le périmètre convenu.', type: 'project' },
  { label: 'Suivi', title: 'Voir ce qui avance et ajuster.', text: 'KAERON suit les actions réalisées et les points en attente, puis ajuste le service avec vous. Un point à trois mois permet de revoir les besoins de votre activité.', result: 'Un service contrôlé dans la durée.', type: 'review' },
]

function PhaseVisual({ type }: { type: string }) {
  if (type === 'brief') return <div className="phase-visual visual-brief" aria-hidden="true"><span className="visual-caption">Du quotidien aux priorités</span><div className="brief-inputs"><span>Vos tâches</span><span>Vos logiciels</span><span>Vos règles</span></div><div className="sample-sheet"><div className="sheet-heading"><span className="file-symbol" aria-hidden="true"><span className="arrow diagonal" /></span><strong>Le point de départ</strong></div><div className="brief-field"><span>Contexte</span><i/></div><div className="brief-field"><span>Objectif</span><i/></div><div className="brief-field"><span>Priorités</span><i/></div></div></div>
  if (type === 'practice') return <div className="phase-visual visual-practice" aria-hidden="true"><span className="visual-caption">Installer, puis vérifier</span><div className="prompt-bubble"><span>Vos règles</span><p>Un objectif précis.<br/>Le contexte qui compte.</p></div><div className="review-bubble"><div><span className="file-symbol"><Icon name="sparkle" /></span><strong>Votre validation</strong></div><p>Pertinence <i/> Exactitude <i/> Limites</p></div></div>
  if (type === 'project') return <div className="phase-visual visual-project" aria-hidden="true"><span className="visual-caption">Suivre un dossier jusqu’au bout</span><div className="project-stack"><div className="project-layer layer-back"/><div className="project-layer layer-middle"/><div className="sample-sheet project-front"><span className="sheet-reference">TRAVAIL OPÉRATIONNEL</span><strong>Du signal<br/>au résultat vérifié.</strong><div className="project-sections"><span>Actions</span><span>Attentes</span><span>Résultat</span></div></div></div></div>
  return <div className="phase-visual visual-review" aria-hidden="true"><span className="visual-caption">Rendre le travail accompli visible</span><div className="sample-sheet review-sheet"><div className="sheet-heading"><span className="file-symbol"><Icon name="check" /></span><strong>Faire le point</strong></div><div className="review-line"><Icon name="check" />Travail réalisé</div><div className="review-line"><Icon name="check" />Attentes suivies</div><div className="review-line"><Icon name="check" />Incidents traités</div><div className="review-foot">Point sur le périmètre à 3 mois</div></div></div>
}

function Programme() {
  return <section id="parcours" className="programme section-space"><div className="shell">
    <div className="section-intro" data-reveal><p className="eyebrow">De l’audit à la mise en place</p><h2>Votre quotidien d’abord.<br/><span className="accent-word">Des solutions à votre mesure.</span></h2><p>Nous partons des tâches qui remplissent vos journées et des outils que vous utilisez. <br/>Vous choisissez les priorités et les décisions que vous gardez.</p></div>
    <div className="phase-grid">{phases.map((phase,index)=><article className={`phase-card phase-${phase.type}`} key={phase.type}>
      <PhaseVisual type={phase.type}/><div className="phase-copy"><div className="phase-label"><span>0{index+1}</span>{phase.label}</div><h3>{phase.title}</h3><p>{phase.text}</p><div className="phase-result"><Icon name="diagonal" />{phase.result}</div></div>
    </article>)}</div>
    <p className="programme-note">Illustrations du fonctionnement. Les tâches, les logiciels, les accès, les volumes et les validations sont définis avant la mise en service.</p>
  </div></section>
}

function LearningExperience() {
  return <section className="experience"><div className="shell experience-panel">
    <div className="experience-copy" data-reveal>
      <p className="eyebrow">Trois exemples de tâches à étudier</p>
      <h2>L’administratif avance.<br/><span>Vous gardez la main.</span></h2>
      <p>Mails à trier, pièces à ranger, factures à préparer : l’audit étudie ces tâches dans vos outils. Une règle simple suffit parfois ; l’IA intervient si elle est utile au travail demandé.</p>
      <div className="experience-tag">Vos outils · Vos règles · Vos validations</div>
    </div>
    <div className="learning-cards">
      <div className="learning-card" data-reveal>
        <div className="learning-card-top"><span>Les mails</span><strong>Tri <small>IA</small></strong></div>
        <h3>Voir les messages qui demandent votre attention.</h3>
        <p>Les mails peuvent être triés et les réponses préparées selon vos consignes. Vous validez avant l’envoi.</p>
        <div className="learning-card-bottom"><span>Réponses à valider</span><Arrow diagonal/></div>
      </div>
      <div className="learning-card" data-reveal>
        <div className="learning-card-top"><span>Les justificatifs</span><strong>Dépôt <small>IA</small></strong></div>
        <h3>Retrouver les pièces au bon endroit.</h3>
        <p>Factures et reçus peuvent être classés dans les outils retenus. Les pièces manquantes ou à vérifier sont signalées.</p>
        <div className="learning-card-bottom"><span>Exceptions signalées</span><Arrow diagonal/></div>
      </div>
      <div className="learning-card" data-reveal>
        <div className="learning-card-top"><span>Vos factures</span><strong>Facturation <small>IA</small></strong></div>
        <h3>Préparer les factures avec les bonnes pièces.</h3>
        <p>Les éléments nécessaires sont réunis, les pièces manquantes repérées et les factures préparées pour votre validation.</p>
        <div className="learning-card-bottom"><span>Émission après votre accord</span><Arrow diagonal/></div>
      </div>
    </div>
  </div></section>
}

const profiles = [
  { id: '01', title: 'Quand l’administratif revient toujours à vous.', text: 'Entre clients et équipe, les mails, pièces et relances finissent sur votre bureau. L’audit repère ce qui peut avancer selon vos règles.', type: 'Petites entreprises' },
  { id: '02', title: 'Quand vos dossiers demandent trop de suivi.', text: 'Devis, documents et validations passent d’une personne à l’autre. KAERON identifie les étapes à relier et les décisions à vous présenter.', type: 'PME et équipes' },
  { id: '03', title: 'Quand les papiers prolongent la journée.', text: 'Après les visites et les chantiers, restent les devis, reçus et factures. L’audit cherche ce qui peut être préparé ou suivi pour vous laisser plus de temps sur le terrain.', type: 'Artisans et indépendants' },
]

function Audience() {
  return <section id="pour-qui" className="audience section-space"><div className="shell">
    <div className="section-heading" data-reveal><div><p className="eyebrow">Votre métier d’abord</p><h2>Du temps pour ce que<br/>vous faites vraiment.</h2></div><p>TPE, PME ou artisan : nous partons des tâches qui interrompent vos journées et des outils que vous utilisez.</p></div>
    <div className="profiles">{profiles.map(profile => <article className="profile" key={profile.id} data-reveal><div className="profile-top"><span>{profile.type}</span><span className="profile-number">{profile.id}</span></div><h3>{profile.title}</h3><p>{profile.text}</p></article>)}</div>
    <div className="prerequisites"><div><span className="tiny-label">Un audit à votre mesure</span><h3>Vos outils, vos priorités. <br/>Un périmètre à valider.</h3></div><ul><li><Icon name="check" />Les tâches répétitives et le temps qu’elles vous prennent.</li><li><Icon name="check" />Les logiciels que vous utilisez et les accès nécessaires.</li><li><Icon name="check" />Les décisions et les actions que vous souhaitez valider.</li><li><Icon name="check" />Les volumes, les règles et les résultats attendus.</li></ul></div>
  </div></section>
}

const questions = [
  { q: 'Quelles tâches peut-on automatiser ?', a: 'Tri des mails, classement des justificatifs, préparation des factures, devis ou suivi des relances : l’audit étudie ce qui vous prend du temps. Une règle simple suffit pour certaines étapes ; l’IA peut aider à traiter un contenu. Le choix dépend de vos outils, de vos volumes et des validations nécessaires.' },
  { q: 'Que comprend l’audit personnalisé ?', a: 'Nous examinons votre quotidien, vos logiciels, vos volumes et vos priorités. Nous repérons les tâches à automatiser, avec ou sans IA, et les décisions que vous souhaitez garder. Une synthèse et une proposition chiffrée précèdent toute installation.' },
  { q: 'L’audit est-il gratuit ? Combien coûte la mise en place ?', a: 'L’audit personnalisé est gratuit. À titre d’exemple, un socle et un processus ciblé représentent 1 800 € HT de mise en place et 420 € HT par mois. Ces prix concernent les logiciels déjà qualifiés, pour le périmètre et les volumes convenus au devis. Suivi, hébergement, entretien et support sont compris ; les licences de vos logiciels restent à votre charge.' },
  { q: 'Quelles décisions restent entre nos mains ?', a: 'Vous fixez ce qui peut avancer seul et ce qui demande votre accord, par exemple une réponse ou une facture. Vous validez le contenu, sa version et ses destinataires ; si ces éléments changent, KAERON redemande. Un responsable peut suspendre une responsabilité à tout moment : les nouvelles actions s’arrêtent et les étapes en cours s’interrompent quand c’est sûr. Les actions déjà réalisées restent dans vos logiciels.' },
  { q: 'Où vont nos données et nos documents ?', a: 'Les originaux restent dans vos logiciels. KAERON conserve seulement les copies utiles au service pour les durées fixées au contrat. L’hébergement du service et la base sont en Europe, chez des sociétés américaines. Les traitements d’IA passent par OpenRouter puis le fournisseur retenu : leur traitement en Union européenne n’est pas garanti. KAERON n’entraîne aucun modèle avec vos données sans accord écrit. Les échanges Telegram ou WhatsApp ne sont pas chiffrés de bout en bout.' },
  { q: 'Que se passe-t-il après ma demande ?', a: 'Un premier échange nous aide à comprendre les tâches qui vous prennent du temps, vos outils et les décisions que vous gardez. Si le besoin entre dans l’offre, l’audit personnalisé définit les priorités et prépare une proposition chiffrée. Un logiciel non qualifié ou un besoin spécifique nécessite une étude bornée et un devis. Vous validez le périmètre, les accès et les essais avant la mise en service ; l’abonnement commence alors.' },
]

function FAQ() {
  return <section id="faq" className="faq section-space"><div className="shell faq-layout"><div className="faq-heading"><p className="eyebrow">Questions fréquentes</p><h2>Vos questions <br/>avant l’audit.</h2><p>Les tâches possibles, vos validations, les données et les conditions du service.</p></div><div className="faq-list">{questions.map((question, index) => <details key={question.q}><summary><span className="faq-index">0{index + 1}</span><span>{question.q}</span><Icon name="plus" className="faq-icon" /></summary><p>{question.a}</p></details>)}</div></div></section>
}

function Closing() {
  return <footer id="contact"><div className="shell">
    <div className="closing" data-reveal><div><p className="eyebrow">Votre prochaine étape</p><h2>Et si vous retrouviez<br/><em>du temps pour votre métier ?</em></h2><p>Parlez-nous de votre quotidien, des outils que vous utilisez et des tâches qui reviennent chaque semaine. Un premier échange cadre votre besoin ; l’audit personnalisé définit ensuite les automatisations à envisager et les validations à conserver.</p><ExternalCTA/><p className="cta-note">Premier échange et audit personnalisé gratuits.</p>{!formUrl && <p className="preview-notice">Le formulaire externe n’est pas encore connecté dans cet aperçu.</p>}</div><div className="conversation-card"><Icon name="diagonal" className="conversation-sign" /><p>Vos tâches.<br/>Vos outils.<br/><strong>Votre audit.</strong></p><span>Premier échange · Audit personnalisé</span></div></div>
    <div className="footer-bottom"><Wordmark/><div className="footer-info"><p>KAERON · Audit personnalisé et automatisation<br/>Des solutions adaptées à votre activité, avec ou sans IA<br/><span className="footer-ref">Vos outils · Vos règles · Vos validations</span></p><nav className="footer-legal" aria-label="Informations légales"><a href="/mentions-legales/">Mentions légales</a><a href="/confidentialite/">Confidentialité</a><a href="/cgu/">Conditions d'utilisation</a></nav></div><a className="back-top" href="#top">Retour en haut <Icon name="up" /></a></div>
    <p className="scope-note">Le périmètre, les accès, les volumes et les validations sont définis dans l’audit et la proposition. Les automatisations retenues sont testées avant la mise en service ; leur exploitation et le support suivent les conditions convenues.</p>
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
