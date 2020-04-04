alter table volunteer alter column telegram_chat_id set data type bigint;
alter table volunteer alter column telegram_user_id set data type bigint;
alter table organization alter column update_offset set data type bigint;