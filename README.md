# 🛠️ Forge & Fable

**Module de crafting et récolte pour Foundry VTT v13+**

*Enrichissez vos sessions de jeu de rôle avec un système d'artisanat accessible et modulaire.*

---

## 📋 Vue d'ensemble

Forge & Fable propose trois fonctionnalités principales :

🔨 **Fabrication d'objets** basée sur des recettes et métiers  
🌿 **Récolte de ressources** dans différents environnements  
📝 **Création de recettes** par le MJ via une interface dédiée  

Le système repose sur des fichiers JSON éditables et une interface utilisateur adaptée au style Foundry VTT.

---

## 🚀 Installation

1. **Télécharger** le module depuis le gestionnaire de modules Foundry
2. **Activer** le module dans les paramètres du monde  
3. **Créer** les macros nécessaires pour accéder aux fonctionnalités

---

## ⚙️ Fonctionnalités détaillées

### 🔨 Système de fabrication

Le système de crafting permet aux joueurs de créer des objets en combinant ingrédients et outils requis.

#### Fonctionnement

- ✅ Sélection d'un métier parmi la liste configurée
- ✅ Choix d'une recette compatible avec le métier  
- ✅ Vérification automatique de la disponibilité des ingrédients dans l'inventaire
- ✅ Filtrage par nom de recette et rareté de l'objet final
- ✅ Consommation automatique des ingrédients lors de la fabrication

#### Interface utilisateur

- 🖼️ Affichage visuel des ingrédients avec icônes
- 📊 Indication de la quantité possédée vs requise
- 👁️ Prévisualisation de l'objet à créer avec sa description
- 🌟 Système de rareté avec codes couleur

---

### 🌿 Système de récolte

La récolte permet d'obtenir des ressources depuis différents environnements.

#### Mécanisme

- 🗺️ Sélection d'un biome/environnement
- 🎲 Génération aléatoire d'un objet parmi ceux disponibles dans ce lieu
- 📦 Ajout automatique à l'inventaire du personnage
- 💬 Message dans le chat pour informer les autres joueurs

#### Environnements par défaut

| Environnement | Ressources disponibles |
|---------------|------------------------|
| 🌲 **Forêt** | Baies sauvages, Champignon lunaire, Fibre végétale |
| ⛰️ **Montagne** | Minerai de fer, Quartz brut, Pierre magique |
| 🐸 **Marais** | Mousse gélatineuse, Herbe noire, Œuf de crapaud |

---

### 📝 Création de recettes (MJ)

Interface réservée aux MJ pour enrichir le contenu disponible.

#### Fonctionnalités MJ

- 📋 Formulaire complet de création de recette
- 👷 Attribution à un métier spécifique
- 🧪 Définition des ingrédients multiples avec quantités
- 🔧 Spécification de l'outil requis
- ⚡ Configuration du résultat (nom, description, rareté)
- 💾 Sauvegarde automatique dans le système de fichiers du monde

---

## 🏗️ Architecture technique

### 📁 Fichiers de données

```
Structure des données :
├── 📁 Fichiers statiques (module)
│   ├── data/metiers.json ──────── Liste des métiers disponibles
│   └── data/harvestables.json ── Environnements et ressources
│
└── 📁 Fichiers dynamiques (monde)
    └── worlds/[monde]/forge-and-fable/
        └── recipes.json ──────── Recettes créées par le MJ
```

### 💻 Scripts principaux

| Fichier | Fonction |
|---------|----------|
| `scripts/forge.js` | Gestion de l'interface de fabrication et logique métier |
| `scripts/harvest.js` | Système de récolte et génération aléatoire |
| `scripts/recipe-manager.js` | Interface de création pour les MJ |

### 🎨 Templates HTML

- `templates/forge-ui.html` → Interface joueur de fabrication
- `templates/harvest-ui.html` → Interface de récolte  
- `templates/recipe-manager.html` → Interface MJ de création

---

## 🎮 Utilisation pratique

### 🎯 Macros recommandées

#### Fabrication
```javascript
game.forgeFable.open();
```

#### Récolte
```javascript
game.forgeFable.openHarvest();
```

#### Création de recette (MJ uniquement)
```javascript
if (game.user.isGM) {
    game.forgeFable.openRecipeCreator();
} else {
    ui.notifications.warn("Accès réservé au MJ");
}
```

### 🎯 Gestion des ressources

Le système vérifie automatiquement :

- ✅ La possession des ingrédients requis
- ✅ Les quantités suffisantes  
- ✅ La correspondance entre métier et recette
- ✅ L'existence des objets dans la base Foundry pour les icônes

### 🎭 Intégration avec les personnages

- 👤 Lecture de l'inventaire du token sélectionné
- 🔄 Modification automatique des quantités d'objets
- ➕ Création d'objets inexistants avec propriétés par défaut
- 💬 Messages de chat intégrés pour le roleplay

---

## 🎛️ Configuration et personnalisation

### ➕ Ajout de métiers

Éditer `data/metiers.json` :
```json
[
  "Alchimiste",
  "Forgeron", 
  "Cuisinier",
  "Nouveau Métier"
]
```

### 🗺️ Ajout d'environnements de récolte

Modifier `data/harvestables.json` :
```json
{
  "nouveau_biome": ["Ressource A", "Ressource B"],
  "caverne": ["Cristaux", "Minerais précieux"]
}
```

### 🌟 Système de rareté

| Rareté | Couleur | Description |
|--------|---------|-------------|
| **Commun** | 🔘 Gris | Objets de base |
| **Inhabituel** | 🟢 Vert | Objets améliorés |
| **Rare** | 🔵 Bleu | Objets précieux |
| **Épique** | 🟣 Violet | Objets puissants |
| **Légendaire** | 🟠 Orange | Objets exceptionnels |

---

## ⚠️ Limitations connues

| Limitation | Impact | Solution |
|------------|--------|----------|
| **Gestion des icônes** | Fallback vers icône par défaut | Créer des objets dans Foundry |
| **Vérification des outils** | Affichage uniquement | Évolution future possible |
| **Intégration système** | Pas de jets de compétence | Modulaire par design |
| **Persistance** | Fichiers module écrasés | Données dans `/worlds/` |

---

## 🚀 Évolutions possibles

**Améliorations suggérées :**

- 🎲 Intégration avec les jets de compétence du système
- 🔧 Vérification automatique des outils requis  
- 📈 Système de progression artisanale
- ⚡ Échecs et réussites critiques en fabrication
- 📋 Interface de gestion des recettes existantes
- 📤 Export/import de configurations

---

## 📋 Informations techniques

| Propriété | Valeur |
|-----------|--------|
| **Version** | 1.4.0 |
| **Compatibilité** | Foundry VTT v13 |
| **Auteur** | Vekamel |
| **Type** | Module autonome |

**Philosophie :** Le module est conçu pour être léger, modulaire et facilement extensible selon les besoins spécifiques de chaque table de jeu.

---

## 🤝 Support et communauté

Pour signaler des bugs, proposer des améliorations ou obtenir de l'aide :

- 🐛 **Issues** : Utilisez le système d'issues GitHub
- 💡 **Suggestions** : Les propositions d'amélioration sont bienvenues  
- 📖 **Documentation** : Ce README couvre l'essentiel du fonctionnement

---

*Forge & Fable - Transformez vos aventures avec un système de crafting immersif*