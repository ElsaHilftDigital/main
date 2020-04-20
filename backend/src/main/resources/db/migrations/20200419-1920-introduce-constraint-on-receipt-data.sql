alter table purchase
add check ((receipt is null) = (receipt_mime_type is null));