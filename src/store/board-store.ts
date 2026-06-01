"use client"

import { create } from "zustand"
import type { Column, Item } from "@/types"

interface BoardState {
  columns: Column[]
  items: Item[]
  isDragging: boolean

  setBoard: (columns: Column[], items: Item[]) => void
  setIsDragging: (v: boolean) => void

  addColumn: (col: Column) => void
  updateColumn: (id: string, data: Partial<Column>) => void
  removeColumn: (id: string) => void

  addItem: (item: Item) => void
  updateItem: (id: string, data: Partial<Item>) => void
  removeItem: (id: string) => void
  moveItem: (id: string, toColumnId: string, newPosition: number) => void
}

export const useBoardStore = create<BoardState>((set) => ({
  columns: [],
  items: [],
  isDragging: false,

  setBoard: (columns, items) => set({ columns, items }),
  setIsDragging: (isDragging) => set({ isDragging }),

  addColumn: (col) =>
    set((s) => ({ columns: [...s.columns, col].sort((a, b) => a.position - b.position) })),
  updateColumn: (id, data) =>
    set((s) => ({
      columns: s.columns
        .map((c) => (c.id === id ? { ...c, ...data } : c))
        .sort((a, b) => a.position - b.position),
    })),
  removeColumn: (id) =>
    set((s) => ({
      columns: s.columns.filter((c) => c.id !== id),
      items: s.items.filter((i) => i.columnId !== id),
    })),

  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  updateItem: (id, data) =>
    set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, ...data } : i)) })),
  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  moveItem: (id, toColumnId, newPosition) =>
    set((s) => ({
      items: s.items.map((i) =>
        i.id === id ? { ...i, columnId: toColumnId, position: newPosition } : i
      ),
    })),
}))
