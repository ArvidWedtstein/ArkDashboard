SELECT
  users.id,
  users.email,
  users.created_at,
  users.updated_at,
  users.invited_at,
  users.banned_until,
  users.email_change_confirm_status,
  users.phone,
  users.last_sign_in_at,
  users.recovery_sent_at,
  p.full_name AS fullname,
  p.username,
  p.biography,
  p.status,
  p.website,
  p.avatar_url,
  r.id AS role_id,
  r.name
FROM
  (
    (
      auth.users
      JOIN "Profile" p ON ((users.id = p.id))
    )
    JOIN "Role" r ON ((p.role_id = r.id))
  );