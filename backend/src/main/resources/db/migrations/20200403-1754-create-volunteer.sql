create table volunteer (
    id        bigserial primary key,
    name      text      not null,
    surname   text      not null,
    phone     text      not null,
    email     text      not null,
    birthDate date      not null,
    address   text      not null,
    city      text      not null,
    zipCode   text      not null,
    iban      text      not null
);