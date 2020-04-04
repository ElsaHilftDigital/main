create table order_item (
    id                bigserial primary key,
    purchase_id       bigint not null references purchase(id),
    purchase_item     text
);
