create table organization (
    id            bigserial primary key,
    name          text      not null,
    bot_token     text      not null,
    update_offset int       not null
);