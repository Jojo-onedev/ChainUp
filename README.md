# 🎓 DiploChain - Certification de Diplômes sur Blockchain

> **Projet Hackathon MIABEE 2026 - GovTech Blockchain**  
> Groupe **ChainUp** · Burkina Faso

DiploChain est une solution complète de certification et de vérification de diplômes académiques basée sur la blockchain **Polygon**. Elle rend la falsification de diplômes techniquement impossible grâce à la cryptographie et aux Smart Contracts.

---

## 🧩 Pourquoi DiploChain ?

Au Burkina Faso, **25 à 30 %** des diplômes présentés aux concours de la fonction publique sont estimés falsifiés. En 2025, plus de **6 000 dossiers** de fonctionnaires ont été examinés et **21 agents révoqués** en conseil des ministres pour faux diplômes.

DiploChain répond à cette crise nationale en offrant un registre public, décentralisé et infalsifiable pour chaque diplôme émis.

---

## 🏗️ Architecture du Projet

```
ChainUp/
├── blockchain/          # Smart Contract Solidity + Hardhat
├── admin-web/           # Portail Web Université (émission)
├── mobile-verify/       # Application Mobile Recruteur (vérification)
├── verify-web/          # (Archivé) Interface de vérification standalone
└── GUIDE_PROJET/        # Documentation pédagogique non-technique
```

---

## ⚙️ Stack Technique

| Couche | Technologie |
|--------|------------|
| **Blockchain** | Solidity 0.8.24, Hardhat 2.22.17 |
| **Réseau** | Polygon Amoy Testnet (Chainid: 80002) |
| **Frontend Web** | React 19, Vite, Tailwind CSS, GSAP |
| **Icônes Web** | Google Material Symbols |
| **Application Mobile** | React Native, Expo SDK 54 |
| **Icônes Mobile** | @expo/vector-icons (MaterialIcons) |
| **Connexion Blockchain** | Ethers.js v6 |
| **Lecture QR Code** | jsQR (web), expo-camera (mobile) |
| **Animations** | GSAP, expo-linear-gradient |

---

## 📦 Modules du Projet

### 1. `blockchain/` - Le Contrat Intelligent

Le cœur du système. Contient le Smart Contract `DiploChain.sol` qui enregistre et vérifie les diplômes de façon permanente et infalsifiable.

**Fonctions principales :**
- `issueDiploma(hash, name, degree, year)` - Enregistre un diplôme sur la blockchain
- `verifyDiploma(hash)` - Vérifie l'authenticité d'un diplôme à partir de son empreinte

---

### 2. `admin-web/` - Portails Web (React/Vite)

Interface web hébergeant l'ensemble des portails d'accès de l'écosystème DiploChain.

**Pages et Portails disponibles :**

| Route | Description |
|-------|-------------|
| `/` | Landing Page publique DiploChain |
| `/verify` | Portail de vérification public par Hash |
| `/admin` | Page de connexion pour les établissements |
| `/dashboard` | Tableau de bord Université — émission de diplômes |
| `/graduate` | **Espace Diplômé** — Coffre-fort numérique personnel |
| `/minister-secret-access` | **Portail Ministère** — Super-Admin souverain |

**Fonctionnalités clés :**
- 🏛️ **Portail Ministère** protégé par clé souveraine pour gérer l'accréditation des universités.
- 🎓 **Espace Diplômé** (Coffre-fort numérique) pour retrouver et partager ses diplômes certifiés.
- 🔐 Connexion sécurisée par établissement avec paramètres persistants (`localStorage`).
- 📝 Formulaire d'émission de diplôme avec état de réussite UI Premium (sans alertes bloquantes).
- 🔗 Génération automatique du Hash cryptographique et inscription blockchain.
- 📱 QR Code généré après chaque émission.
- 🔍 Vérification publique instantanée.
- 🌙 Design moderne et professionnel avec animations GSAP.

---

### 3. `mobile-verify/` - Application Mobile Recruteur

Application Expo (React Native) permettant aux recruteurs de vérifier un diplôme instantanément en entretien.

**Fonctionnalités :**
- 📷 Scanner un QR Code avec la caméra
- ⌨️ Saisie manuelle du hash
- ✅ Résultat instantané (Authentique / Non valide)
- 🎨 Interface native avec icônes MaterialIcons

---

## 🚀 Installation & Démarrage

### Prérequis

- Node.js >= 18.x
- npm >= 9.x
- Expo Go (sur votre smartphone) pour le mobile

---

### 1. Smart Contract (blockchain)

```bash
cd blockchain
npm install

# Compiler le contrat
npx hardhat compile

# Tester en local
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# Déployer sur Polygon Amoy (nécessite des MATIC de test)
npx hardhat run scripts/deploy.js --network amoy
```

**Configuration `.env` :**
```env
ALCHEMY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/VOTRE_CLE
PRIVATE_KEY=votre_cle_privee_metamask
POLYGONSCAN_API_KEY=votre_cle_polygonscan
```

> ⚠️ Ne jamais committer le fichier `.env`. Il est déjà dans `.gitignore`.

---

### 2. Portail Web Université (admin-web)

```bash
cd admin-web
npm install
npm run dev
```

L'application sera accessible sur **http://localhost:5173**

```
Connexion démo :
→ Sélectionnez n'importe quelle université
→ Entrez n'importe quel mot de passe
→ Cliquez "Accéder au portail"
```

---

### 3. Application Mobile (mobile-verify)

```bash
cd mobile-verify
npm install
npx expo start
```

Scannez le QR Code affiché dans le terminal avec **Expo Go** (iOS ou Android).

---

## 🔄 Flux Complet DiploChain

```
1. L'université se connecte sur admin-web (/admin)
        ↓
2. Elle remplit le formulaire d'émission (nom, diplôme, année)
        ↓
3. Le système génère un Hash cryptographique unique
        ↓
4. Le Hash est enregistré sur la blockchain Polygon (Smart Contract)
        ↓
5. Un QR Code est généré et remis à l'étudiant
        ↓
6. Le recruteur scanne le QR Code avec l'app mobile
   OU visite diplochain.com/verify et colle le hash
        ↓
7. Le Smart Contract répond : ✅ Authentique ou ❌ Non valide
```

---

## 🌐 Vérification Publique

La vérification d'un diplôme est **gratuite, publique et instantanée**.

**Via le web :**  
→ Accéder à `/verify` sur le portail admin-web  
→ Coller le hash **OU** uploader une photo du QR Code

**Via le mobile :**  
→ Ouvrir l'app → Scanner le QR Code du diplôme

---

## 📂 Documentation Pédagogique

Le dossier `GUIDE_PROJET/` contient 5 guides rédigés en langage simple (non-technique) :

| Fichier | Contenu |
|---------|---------|
| `01_PRESENTATION.md` | Présentation générale du projet |
| `02_INTERFACE.md` | Guide de l'interface utilisateur |
| `03_SMART_CONTRACT.md` | Explication du contrat blockchain |
| `04_CONNEXION.md` | Comment fonctionne la connexion Web3 |
| `05_PROCHAINES_ETAPES.md` | Roadmap et déploiement final |

---

## 🔐 Sécurité

- Les clés privées sont stockées dans `.env` (non versionné)
- Le Smart Contract ne peut être utilisé que par les adresses autorisées
- Toutes les transactions sont vérifiables publiquement sur [PolygonScan](https://amoy.polygonscan.com)

---

## 👥 Équipe ChainUp

Projet développé dans le cadre du **Hackathon MIABEE 2026 — GovTech Blockchain**.

---

## 📄 Licence

MIT — Libre d'utilisation pour des projets académiques et gouvernementaux.