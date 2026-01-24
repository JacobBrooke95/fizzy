import { FizzyClient } from "../client.js";

export interface Tag {
  id: string;
  title: string;
  created_at: string;
  url: string;
}

// Tool definition
export const listTagsToolDefinition = {
  name: "fizzy_list_tags",
  description: "List all tags in the account, sorted alphabetically",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
};

// Tool implementation
export async function listTags(client: FizzyClient): Promise<Tag[]> {
  const response = await client.get<Tag[]>("/tags");
  return response.data;
}
