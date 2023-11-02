SELECT u.* 
    FROM public.users u
    JOIN public.surveys s ON u.profile_id = s.profile_id;