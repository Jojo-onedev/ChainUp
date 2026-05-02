# 📑 Notes de Démonstration : DiploChain
**Hackathon MIABEE 2026 - Groupe ChainUp**

Ce document sert de guide "pas-à-pas" pour réussir la démonstration technique de la solution DiploChain devant le jury.

---

## 🛠 Préparation avant le passage
1.  **Web** : Lancer `admin-web` (`npm run dev`) et ouvrir `localhost:5173`.
2.  **Mobile** : Lancer `mobile-verify` (`npx expo start`) et avoir l'application ouverte sur **Expo Go**.
3.  **Blockchain** : S'assurer que le Smart Contract est bien déployé ou expliquer la simulation.
4.  **Documents** : Avoir un exemple de nom d'étudiant prêt (ex: "Abdoulaye SANON").

---

## ⏱ Scénario de Démonstration (5 minutes)

### Étape 1 : Le Contexte (Landing Page) 
*   **Action** : Afficher la page d'accueil (`/`).
*   **Discours** : "Voici DiploChain. Nous répondons à une urgence nationale : 30% des diplômes présentés aux concours sont faux. Notre solution transforme le diplôme en une preuve mathématique infalsifiable."
*   **Point fort** : Montrer le design moderne et professionnel.

### Étape 2 : L'Émission (Espace Université)
*   **Action** : Cliquer sur "Espace Établissement" → Se connecter → Dashboard.
*   **Manipulation** : Saisir le nom d'un étudiant et cliquer sur **"Émettre le Diplôme"**.
*   **Observation** : Laisser le jury voir l'animation de génération du Hash et de l'enregistrement blockchain.
*   **Discours** : "Ici, l'université Joseph Ki-Zerbo certifie un nouveau diplôme. Le système calcule une empreinte unique (Hash) et l'inscrit pour l'éternité sur la blockchain Polygon."

### Étape 3 : Le Résultat & QR Code
*   **Action** : Montrer le QR Code généré à l'écran après le succès.
*   **Discours** : "Le diplôme est émis. L'étudiant reçoit ce QR Code qu'il peut mettre sur son CV ou son profil LinkedIn."

### Étape 4 : Vérification Web (Public)
*   **Action** : Cliquer sur "Vérifier un Diplôme" sur la Landing Page (ou aller sur `/verify`).
*   **Manipulation** : Coller le Hash généré précédemment (ou uploader l'image du QR Code).
*   **Discours** : "N'importe quel recruteur peut maintenant vérifier ce diplôme gratuitement. Le site interroge directement la blockchain pour confirmer l'identité du titulaire."

### Étape 5 : Vérification Mobile (Recruteur)
*   **Action** : Prendre le téléphone avec l'app mobile ouverte.
*   **Manipulation** : Scanner le QR Code affiché sur l'ordinateur.
*   **Discours** : "Pour un entretien physique, le recruteur utilise l'application mobile. En 2 secondes, la caméra scanne et confirme : le diplôme est authentique. Plus besoin d'appels administratifs lents et coûteux."

---

## A souligner
*   **Immuabilité** : "Une fois enregistré, même l'université ne peut pas modifier un diplôme sans laisser de trace."
*   **Accessibilité** : "Pas besoin de compte Metamask pour vérifier. Le public accède à la vérité en un clic."
*   **Vitesse** : "La vérification passe de 30 jours (courrier postal) à 3 secondes (blockchain)."
*   **Coût** : "C'est une infrastructure publique. La vérification est 100% gratuite."

---

## Conclusion de la Démo
"DiploChain ne se contente pas de numériser les diplômes, elle restaure la confiance dans notre système éducatif et garantit la méritocratie au Burkina Faso."
