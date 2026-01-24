import { FizzyClient } from "../client.js";
import { User } from "./identity.js";
import { Board } from "./boards.js";

export interface Card {
  id: string;
  number: number;
  title: string;
  status: string;
  description: string;
  description_html: string;
  image_url: string | null;
  tags: string[];
  golden: boolean;
  last_active_at: string;
  created_at: string;
  url: string;
  board: Board;
  creator: User;
  comments_url: string;
}

// Tool definitions
export const listCardsToolDefinition = {
  name: "fizzy_list_cards",
  description:
    "List cards with optional filtering. Returns paginated results.",
  inputSchema: {
    type: "object" as const,
    properties: {
      board_ids: {
        type: "array",
        items: { type: "string" },
        description: "Filter by board ID(s)",
      },
      tag_ids: {
        type: "array",
        items: { type: "string" },
        description: "Filter by tag ID(s)",
      },
      assignee_ids: {
        type: "array",
        items: { type: "string" },
        description: "Filter by assignee user ID(s)",
      },
      creator_ids: {
        type: "array",
        items: { type: "string" },
        description: "Filter by card creator ID(s)",
      },
      indexed_by: {
        type: "string",
        enum: ["all", "closed", "not_now", "stalled", "postponing_soon", "golden"],
        description: "Filter by card index",
      },
      sorted_by: {
        type: "string",
        enum: ["latest", "newest", "oldest"],
        description: "Sort order (default: latest)",
      },
      terms: {
        type: "array",
        items: { type: "string" },
        description: "Search terms to filter cards",
      },
    },
    required: [],
  },
};

export const getCardToolDefinition = {
  name: "fizzy_get_card",
  description: "Get details of a specific card by its number",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number",
      },
    },
    required: ["card_number"],
  },
};

export const createCardToolDefinition = {
  name: "fizzy_create_card",
  description: "Create a new card on a board",
  inputSchema: {
    type: "object" as const,
    properties: {
      board_id: {
        type: "string",
        description: "The ID of the board to create the card on",
      },
      title: {
        type: "string",
        description: "The title of the card",
      },
      description: {
        type: "string",
        description: "Rich text description of the card (HTML supported)",
      },
      status: {
        type: "string",
        enum: ["published", "drafted"],
        description: "Initial status (default: published)",
      },
      tag_ids: {
        type: "array",
        items: { type: "string" },
        description: "Array of tag IDs to apply to the card",
      },
    },
    required: ["board_id", "title"],
  },
};

export const updateCardToolDefinition = {
  name: "fizzy_update_card",
  description: "Update an existing card",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number to update",
      },
      title: {
        type: "string",
        description: "The new title of the card",
      },
      description: {
        type: "string",
        description: "The new description of the card",
      },
      status: {
        type: "string",
        enum: ["drafted", "published"],
        description: "Card status",
      },
      tag_ids: {
        type: "array",
        items: { type: "string" },
        description: "Array of tag IDs to apply to the card",
      },
    },
    required: ["card_number"],
  },
};

export const deleteCardToolDefinition = {
  name: "fizzy_delete_card",
  description:
    "Delete a card (only card creator or board administrators can delete)",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number to delete",
      },
    },
    required: ["card_number"],
  },
};

export const closeCardToolDefinition = {
  name: "fizzy_close_card",
  description: "Close a card (mark as done)",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number to close",
      },
    },
    required: ["card_number"],
  },
};

export const reopenCardToolDefinition = {
  name: "fizzy_reopen_card",
  description: "Reopen a closed card",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number to reopen",
      },
    },
    required: ["card_number"],
  },
};

export const moveToNotNowToolDefinition = {
  name: "fizzy_move_to_not_now",
  description: "Move a card to 'Not Now' status (postpone)",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number to move to Not Now",
      },
    },
    required: ["card_number"],
  },
};

export const triageCardToolDefinition = {
  name: "fizzy_triage_card",
  description: "Move a card from triage into a column",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number to triage",
      },
      column_id: {
        type: "string",
        description: "The ID of the column to move the card into",
      },
    },
    required: ["card_number", "column_id"],
  },
};

export const sendToTriageToolDefinition = {
  name: "fizzy_send_to_triage",
  description: "Send a card back to triage",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number to send back to triage",
      },
    },
    required: ["card_number"],
  },
};

export const toggleAssignmentToolDefinition = {
  name: "fizzy_toggle_assignment",
  description: "Toggle assignment of a user to/from a card",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number",
      },
      assignee_id: {
        type: "string",
        description: "The ID of the user to assign/unassign",
      },
    },
    required: ["card_number", "assignee_id"],
  },
};

