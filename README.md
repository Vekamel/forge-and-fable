# Forge & Fable — Module de Crafting et Récolte pour Foundry VTT

**Version : 1.0.1**  
**Auteur : Vekamel**

---

## 📦 Description

**Forge & Fable** est un module universel de crafting et de récolte pour Foundry VTT, compatible avec tous les systèmes de jeu.  
Il permet aux joueurs de fabriquer des objets à partir d'ingrédients définis, et de récolter des ressources selon l'environnement.  
Ce module a été conçu pour être entièrement **visuel**, **responsive**, **immersif** et **simple d'utilisation**.

---

## 🔧 Fonctionnalités

### 🛠️ Interface de fabrication (joueurs)

- Accessible via une macro ou `game.forgeFable.open()`
- Choix du métier via une liste déroulante (Alchimiste, Forgeron, etc.)
- Affichage des recettes disponibles selon le métier sélectionné
- Affichage des ingrédients requis, quantités possédées, et icônes associées
- Vérification automatique des ingrédients dans l’inventaire du token sélectionné
- Création de l’objet final (avec image et description) dans l’inventaire
- Affichage d’un message dans le chat lors de la fabrication
- Couleur dynamique du nom de l'objet selon la rareté
- Entièrement responsive et stylisé façon parchemin

### 📜 Création de recettes (MJ)

- Accessible via un bouton "Ajouter une recette" visible uniquement pour le MJ dans l’interface joueur
- Interface en `Dialog` harmonisée avec l’interface joueur
- Ajout d’ingrédients dynamiques
- Choix du métier via liste déroulante
- Saisie du nom, description, rareté et outil requis
- Sauvegarde automatique des recettes dans `worlds/<nom-du-monde>/forge-and-fable/recipes.json` *(au lieu du module, pour éviter les pertes lors des mises à jour)*
- Création automatique du dossier `forge-and-fable` si nécessaire
- Interface redimensionnable et responsive

### 🌿 Récolte (joueurs)

- Macro MJ : `game.forgeFable.openHarvest()` ou bouton via macro
- Sélection du type d’environnement (forêt, montagne, marais, etc.)
- Récolte aléatoire parmi les objets définis dans `modules/forge-and-fable/data/harvestables.json`
- Ajout automatique de l’objet récolté à l’inventaire du token
- Affichage dans le chat
- Icône par défaut utilisée si l’objet n’existe pas
- Interface responsive et cohérente avec les autres fenêtres

---

## 🧩 Installation

- Copier le dossier du module dans `modules/forge-and-fable`
- Activer le module dans les paramètres de Foundry
- Utiliser une macro pour ouvrir l’interface :
  - `game.forgeFable.open()` pour le **craft**
  - `game.forgeFable.openHarvest()` pour la **récolte**

---

## 📌 Compatibilité

- Compatible **Foundry VTT v13+**
- Préparé pour la compatibilité avec **ApplicationV2**
- Testé avec tous systèmes (items de type *consumable*, *loot*, etc.)

---

## 🖼️ Icônes & Style

- Les icônes sont situées dans `assets/` (par défaut : `default-icon.webp`)
- Style **unifié et responsive** pour :
  - Fabrication
  - Création de recettes
  - Récolte
- Toutes les interfaces adoptent le **style parcheminé et propre** de l’interface principale

---

## 🚧 À venir

- Ajout d’une **interface MJ** pour consulter, modifier et supprimer des recettes existantes
- Gestion de **récolte conditionnelle** (heures, rareté, saison…)
- **Génération aléatoire** de recettes ou ingrédients rares
- Système d’**amélioration ou de transformation** d’objets
- Support **multilingue** (FR/EN)

---

## 📁 Structure des données

### `worlds/mon-monde/forge-and-fable/recipes.json`
```json
[
  {
    "name": "Potion de soin",
    "metier": "Alchimiste",
    "tool": "Creuset",
    "ingredients": [
      { "name": "Herbe rouge", "qty": 2 },
      { "name": "Flacon vide", "qty": 1 }
    ],
    "result": {
      "name": "Potion de soin",
      "description": "Rend quelques points de vie.",
      "rarity": "Commun"
    }
  }
]
