alter table purchase
add foreign key (assigned_volunteer) references volunteer (id);

alter table purchase
add foreign key (customer) references customer (id);

alter table purchase
add foreign key (created_by_moderator) references moderator (id);