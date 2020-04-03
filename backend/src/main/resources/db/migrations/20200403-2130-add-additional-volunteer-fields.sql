alter table volunteer
add column bank_name          text    not null,
add column validated          boolean not null default false,
add column wants_compensation boolean not null;