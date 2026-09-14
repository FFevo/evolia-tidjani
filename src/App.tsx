import { useEffect, useRef, useState } from 'react'
import { getExternalFormUrl } from './lib/external-form'
import { SilkBackground } from './components/SilkBackground'
import { usePageMotion } from './hooks/usePageMotion'
import './App.css'

const formUrl = getExternalFormUrl()

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span className={diagonal ? 'arrow diagonal' : 'arrow'} aria-hidden="true" />
}

function ExternalCTA({ label = 'Parler de mon projet', className = '' }: { label?: string; className?: string }) {
  const content = <>{label}<span className="button-orbit"><Arrow diagonal /></span></>
  return formUrl
    ? <a className={`contact-button ${className}`} href={formUrl} target="_blank" rel="noopener noreferrer">{content}<span className="sr-only"> — formulaire externe, nouvel onglet</span></a>
    : <button className={`contact-button ${className}`} type="button" disabled title="Le lien du formulaire externe n’a pas encore été fourni.">{content}</button>
}

function Wordmark() {
  return <a className="wordmark" href="#top" aria-label="Evolia — accueil"><img className="brand-logo" src="/brand/evolia-logo.png" alt="Evolia" width="2168" height="725"/></a>
}

function Header() {
  const [open, setOpen] = useState(false)
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
    <nav className="desktop-nav" aria-label="Navigation principale"><a href="#parcours">Le parcours</a><a href="#pour-qui">Pour qui ?</a><a href="#faq">Questions</a></nav>
    <ExternalCTA className="header-cta" label="Échangeons" />
    <button className="menu-toggle" type="button" ref={toggle} aria-controls="mobile-nav" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Fermer' : 'Menu'}<span aria-hidden="true">{open ? '−' : '+'}</span></button>
  </div><nav id="mobile-nav" className="mobile-nav shell" hidden={!open} aria-label="Navigation mobile">
    <a ref={firstLink} href="#parcours" onClick={() => setOpen(false)}>Le parcours <Arrow /></a><a href="#pour-qui" onClick={() => setOpen(false)}>Pour qui ? <Arrow /></a><a href="#faq" onClick={() => setOpen(false)}>Questions <Arrow /></a><ExternalCTA />
  </nav></header>
}

function Hero({ paused }: { paused: boolean }) {
  return <section className="hero" aria-labelledby="hero-title">
    <SilkBackground paused={paused}/>
    <div className="shell hero-content">
      <p className="hero-course">Formation Consultant IA & Automatisation</p>
      <h1 id="hero-title">En 6 semaines,<br/>construisez votre <em>premier projet IA.</em></h1>
      <p className="hero-description">Salarié, indépendant ou en reconversion, faites évoluer votre expérience métier avec l’IA. <strong>Une méthode, des ateliers en direct et un projet concret pour passer des idées à la pratique.</strong></p>
      <div className="hero-actions"><ExternalCTA label="Parlons de mon évolution"/><a className="hero-discover" href="#parcours">Découvrir le parcours <span className="text-symbol" aria-hidden="true">{'↓\uFE0E'}</span></a></div>
      <p className="cta-note">Un échange d’environ 20 minutes · Sans engagement</p>
      <div className="hero-facts"><div><span className="fact-sign" aria-hidden="true">{'↗\uFE0E'}</span><span><strong>36 heures</strong>sur six semaines</span></div><div><span className="fact-sign" aria-hidden="true">◈</span><span><strong>6 à 10 participants</strong>accompagnés en direct</span></div><div><span className="fact-sign" aria-hidden="true">{'✓\uFE0E'}</span><span><strong>Aucun prérequis</strong>en IA ou en programmation</span></div></div>
    </div>
  </section>
}

const phases = [
  { label: 'Cadrer', title: 'Le bon problème, avant les outils.', text: 'Repérez un besoin utile dans votre métier. Apprenez à poser le contexte, le périmètre et les contraintes pour savoir par où commencer.', result: 'Un cas d’usage clairement défini.', type: 'brief' },
  { label: 'Pratiquer', title: 'Une consigne. Des essais. Votre regard.', text: 'Prenez en main Claude Code et Codex en atelier. Formulez vos consignes, examinez les résultats et apprenez à repérer ce qui doit être corrigé.', result: 'Des usages testés et relus.', type: 'practice' },
  { label: 'Construire', title: 'Vos apprentissages prennent forme.', text: 'Reliez les ateliers autour d’un cas pédagogique. Les 12 heures de projet permettent de pratiquer, d’ajuster et de documenter votre démarche.', result: 'Un projet concret et documenté.', type: 'project' },
  { label: 'Évaluer', title: 'Présenter le travail. Comprendre la suite.', text: 'Faites le point à travers quatre caps internes. Expliquez vos choix, les limites du projet et ce qui reste à approfondir.', result: 'Des acquis évalués, une démarche présentable.', type: 'review' },
]

