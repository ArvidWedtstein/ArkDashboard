const { items } = require("./web/public/arkitems.json");
let data = [
  {
    id: 1,
    content: "aaaa",
    created_at: "2023-01-16T00:00:00.000Z",
    profile_id: 1,
  },
  {
    id: 3,
    content: "bbbbbbbbb",
    created_at: "2023-01-16T10:00:00.000Z",
    profile_id: 2,
  },
  {
    id: 2,
    content: "Hello",
    created_at: "2023-01-16T10:00:20.000Z",
    profile_id: 1,
  },
  {
    id: 4,
    content: "bruh",
    created_at: "2023-01-16T10:00:30.000Z",
    profile_id: 1,
  },
  {
    id: 5,
    content: "test123254346",
    created_at: "2023-01-16T11:00:00.000Z",
    profile_id: 1,
  },
  {
    id: 6,
    content: "test",
    created_at: "2023-01-16T12:00:00.000Z",
    profile_id: 2,
  },
];

console.time("normal");

const getBaseMaterials2 = (firstRecipeOnly = false, ...objects) => {
  let materials = [];
  let processedItems = new Set();

  function findBaseMaterials(itemId, amount) {
    let recipe = items.find((r) => r.itemId === itemId)?.recipe;

    if (!recipe) {
      return;
    }

    recipe.forEach(({ itemId: recipeItemId, count: recipeCount }) => {
      let recipeItem = items.find((r) => r.itemId === recipeItemId);
      let count = recipeCount * amount;

      if (!firstRecipeOnly || !recipeItem?.recipe.length) {
        let materialIndex = materials.findIndex(
          (m) => m.itemId === recipeItemId
        );
        if (materialIndex !== -1) {
          materials[materialIndex].count += count;
        } else {
          materials.push({ ...recipeItem, amount: count });
        }
      } else if (!processedItems.has(recipeItem.itemId)) {
        processedItems.add(recipeItem.itemId);
        findBaseMaterials(recipeItem.itemId, count);
      }
    });
  }

  objects.forEach(({ itemId, amount }) => {
    findBaseMaterials(itemId, amount);
  });

  return materials;
};
console.log(getBaseMaterials2(false, { itemId: 4, amount: 2 }));
console.timeEnd("normal");

console.time("optimized");
const getBaseMaterials = (firstRecipeOnly = false, ...objects) => {
  let materials = [];

  /**
   * Recursive function to find the base materials required to produce an object.
   *
   * @param {number} itemId - The unique identifier for the object.
   * @param {number} amount - The number of objects required.
   */
  function findBaseMaterials(itemId, amount) {
    let recipe = items.find((r) => r.itemId === itemId)?.recipe;

    if (!recipe) {
      return;
    }

    for (let i = 0; i < recipe.length; i++) {
      let recipeItem = items.find((r) => r.itemId === recipe[i].itemId);
      let count = recipe[i].count * amount;

      if (!firstRecipeOnly || !recipeItem?.recipe.length) {
        let material = materials.find((m) => m.itemId === recipe[i].itemId);
        if (material) {
          material.amount += count;
        } else {
          materials.push({ ...recipeItem, amount: count });
        }
      } else {
        findBaseMaterials(recipeItem.itemId, count);
      }
    }
  }

  objects.forEach(({ itemId, amount }) => {
    findBaseMaterials(itemId, amount);
  });

  return materials;
};

console.log(getBaseMaterials(true, { itemId: 4, amount: 2 }));
console.timeEnd("optimized");
