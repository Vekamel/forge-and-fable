Hooks.once("ready", async () => {
  const worldPath = `worlds/${game.world.id}/forge-and-fable/`;
  const fileName = "metiers.json";
  const sourcePath = `modules/forge-and-fable/data/${fileName}`;
  const targetPath = `${worldPath}${fileName}`;

  // Vérifie si le fichier existe déjà
  try {
    const response = await fetch(targetPath);
    if (response.ok) {
      console.log(`Forge & Fable : ${fileName} déjà présent.`);
    } else {
      throw new Error("Fichier non trouvé.");
    }
  } catch {
    try {
      // Récupère le fichier source
      const sourceResponse = await fetch(sourcePath);
      if (!sourceResponse.ok) throw new Error(`Fichier source introuvable : ${sourcePath}`);
      const data = await sourceResponse.text();
      const blob = new Blob([data], { type: "application/json" });

      // Crée le dossier dans world si nécessaire
      await FilePicker.implementation.browse("data", worldPath)
        .catch(() => FilePicker.implementation.createDirectory("data", worldPath, {}));

      // Upload
      await FilePicker.implementation.upload("data", worldPath, new File([blob], fileName), {}, { notify: true });

      console.log(`Forge & Fable : ${fileName} copié dans le world.`);
      ui.notifications.info(`Forge & Fable : ${fileName} copié automatiquement dans le dossier du monde.`);
    } catch (error) {
      console.error(`Forge & Fable : Erreur de copie du fichier ${fileName}`, error);
      ui.notifications.error(`Forge & Fable : Impossible de copier ${fileName}`);
    }
  }


  game.forgeFable.open = async function () {
    const actor = canvas.tokens.controlled[0]?.actor;
    if (!actor) return ui.notifications.warn("Sélectionnez un token.");

    const metiers = await fetch("modules/forge-and-fable/data/metiers.json").then(r => r.json());
    const recipes = await fetch("worlds/" + game.world.id + "/forge-and-fable/recipes.json").then(r => r.json()).catch(() => []);

    const content = await renderTemplate("modules/forge-and-fable/templates/forge-ui.html", { metiers, recipes });
    new Dialog({
      title: "Fabrication - Forge & Fable",
      content,
      render: html => setupLogic(html, actor, recipes),
      buttons: {}
    }, { classes: ["forge-ui"], width: 600, height: 700, resizable: true }).render(true);
  };

  game.forgeFable.openRecipeCreator = openRecipeCreationDialog;
});

function getItemImageByName(name) {
  const item = game.items.getName(name);
  const img = item?.img;
  if (!item || !img || img === "icons/svg/item-bag.svg" || img === "icons/svg/mystery-man.svg") {
    return "modules/forge-and-fable/assets/default-icon.webp";
  }
  return img;
}

function setupLogic(html, actor, allRecipes) {
  const metierSelect = html.find("#metier");
  const recetteSelect = html.find("#recette");
  const ingredientsDiv = html.find("#ingredients");
  const resultDiv = html.find("#resultat");
  const craftBtn = html.find("#craft-button");
  const outilDiv = html.find("#outil");

  const recetteSearch = html.find("#recette-search");
  const rareteFilter = html.find("#rarete-filter");

  function refreshRecettes() {
    const metier = metierSelect.val();
    const searchTerm = recetteSearch.val().toLowerCase();
    const rarete = rareteFilter.val();

    let filtered = allRecipes.filter(r => r.metier === metier);

    if (searchTerm) {
      filtered = filtered.filter(r => r.name.toLowerCase().includes(searchTerm));
    }

    if (rarete) {
      filtered = filtered.filter(r => r.result.rarity === rarete);
    }

    recetteSelect.empty();
    filtered.forEach((r, i) => recetteSelect.append('<option value="' + i + '">' + r.name + '</option>'));
    recetteSelect.data("filtered", filtered);
    updateRecette();
  }

  function updateRecette() {
    const list = recetteSelect.data("filtered");
    const index = parseInt(recetteSelect.val());
    const recipe = list?.[index];
    if (!recipe) return;

    ingredientsDiv.empty();
    recipe.ingredients.forEach(ing => {
      const owned = actor.items.find(i => i.name === ing.name)?.system?.quantity || 0;
      const enough = owned >= ing.qty;
      const iconPath = getItemImageByName(ing.name);
      ingredientsDiv.append(
        '<div class="ingredient ' + (enough ? "ok" : "missing") + '" style="display: flex; align-items: center; gap: 0.5rem;">' +
        '<img src="' + iconPath + '" width="32" height="32" />' +
        '<span>' + ing.qty + ' × ' + ing.name + ' (Possédé : ' + owned + ')</span>' +
        '</div>'
      );
    });

    outilDiv.empty();
    if (recipe.tool) {
      const owned = actor.items.find(i => i.name === recipe.tool)?.system?.quantity || 0;
      const toolImg = getItemImageByName(recipe.tool);
      outilDiv.append(
        '<div class="outil" style="display: flex; align-items: center; gap: 0.5rem;">' +
        '<img src="' + toolImg + '" width="32" height="32" />' +
        '<span>1 × ' + recipe.tool + ' (Possédé : ' + owned + ')</span>' +
        '</div>'
      );
    } else {
      outilDiv.append("<em>Aucun outil requis.</em>");
    }

    const img = getItemImageByName(recipe.result.name);
    resultDiv.html(
      '<img src="' + img + '" />' +
      '<h3 class="rarity ' + recipe.result.rarity + '">' + recipe.result.name + '</h3>' +
      '<p>' + recipe.result.description + '</p>' +
      '<p><strong>Rareté :</strong> ' + recipe.result.rarity + '</p>'
    );

    const hasIngredients = recipe.ingredients.every(ing => {
      const owned = actor.items.find(i => i.name === ing.name)?.system?.quantity || 0;
      return owned >= ing.qty;
    });

    const hasTool = !recipe.tool || (actor.items.find(i => i.name === recipe.tool)?.system?.quantity || 0) >= 1;
    const canCraft = hasIngredients && hasTool;

    craftBtn.prop("disabled", !canCraft);
  }

  async function craft() {
    const list = recetteSelect.data("filtered");
    const index = parseInt(recetteSelect.val());
    const recipe = list?.[index];
    if (!recipe) return;

    for (let ing of recipe.ingredients) {
      const item = actor.items.find(i => i.name === ing.name);
      if (item) {
        await item.update({ "system.quantity": item.system.quantity - ing.qty });
      }
    }

    const existing = actor.items.find(i => i.name === recipe.result.name);
    if (existing) {
      await existing.update({ "system.quantity": existing.system.quantity + 1 });
    } else {
      await actor.createEmbeddedDocuments("Item", [{
        name: recipe.result.name,
        type: "consumable",
        img: getItemImageByName(recipe.result.name),
        system: {
          quantity: 1,
          description: recipe.result.description,
          rarity: recipe.result.rarity
        }
      }]);
    }

    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor }),
      content: '<strong>' + actor.name + '</strong> vient de fabriquer <em>' + recipe.result.name + '</em> !'
    });

    ui.notifications.info("Objet fabriqué : " + recipe.result.name);
    updateRecette();
  }

  metierSelect.on("change", refreshRecettes);
  recetteSelect.on("change", updateRecette);
  craftBtn.on("click", craft);
  recetteSearch.on("input", refreshRecettes);
  rareteFilter.on("change", refreshRecettes);

  if (metierSelect.val()) refreshRecettes();
}