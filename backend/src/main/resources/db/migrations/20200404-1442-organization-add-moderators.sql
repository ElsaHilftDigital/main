insert into organization (name, update_offset)
values
    ('Elsa hilft', -1);

alter table moderator add column organization_id bigint not null default 1 references organization(id);
