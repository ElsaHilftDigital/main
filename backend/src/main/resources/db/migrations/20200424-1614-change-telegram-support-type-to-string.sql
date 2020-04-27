update organization set telegram_support_chat = null where id = 1;
alter table organization alter column telegram_support_chat type text;
