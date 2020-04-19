alter table purchase
rename column comments to private_comments;

alter table purchase
add column public_comments text not null default '';

alter table purchase
alter column public_comments drop default;