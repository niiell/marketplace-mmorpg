# Supabase Row Level Security (RLS) Guidemap

This document outlines the Row Level Security policies implemented in the Marketplace MMORPG project to ensure data access control and user privacy.

## Enabled RLS Tables

- profiles
- listings
- transactions
- transaction_logs
- disputes
- chats
- messages
- reviews
- notifications

## Key RLS Policies

### User Roles Management

- Only users with 'admin' role can manage user_roles table.

### Profiles

- Users can view and edit only their own profile.

### Listings

- Sellers can manage their own listings.
- Anyone can view listings with status 'aktif'.

### Transactions

- Buyers or sellers can access their own transactions.

### Transaction Logs

- Related users (buyer or seller) can view transaction logs.

### Chats and Messages

- Chat participants (buyer or seller) can access chats and messages.

### Reviews

- Reviewers can insert reviews.
- Reviewers or reviewees can view reviews.

### Notifications

- Users can access their own notifications.

## Recommendations

- Regularly audit RLS policies to ensure they align with business rules.
- Combine RLS with backend authorization checks for defense in depth.
- Document any changes to RLS policies here for team awareness.

This guidemap helps maintain secure and compliant data access control in the application.
