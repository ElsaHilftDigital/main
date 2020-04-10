-- changeset includeAll:raw context:dev
update organization set telegram_group_chat_id = 0 where telegram_group_chat_id is null;
update organization set url_group_chat = '' where url_group_chat is null;
update organization set telegram_moderator_group_chat_id = 0 where telegram_moderator_group_chat_id is null;