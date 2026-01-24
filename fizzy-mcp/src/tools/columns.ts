import { FizzyClient } from "../client.js";

export interface Column {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

// Tool definitions
export const listColumnsToolDefinition = {
  name: "fizzy_list_columns",
  description: "List all columns on a board, sorted by position",
  inputSchema: {
    type: "object" as const,
    properties: {
      board_id: {
        type: "string",
        description: "The ID of the board",
      },
    },
    required: ["board_id"],
  },
};

export const getColumnToolDefinition = {
  name: "fizzy_get_column",
  description: "Get details of a specific column",
  inputSchema: {
    type: "object" as const,
    properties: {
      board_id: {
        type: "string",
        description: "The ID of the board",
      },
      column_id: {
        type: "string",
        description: "The ID of the column",
      },
    },
    required: ["board_id", "column_id"],
  },
};

export const createColumnToolDefinition = {
  name: "fizzy_create_column",
  description: "Create a new column on a board",
  inputSchema: {
    type: "object" as const,
    properties: {
      board_id: {
        type: "string",
        description: "The ID of the board",
      },
      name: {
        type: "string",
        description: "The name of the column",
      },
      color: {
        type: "string",
        enum: [
          "var(--color-card-default)",
          "var(--color-card-1)",
          "var(--color-card-2)",
          "var(--color-card-3)",
          "var(--color-card-4)",
          "var(--color-card-5)",
          "var(--color-card-6)",
          "var(--color-card-7)",
          "var(--color-card-8)",
        ],
        description:
          "Column color: default (Blue), 1 (Gray), 2 (Tan), 3 (Yellow), 4 (Lime), 5 (Aqua), 6 (Violet), 7 (Purple), 8 (Pink)",
      },
    },
    required: ["board_id", "name"],
  },
};

export const updateColumnToolDefinition = {
  name: "fizzy_update_column",
  description: "Update an existing column",
  inputSchema: {
    type: "object" as const,
    properties: {
      board_id: {
        type: "string",
        description: "The ID of the board",
      },
      column_id: {
        type: "string",
        description: "The ID of the column to update",
      },
      name: {
        type: "string",
        description: "The new name of the column",
      },
      color: {
        type: "string",
        description: "The new color of the column",
      },
    },
    required: ["board_id", "column_id"],
  },
};

export const deleteColumnToolDefinition = {
  name: "fizzy_delete_column",
  description: "Delete a column from a board",
  inputSchema: {
    type: "object" as const,
    properties: {
      board_id: {
        type: "string",
        description: "The ID of the board",
      },
      column_id: {
        type: "string",
        description: "The ID of the column to delete",
      },
    },
    required: ["board_id", "column_id"],
  },
};

// Tool implementations
export async function listColumns(
  client: FizzyClient,
  boardId: string
): Promise<Column[]> {
  const response = await client.get<Column[]>(`/boards/${boardId}/columns`);
  return response.data;
}

export async function getColumn(
  client: FizzyClient,
  boardId: string,
  columnId: string
): Promise<Column> {
  const response = await client.get<Column>(
    `/boards/${boardId}/columns/${columnId}`
  );
  return response.data;
}

export interface CreateColumnParams {
  name: string;
  color?: string;
}

export async function createColumn(
  client: FizzyClient,
  boardId: string,
  params: CreateColumnParams
): Promise<{ location: string }> {
  const response = await client.post<{ location: string }>(
    `/boards/${boardId}/columns`,
    { column: params }
  );
  return response.data!;
}

export interface UpdateColumnParams {
  name?: string;
  color?: string;
}

export async function updateColumn(
  client: FizzyClient,
  boardId: string,
  columnId: string,
  params: UpdateColumnParams
): Promise<void> {
  await client.put(`/boards/${boardId}/columns/${columnId}`, { column: params });
}

export async function deleteColumn(
  client: FizzyClient,
  boardId: string,
  columnId: string
): Promise<void> {
  await client.delete(`/boards/${boardId}/columns/${columnId}`);
}
