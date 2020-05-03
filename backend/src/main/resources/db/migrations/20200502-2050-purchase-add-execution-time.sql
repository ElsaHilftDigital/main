alter table purchase add column execution_time timestamptz;
update purchase set execution_time = create_time;