function PhaseVisual({ type }: { type: string }) {
  if (type === 'brief') return <div className="phase-visual visual-brief" aria-hidden="true"><span className="visual-caption">Du besoin au brief</span><div className="brief-inputs"><span>Une idée</span><span>Un besoin métier</span><span>Des contraintes</span></div><div className="sample-sheet"><div className="sheet-heading"><span className="file-symbol" aria-hidden="true">{'↗\uFE0E'}</span><strong>Le point de départ</strong></div><div className="brief-field"><span>Contexte</span><i/></div><div className="brief-field"><span>Objectif</span><i/></div><div className="brief-field"><span>Périmètre</span><i/></div></div></div>
  if (type === 'practice') return <div className="phase-visual visual-practice" aria-hidden="true"><span className="visual-caption">Piloter, puis vérifier</span><div className="prompt-bubble"><span>Votre consigne</span><p>Un objectif précis.<br/>Le contexte qui compte.</p></div><div className="review-bubble"><div><span className="file-symbol" aria-hidden="true">{'✦\uFE0E'}</span><strong>Votre relecture</strong></div><p>Pertinence <i/> Exactitude <i/> Limites</p></div></div>
  if (type === 'project') return <div className="phase-visual visual-project" aria-hidden="true"><span className="visual-caption">Des essais à un ensemble cohérent</span><div className="project-stack"><div className="project-layer layer-back"/><div className="project-layer layer-middle"/><div className="sample-sheet project-front"><span className="sheet-reference">PROJET D’APPRENTISSAGE</span><strong>De l’idée<br/>à la mise en pratique.</strong><div className="project-sections"><span>Démarche</span><span>Essais</span><span>Limites</span></div></div></div></div>
  return <div className="phase-visual visual-review" aria-hidden="true"><span className="visual-caption">Rendre le chemin parcouru visible</span><div className="sample-sheet review-sheet"><div className="sheet-heading"><span className="file-symbol" aria-hidden="true">{'✓\uFE0E'}</span><strong>Faire le point</strong></div><div className="review-line"><span className="text-symbol" aria-hidden="true">{'✓\uFE0E'}</span>Démarche expliquée</div><div className="review-line"><span className="text-symbol" aria-hidden="true">{'✓\uFE0E'}</span>Limites identifiées</div><div className="review-line"><span className="text-symbol" aria-hidden="true">{'✓\uFE0E'}</span>Acquis évalués</div><div className="review-foot">4 caps pédagogiques internes</div></div></div>
}

function Programme() {
  return <section id="parcours" className="programme section-space"><div className="shell">
    <div className="section-intro" data-reveal><p className="eyebrow">Le parcours · De l’envie à la pratique</p><h2>Un fil conducteur.<br/><span className="accent-word">Votre projet.</span></h2><p>Vous n’avez pas à tout apprendre à la fois. <br/>Chaque étape donne une forme plus précise à la suivante.</p></div>
    <div className="phase-grid">{phases.map((phase,index)=><article className={`phase-card phase-${phase.type}`} key={phase.type}>
      <PhaseVisual type={phase.type}/><div className="phase-copy"><div className="phase-label"><span>0{index+1}</span>{phase.label}</div><h3>{phase.title}</h3><p>{phase.text}</p><div className="phase-result"><span className="text-symbol" aria-hidden="true">{'↗\uFE0E'}</span>{phase.result}</div></div>
    </article>)}</div>
    <p className="programme-note">Illustrations pédagogiques. Exercices sur données synthétiques ou anonymisées. Les quatre caps internes sont distincts de l’examen RS6776.</p>
  </div></section>
}

