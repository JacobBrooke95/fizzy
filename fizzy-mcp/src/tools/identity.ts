import { FizzyClient } from "../client.js";

export interface User {
  id: string;
  name: string;
  role: string;
  active: boolean;
  email_address: string;
  created_at: string;
  url: string;
}

export interface Account {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  user: User;
}

export interface IdentityResponse {
  accounts: Account[];
}

export const identityToolDefinition = {
  name: "fizzy_get_identity",
  description:
    "Get the current user's identity and list of accounts they have access to",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
};

export async function getIdentity(client: FizzyClient): Promise<IdentityResponse> {
  const response = await client.get<IdentityResponse>("/my/identity");
  return response.data;
}
