import { FizzyClient } from "../client.js";
import { User } from "./identity.js";

export interface Board {
  id: string;
  name: string;
  all_access: boolean;
  created_at: string;
  url: string;
  creator: User;
}

// Tool definitions
export const listBoardsToolDefinition = {
  name: "fizzy_list_boards",
  description: "List all boards you have access to in the account",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
};

export const getBoardToolDefinition = {
  name: "fizzy_get_board",
  description: "Get details of a specific board",
  inputSchema: {
    type: "object" as const,
    properties: {
      board_id: {
        type: "string",
        description: "The ID of the board to retrieve",
      },
    },
    required: ["board_id"],
  },
};

export const createBoardToolDefinition = {
  name: "fizzy_create_board",
  description: "Create a new board",
  inputSchema: {
    type: "object" as const,
    properties: {
      name: {
        type: "string",
        description: "The name of the board",
      },
      all_access: {
        type: "boolean",
        description:
          "Whether any user in the account can access this board (default: true)",
      },
      auto_postpone_period: {
        type: "number",
        description:
          "Number of days of inactivity before cards are automatically postponed",
      },
      public_description: {
        type: "string",
        description: "Rich text description shown on the public board page",
      },
    },
    required: ["name"],
  },
};

export const updateBoardToolDefinition = {
  name: "fizzy_update_board",
  description: "Update an existing board",
  inputSchema: {
    type: "object" as const,
    properties: {
      board_id: {
        type: "string",
        description: "The ID of the board to update",
      },
      name: {
        type: "string",
        description: "The new name of the board",
      },
      all_access: {
        type: "boolean",
        description: "Whether any user in the account can access this board",
      },
      auto_postpone_period: {
        type: "number",
        description:
          "Number of days of inactivity before cards are automatically postponed",
      },
      public_description: {
        type: "string",
        description: "Rich text description shown on the public board page",
      },
      user_ids: {
        type: "array",
        items: { type: "string" },
        description:
          "Array of user IDs who should have access (only when all_access is false)",
      },
    },
    required: ["board_id"],
  },
};

export const deleteBoardToolDefinition = {
  name: "fizzy_delete_board",
  description: "Delete a board (only board administrators can delete)",
  inputSchema: {
    type: "object" as const,
    properties: {
      board_id: {
        type: "string",
        description: "The ID of the board to delete",
      },
    },
    required: ["board_id"],
  },
};

// Tool implementations
export async function listBoards(client: FizzyClient): Promise<Board[]> {
  const response = await client.get<Board[]>("/boards");
  return response.data;
}

export async function getBoard(
  client: FizzyClient,
  boardId: string
): Promise<Board> {
  const response = await client.get<Board>(`/boards/${boardId}`);
  return response.data;
}

export interface CreateBoardParams {
  name: string;
  all_access?: boolean;
  auto_postpone_period?: number;
  public_description?: string;
}

export async function createBoard(
  client: FizzyClient,
  params: CreateBoardParams
): Promise<{ location: string }> {
  const response = await client.post<{ location: string }>("/boards", {
    board: params,
  });
  return response.data!;
}

export interface UpdateBoardParams {
  name?: string;
  all_access?: boolean;
  auto_postpone_period?: number;
  public_description?: string;
  user_ids?: string[];
}

export async function updateBoard(
  client: FizzyClient,
  boardId: string,
  params: UpdateBoardParams
): Promise<void> {
  await client.put(`/boards/${boardId}`, { board: params });
}

export async function deleteBoard(
  client: FizzyClient,
  boardId: string
): Promise<void> {
  await client.delete(`/boards/${boardId}`);
}
