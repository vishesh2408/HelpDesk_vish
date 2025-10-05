INSERT INTO users (id,email,name,password_hash,role)
VALUES
('11111111-1111-1111-1111-111111111111','user@example.com','Normal User','$2b$10$KIX0h8Y9BbYc5l6iG5k1.u3nF0lQYj7GQmG9Qq3b1wF7QG9d2f9a6','user'),
('22222222-2222-2222-2222-222222222222','agent@example.com','Support Agent','$2b$10$KIX0h8Y9BbYc5l6iG5k1.u3nF0lQYj7GQmG9Qq3b1wF7QG9d2f9a6','agent'),
('33333333-3333-3333-3333-333333333333','admin@example.com','Admin User','$2b$10$KIX0h8Y9BbYc5l6iG5k1.u3nF0lQYj7GQmG9Qq3b1wF7QG9d2f9a6','admin');

INSERT INTO tickets (id, title, description, requester_id, assignee_id, status, priority, sla_seconds, created_at, due_at, version)
VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','VPN disconnects','VPN drops every 10 minutes','11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','open','high',3600, now(), now() + interval '3600 seconds', 1);

INSERT INTO comments (id, ticket_id, author_id, body)
VALUES ('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1','aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','22222222-2222-2222-2222-222222222222','We are investigating.');

INSERT INTO timeline (ticket_id, actor_id, action, metadata)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','11111111-1111-1111-1111-111111111111','created', jsonb_build_object('title','VPN disconnects'));
