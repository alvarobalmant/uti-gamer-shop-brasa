-- Corrigir todas as funções restantes sem search_path adequado
CREATE OR REPLACE FUNCTION public.has_admin_users()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE role = 'admin'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.has_active_subscription(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_subscriptions 
    WHERE user_subscriptions.user_id = has_active_subscription.user_id
      AND status = 'active' 
      AND end_date > now()
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.get_active_subscription(user_id UUID)
RETURNS TABLE(subscription_id UUID, plan_name TEXT, discount_percentage INTEGER, end_date TIMESTAMP WITH TIME ZONE) AS $$
  SELECT 
    us.id,
    sp.name,
    sp.discount_percentage,
    us.end_date
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = get_active_subscription.user_id
    AND us.status = 'active' 
    AND us.end_date > now()
  ORDER BY us.end_date DESC
  LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.is_email_confirmed()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email_confirmed_at IS NOT NULL 
    FROM auth.users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE PLPGSQL SECURITY DEFINER SET search_path = 'public';