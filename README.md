# main

## Installation

### Telegram

You need a [telegram bot](https://core.telegram.org/bots#6-botfather). Export
the token into the `TELEGRAM_TOKEN` environment variable of the backend java
process.

You need two group chats: One for volunteers, one for moderators.

Find the Telegram chat IDs of both chats and insert them into the DB table
`organization.telegram_group_chat_id` for the volunteer's group chat and
`organization.telegram_moderator_group_chat_id` for the moderator group chat.
Generate a Join Link for the volunteer chat and put it into
`organization.url_group_chat`.
