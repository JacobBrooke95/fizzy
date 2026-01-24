import { FizzyClient } from "../client.js";

export interface Step {
  id: string;
  content: string;
  completed: boolean;
}

// Tool definitions
export const getStepToolDefinition = {
  name: "fizzy_get_step",
  description: "Get details of a specific step (to-do item) on a card",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number",
      },
      step_id: {
        type: "string",
        description: "The ID of the step",
      },
    },
    required: ["card_number", "step_id"],
  },
};

export const createStepToolDefinition = {
  name: "fizzy_create_step",
  description: "Create a new step (to-do item) on a card",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number",
      },
      content: {
        type: "string",
        description: "The step text",
      },
      completed: {
        type: "boolean",
        description: "Whether the step is completed (default: false)",
      },
    },
    required: ["card_number", "content"],
  },
};

export const updateStepToolDefinition = {
  name: "fizzy_update_step",
  description: "Update an existing step",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number",
      },
      step_id: {
        type: "string",
        description: "The ID of the step to update",
      },
      content: {
        type: "string",
        description: "The new step text",
      },
      completed: {
        type: "boolean",
        description: "Whether the step is completed",
      },
    },
    required: ["card_number", "step_id"],
  },
};

export const deleteStepToolDefinition = {
  name: "fizzy_delete_step",
  description: "Delete a step from a card",
  inputSchema: {
    type: "object" as const,
    properties: {
      card_number: {
        type: "number",
        description: "The card number",
      },
      step_id: {
        type: "string",
        description: "The ID of the step to delete",
      },
    },
    required: ["card_number", "step_id"],
  },
};

// Tool implementations
export async function getStep(
  client: FizzyClient,
  cardNumber: number,
  stepId: string
): Promise<Step> {
  const response = await client.get<Step>(
    `/cards/${cardNumber}/steps/${stepId}`
  );
  return response.data;
}

export interface CreateStepParams {
  content: string;
  completed?: boolean;
}

export async function createStep(
  client: FizzyClient,
  cardNumber: number,
  params: CreateStepParams
): Promise<{ location: string }> {
  const response = await client.post<{ location: string }>(
    `/cards/${cardNumber}/steps`,
    { step: params }
  );
  return response.data!;
}

export interface UpdateStepParams {
  content?: string;
  completed?: boolean;
}

export async function updateStep(
  client: FizzyClient,
  cardNumber: number,
  stepId: string,
  params: UpdateStepParams
): Promise<Step> {
  const response = await client.put<Step>(
    `/cards/${cardNumber}/steps/${stepId}`,
    { step: params }
  );
  return response.data!;
}

export async function deleteStep(
  client: FizzyClient,
  cardNumber: number,
  stepId: string
): Promise<void> {
  await client.delete(`/cards/${cardNumber}/steps/${stepId}`);
}
