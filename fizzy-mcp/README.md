# Fizzy MCP Server

An MCP (Model Context Protocol) server that provides AI agents access to your Fizzy kanban boards.

## Setup

### 1. Install dependencies

```bash
cd fizzy-mcp
npm install
```

### 2. Build the server

```bash
npm run build
```

### 3. Create an access token

1. Start the Fizzy development server: `bin/dev`
2. Open http://fizzy.localhost:3006
3. Log in and go to your profile
4. In the API section, click "Personal access tokens"
5. Click "Generate new access token"
6. Give it a description and select "Read + Write" permission
7. Copy the generated token

### 4. Configure Claude Desktop

Add the following to your Claude Desktop config file at `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "fizzy": {
      "command": "node",
      "args": ["/Users/jacobbrooke/Projects/fizzy/fizzy-mcp/dist/index.js"],
      "env": {
        "FIZZY_BASE_URL": "http://fizzy.localhost:3006",
        "FIZZY_ACCOUNT_ID": "338000007",
        "FIZZY_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

Replace:
- `FIZZY_ACCESS_TOKEN` with your generated access token
- `FIZZY_ACCOUNT_ID` with your account's external ID (found in the URL when logged in)

### 5. Restart Claude Desktop

After updating the config, restart Claude Desktop to load the MCP server.

## Available Tools

### Identity
- `fizzy_get_identity` - Get current user's identity and accounts

### Boards
- `fizzy_list_boards` - List all boards
- `fizzy_get_board` - Get a specific board
- `fizzy_create_board` - Create a new board
- `fizzy_update_board` - Update a board
- `fizzy_delete_board` - Delete a board

### Cards
- `fizzy_list_cards` - List cards with filtering
- `fizzy_get_card` - Get a specific card
- `fizzy_create_card` - Create a new card
- `fizzy_update_card` - Update a card
- `fizzy_delete_card` - Delete a card
- `fizzy_close_card` - Close (complete) a card
- `fizzy_reopen_card` - Reopen a closed card
- `fizzy_move_to_not_now` - Postpone a card
- `fizzy_triage_card` - Move card from triage to a column
- `fizzy_send_to_triage` - Send card back to triage
- `fizzy_toggle_assignment` - Assign/unassign a user
- `fizzy_toggle_tag` - Add/remove a tag

### Columns
- `fizzy_list_columns` - List columns on a board
- `fizzy_get_column` - Get a specific column
- `fizzy_create_column` - Create a new column
- `fizzy_update_column` - Update a column
- `fizzy_delete_column` - Delete a column

### Comments
- `fizzy_list_comments` - List comments on a card
- `fizzy_get_comment` - Get a specific comment
- `fizzy_create_comment` - Add a comment to a card
- `fizzy_update_comment` - Update a comment
- `fizzy_delete_comment` - Delete a comment

### Steps (To-dos)
- `fizzy_get_step` - Get a specific step
- `fizzy_create_step` - Add a step to a card
- `fizzy_update_step` - Update a step (e.g., mark complete)
- `fizzy_delete_step` - Delete a step

### Tags
- `fizzy_list_tags` - List all tags in the account

### Users
- `fizzy_list_users` - List all users
- `fizzy_get_user` - Get a specific user

### Notifications
- `fizzy_list_notifications` - List notifications
- `fizzy_mark_notification_read` - Mark notification as read
- `fizzy_mark_notification_unread` - Mark notification as unread
- `fizzy_mark_all_notifications_read` - Mark all as read

## Development

```bash
# Watch mode for development
npm run dev

# Build for production
npm run build

# Run the server directly
npm start
```

## Testing

With the Fizzy dev server running (`bin/dev`), you can test the MCP server via Claude Desktop:

1. Ask Claude to list your boards
2. Create a new card
3. Verify the card appears in the Fizzy UI
4. Close the card via MCP
5. Verify closure in the UI
