import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
    useEffect(() => {
        // --- 0. NAVIGATION MOBILE ---
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuToggle && mobileMenu) {
            const toggleMenu = () => {
                const isOpen = mobileMenu.classList.toggle('active');
                mobileMenu.hidden = !isOpen;
                mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
                mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
                mobileMenuToggle.innerHTML = isOpen
                    ? '<i class="fa-solid fa-xmark"></i>'
                    : '<i class="fa-solid fa-bars"></i>';
            };
            
            // Remove existing listeners if any (cleanup for React Strict Mode)
            mobileMenuToggle.replaceWith(mobileMenuToggle.cloneNode(true));
            const newToggle = document.getElementById('mobile-menu-toggle');
            newToggle.addEventListener('click', toggleMenu);

            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    mobileMenu.hidden = true;
                    newToggle.setAttribute('aria-expanded', 'false');
                    newToggle.setAttribute('aria-label', 'Ouvrir le menu');
                    newToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
                });
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileMenu.hidden = true;
                    newToggle.setAttribute('aria-expanded', 'false');
                    newToggle.setAttribute('aria-label', 'Ouvrir le menu');
                    newToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
                }
            });
        }

        // --- 1. SCROLL REVEAL ANIMATIONS ---
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-top');
        const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
        
        const revealOnScroll = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);
        revealElements.forEach(el => revealOnScroll.observe(el));

        setTimeout(() => { document.querySelector('.navbar')?.classList.add('active'); }, 100);

        // --- 2. NAVBAR EFFETS ---
        const navbar = document.querySelector('.navbar');
        const onScroll = () => {
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.style.padding = "0.2rem 0";
                    navbar.style.boxShadow = "var(--shadow-sm)";
                } else {
                    navbar.style.padding = "0";
                    navbar.style.boxShadow = "none";
                }
            }
        };
        window.addEventListener('scroll', onScroll);

        // --- 3. DARK MODE TOGGLE ---
        const themeToggle = document.getElementById('theme-toggle');
        const rootElement = document.documentElement;
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            rootElement.setAttribute('data-theme', 'dark');
            if(themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
        
        if(themeToggle) {
            themeToggle.replaceWith(themeToggle.cloneNode(true));
            const newThemeToggle = document.getElementById('theme-toggle');
            newThemeToggle.addEventListener('click', () => {
                if (rootElement.getAttribute('data-theme') === 'dark') {
                    rootElement.removeAttribute('data-theme');
                    localStorage.setItem('theme', 'light');
                    newThemeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
                } else {
                    rootElement.setAttribute('data-theme', 'dark');
                    localStorage.setItem('theme', 'dark');
                    newThemeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
                }
            });
        }

        // --- 5. BOUTON MAGNETIQUE ---
        const magneticBtns = document.querySelectorAll('.btn-primary');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.2; 
                const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
                requestAnimationFrame(() => {
                    btn.style.transform = `translate(${x}px, ${y}px)`;
                });
            });
            btn.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => {
                    btn.style.transform = `translate(0px, 0px)`;
                });
            });
        });

        // --- 6. SIMULATEUR DE SCANNER BLOCKCHAIN ---
        const verifyBtn = document.getElementById('verify-btn');
        const modal = document.getElementById('scanner-modal');
        const closeBtn = document.querySelector('.close-modal');
        const steps = document.querySelectorAll('.scan-step');
        const holoContainer = document.querySelector('.holographic-result');
        const stepContainer = document.querySelector('.scanner-steps');
        const scannerContent = document.querySelector('.modal-content');

        let simulationRunId = 0;
        const pendingTimeouts = [];

        const clearPendingTimeouts = () => {
            pendingTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
            pendingTimeouts.length = 0;
        };

        const queueTimeout = (callback, delay) => {
            const timeoutId = setTimeout(() => {
                const index = pendingTimeouts.indexOf(timeoutId);
                if (index !== -1) pendingTimeouts.splice(index, 1);
                callback();
            }, delay);
            pendingTimeouts.push(timeoutId);
            return timeoutId;
        };

        const closeModal = () => {
            if (!modal) return;
            simulationRunId++;
            clearPendingTimeouts();
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        if(verifyBtn && modal) {
            verifyBtn.replaceWith(verifyBtn.cloneNode(true));
            const newVerifyBtn = document.getElementById('verify-btn');
            
            newVerifyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                simulationRunId++;
                const currentRunId = simulationRunId;
                clearPendingTimeouts();

                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                
                if (stepContainer) stepContainer.style.display = 'block';
                if (holoContainer) holoContainer.classList.remove('active');
                steps.forEach(step => {
                    step.classList.remove('active', 'completed');
                    const statusIcon = step.querySelector('.status-icon');
                    if (statusIcon) {
                        statusIcon.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
                    }
                });

                let stepIndex = 0;
                const runSimulation = () => {
                    if (currentRunId !== simulationRunId || !modal.classList.contains('active')) return;

                    if (stepIndex < steps.length) {
                        steps[stepIndex].classList.add('active');
                        let delay = 1000 + Math.random() * 800; 
                        
                        queueTimeout(() => {
                            if (currentRunId !== simulationRunId || !modal.classList.contains('active')) return;
                            steps[stepIndex].classList.replace('active', 'completed');
                            const statusIcon = steps[stepIndex].querySelector('.status-icon');
                            if (statusIcon) {
                                statusIcon.innerHTML = '<i class="fa-solid fa-check text-success"></i>';
                            }
                            stepIndex++;
                            runSimulation();
                        }, delay);
                    } else {
                        queueTimeout(() => {
                            if (currentRunId !== simulationRunId || !modal.classList.contains('active')) return;
                            if (stepContainer) stepContainer.style.display = 'none';
                            if (holoContainer) holoContainer.classList.add('active');
                        }, 500);
                    }
                };
                
                runSimulation();
            });

            if (closeBtn) {
                closeBtn.replaceWith(closeBtn.cloneNode(true));
                document.querySelector('.close-modal').addEventListener('click', closeModal);
            }

            modal.addEventListener('click', (event) => {
                if (event.target === modal) closeModal();
            });
        }

        // --- 7. CARTE HOLOGRAPHIQUE ---
        const holoCard = document.querySelector('.holo-card');
        if (holoCard) {
            const glare = holoCard.querySelector('.holo-glare');
            
            const handleMouseMove = (e) => {
                const rect = holoCard.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -12;
                const rotateY = ((x - centerX) / centerX) * 12;
                holoCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                if (glare) {
                    const bgX = (x / rect.width) * 100;
                    const bgY = (y / rect.height) * 100;
                    glare.style.backgroundPosition = `${bgX}% ${bgY}%`;
                }
            };
            
            holoCard.addEventListener('mousemove', handleMouseMove);

            holoCard.addEventListener('mouseleave', () => {
                holoCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                if (glare) {
                    glare.style.backgroundPosition = `100% 100%`;
                }
            });
        }
        
        // Cleanup function
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    return (
        <div className="landing-page">
            <header className="navbar reveal-top">
                <div className="container nav-content">
                    <div className="logo">
                        <i className="fa-solid fa-link"></i> DiploChain
                    </div>
                    <nav className="nav-links">
                        <a href="#problem">Le Problème</a>
                        <a href="#consequences">Conséquences</a>
                        <a href="#solution">La Solution</a>
                        <a href="#how-it-works">Fonctionnement</a>
                    </nav>
                    <div className="nav-actions">
                        <button id="mobile-menu-toggle" className="mobile-menu-toggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobile-menu">
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        <button id="theme-toggle" className="btn-theme-toggle" aria-label="Changer le thème">
                            <i className="fa-solid fa-moon"></i>
                        </button>
                        <Link to="/admin/" className="btn btn-primary-outline">Espace Établissement</Link>
                    </div>
                </div>
                <nav id="mobile-menu" className="mobile-nav" hidden>
                    <a href="#problem">Le Problème</a>
                    <a href="#consequences">Conséquences</a>
                    <a href="#solution">La Solution</a>
                    <a href="#how-it-works">Fonctionnement</a>
                </nav>
            </header>

            <section className="hero">
                <div className="container hero-container">
                    <div className="hero-content reveal-left">
                        <span className="badge">Urgence Nationale - Vérification Diplômes</span>
                        <h1>Zéro faux diplôme.<br />100% vérifiable.</h1>
                        <p>Au Burkina Faso, 1 diplôme sur 3 présenté aux concours publics est falsifié. DiploChain met fin à cette crise en transformant chaque diplôme en certificat numérique infalsifiable, vérifiable en 3 secondes, gratuitement, depuis n'importe quel appareil.</p>
                        <p className="hero-techline">Grâce à la blockchain.</p>

                        <div className="hero-buttons">
                            <Link to="/verify" className="btn btn-primary"><i className="fa-solid fa-qrcode"></i> Vérifier un Diplôme</Link>
                            <a href="#problem" className="btn btn-secondary">Comprendre le problème</a>
                        </div>
                    </div>
                    <div className="hero-image reveal-right">
                        <div className="image-wrapper">
                            <div className="decorative-blob"></div>
                            <img src="/hero_split.png" alt="Étudiant diplômé" style={{borderRadius: '50%'}} />
                            
                            <div className="floating-card success-card">
                                <div className="icon-circle success-bg">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <div className="card-text">
                                    <strong>Diplôme Validé</strong>
                                    <span>Authentique à 100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="problem" className="problem-section dark-antagonist">
                <div className="container container-bento">
                    <div className="bento-header reveal-up">
                        <h2>Une hémorragie silencieuse au cœur de l'État</h2>
                        <p>Les faux diplômes ne sont pas un phénomène marginal au Burkina Faso. Ils infiltrent les ministères les plus stratégiques du pays et mettent en danger la vie des citoyens burkinabè chaque jour.</p>
                    </div>

                    <div className="bento-grid bento-grid-modernized">
                        <div className="bento-card bento-modern reveal-up">
                            <div className="bento-date">4 septembre 2025</div>
                            <div className="bento-content">
                                <h3>21 fonctionnaires révoqués en Conseil des ministres</h3>
                                <p>Le Conseil des ministres présidé par le Capitaine Ibrahim Traoré exclut définitivement 21 agents publics de 9 ministères ayant présenté des diplômes inauthentiques.</p>
                            </div>
                        </div>

                        <div className="bento-card bento-modern reveal-up" style={{transitionDelay: '0.08s'}}>
                            <div className="bento-date">11 septembre 2025</div>
                            <div className="bento-content">
                                <h3>4 nouvelles révocations : l'opération s'intensifie</h3>
                                <p>Une semaine plus tard, 4 agents supplémentaires sont révoqués. L'opération va s'intensifier avec plus de 6 000 dossiers en cours d'examen.</p>
                            </div>
                        </div>

                        <div className="bento-card bento-modern reveal-up" style={{transitionDelay: '0.16s'}}>
                            <div className="bento-date">Juillet 2025</div>
                            <div className="bento-content">
                                <h3>Extension à toutes les structures d'État</h3>
                                <p>Le Premier ministre étend le contrôle aux sociétés d'État, établissements publics et institutions. Objectif affiché : promouvoir la méritocratie.</p>
                            </div>
                        </div>

                        <div className="bento-card bento-modern reveal-up" style={{transitionDelay: '0.24s'}}>
                            <div className="bento-date">Depuis 2015</div>
                            <div className="bento-content">
                                <h3>Faux médecins, des vies en danger</h3>
                                <p>L'Ordre des médecins du Burkina Faso détecte des praticiens exerçant sans diplôme valide, réalisant des actes chirurgicaux sur des patients.</p>
                            </div>
                        </div>
                    </div>

                    <div className="problem-pills reveal-up">
                        <div className="problem-pill">
                            <strong>25-30%</strong>
                            <span>des diplômes présentés aux concours de la fonction publique burkinabè sont estimés falsifiés</span>
                        </div>
                        <div className="problem-pill">
                            <strong>6 000+</strong>
                            <span>dossiers de fonctionnaires examinés par le KORAG en 2025 — opération toujours en cours</span>
                        </div>
                        <div className="problem-pill">
                            <strong>9 ministères</strong>
                            <span>touchés dont Santé, Défense, Sécurité, Justice, Éducation</span>
                        </div>
                        <div className="problem-pill">
                            <strong>15 000+</strong>
                            <span>jeunes autodidactes se forment chaque année sans certification reconnue</span>
                        </div>
                    </div>
                </div>
            </section>

            <section id="consequences" className="consequences-section bg-light">
                <div className="container">
                    <div className="section-header reveal-up">
                        <h2>Des conséquences concrètes sur chaque Burkinabè</h2>
                        <p>Les faux diplômes ne sont pas une simple fraude administrative. Ils mettent en danger la santé, la sécurité et l'avenir de toute la nation.</p>
                    </div>

                    <div className="consequences-grid">
                        <article className="consequence-card consequence-danger reveal-up">
                            <h3><i className="fa-solid fa-shield-halved"></i> Sécurité publique</h3>
                            <p>Des agents sans les compétences requises occupent des postes vitaux pour la nation.</p>
                            <ul>
                                <li>Faux médecins en blocs opératoires</li>
                                <li>Faux officiers dans l'armée</li>
                                <li>Décisions judiciaires par des non qualifiés</li>
                                <li>Faux enseignants dans les écoles</li>
                            </ul>
                        </article>

                        <article className="consequence-card consequence-warning reveal-up" style={{transitionDelay: '0.08s'}}>
                            <h3><i className="fa-solid fa-scale-balanced"></i> Injustice sociale</h3>
                            <p>Chaque poste occupé par un fraudeur prive un diplômé honnête d'un emploi mérité.</p>
                            <ul>
                                <li>L'État finance des incompétents</li>
                                <li>La confiance citoyenne est détruite</li>
                                <li>La méritocratie est impossible</li>
                            </ul>
                        </article>

                        <article className="consequence-card consequence-info reveal-up" style={{transitionDelay: '0.16s'}}>
                            <h3><i className="fa-solid fa-user-graduate"></i> Jeunesse invisible</h3>
                            <p>Des milliers de jeunes talentueux restent invisibles faute de certification reconnue.</p>
                            <ul>
                                <li>Impossible de prouver ses compétences</li>
                                <li>Les vrais diplômés perdent aux concours</li>
                                <li>Fuite des talents bloquée</li>
                            </ul>
                        </article>
                    </div>
                </div>
            </section>

            <section id="solution" className="solution-section bg-light">
                <div className="container">
                    <div className="section-header reveal-up">
                        <h2>DiploChain : Rendre la fraude techniquement impossible</h2>
                        <p>DiploChain est un registre national de diplômes basé sur la blockchain. Chaque diplôme émis est signé cryptographiquement et enregistré de façon permanente et infalsifiable.</p>
                    </div>

                    <div className="solution-steps">
                        <article className="solution-step-card reveal-up">
                            <span className="step-number">01</span>
                            <h3>L'établissement émet le diplôme</h3>
                            <p>L'université accréditée saisit les informations du diplômé sur son portail sécurisé. Elle signe le diplôme avec sa clé cryptographique officielle et le publie instantanément sur la blockchain.</p>
                        </article>
                        <article className="solution-step-card reveal-up" style={{transitionDelay: '0.08s'}}>
                            <span className="step-number">02</span>
                            <h3>Le diplôme est enregistré</h3>
                            <p>Un hash unique est créé, une empreinte numérique du diplôme. Il est immuable. Personne ne peut le modifier, le supprimer ni le falsifier.</p>
                        </article>
                        <article className="solution-step-card reveal-up" style={{transitionDelay: '0.16s'}}>
                            <span className="step-number">03</span>
                            <h3>Le diplômé partage son profil</h3>
                            <p>Le diplômé reçoit un QR code unique et un lien de profil public contenant tous ses diplômes vérifiés.</p>
                        </article>
                        <article className="solution-step-card reveal-up" style={{transitionDelay: '0.24s'}}>
                            <span className="step-number">04</span>
                            <h3>Le recruteur vérifie en 3 secondes</h3>
                            <p>Le recruteur scanne le QR code ou entre le code du diplôme. La réponse est immédiate, gratuite et infalsifiable.</p>
                        </article>
                    </div>

                    <div className="comparison-wrap reveal-up">
                        <h3>Comparaison Avant / Après DiploChain</h3>
                        <div className="comparison-lists">
                            <div className="comparison-list before-list">
                                <h4>Sans DiploChain</h4>
                                <ul>
                                    <li>Diplôme papier falsifiable avec une imprimante</li>
                                    <li>Vérification en 15 à 30 jours et jusqu'à 50 000 FCFA</li>
                                    <li>Fraude découverte après des années en poste</li>
                                </ul>
                            </div>
                            <div className="comparison-list after-list">
                                <h4>Avec DiploChain</h4>
                                <ul>
                                    <li>Hash cryptographique unique et infalsifiable</li>
                                    <li>Vérification en 3 secondes, gratuite, partout dans le monde</li>
                                    <li>Fraude impossible dès l'émission du diplôme</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="how-it-works-section">
                <div className="container">
                    <div className="section-header reveal-up">
                        <h2>Comment ça marche : Pourquoi c'est infalsifiable</h2>
                        <p>DiploChain ne repose pas sur la confiance en une institution. Il repose sur des garanties mathématiques. Voici pourquoi personne ne peut falsifier un diplôme DiploChain.</p>
                    </div>

                    <div className="blockchain-grid">
                        <article className="blockchain-card reveal-up">
                            <h3><i className="fa-solid fa-key"></i> Signature cryptographique</h3>
                            <p>Chaque établissement possède une clé privée secrète connue de lui seul. Quand il émet un diplôme, il le signe avec cette clé.</p>
                            <p className="tech-note">Algorithme : ECDSA</p>
                        </article>
                        <article className="blockchain-card reveal-up" style={{transitionDelay: '0.08s'}}>
                            <h3><i className="fa-solid fa-fingerprint"></i> Empreinte numérique SHA-256</h3>
                            <p>Le diplôme est transformé en une empreinte unique de 64 caractères : son empreinte digitale. Changer même une virgule produit une empreinte différente.</p>
                            <p className="tech-note">Résultat : falsification impossible</p>
                        </article>
                        <article className="blockchain-card reveal-up" style={{transitionDelay: '0.16s'}}>
                            <h3><i className="fa-solid fa-database"></i> Registre public immuable</h3>
                            <p>L'empreinte et la signature sont enregistrées sur la blockchain : un registre public copié sur des milliers d'ordinateurs dans le monde entier.</p>
                            <p className="tech-note">Accessible 24h/24</p>
                        </article>
                        <article className="blockchain-card reveal-up" style={{transitionDelay: '0.24s'}}>
                            <h3><i className="fa-solid fa-network-wired"></i> Aucun point de défaillance</h3>
                            <p>Il n'y a pas de serveur central à pirater. La blockchain est distribuée sur des milliers de nœuds.</p>
                            <p className="tech-note">Zéro point de défaillance unique</p>
                        </article>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container footer-content reveal-up">
                    <h2>Sécurisons l'avenir du Burkina Faso,<br />un diplôme à la fois.</h2>
                    <div className="footer-bottom">
                        <div className="footer-logo"><i className="fa-solid fa-link"></i> DiploChain</div>
                        <p>&copy; 2026 Projet MIABEE Hackathon - Blockchain GovTech - Groupe ChainUp - Tous droits réservés.</p>
                    </div>
                </div>
            </footer>

            {/* MODAL DU SCANNER BLOCKCHAIN */}
            <div className="modal-overlay" id="scanner-modal" role="dialog" aria-modal="true" aria-labelledby="scanner-title" aria-hidden="true">
                <div className="modal-content" tabIndex="-1">
                    <button className="close-modal" aria-label="Fermer la fenêtre"><i className="fa-solid fa-times"></i></button>
                    <div className="scanner-container">
                        <h2 id="scanner-title" style={{textAlign: 'center', marginBottom: '24px'}}>Vérification Blockchain...</h2>
                        <div className="scanner-steps">
                            <div className="scan-step" id="step-1">
                                <span className="status-icon"><i className="fa-solid fa-spinner fa-spin"></i></span>
                                <p>Extraction : Hachage du document PDF...</p>
                            </div>
                            <div className="scan-step" id="step-2">
                                <span className="status-icon"><i className="fa-solid fa-spinner fa-spin"></i></span>
                                <p>Consensus : Interrogation des nœuds du réseau...</p>
                            </div>
                            <div className="scan-step" id="step-3">
                                <span className="status-icon"><i className="fa-solid fa-spinner fa-spin"></i></span>
                                <p>Preuve : Validation de la signature cryptographique...</p>
                            </div>
                        </div>

                        <div className="holographic-result">
                            <h3 className="text-success" style={{marginBottom: '16px'}}>Vérification Réussie !</h3>
                            <div className="holo-card">
                                <div className="holo-glare"></div>
                                <div className="holo-content">
                                    <div className="cert-header">
                                        <i className="fa-solid fa-graduation-cap"></i>
                                        <h4>Université Joseph Ki-Zerbo</h4>
                                    </div>
                                    <h2>Master en Cybersécurité</h2>
                                    <p className="cert-name">Décerné à : <strong>Abdoulaye SANON</strong></p>
                                    <p className="cert-hash">ID Block: 0x8a9b4d...f3c4</p>
                                    <div className="cert-stamp">
                                        <i className="fa-solid fa-shield-check"></i> Authentique
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
