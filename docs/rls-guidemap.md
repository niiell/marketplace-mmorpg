# Supabase Row Level Security (RLS) Guidemap

## Overview

This document outlines the Row Level Security policies implemented in the Marketplace MMORPG project to ensure data access control and user privacy.

## Enabled RLS Tables

### Core Tables

- profiles
- listings
- transactions
- transaction_logs
- disputes
- chats
- messages
- reviews
- notifications

### Auxiliary Tables

- user_roles

## Key RLS Policies

### User Roles Management

- Only users with 'admin' role can manage user_roles table.
- Users can view their own role.

### Profiles

- Users can view and edit only their own profile.
- Admins can view and edit all profiles.

### Listings

- Sellers can manage their own listings.
- Anyone can view listings with status 'aktif'.
- Admins can manage all listings.

### Transactions

- Buyers or sellers can access their own transactions.
- Admins can access all transactions.

### Transaction Logs

- Related users (buyer or seller) can view transaction logs.
- Admins can view all transaction logs.

### Chats and Messages

- Chat participants (buyer or seller) can access chats and messages.
- Admins can access all chats and messages.

### Reviews

- Reviewers can insert reviews.
- Reviewers or reviewees can view reviews.
- Admins can view and edit all reviews.

### Notifications

- Users can access their own notifications.
- Admins can access all notifications.

## Recommendations

- Regularly audit RLS policies to ensure they align with business rules.
- Combine RLS with backend authorization checks for defense in depth.
- Document any changes to RLS policies here for team awareness.
- Use Supabase's built-in RLS features to simplify policy management.
- Monitor and analyze access patterns to identify potential security risks.

## Best Practices

- Keep RLS policies up-to-date with changing business requirements.
- Use clear and concise naming conventions for RLS policies.
- Test RLS policies thoroughly to ensure correct functionality.
- Use Supabase's RLS debugging tools to troubleshoot issues.