create table purchase_supermarket (
    id   bigserial primary key,
    name text,
    tmp_purchase_id bigint references purchase(id)
);

insert into purchase_supermarket (name, tmp_purchase_id)
select supermarket, id from purchase;

alter table order_item add column purchase_supermarket_id bigint;

update order_item set purchase_supermarket_id = ps.id
from purchase_supermarket ps where ps.tmp_purchase_id = purchase_id;

alter table order_item add constraint order_item_puchase_supermarked_id_fkey
foreign key (purchase_supermarket_id) references purchase_supermarket(id);

alter table order_item drop constraint order_item_purchase_id_fkey;

alter table order_item drop column purchase_id;

alter table purchase drop column supermarket;

alter table purchase_supermarket rename column tmp_purchase_id to purchase_id;