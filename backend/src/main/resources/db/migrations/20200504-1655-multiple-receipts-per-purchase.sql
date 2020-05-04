alter table purchase_supermarket add column receipt bytea;
alter table purchase_supermarket add column receipt_file_id text;
alter table purchase_supermarket add column receipt_file_extension text;
alter table purchase_supermarket add column receipt_mime_type text;

update purchase_supermarket s
set receipt = p.receipt,
    receipt_file_id = p.receipt_file_id,
    receipt_file_extension = p.receipt_file_extension,
    receipt_mime_type = p.receipt_mime_type
from purchase p
where p.id = s.purchase_id;

alter table purchase drop column receipt;
alter table purchase drop column receipt_file_id;
alter table purchase drop column receipt_file_extension;
alter table purchase drop column receipt_mime_type;
