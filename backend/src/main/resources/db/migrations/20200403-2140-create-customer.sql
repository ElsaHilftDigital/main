create table customer (
    id            bigserial primary key,
    uuid          uuid not null,
    first_name    text not null,
    last_name     text not null,
    phone         text not null,
    mobile        text,
    address       text not null,
    city          text not null,
    zip_code      text not null
);

create index on customer (uuid);
