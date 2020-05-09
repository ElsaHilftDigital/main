alter table purchase
    add column purchase_number int;

update purchase
set purchase_number = purchase_number_table.number
from (
         select row_number() over (partition by date_trunc('day', execution_time at time zone 'Europe/Zurich') order by execution_time) as number, id
         from purchase
     ) as purchase_number_table
where purchase.id = purchase_number_table.id;

alter table purchase
    alter column purchase_number set not null;

create unique index purchase_number_unique on purchase (purchase_number, date_trunc('day', execution_time at time zone 'Europe/Zurich'));
