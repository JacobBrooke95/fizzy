import { FizzyClient } from "../client.js";
import { User } from "./identity.js";

export interface CommentBody {
  plain_text: string;
  html: string;
}

export interface Comment {
  id: string;
  created_at: string;
  updated_at: string;
  body: CommentBody;
  creator: User;
  reactions_url: string;
  url: string;
}

// Tool definitions
export const listCommentsToolDefinition = {
  name: "fizzy_list_comments",
  description:
    "List all comments on a card, sorted chronologically (oldest first)",
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

export const getCommentToolDefinition = {
  name: "fizzy_get_comment",
  description: "Get details of a specific comment",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number",
      },
      comment_id: {
        type: "string",
        description: "The ID of the comment",
      },
    },
    required: ["card_number", "comment_id"],
  },
};

export const createCommentToolDefinition = {
  name: "fizzy_create_comment",
  description: "Create a new comment on a card",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number",
      },
      body: {
        type: "string",
        description: "The comment body (supports rich text HTML)",
      },
    },
    required: ["card_number", "body"],
  },
};

export const updateCommentToolDefinition = {
  name: "fizzy_update_comment",
  description: "Update an existing comment (only the creator can update)",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number",
      },
      comment_id: {
        type: "string",
        description: "The ID of the comment to update",
      },
      body: {
        type: "string",
        description: "The new comment body",
      },
    },
    required: ["card_number", "comment_id", "body"],
  },
};

export const deleteCommentToolDefinition = {
  name: "fizzy_delete_comment",
  description: "Delete a comment (only the creator can delete)",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number",
      },
      comment_id: {
        type: "string",
        description: "The ID of the comment to delete",
      },
    },
    required: ["card_number", "comment_id"],
  },
};

// Tool implementations
export async function listComments(
  client: FizzyClient,
  cardNumber: number
): Promise<Comment[]> {
  const response = await client.get<Comment[]>(`/cards/${cardNumber}/comments`);
  return response.data;
}

export async function getComment(
  client: FizzyClient,
  cardNumber: number,
  commentId: string
): Promise<Comment> {
  const response = await client.get<Comment>(
    `/cards/${cardNumber}/comments/${commentId}`
  );
  return response.data;
}

export async function createComment(
  client: FizzyClient,
  cardNumber: number,
  body: string
): Promise<{ location: string }> {
  const response = await client.post<{ location: string }>(
    `/cards/${cardNumber}/comments`,
    { comment: { body } }
  );
  return response.data!;
}

export async function updateComment(
  client: FizzyClient,
  cardNumber: number,
  commentId: string,
  body: string
): Promise<Comment> {
  const response = await client.put<Comment>(
    `/cards/${cardNumber}/comments/${commentId}`,
    { comment: { body } }
  );
  return response.data!;
}

export async function deleteComment(
  client: FizzyClient,
  cardNumber: number,
  commentId: string
): Promise<void> {
  await client.delete(`/cards/${cardNumber}/comments/${commentId}`);
}
