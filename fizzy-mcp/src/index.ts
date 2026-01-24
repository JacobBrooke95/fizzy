#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { createClientFromEnv, FizzyClient } from "./client.js";

// Import tool definitions
import { identityToolDefinition, getIdentity } from "./tools/identity.js";
import {
  listBoardsToolDefinition,
  getBoardToolDefinition,
  createBoardToolDefinition,
  updateBoardToolDefinition,
  deleteBoardToolDefinition,
  listBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} from "./tools/boards.js";
import {
  listCardsToolDefinition,
  getCardToolDefinition,
  createCardToolDefinition,
  updateCardToolDefinition,
  deleteCardToolDefinition,
  closeCardToolDefinition,
  reopenCardToolDefinition,
  moveToNotNowToolDefinition,
  triageCardToolDefinition,
  sendToTriageToolDefinition,
  toggleAssignmentToolDefinition,
  toggleTagToolDefinition,
  listCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
  closeCard,
  reopenCard,
  moveToNotNow,
  triageCard,
  sendToTriage,
  toggleAssignment,
  toggleTag,
} from "./tools/cards.js";
import {
  listColumnsToolDefinition,
  getColumnToolDefinition,
  createColumnToolDefinition,
  updateColumnToolDefinition,
  deleteColumnToolDefinition,
  listColumns,
  getColumn,
  createColumn,
  updateColumn,
  deleteColumn,
} from "./tools/columns.js";
import {
  listCommentsToolDefinition,
  getCommentToolDefinition,
  createCommentToolDefinition,
  updateCommentToolDefinition,
  deleteCommentToolDefinition,
  listComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
} from "./tools/comments.js";
import {
  getStepToolDefinition,
  createStepToolDefinition,
  updateStepToolDefinition,
  deleteStepToolDefinition,
  getStep,
  createStep,
  updateStep,
  deleteStep,
} from "./tools/steps.js";
import { listTagsToolDefinition, listTags } from "./tools/tags.js";
import {
  listUsersToolDefinition,
  getUserToolDefinition,
  listUsers,
  getUser,
} from "./tools/users.js";
import {
  listNotificationsToolDefinition,
  markNotificationReadToolDefinition,
  markNotificationUnreadToolDefinition,
  markAllNotificationsReadToolDefinition,
  listNotifications,
  markNotificationRead,
  markNotificationUnread,
  markAllNotificationsRead,
} from "./tools/notifications.js";

// All tool definitions
const TOOLS = [
  // Identity
  identityToolDefinition,
  // Boards
  listBoardsToolDefinition,
  getBoardToolDefinition,
  createBoardToolDefinition,
  updateBoardToolDefinition,
  deleteBoardToolDefinition,
  // Cards
  listCardsToolDefinition,
  getCardToolDefinition,
  createCardToolDefinition,
  updateCardToolDefinition,
  deleteCardToolDefinition,
  closeCardToolDefinition,
  reopenCardToolDefinition,
  moveToNotNowToolDefinition,
  triageCardToolDefinition,
  sendToTriageToolDefinition,
  toggleAssignmentToolDefinition,
  toggleTagToolDefinition,
  // Columns
  listColumnsToolDefinition,
  getColumnToolDefinition,
  createColumnToolDefinition,
  updateColumnToolDefinition,
  deleteColumnToolDefinition,
  // Comments
  listCommentsToolDefinition,
  getCommentToolDefinition,
  createCommentToolDefinition,
  updateCommentToolDefinition,
  deleteCommentToolDefinition,
  // Steps
  getStepToolDefinition,
  createStepToolDefinition,
  updateStepToolDefinition,
  deleteStepToolDefinition,
  // Tags
  listTagsToolDefinition,
  // Users
  listUsersToolDefinition,
  getUserToolDefinition,
  // Notifications
  listNotificationsToolDefinition,
  markNotificationReadToolDefinition,
  markNotificationUnreadToolDefinition,
  markAllNotificationsReadToolDefinition,
];

