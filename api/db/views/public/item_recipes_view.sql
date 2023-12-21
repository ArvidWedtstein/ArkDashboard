SELECT
  ir.id,
  ir.crafting_station_id,
  ir.crafting_time,
  ir.yields,
  i1.id AS crafted_item_id,
  i1.name AS crafted_item_name,
  i1.image AS crafted_item_image,
  i1.category AS crafted_item_category,
  i1.type AS crafted_item_type,
  iri.id AS item_recipe_item_id,
  iri.amount,
  i2.id AS item_id,
  i2.name AS item_name,
  i2.image AS item_image
FROM
  (
    (
      (
        "ItemRecipes" ir
        JOIN "Item" i1 ON ((ir.crafted_item_id = i1.id))
      )
      JOIN "ItemRecipeItems" iri ON ((ir.id = iri.item_recipe_id))
    )
    JOIN "Item" i2 ON ((iri.item_id = i2.id))
  )
WHERE
  (
    ir.crafting_station_id <> ALL (
      ARRAY [(214)::bigint, (525)::bigint, (572)::bigint]
    )
  );