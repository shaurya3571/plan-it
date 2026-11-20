-- handle_new_user() only runs as the auth.users insert trigger; it must not be
-- directly callable via PostgREST (/rest/v1/rpc/handle_new_user).
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
