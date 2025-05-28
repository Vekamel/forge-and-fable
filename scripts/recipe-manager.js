Hooks.once("ready", async () => {
  game.forgeFable = game.forgeFable || {};

  game.forgeFable.openRecipeCreator = async function () {
    if (!game.user.isGM) {
      return ui.notifications.warn("Seul un MJ peut créer une recette.");
    }

    const html = await renderTemplate("modules/forge-and-fable/templates/recipe-manager.html");
    new Dialog({
      title: "Création de recette – Forge & Fable",
      content: html,
      buttons: {
        submit: {
          label: "Créer",
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

            const worldPath = "worlds/" + game.world.id + "/recipes.json";

            // Lire le fichier existant dans le monde
            let existing = [];
            try {
              const response = await fetch(worldPath);
              if (response.ok) existing = await response.json();
            } catch (err) {
              console.warn("Aucune recette existante trouvée dans le monde. Un nouveau fichier sera créé.");
            }

            existing.push(newRecipe);
            const blob = new Blob([JSON.stringify(existing, null, 2)], { type: "application/json" });
            const filename = "recipes.json";

            await FilePicker.upload("data", `worlds/${game.world.id}`, new File([blob], filename), {}, { notify: true });
            ui.notifications.info("Recette ajoutée avec succès !");
          }
        }
      },
      render: (html) => {
        html.find(".add-ingredient").on("click", () => {
          const container = html.find(".ingredients-list");
          const newRow = $(`
            <div class="ingredient" style="display: flex; gap: 0.5rem;">
              <input type="text" placeholder="Nom" name="ingredient-name" class="form-control" />
              <input type="number" placeholder="Qté" name="ingredient-qty" class="form-control" style="width: 60px;" min="1" value="1" />
            </div>`);
          container.append(newRow);
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
