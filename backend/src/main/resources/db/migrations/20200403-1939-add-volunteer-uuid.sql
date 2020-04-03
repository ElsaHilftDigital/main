alter table volunteer add column uuid uuid not null;
create index on volunteer (uuid);
