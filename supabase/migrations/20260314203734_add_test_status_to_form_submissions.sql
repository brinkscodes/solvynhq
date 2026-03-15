-- Drop the old check constraint and add one that includes 'test'
alter table form_submissions drop constraint if exists form_submissions_status_check;
alter table form_submissions add constraint form_submissions_status_check check (status in ('new', 'read', 'archived', 'test'));
