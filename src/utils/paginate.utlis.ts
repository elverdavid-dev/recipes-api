import { HttpException, HttpStatus } from '@nestjs/common';

export function paginateResults(
  totalItems: number,
  page: number,
  limit: number,
) {
  const totalPages = Math.ceil(totalItems / limit);
  console.log(totalPages);
  if (page < 1 || page > totalPages) {
    throw new HttpException('Página no encontrada', HttpStatus.NOT_FOUND);
  }

  return {
    totalItems,
    totalPages,
    currentPage: page,
  };
}