function LearningExperience() {
  return <section className="experience"><div className="shell experience-panel">
    <div className="experience-copy" data-reveal><p className="eyebrow">À distance. Vraiment accompagnés.</p><h2>Vous pratiquez.<br/>Vous échangez. <br/><span>Vous avancez.</span></h2><p>Des ateliers en direct pour poser vos questions et confronter vos idées. Un petit groupe pour bénéficier d’un cadre et garder le rythme.</p><div className="experience-tag">6 à 10 participants · Entièrement à distance</div></div>
    <div className="learning-cards"><div className="learning-card" data-reveal><div className="learning-card-top"><span>Les ateliers</span><strong>24 <small>h</small></strong></div><h3>Ensemble, en direct.</h3><p>Des temps encadrés pour pratiquer, échanger et faire le point sur vos acquis.</p><div className="learning-card-bottom"><span>Présence aux ateliers et validations</span><span className="text-symbol" aria-hidden="true">{'↗\uFE0E'}</span></div></div><div className="learning-card" data-reveal><div className="learning-card-top"><span>Votre projet</span><strong>12 <small>h</small></strong></div><h3>Le temps de construire.</h3><p>Du travail entre les sessions pour relier les apprentissages et documenter votre démarche.</p><div className="learning-card-bottom"><span>36 heures au total, sur 6 semaines</span><span className="text-symbol" aria-hidden="true">{'↗\uFE0E'}</span></div></div></div>
  </div></section>
}

const profiles = [
  { id: '01', title: 'Évoluer dans votre métier.', text: 'Vous connaissez les besoins du terrain. Apprenez à y intégrer des usages de l’IA et de l’automatisation.', type: 'Évolution professionnelle' },
  { id: '02', title: 'Ouvrir un nouveau chapitre.', text: 'Vous préparez une reconversion. Appuyez-vous sur votre expérience pour explorer le conseil en IA.', type: 'Reconversion' },
  { id: '03', title: 'Enrichir votre activité.', text: 'Vous êtes indépendant. Développez vos compétences pour mieux comprendre et accompagner les besoins liés à l’IA.', type: 'Activité indépendante' },
]

function Audience() {
  return <section id="pour-qui" className="audience section-space"><div className="shell">
    <div className="section-heading" data-reveal><div><p className="eyebrow">Votre point de départ</p><h2>Une nouvelle étape.<br/>Dans votre trajectoire.</h2></div><p>Votre expérience compte.<br/>Le parcours s’appuie sur ce que vous connaissez déjà.</p></div>
    <div className="profiles">{profiles.map(profile => <article className="profile" key={profile.id} data-reveal><div className="profile-top"><span>{profile.type}</span><span className="profile-number">{profile.id}</span></div><h3>{profile.title}</h3><p>{profile.text}</p></article>)}</div>
    <div className="prerequisites"><div><span className="tiny-label">Pour suivre le parcours</span><h3>Un socle simple. <br/>Un engagement réel.</h3></div><ul><li><span className="text-symbol" aria-hidden="true">{'✓\uFE0E'}</span>12 mois d’expérience professionnelle, ou une équivalence validée à l’admission.</li><li><span className="text-symbol" aria-hidden="true">{'✓\uFE0E'}</span>Une aisance courante avec les fichiers, documents en ligne et tableurs.</li><li><span className="text-symbol" aria-hidden="true">{'✓\uFE0E'}</span>Un ordinateur, une connexion stable, un micro, une webcam et les droits d’installation nécessaires.</li><li><span className="text-symbol" aria-hidden="true">{'✓\uFE0E'}</span>La disponibilité pour 24 h encadrées et 12 h de projet.</li></ul></div>
  </div></section>
}

const questions = [
  { q: 'Faut-il savoir coder ou déjà utiliser l’IA ?', a: 'Non. Aucun prérequis en IA, programmation ou automatisation n’est demandé. Le parcours s’appuie sur votre expérience professionnelle et nécessite une autonomie courante avec un navigateur, des fichiers, des documents collaboratifs et un tableur simple.' },
  { q: 'Comment s’organisent les six semaines ?', a: 'Le parcours représente 36 heures : 24 heures encadrées en direct et 12 heures de projet. Il se déroule entièrement à distance, avec une présence nécessaire aux ateliers et aux quatre caps internes. Les dates et horaires de la cohorte sont à confirmer avant l’inscription. Ce n’est pas une formation composée uniquement de vidéos à suivre seul.' },
  { q: 'Quels outils et quel équipement prévoir ?', a: 'Un ordinateur compatible, une connexion stable, un microphone, une webcam et les droits d’installation sont nécessaires. Claude Code et Codex sont utilisés par abonnement. Les systèmes supportés, les abonnements fournis ou laissés à votre charge et leurs coûts sont à confirmer avant l’inscription.' },
  { q: 'Quel est le tarif ? Le CPF est-il possible ?', a: 'Le tarif et les conditions sont communiqués avant toute inscription définitive. Le rattachement retenu dans les informations produit est la certification RS6776, avec un portage via AUTONOMIA. Le lien de l’offre Mon Compte Formation, les frais de certification et l’éventuel reste à charge restent à confirmer. Le financement dépend du dossier : aucune prise en charge intégrale n’est garantie.' },
  { q: 'Quelle est la certification visée ?', a: '« Consultant IA & Automatisation » est l’intitulé du parcours. La certification visée est RS6776 « Création de contenus rédactionnels et visuels par l’usage responsable de l’intelligence artificielle générative », délivrée par INKREA FORMATIONS. L’évaluation est organisée par AUTONOMIA : rapport écrit fondé sur six cas pratiques, puis soutenance orale de 20 minutes. Les quatre caps du parcours sont des évaluations internes distinctes de cet examen.' },
  { q: 'Que se passe-t-il après le premier échange ?', a: 'L’admission comprend un questionnaire de positionnement, une vérification technique et un échange d’environ 20 minutes. L’admission pédagogique, la demande de financement et l’inscription définitive sont des étapes distinctes. Les modalités, le calendrier, les contacts et les conditions applicables doivent être précisés avant tout engagement. Un besoin d’adaptation peut être étudié lors d’un échange confidentiel.' },
]

