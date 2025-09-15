select r.id,r.ticket_id,u.full_name as reporter_name,sr.listing_id,sl.title,provider.id as provider_id,provider.full_name as provider_name from request_reports r
JOIN users u
ON u.id = r.reporter_id
JOIN service_requests sr
ON sr.id = r.request_id
JOIN service_listings sl
ON sl.id = sr.listing_id
JOIN users provider
ON provider.id = sl.posted_by
WHERE r.id = $1;