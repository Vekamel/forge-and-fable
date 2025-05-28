Hooks.once("ready", async () => {
  game.forgeFable = game.forgeFable || {};

  // Interface joueur
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

  // Fonction MJ
  game.forgeFable.openRecipeCreator = openRecipeCreationDialog;
});

// Fonction image fallback
function getItemImageByName(name) {
  const item = game.items.getName(name);
  const img = item?.img;
  if (!item || !img || img === "icons/svg/item-bag.svg" || img === "icons/svg/mystery-man.svg") {
    return "modules/forge-and-fable/assets/default-icon.webp";
  }
  return img;
}

// Logique interface joueur
function setupLogic(html, actor, allRecipes) {
  const metierSelect = html.find("#metier");
  const recetteSelect = html.find("#recette");
  const ingredientsDiv = html.find("#ingredients");
  const resultDiv = html.find("#resultat");
  const craftBtn = html.find("#craft-button");

  function refreshRecettes() {
    const metier = metierSelect.val();
    const filtered = allRecipes.filter(r => r.metier === metier);
    recetteSelect.empty();
    filtered.forEach((r, i) => recetteSelect.append(`<option value="${i}">${r.name}</option>`));
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
      ingredientsDiv.append(`
        <div class="ingredient ${enough ? "ok" : "missing"}" style="display: flex; align-items: center; gap: 0.5rem;">
          <img src="${iconPath}" width="32" height="32" />
          <span>${ing.qty} × ${ing.name} (Possédé : ${owned})</span>
        </div>
      `);
    });

    const img = getItemImageByName(recipe.result.name);
    const toolImg = getItemImageByName(recipe.tool);

    resultDiv.html(`
      <img src="${img}" />
      <h3 class="rarity ${recipe.result.rarity}">${recipe.result.name}</h3>
      <p>${recipe.result.description}</p>
      <p><strong>Rareté :</strong> ${recipe.result.rarity}</p>
      <div style="margin-top:0.5rem; display: flex; align-items: center; gap: 0.5rem;">
        <img src="${toolImg}" />
        <span>Outil requis : ${recipe.tool}</span>
      </div>
    `);

    const canCraft = recipe.ingredients.every(ing => {
      const owned = actor.items.find(i => i.name === ing.name)?.system?.quantity || 0;
      return owned >= ing.qty;
    });

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
      content: `<strong>${actor.name}</strong> vient de fabriquer <em>${recipe.result.name}</em> !`
    });

    ui.notifications.info(`Objet fabriqué : ${recipe.result.name}`);
    updateRecette();
  }

  metierSelect.on("change", refreshRecettes);
  recetteSelect.on("change", updateRecette);
  craftBtn.on("click", craft);

  if (metierSelect.val()) refreshRecettes();
}

// Interface MJ – Dialog redimensionnable
function openRecipeCreationDialog() {
  if (!game.user.isGM) return ui.notifications.warn("Seul un MJ peut créer une recette.");

  const content = renderTemplate("modules/forge-and-fable/templates/recipe-manager.html");

  content.then(html => {
    const dialog = new Dialog({
      title: "Création de recette – Forge & Fable",
      content: html,
      buttons: {},
      render: html => {
        html.find(".add-ingredient").on("click", () => {
          const container = html.find(".ingredients-list");
          const newRow = $(`<div class="ingredient" style="display: flex; gap: 0.5rem;">
              <input type="text" placeholder="Nom" name="ingredient-name" class="form-control" />
              <input type="number" placeholder="Qté" name="ingredient-qty" class="form-control" style="width: 60px;" min="1" value="1" />
            </div>`);
          container.append(newRow);
        });

        html.find("form").on("submit", async ev => {
          ev.preventDefault();
          const form = new FormData(ev.target);
          const ingredients = [];
          const names = html.find("input[name='ingredient-name']").map((i, el) => el.value).get();
          const qtys = html.find("input[name='ingredient-qty']").map((i, el) => el.value).get();

          for (let i = 0; i < names.length; i++) {
            if (names[i]) ingredients.push({ name: names[i], qty: parseInt(qtys[i]) || 1 });
          }

          const newRecipe = {
            name: form.get("name"),
            metier: form.get("metier"),
            tool: form.get("tool"),
            ingredients,
            result: {
              name: form.get("result-name"),
              description: form.get("result-description"),
              rarity: form.get("result-rarity")
            }
          };

          const folder = `worlds/${game.world.id}/forge-and-fable/`;
          const path = `${folder}recipes.json`;
          const filename = "recipes.json";

          // Vérifie si le dossier existe et le crée si nécessaire
          await FilePicker.implementation.browse("data", folder)
            .catch(async () => {
              await FilePicker.implementation.createDirectory("data", folder, {});
            });

          // Charge les données existantes ou crée une nouvelle liste
          let existing = [];
          try {
            const response = await fetch(path);
            existing = await response.json();
          } catch (e) {
            existing = [];
          }

          existing.push(newRecipe);
          const blob = new Blob([JSON.stringify(existing, null, 2)], { type: "application/json" });

          await FilePicker.implementation.upload("data", folder, new File([blob], filename), {}, { notify: true });
          ui.notifications.info("Recette ajoutée dans le monde !");
          dialog.close();
        });
      }
    }, {
      width: 700,
      height: "auto",
      resizable: true,
      classes: ["forge-ui"]
    });

    dialog.render(true);
  });
}
