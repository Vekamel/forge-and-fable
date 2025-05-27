Hooks.once("ready", () => {
  game.forgeFable = game.forgeFable || {};

  game.forgeFable.openHarvest = async function () {
    const actor = canvas.tokens.controlled[0]?.actor;
    if (!actor) return ui.notifications.warn("Sélectionnez un token.");

    const biomes = await fetch("modules/forge-and-fable/data/harvestables.json").then(r => r.json());
    const biomeList = Object.keys(biomes);
    const content = await renderTemplate("modules/forge-and-fable/templates/harvest-ui.html");

    new Dialog({
      title: "Récolte – Forge & Fable",
      content,
      buttons: {},
      render: html => {
        const biomeSelect = html.find("#harvest-biome");
        const harvestButton = html.find("#harvest-button");
        const resultName = html.find("#harvest-name");
        const resultIcon = html.find("#harvest-icon");

        if (biomeSelect.length && biomeSelect[0].options.length === 0) {
          biomeList.forEach(b => biomeSelect.append(`<option value="${b}">${b}</option>`));
        }

        harvestButton.on("click", async () => {
          const biome = biomeSelect.val();
          const pool = biomes[biome] || [];

          if (!Array.isArray(pool) || pool.length === 0) {
            ui.notifications.warn("Aucun objet à récolter dans cet environnement.");
            return;
          }

          const picked = pool[Math.floor(Math.random() * pool.length)];

          const existing = actor.items.find(i => i.name === picked);
          const img = game.items.getName(picked)?.img || "modules/forge-and-fable/assets/default-icon.webp";

          if (existing) {
            await existing.update({ "system.quantity": existing.system.quantity + 1 });
          } else {
            await actor.createEmbeddedDocuments("Item", [{
              name: picked,
              type: "loot",
              img,
              system: { quantity: 1 }
            }]);
          }

          resultName.text(picked);
          resultIcon.attr("src", img);

          ChatMessage.create({
            content: `<strong>${actor.name}</strong> a récolté : <em>${picked}</em> (${biome})`,
            speaker: ChatMessage.getSpeaker({ actor })
          });

          ui.notifications.info(`Vous avez récolté : ${picked}`);
        });
      }
    }, {
      width: 600,
      height: "auto",
      resizable: true,
      classes: ["forge-ui"]
    }).render(true);
  };
});
