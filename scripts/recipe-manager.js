class ForgeFableRecipeCreatorApp extends Application {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "forge-fable-recipe-manager",
      title: "Créer une nouvelle recette",
      template: "modules/forge-and-fable/templates/recipe-manager.html",
      width: 500,
      height: "auto",
      resizable: true
    });
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".add-ingredient").on("click", () => {
      const container = html.find(".ingredients-list");
      const newRow = $(`
        <div class="ingredient">
          <input type="text" placeholder="Nom" name="ingredient-name" />
          <input type="number" placeholder="Quantité" name="ingredient-qty" min="1" value="1" />
        </div>`);
      container.append(newRow);
    });

    html.on("submit", async ev => {
      ev.preventDefault();
      const form = new FormData(ev.target);

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

      const filePath = "modules/forge-and-fable/data/recipes.json";
      const existing = await fetch(filePath).then(r => r.json());
      existing.push(newRecipe);

      const blob = new Blob([JSON.stringify(existing, null, 2)], { type: "application/json" });
      const filename = filePath.split("/").pop();

      await FilePicker.upload("data", filePath.replace(filename, ""), new File([blob], filename), {}, { notify: true });
      ui.notifications.info("Recette ajoutée avec succès !");
      this.close();
    });
  }
}

// Rendre accessible globalement
window.ForgeFableRecipeCreatorApp = ForgeFableRecipeCreatorApp;
