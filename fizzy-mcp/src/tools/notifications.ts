import { FizzyClient } from "../client.js";
import { User } from "./identity.js";

export interface NotificationCard {
  id: string;
  title: string;
  status: string;
  url: string;
}

export interface Notification {
  id: string;
  read: boolean;
  read_at: string | null;
  created_at: string;
  title: string;
  body: string;
  creator: User;
  card: NotificationCard;
  url: string;
}

// Tool definitions
export const listNotificationsToolDefinition = {
  name: "fizzy_list_notifications",
  description:
    "List notifications for the current user. Unread notifications are returned first.",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
};

export const markNotificationReadToolDefinition = {
  name: "fizzy_mark_notification_read",
  description: "Mark a notification as read",
  inputSchema: {
    type: "object" as const,
    properties: {
      notification_id: {
        type: "string",
        description: "The ID of the notification",
      },
    },
    required: ["notification_id"],
  },
};

export const markNotificationUnreadToolDefinition = {
  name: "fizzy_mark_notification_unread",
  description: "Mark a notification as unread",
  inputSchema: {
    type: "object" as const,
    properties: {
      notification_id: {
        type: "string",
        description: "The ID of the notification",
      },
    },
    required: ["notification_id"],
  },
};

export const markAllNotificationsReadToolDefinition = {
  name: "fizzy_mark_all_notifications_read",
  description: "Mark all unread notifications as read",
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
};

// Tool implementations
export async function listNotifications(
  client: FizzyClient
): Promise<Notification[]> {
  const response = await client.get<Notification[]>("/notifications");
  return response.data;
}

export async function markNotificationRead(
  client: FizzyClient,
  notificationId: string
): Promise<void> {
  await client.post(`/notifications/${notificationId}/reading`);
}

export async function markNotificationUnread(
  client: FizzyClient,
  notificationId: string
): Promise<void> {
  await client.delete(`/notifications/${notificationId}/reading`);
}

export async function markAllNotificationsRead(
  client: FizzyClient
): Promise<void> {
  await client.post("/notifications/bulk_reading");
}
