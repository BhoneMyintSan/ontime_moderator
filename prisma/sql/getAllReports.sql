select r.id,r.listing_id,r.reporter_id,r.status,r.datetime,r.report_reason, u1.full_name as reporter_name,u2.full_name as offender_name from report r
join "user" u1
on u1.id = r.reporter_id
join service_listing l
on l.id = r.listing_id
join "user" u2
on u2.id = l.posted_by;

