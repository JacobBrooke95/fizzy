import { FizzyClient } from "../client.js";
import { User } from "./identity.js";

// Tool definitions
export const listUsersToolDefinition = {
  name: "fizzy_list_users",
  description: "List all active users in the account",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
};

export const getUserToolDefinition = {
  name: "fizzy_get_user",
  description: "Get details of a specific user",
  inputSchema: {
    type: "object" as const,
    properties: {
      user_id: {
        type: "string",
        description: "The ID of the user",
      },
    },
    required: ["user_id"],
  },
};

// Tool implementations
export async function listUsers(client: FizzyClient): Promise<User[]> {
  const response = await client.get<User[]>("/users");
  return response.data;
}

export async function getUser(
  client: FizzyClient,
  userId: string
): Promise<User> {
  const response = await client.get<User>(`/users/${userId}`);
  return response.data;
}