function FAQ() {
  return <section id="faq" className="faq section-space"><div className="shell faq-layout"><div className="faq-heading"><p className="eyebrow">Questions fréquentes</p><h2>Les choses <br/>au clair.</h2><p>Le contenu, le rythme et les conditions : tout ce qui compte avant de vous lancer.</p></div><div className="faq-list">{questions.map((question, index) => <details key={question.q}><summary><span className="faq-index">0{index + 1}</span><span>{question.q}</span><span className="faq-icon" aria-hidden="true">+</span></summary><p>{question.a}</p></details>)}</div></div></section>
}

function Closing() {
  return <footer id="contact"><div className="shell">
    <div className="closing" data-reveal><div><p className="eyebrow">Le prochain pas est simple.</p><h2>Le prochain pas ?<br/><em>En parler ensemble.</em></h2><p>Un échange d’environ 20 minutes pour voir comment le parcours peut s’inscrire dans votre trajectoire.</p><ExternalCTA label="Faire le premier pas"/><p className="cta-note">Vous accédez directement à notre formulaire externe.</p>{!formUrl && <p className="preview-notice">Le formulaire externe n’est pas encore connecté dans cet aperçu.</p>}</div><div className="conversation-card"><span className="conversation-sign" aria-hidden="true">{'↗\uFE0E'}</span><p>Votre expérience.<br/>Vos envies.<br/><strong>La suite à dessiner.</strong></p><span>Un échange d’environ 20 minutes</span></div></div>
    <div className="footer-bottom"><Wordmark/><div className="footer-info"><p>Parcours Consultant IA & Automatisation<br/>Portage et organisation de l’évaluation : AUTONOMIA<br/><span className="footer-ref">SIRET 51520065700028</span></p><nav className="footer-legal" aria-label="Informations légales"><a href="/mentions-legales/">Mentions légales</a><a href="/confidentialite/">Confidentialité</a><a href="/cgu/">Conditions d'utilisation</a></nav></div><a className="back-top" href="#top">Retour en haut <span className="text-symbol" aria-hidden="true">{'↑\uFE0E'}</span></a></div>
    <p className="scope-note">Les exercices utilisent des données synthétiques ou anonymisées. Le parcours ne couvre pas le développement avancé, les API, les modèles locaux ni la mise en production de systèmes sensibles. Il ne garantit ni mission, ni emploi, ni revenu.</p>
  </div></footer>
}

function StickyContact() {
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
  if (!formUrl || !visible) return null
  return <div className="sticky-contact"><ExternalCTA/></div>
}

export default function App() {
  const [paused, setPaused] = useState(false)
  usePageMotion(paused)
  return <><a className="skip-link" href="#contenu">Aller au contenu</a><div id="top"/><Header/><main id="contenu"><Hero paused={paused}/><Programme/><LearningExperience/><Audience/><FAQ/></main><Closing/><StickyContact/><button className="motion-toggle" type="button" aria-pressed={paused} onClick={() => setPaused(!paused)} aria-label={paused ? "Reprendre les animations" : "Mettre les animations en pause"} title={paused ? "Reprendre les animations" : "Mettre les animations en pause"} style={formUrl ? { bottom: 92 } : undefined}><span className="text-symbol" aria-hidden="true">{paused ? '▶\uFE0E' : 'Ⅱ'}</span><span>{paused ? "Reprendre" : "Pause"}</span></button></>
}
