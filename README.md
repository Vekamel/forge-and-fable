
# 📜 Forge & Fable — Mode d'emploi

## Introduction

**Forge & Fable** est un module autonome pour Foundry VTT v13+, permettant :
- la **fabrication d'objets** par les joueurs,
- la **récolte de ressources**,
- la **création de nouvelles recettes** par le MJ.

Le module fonctionne avec un système de fichiers JSON simples, modifiables, et une interface claire inspirée du style parcheminé fantasy.

---

## Installation

1. Copier le dossier `Forge & Fable` dans le répertoire `modules/` de Foundry VTT.
2. Activer le module dans les paramètres du monde.

---

## Fonctionnalités

### ⚒️ Fabrication (Forge)

Accessible via une **macro** ou un bouton d’interface.

- Choisir un métier (liste configurable dans `data/metiers.json`).
- Sélectionner une recette disponible (dans `data/recipes.json`).
- Vérifier les ingrédients et outils requis.
- Cliquer sur **Fabriquer** pour consommer les ingrédients et obtenir l’objet.

#### Données utilisées :
- `data/metiers.json` → liste des métiers
- `data/recipes.json` → liste des recettes

#### Flux :
1. Lecture des métiers et des recettes au chargement.
2. Interface joueur : `forge-ui.html`
3. Script : `scripts/forge.js`

---

### 🌿 Récolte

Accessible via une **macro** ou un bouton d’interface.

- Choisir un lieu de récolte.
- Voir la liste des objets récoltables dans ce lieu (`data/harvestables.json`).
- Lancer une action de récolte → objets ajoutés à l’inventaire.

#### Données utilisées :
- `data/harvestables.json` → lieux et objets récoltables

#### Flux :
1. Lecture des lieux/items au chargement.
2. Interface joueur : `harvest-ui.html`
3. Script : `scripts/harvest.js`

---

### 🛠️ Création de recette (MJ uniquement)

Accessible via un **bouton spécifique réservé au MJ**.

- Remplir le formulaire de nouvelle recette :
  - Nom de la recette
  - Métier requis
  - Ingrédients nécessaires
  - Outils requis
  - Résultat (objet créé)
  - Rareté
  - Icône (chemin ou par défaut)
- Sauvegarder → la recette est ajoutée au fichier `data/recipes.json`.

#### Flux :
1. Interface MJ : `recipe-manager.html`
2. Script : `scripts/recipe-manager.js`
3. Sauvegarde : mise à jour du fichier `recipes.json`

⚠️ Attention : en l’état actuel, ce fichier est dans `modules/Forge & Fable/data/`.  
En cas de mise à jour du module, ce fichier sera **écrasé**. Voir plus bas pour les bonnes pratiques.

---

## Limitations et points importants

- Le fichier suivant est sensible aux mises à jour du module :
  - `data/harvestables.json`

➡️ **Bonnes pratiques** recommandées :
- Avant toute mise à jour du module :
  - **sauvegarder le fichier `data/harvestables.json`**.
  - Après la mise à jour, **réintégrer le fichier personnalisé**.

➡️ Une future évolution du module pourra permettre de stocker ces fichiers dans le répertoire `worlds/` pour plus de sécurité.

---

## Personnalisation

### Ajouter un métier

Modifier `data/metiers.json`, exemple :

```json
[
  "Alchimiste",
  "Forgeron",
  "Cuisinier",
  "Nouveau Métier"
]
```

### Ajouter un lieu de récolte

Modifier `data/harvestables.json`, exemple :

```json
[
  {
    "lieu": "Forêt enchantée",
    "items": ["Baie magique", "Herbe rare"]
  }
]
```

### Ajouter une recette (manuellement ou via l'interface MJ)

Modifier `data/recipes.json`, ou utiliser l'interface **Créer recette (MJ)** directement dans Foundry.

---

## 📌 Macros à utiliser

Vous pouvez créer des **macros personnalisées** dans Foundry pour ouvrir les interfaces du module.

### 1️⃣ Ouvrir l'interface de fabrication (Forge)

```js
// Macro : Ouvrir l'interface de fabrication
new ForgeApplicationV2().render(true);
```

### 2️⃣ Ouvrir l'interface de récolte (Harvest)

```js
// Macro : Ouvrir l'interface de récolte
new HarvestApplicationV2().render(true);
```

### 3️⃣ Ouvrir l'interface de création de recette (MJ uniquement)

```js
// Macro : Ouvrir l'interface de création de recette (MJ)
if (game.user.isGM) {
    new RecipeManagerApplicationV2().render(true);
} else {
    ui.notifications.warn(game.i18n.localize("FORGE_AND_FABLE.OnlyGM"));
}
```

---

## Structure du module

```
Forge & Fable/
├── assets/               --> Icônes par défaut
├── data/                 --> Fichiers métiers, lieux, recettes (⚠️ sensibles aux màj)
├── scripts/              --> JS pour fabrication, récolte, création
├── templates/            --> Templates HTML des interfaces
├── styles.css            --> Style commun
├── README.md             --> Ce fichier
└── module.json           --> Déclaration du module
```

---

## Auteurs

Module développé par **Vekamel**.

---

## Version actuelle

**Forge & Fable v1.4.0 — base officielle du 12/06/2025**
