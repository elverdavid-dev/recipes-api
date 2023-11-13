import { HttpException, HttpStatus } from '@nestjs/common'

export function paginateResults(
  totalItems: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(totalItems / limit)

  const skip = (page - 1) * limit

  const PageData = {
    totalItems,
    totalPages,
    currentPage: page,
    skip
  }

  if (totalPages === 0) {
    return PageData
  } else if (page < 0 || page > totalPages) {
    throw new HttpException('Página no encontrada', HttpStatus.NOT_FOUND)
  }

  return PageData
}
