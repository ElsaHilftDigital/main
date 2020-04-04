create table purchase (
    id                     bigserial primary key,
    uuid                   uuid not null,
    status                 text not null,
    timing                 text,
    supermarket            text,
    purchase_size          text,
    payment_method         text not null,
    comments               text,
    receipt                bytea,
    cost                   money,
    expenses_paid          boolean not null,
    receipt_file_id        text,
    broadcast_message_id   int
);

create index on purchase (uuid);
