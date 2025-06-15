
# Security Guidelines for UTI DOS GAMES

## Overview
This document outlines security best practices and procedures for administrators and developers working with the UTI DOS GAMES platform.

## Admin Account Security

### Initial Setup
1. **Never use default credentials** - All admin accounts must use strong, unique passwords
2. **Change default passwords immediately** after first login
3. **Use secure email addresses** for admin accounts (preferably with 2FA enabled on the email provider)

### Password Requirements
- Minimum 12 characters for admin accounts
- Minimum 6 characters for regular users
- Include uppercase, lowercase, numbers, and special characters for admin accounts
- Use unique passwords not used elsewhere
- Change admin passwords every 90 days

### Account Management
- Limit admin accounts to essential personnel only
- Review admin access quarterly
- Remove unused admin accounts immediately
- Monitor all admin login activities through security audit logs

## Authentication Security

### Login Security Features
- **Rate limiting**: Maximum 5 failed attempts before 5-minute lockout
- **Security logging**: All login attempts are logged with timestamps and user agents
- **Enhanced error messages**: Generic error messages to prevent user enumeration
- **Session monitoring**: Admin sessions are specially monitored and logged
- **Row Level Security (RLS)**: All database tables have RLS enabled with appropriate policies

### Security Monitoring
All security events are logged including:
- Failed login attempts with rate limiting
- Successful admin logins with enhanced logging
- Admin session restorations
- User signups and errors
- Database access patterns through RLS policies

### Best Practices for Users
1. **Use strong passwords** (minimum 6 characters, preferably longer)
2. **Don't share accounts** - Each person should have their own account
3. **Log out when finished** - Especially on shared computers
4. **Report suspicious activity** immediately

## Database Security

### Row Level Security (RLS)
All tables have RLS enabled with optimized policies:

#### Policy Structure
- **Public Read Policies**: Allow reading of active/published content
- **User-Specific Policies**: Users can only access their own data (cart, subscriptions)
- **Admin Full Policies**: Admins have full CRUD access to all data
- **Audit Logging**: Security events are automatically logged

#### Key Security Features
- Users can only access their own cart items and subscriptions
- Admin privileges are required for all content management
- Public content is filtered to show only active items
- All policies use the `public.is_admin()` security definer function

### Data Protection
- User passwords are hashed by Supabase Auth
- Sensitive operations require authentication
- Admin actions are logged for audit trails
- Security audit log tracks all security-related events

## Production Deployment Security

### Before Going Live
1. **Remove all test accounts** including any demo admin accounts
2. **Set up proper admin accounts** with secure credentials using `promote_user_to_admin()`
3. **Enable email confirmation** for user signups
4. **Configure proper redirect URLs** in Supabase settings
5. **Set up monitoring** for security events and audit logs
6. **Review all RLS policies** to ensure they're correctly configured
7. **Test rate limiting** and security features

### Ongoing Security
1. **Regular security audits** of admin accounts and permissions
2. **Monitor security logs** for suspicious activity using audit log table
3. **Keep dependencies updated** regularly
4. **Backup database** regularly with secure storage
5. **Review user accounts** periodically for inactive or suspicious accounts
6. **Monitor RLS policy performance** and optimize as needed

## Security Functions Available

### Admin Management
- `public.promote_user_to_admin(user_email)`: Promote a user to admin
- `public.has_admin_users()`: Check if any admin users exist
- `public.is_admin()`: Check if current user is admin (used in RLS policies)

### Audit and Monitoring
- `public.log_security_event(event_type, user_id, details)`: Log security events
- Security audit log table for comprehensive monitoring

## Incident Response

### If Security Breach Suspected
1. **Immediately change all admin passwords**
2. **Review security audit logs** for unauthorized access patterns
3. **Check database** for unauthorized changes using audit trails
4. **Disable affected accounts** temporarily if needed
5. **Notify all administrators**
6. **Consider temporary lockdown** if needed
7. **Document the incident** and response actions
8. **Review and update RLS policies** if needed

### Emergency Contacts
- Primary Admin: [Contact Information]
- Technical Lead: [Contact Information]
- Supabase Support: support@supabase.io

## Development Security

### Code Security
1. **Never commit secrets** to version control
2. **Use environment variables** for sensitive configuration
3. **Validate all user inputs** on frontend and backend
4. **Use parameterized queries** to prevent SQL injection
5. **Implement proper error handling** without exposing system details
6. **Follow TypeScript strict mode** for better code safety

### RLS Policy Guidelines
1. **Use security definer functions** to avoid infinite recursion
2. **Test policies thoroughly** in development
3. **Use consistent naming conventions** for policies
4. **Separate read and write policies** for better granularity
5. **Document policy purposes** and update this document

### Testing Security
1. **Use separate test databases** from production
2. **Don't use production data** in development
3. **Test security features** regularly including rate limiting
4. **Test RLS policies** with different user roles
5. **Perform security reviews** before major releases

## Current Security Implementation Status

### ✅ Implemented Features
- Row Level Security on all tables
- Admin role system with security definer functions
- Rate limiting on login attempts (5 attempts, 5-minute lockout)
- Enhanced security logging for admin access
- Generic error messages to prevent user enumeration
- Session persistence and proper auth state management
- Security audit logging system

### 🔧 Configuration Required
- Email confirmation settings in Supabase dashboard
- Production redirect URLs configuration
- Admin account creation using promote_user_to_admin function
- Security monitoring alerts setup

## Compliance and Auditing

### Regular Reviews
- Monthly review of admin accounts and permissions
- Quarterly security audit of the entire system using audit logs
- Annual penetration testing (recommended)
- Continuous monitoring of security logs and RLS policy performance

### Documentation
- Keep this document updated with any security changes
- Document all security incidents and responses in audit log
- Maintain audit logs for compliance purposes
- Review and update RLS policies documentation

## Rate Limiting Details

### Current Implementation
- **Login Attempts**: 5 failed attempts trigger 5-minute account lockout
- **Monitoring**: All failed attempts logged with user agent and timestamp
- **Recovery**: Automatic unlock after timeout period
- **Admin Logging**: Enhanced logging for admin account access attempts

### Future Enhancements
Consider implementing additional rate limiting for:
- API endpoints
- Search functionality
- File uploads
- Password reset attempts

---

**Last Updated**: June 2025
**Next Review**: September 2025
**Document Owner**: Technical Lead
**Security Policy Version**: 2.0

For questions about security procedures, contact the technical team.

**Migration Applied**: 20250615233500 - Security Optimization Cleanup
