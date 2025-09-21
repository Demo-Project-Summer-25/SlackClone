export interface KanbanCard {
  id: string;
  columnId: string;
  title: string;
  description?: string | null;
  position?: number | null;
  dueAt?: string | null;
  priorityId?: string | null;
  priorityLabel?: string | null;
  priorityColor?: string | null;
  createdBy: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  assignees: string[];
}

export interface KanbanColumn {
  id: string;
  name: string;
  position?: number | null;
  createdAt: string;
  updatedAt: string;
  cards: KanbanCard[];
}

export interface KanbanBoard {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  columns: KanbanColumn[];
}

export interface BoardCreatePayload {
  name: string;
  ownerId: string;
  description?: string | null;
}

export interface ColumnCreatePayload {
  name: string;
  boardId: string;
  position?: number;
}

export interface ColumnUpdatePayload {
  name?: string;
  position?: number;
}

export interface CardCreatePayload {
  columnId: string;
  title: string;
  description?: string | null;
  position?: number;
  dueAt?: string | null;
  priorityId?: string | null;
  createdBy: string;
  assignees: string[];
}

export interface CardUpdatePayload {
  title?: string;
  description?: string | null;
  dueAt?: string | null;
  priorityId?: string | null;
  archived?: boolean;
  columnId?: string;
  position?: number;
}

export interface CardAssignmentPayload {
  userId: string;
}
