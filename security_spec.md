# Security Specification for scapespace.interiors

## Data Invariants
1. A **User Profile** must have a valid role ('admin' or 'customer'). Only admins can change roles. Users can only edit their own display name.
2. A **Project** can only be created, updated, or deleted by an Admin. Public users can only read 'public' projects.
3. A **Consultation Request** can be created by any visitor. Only admins can read, update, or delete consultation requests.

## The "Dirty Dozen" Payloads (Targeted Rejections)
1. **Identity Theft:** Attempting to create a user profile with a different UID than the authenticated user.
2. **Privilege Escalation:** Attempting to set `role: 'admin'` during registration.
3. **Admin Fakeout:** Attempting to update another user's role.
4. **Project Injection:** A non-admin attempting to create a project.
5. **Draft Leak:** A non-admin attempting to read a project with `status: 'draft'`.
6. **Inquiry Sniffing:** A non-admin attempting to list all consultation requests.
7. **ID Poisoning:** Attempting to create a project with a 2KB long ID string.
8. **Shadow Field:** Adding `isVerified: true` to a project payload on creation.
9. **Timestamp Spoofing:** Providing a client-side `createdAt` timestamp that doesn't match `request.time`.
10. **Consultation Spam:** Sending a consultation request larger than 5KB.
11. **Project Deletion:** A customer attempting to delete a project.
12. **Role Hijack:** An admin attempting to delete their own account (protection logic if needed) or a user deleting their profile to wipe logs.

## Test Runner (Logic Overview)
The `firestore.rules` will be tested against these payloads using the rules simulator or automated tests.
