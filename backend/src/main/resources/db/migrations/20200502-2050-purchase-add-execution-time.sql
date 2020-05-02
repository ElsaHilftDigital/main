alter table purchase add column execution_time timestamptz not null;
update purchase set execution_time = create_time;
