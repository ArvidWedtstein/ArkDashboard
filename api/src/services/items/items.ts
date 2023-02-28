import type { QueryResolvers, MutationResolvers } from "types/graphql";

import { db } from "src/lib/db";

export const itemsPage = ({
  page = 1,
  items_per_page = 36,
}: {
  page: number;
  items_per_page: number;
}) => {
  const offset = (page - 1) * items_per_page;
  return {
    items: db.item.findMany({
      take: items_per_page,
      skip: offset,
      orderBy: { created_at: "desc" },
    }),
    count: db.item.count(),
  };
};

export const items: QueryResolvers["items"] = () => {
  return db.item.findMany();
};

export const item: QueryResolvers["item"] = ({ id }) => {
  return db.item.findUnique({
    where: { id },
  });
};

export const createItem: MutationResolvers["createItem"] = ({ input }) => {
  return db.item.create({
    data: input,
  });
};

export const updateItem: MutationResolvers["updateItem"] = ({ id, input }) => {
  return db.item.update({
    data: input,
    where: { id },
  });
};

export const deleteItem: MutationResolvers["deleteItem"] = ({ id }) => {
  return db.item.delete({
    where: { id },
  });
};
