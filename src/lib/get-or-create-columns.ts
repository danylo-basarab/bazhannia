import { prisma } from "./prisma"

const DEFAULT_COLUMNS = [
  { name: "хочу", color: "#fecdd3", position: 1000 },
  { name: "планую", color: "#bfdbfe", position: 2000 },
  { name: "маю", color: "#bbf7d0", position: 3000 },
]

export async function getOrCreateColumns(userId: string) {
  const existing = await prisma.column.findMany({
    where: { userId },
    orderBy: { position: "asc" },
  })

  if (existing.length > 0) return existing

  return prisma.$transaction(
    DEFAULT_COLUMNS.map((col) =>
      prisma.column.create({ data: { userId, ...col } })
    )
  )
}
