create table db_event
(
    id    bigserial primary key,
    topic text not null,
    data  text not null
)