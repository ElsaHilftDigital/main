alter table volunteer add column telegram_chat_id int;
alter table volunteer add column telegram_user_id int;

create index volunteer_telegram_chat_id on volunteer (telegram_chat_id);
create index volunteer_telegram_user_id on volunteer (telegram_user_id);