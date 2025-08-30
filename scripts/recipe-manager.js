Hooks.once("ready", async () => {
  game.forgeFable = game.forgeFable || {};

  // 📁 Chemin monde
  const worldPath = `worlds/${game.world.id}/forge-and-fable/`;
  const recipeFile = "recipes.json";
  const filePath = `${worldPath}${recipeFile}`;

  // 📄 Vérifie si recipes.json existe, sinon le créer vide
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error("Not found");
  } catch (e) {
    console.log("Forge & Fable | recipes.json non trouvé, création d’un fichier vide…");

    try {
      // Crée le dossier s'il n'existe pas
      await FilePicker.browse("data", worldPath);
    } catch {
      await FilePicker.implementation.createDirectory("data", worldPath, {});
    }

    // Upload fichier vide
    const blob = new Blob([JSON.stringify([], null, 2)], { type: "application/json" });
    await FilePicker.implementation.upload("data", worldPath, new File([blob], recipeFile), {}, { notify: true });

    console.log("Forge & Fable | recipes.json vide créé dans le monde.");
  }


  game.forgeFable.openRecipeCreator = async function () {
    if (!game.user.isGM) {
      return ui.notifications.warn(game.i18n.localize("FORGEFABLE.WarningOnlyGM"));
    }

    const html = await foundry.applications.handlebars.renderTemplate("modules/forge-and-fable/templates/recipe-manager.html");

    new Dialog({
      title: "Création - Forge & Fable",
      content: html,
      buttons: {
        submit: {
          label: "Créer la recette",
          icon: '<i class="fas fa-hammer"></i>',
          callback: async (html) => {
            const form = new FormData(html[0].querySelector("form"));
            const ingredients = [];
            const names = html.find("input[name='ingredient-name']").map((i, el) => el.value).get();
            const qtys = html.find("input[name='ingredient-qty']").map((i, el) => el.value).get();

            for (let i = 0; i < names.length; i++) {
              if (names[i]) {
                ingredients.push({ name: names[i], qty: parseInt(qtys[i]) || 1 });
              }
            }

            const newRecipe = {
              name: form.get("name"),
              metier: form.get("metier"),
              tool: form.get("tool"),
              ingredients: ingredients,
              result: {
                name: form.get("result-name"),
                description: form.get("result-description"),
                rarity: form.get("result-rarity")
              }
            };

            // 📁 Chemin monde
            const worldPath = `worlds/${game.world.id}/forge-and-fable/`;
            const filePath = `${worldPath}recipes.json`;
            const filename = "recipes.json";

            // 🗂️ Vérifier / créer dossier si besoin
            try {
              await FilePicker.browse("data", worldPath);
            } catch (e) {
              console.log(`Forge & Fable | Dossier ${worldPath} non trouvé, création...`);
              await foundry.applications.apps.FilePicker.implementation.createDirectory("data", worldPath);
            }

            // 📄 Charger recettes existantes
            let existing = [];
            try {
              existing = await fetch(filePath).then(r => r.json());
            } catch (e) {
              console.warn("Forge & Fable | Fichier recipes.json non trouvé, il sera créé.");
            }

            existing.push(newRecipe);

            const blob = new Blob([JSON.stringify(existing, null, 2)], { type: "application/json" });

            // 📤 Upload moderne
            await foundry.applications.apps.FilePicker.implementation.upload(
              "data",
              worldPath,
              new File([blob], filename),
              {},
              { notify: true }
            );

            ui.notifications.info(game.i18n.localize("FORGEFABLE.RecipeAdded"));
          }
        }
      },
      render: (html) => {
  html.find(".add-ingredient").on("click", () => {
    const container = html.find(".ingredients-list");
    const row = $(`
      <div class="ingredient" style="display: flex; gap: 0.5rem;">
        <input type="text" placeholder="Nom" name="ingredient-name" class="form-control" />
        <input type="number" placeholder="Qté" name="ingredient-qty" class="form-control" style="width: 60px;" min="1" value="1" />
      </div>`);
    container.append(row);
  });
},

      default: "submit"
    }, {
      width: 700,
      height: "auto",
      resizable: true,
      classes: ["forge-ui"]
    }).render(true);
  };
});
