import { Prisma } from "@prisma/client";
import { PaginationQueryParams } from "../../types/pagination.type";
import prisma from "../../prisma";

interface GetProductsQuery extends PaginationQueryParams {
  search: string;
}

export const getProductsService = async (query: GetProductsQuery) => {
  try {
    const { page, search, sortBy, sortOrder, take } = query;

    const whereClause: Prisma.ProductWhereInput = {
      name: { contains: search },
      isAvailable: true,
    };

    const products = await prisma.product.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        discount: true,
      },
    });

    const count = await prisma.product.count({ where: whereClause });

    return {
      data: products,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
