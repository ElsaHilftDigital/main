create table moderator (
    id       bigserial primary key,
    uuid     uuid      not null unique,
    name     text      not null,
    email    text      not null,
    login    text      not null unique,
    password text      not null
);
