# Forge & Fable

**Forge & Fable** est un module pour **Foundry VTT** proposant un système complet de **récolte**, **artisanat** et **gestion de métiers**, immersif et adaptable à tous les univers de jeu de rôle.

## 📦 Fonctionnalités principales

- 🎯 Interface de fabrication avec sélection du métier, filtres de rareté, recherche par nom.
- 🔨 Création de recettes personnalisées via une interface dédiée pour MJ.
- 🌿 Récolte d’ingrédients en fonction des biomes et outils.
- 👤 Métiers personnalisés assignables aux personnages joueurs.
- 📂 Données persistantes automatiquement copiées dans le dossier `world`.

## 🗂️ Fichiers automatiques créés

Au démarrage du monde, le module copie automatiquement dans `worlds/[nom_du_monde]/forge-and-fable/` :

- `recipes.json`
- `harvestables.json`
- `metiers.json`

S'ils n'existent pas, une version par défaut est créée depuis `modules/forge-and-fable/data/`.

## ⚙️ Utilisation

### 🧰 Fenêtre de Forge (artisanat)
Permet à un PJ de fabriquer un objet s’il possède les composants requis et les outils nécessaires. Interface dynamique, filtre par rareté et recherche intégrée.

### 🌿 Fenêtre de Récolte
Affiche les ressources disponibles par biome et permet de simuler une action de récolte. Prend en compte l’outil utilisé.

### 📜 Fenêtre de Création de Recette (MJ uniquement)
Interface pour créer une nouvelle recette et l’ajouter directement au fichier `recipes.json` du monde.

## 🧪 Macros utiles

```js
// Ouvrir la fenêtre de fabrication (nécessite un token sélectionné)
game.forgeFable.open();
```

```js
// Ouvrir la fenêtre de récolte
game.forgeFable.openHarvest();
```

```js
// Ouvrir la fenêtre de création de recette (MJ uniquement)
game.forgeFable.openRecipeCreator();
```

## 📁 Arborescence du module

```
forge-and-fable/
├── assets/
│   └── default-icon.webp
├── data/
│   ├── harvestables.json
│   ├── metiers.json
│   └── recipes.json
├── scripts/
│   ├── forge.js
│   ├── harvest.js
│   └── recipe-manager.js
├── templates/
│   ├── forge-ui.html
│   ├── harvest-ui.html
│   └── recipe-manager.html
├── styles.css
├── module.json
└── README.md
```

## ✅ Compatibilité

Conçu pour fonctionner avec tous les systèmes compatibles Foundry VTT utilisant des **Actors**, **Items**, et un système de données `system.quantity`.

## 🛠️ Installation manuelle

Déposez le dossier `forge-and-fable` dans le répertoire `modules/` de votre installation Foundry.
