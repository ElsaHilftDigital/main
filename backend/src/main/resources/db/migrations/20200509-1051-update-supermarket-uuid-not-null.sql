update purchase_supermarket
set uuid = uuid_generate_v4 ()
where uuid = null;

alter table purchase_supermarket alter column uuid set not null;
