ALTER TABLE
    phone_verifications
ADD
    CONSTRAINT phone_verifications_user_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE
SET
    NULL