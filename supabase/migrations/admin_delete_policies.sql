-- Allow admins to delete reviewer applications and developer submissions
-- Run in Supabase SQL editor

create policy "Admins can delete reviewer_applications"
  on public.reviewer_applications
  for delete
  using (public.is_admin());

create policy "Admins can delete developer_submissions"
  on public.developer_submissions
  for delete
  using (public.is_admin());
