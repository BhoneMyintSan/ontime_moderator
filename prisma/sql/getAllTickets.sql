select r.*,u.full_name as reporter_name from request_reports r
join users u
on u.id = r.reporter_id;