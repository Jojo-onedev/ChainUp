# 🎓 DiploChain - Système de Certification de Diplômes Blockchain

Bienvenue sur le projet **DiploChain**. Ce projet est une solution complète de certification et de vérification d'authenticité de diplômes académiques utilisant la blockchain Polygon.

## 🏗 Architecture du Projet

Le projet est divisé en deux parties distinctes pour séparer la logique d'interface et la logique décentralisée :

1.  **/admin-web** : L'interface utilisateur (React + Vite + Tailwind) pour l'administration des universités.
2.  **/blockchain** : L'environnement de développement des Smart Contracts (Hardhat + Solidity).

---

## ⛓ Partie Blockchain (`/blockchain`)

Cette partie gère tout ce qui touche au réseau Polygon.

### 📝 Smart Contract : `DiploChain.sol`
Situé dans `contracts/DiploChain.sol`, il contient la logique principale :
*   **`issueDiploma`** : Permet à l'université (`owner`) d'enregistrer un hash unique représentant un diplôme avec les métadonnées de l'étudiant.
*   **`verifyDiploma`** : Fonction publique permettant à n'importe qui de vérifier l'authenticité d'un diplôme via son hash.
*   **Sécurité** : Utilise le modificateur `onlyOwner` pour garantir que seule l'université peut certifier des documents.

### ⚙️ Configuration Hardhat
*   **`hardhat.config.js`** : Configuré pour supporter le réseau local de test et le réseau **Polygon Amoy**.
*   **`.env`** : Contient les secrets (Clé privée, URL RPC Alchemy). *Ce fichier est ignoré par Git pour des raisons de sécurité.*

### 🚀 Commandes Utiles
*   `npx hardhat compile` : Compile le contrat et génère les ABIs.
*   `npx hardhat run scripts/deploy.js --network amoy` : Déploie le contrat sur le testnet Polygon.

---

## 🖥 Partie Frontend (`/admin-web`)

L'interface d'administration moderne et animée.

### 🔌 Intégration Blockchain
*   **`src/blockchain/useBlockchain.js`** : Un Hook React personnalisé qui gère la connexion Metamask (`ethers.js`), l'appel aux fonctions d'émission et de vérification.
*   **`src/blockchain/abis/DiploChain.json`** : Contient l'ABI générée par Hardhat pour permettre au JavaScript de "parler" au contrat.
*   **`src/blockchain/contracts.js`** : Centralise l'adresse du contrat déployé.

### 🎨 Design & Expérience
*   **GSAP** : Utilisé pour les animations premium (entrées en cascade, transitions fluides).
*   **Tailwind CSS** : Pour un design "Glassmorphism" épuré et moderne.

---

## 🛠 Instructions pour la suite (Blockchain Dev)

Si tu souhaites modifier le Smart Contract :
1.  Modifie le fichier `.sol` dans `/blockchain/contracts`.
2.  Lance `npx hardhat compile`.
3.  Déploie avec le script de déploiement.
4.  **Important** : Copie le nouveau fichier JSON généré dans `blockchain/artifacts/contracts/DiploChain.sol/DiploChain.json` vers `admin-web/src/blockchain/abis/` pour mettre à jour le frontend.
5.  Mets à jour l'adresse du contrat dans `admin-web/src/blockchain/contracts.js`.

---

## 💡 Notes pour le Hackathon
*   **Réseau** : Polygon Amoy Testnet.
*   **Faucet** : Utiliser [Alchemy Faucet](https://www.alchemy.com/faucets/polygon-amoy) pour obtenir des MATIC de test.