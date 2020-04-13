alter table purchase
add column responsible_moderator_id bigint references moderator(id);

update purchase set responsible_moderator_id = (select max(id) from moderator);

alter table purchase
alter column responsible_moderator_id set not null;