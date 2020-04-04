create table purchase_applications (
    purchase_id bigint not null references purchase (id),
    volunteer_id bigint not null references volunteer (id),
    primary key (purchase_id, volunteer_id)
);