export const toggleTagToolDefinition = {
  name: "fizzy_toggle_tag",
  description:
    "Toggle a tag on or off for a card. Creates the tag if it doesn't exist.",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number",
      },
      tag_title: {
        type: "string",
        description: "The title of the tag (leading # is stripped)",
      },
    },
    required: ["card_number", "tag_title"],
  },
};

// Tool implementations
export interface ListCardsParams {
  board_ids?: string[];
  tag_ids?: string[];
  assignee_ids?: string[];
  creator_ids?: string[];
  indexed_by?: string;
  sorted_by?: string;
  terms?: string[];
}

export async function listCards(
  client: FizzyClient,
  params: ListCardsParams = {}
): Promise<Card[]> {
  const queryParts: string[] = [];

  if (params.board_ids) {
    params.board_ids.forEach((id) => queryParts.push(`board_ids[]=${encodeURIComponent(id)}`));
  }
  if (params.tag_ids) {
    params.tag_ids.forEach((id) => queryParts.push(`tag_ids[]=${encodeURIComponent(id)}`));
  }
  if (params.assignee_ids) {
    params.assignee_ids.forEach((id) => queryParts.push(`assignee_ids[]=${encodeURIComponent(id)}`));
  }
  if (params.creator_ids) {
    params.creator_ids.forEach((id) => queryParts.push(`creator_ids[]=${encodeURIComponent(id)}`));
  }
  if (params.indexed_by) {
    queryParts.push(`indexed_by=${encodeURIComponent(params.indexed_by)}`);
  }
  if (params.sorted_by) {
    queryParts.push(`sorted_by=${encodeURIComponent(params.sorted_by)}`);
  }
  if (params.terms) {
    params.terms.forEach((term) => queryParts.push(`terms[]=${encodeURIComponent(term)}`));
  }

  const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";
  const response = await client.get<Card[]>(`/cards${queryString}`);
  return response.data;
}

export async function getCard(
  client: FizzyClient,
  cardNumber: number
): Promise<Card> {
  const response = await client.get<Card>(`/cards/${cardNumber}`);
  return response.data;
}

export interface CreateCardParams {
  title: string;
  description?: string;
  status?: "published" | "drafted";
  tag_ids?: string[];
}

export async function createCard(
  client: FizzyClient,
  boardId: string,
  params: CreateCardParams
): Promise<{ location: string }> {
  const response = await client.post<{ location: string }>(
    `/boards/${boardId}/cards`,
    { card: params }
  );
  return response.data!;
}

export interface UpdateCardParams {
  title?: string;
  description?: string;
  status?: "drafted" | "published";
  tag_ids?: string[];
}

export async function updateCard(
  client: FizzyClient,
  cardNumber: number,
  params: UpdateCardParams
): Promise<Card> {
  const response = await client.put<Card>(`/cards/${cardNumber}`, {
    card: params,
  });
  return response.data!;
}

export async function deleteCard(
  client: FizzyClient,
  cardNumber: number
): Promise<void> {
  await client.delete(`/cards/${cardNumber}`);
}

export async function closeCard(
  client: FizzyClient,
  cardNumber: number
): Promise<void> {
  await client.post(`/cards/${cardNumber}/closure`);
}

export async function reopenCard(
  client: FizzyClient,
  cardNumber: number
): Promise<void> {
  await client.delete(`/cards/${cardNumber}/closure`);
}

export async function moveToNotNow(
  client: FizzyClient,
  cardNumber: number
): Promise<void> {
  await client.post(`/cards/${cardNumber}/not_now`);
}

export async function triageCard(
  client: FizzyClient,
  cardNumber: number,
  columnId: string
): Promise<void> {
  await client.post(`/cards/${cardNumber}/triage`, { column_id: columnId });
}

export async function sendToTriage(
  client: FizzyClient,
  cardNumber: number
): Promise<void> {
  await client.delete(`/cards/${cardNumber}/triage`);
}

export async function toggleAssignment(
  client: FizzyClient,
  cardNumber: number,
  assigneeId: string
): Promise<void> {
  await client.post(`/cards/${cardNumber}/assignments`, {
    assignee_id: assigneeId,
  });
}

export async function toggleTag(
  client: FizzyClient,
  cardNumber: number,
  tagTitle: string
): Promise<void> {
  await client.post(`/cards/${cardNumber}/taggings`, { tag_title: tagTitle });
}
