alter table purchase
    drop column number_receipts;

alter table purchase_supermarket
    add column receipt_uploaded boolean not null default false;

alter table purchase_supermarket
    alter column receipt_uploaded drop default;