// Tool handler
async function handleToolCall(
  client: FizzyClient,
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    // Identity
    case "fizzy_get_identity":
      return getIdentity(client);

    // Boards
    case "fizzy_list_boards":
      return listBoards(client);
    case "fizzy_get_board":
      return getBoard(client, args.board_id as string);
    case "fizzy_create_board":
      return createBoard(client, {
        name: args.name as string,
        all_access: args.all_access as boolean | undefined,
        auto_postpone_period: args.auto_postpone_period as number | undefined,
        public_description: args.public_description as string | undefined,
      });
    case "fizzy_update_board":
      return updateBoard(client, args.board_id as string, {
        name: args.name as string | undefined,
        all_access: args.all_access as boolean | undefined,
        auto_postpone_period: args.auto_postpone_period as number | undefined,
        public_description: args.public_description as string | undefined,
        user_ids: args.user_ids as string[] | undefined,
      });
    case "fizzy_delete_board":
      return deleteBoard(client, args.board_id as string);

    // Cards
    case "fizzy_list_cards":
      return listCards(client, {
        board_ids: args.board_ids as string[] | undefined,
        tag_ids: args.tag_ids as string[] | undefined,
        assignee_ids: args.assignee_ids as string[] | undefined,
        creator_ids: args.creator_ids as string[] | undefined,
        indexed_by: args.indexed_by as string | undefined,
        sorted_by: args.sorted_by as string | undefined,
        terms: args.terms as string[] | undefined,
      });
    case "fizzy_get_card":
      return getCard(client, args.card_number as number);
    case "fizzy_create_card":
      return createCard(client, args.board_id as string, {
        title: args.title as string,
        description: args.description as string | undefined,
        status: args.status as "published" | "drafted" | undefined,
        tag_ids: args.tag_ids as string[] | undefined,
      });
    case "fizzy_update_card":
      return updateCard(client, args.card_number as number, {
        title: args.title as string | undefined,
        description: args.description as string | undefined,
        status: args.status as "drafted" | "published" | undefined,
        tag_ids: args.tag_ids as string[] | undefined,
      });
    case "fizzy_delete_card":
      return deleteCard(client, args.card_number as number);
    case "fizzy_close_card":
      return closeCard(client, args.card_number as number);
    case "fizzy_reopen_card":
      return reopenCard(client, args.card_number as number);
    case "fizzy_move_to_not_now":
      return moveToNotNow(client, args.card_number as number);
    case "fizzy_triage_card":
      return triageCard(
        client,
        args.card_number as number,
        args.column_id as string
      );
    case "fizzy_send_to_triage":
      return sendToTriage(client, args.card_number as number);
    case "fizzy_toggle_assignment":
      return toggleAssignment(
        client,
        args.card_number as number,
        args.assignee_id as string
      );
    case "fizzy_toggle_tag":
      return toggleTag(
        client,
        args.card_number as number,
        args.tag_title as string
      );

    // Columns
    case "fizzy_list_columns":
      return listColumns(client, args.board_id as string);
    case "fizzy_get_column":
      return getColumn(
        client,
        args.board_id as string,
        args.column_id as string
      );
    case "fizzy_create_column":
      return createColumn(client, args.board_id as string, {
        name: args.name as string,
        color: args.color as string | undefined,
      });
    case "fizzy_update_column":
      return updateColumn(
        client,
        args.board_id as string,
        args.column_id as string,
        {
          name: args.name as string | undefined,
          color: args.color as string | undefined,
        }
      );
    case "fizzy_delete_column":
      return deleteColumn(
        client,
        args.board_id as string,
        args.column_id as string
      );

    // Comments
    case "fizzy_list_comments":
      return listComments(client, args.card_number as number);
    case "fizzy_get_comment":
      return getComment(
        client,
        args.card_number as number,
        args.comment_id as string
      );
    case "fizzy_create_comment":
      return createComment(
        client,
        args.card_number as number,
        args.body as string
      );
    case "fizzy_update_comment":
      return updateComment(
        client,
        args.card_number as number,
        args.comment_id as string,
        args.body as string
      );
    case "fizzy_delete_comment":
      return deleteComment(
        client,
        args.card_number as number,
        args.comment_id as string
      );

    // Steps
    case "fizzy_get_step":
      return getStep(
        client,
        args.card_number as number,
        args.step_id as string
      );
    case "fizzy_create_step":
      return createStep(client, args.card_number as number, {
        content: args.content as string,
        completed: args.completed as boolean | undefined,
      });
    case "fizzy_update_step":
      return updateStep(
        client,
        args.card_number as number,
        args.step_id as string,
        {
          content: args.content as string | undefined,
          completed: args.completed as boolean | undefined,
        }
      );
    case "fizzy_delete_step":
      return deleteStep(
        client,
        args.card_number as number,
        args.step_id as string
      );

    // Tags
    case "fizzy_list_tags":
      return listTags(client);

    // Users
    case "fizzy_list_users":
      return listUsers(client);
    case "fizzy_get_user":
      return getUser(client, args.user_id as string);

    // Notifications
    case "fizzy_list_notifications":
      return listNotifications(client);
    case "fizzy_mark_notification_read":
      return markNotificationRead(client, args.notification_id as string);
    case "fizzy_mark_notification_unread":
      return markNotificationUnread(client, args.notification_id as string);
    case "fizzy_mark_all_notifications_read":
      return markAllNotificationsRead(client);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function main() {
  // Create client from environment variables
  const client = createClientFromEnv();

  // Create MCP server
  const server = new Server(
    {
      name: "fizzy-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tools list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  // Register tool call handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const result = await handleToolCall(
        client,
        name,
        (args as Record<string, unknown>) ?? {}
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Error: ${message}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Connect via stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Fizzy MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
