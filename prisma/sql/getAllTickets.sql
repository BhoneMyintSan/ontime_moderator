select r.*,u.full_name as reporter_name from request_report r
join "user" u
on u.id = r.reporter_id;