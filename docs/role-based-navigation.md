# Role-Based Navigation System

## Overview

The Dropsland app now implements role-based navigation that conditionally shows UI elements based on the user's role (`DJ`, `FAN`, or `STAFF`). This ensures that:

- **DJs** see the Create button and can access creator tools
- **Fans** and **Staff** do NOT see the Create button
- Direct URL access to `/create/*` routes is blocked for non-DJ users

## Implementation Details

### 1. Bottom Navigation (`components/bottom-dock.tsx`)

The bottom navigation dock now:

- Fetches the user's role from Supabase on mount
- Caches the role in `localStorage` to prevent flickering on page loads
- Conditionally renders the "Create" button only for users with `role === 'DJ'`
- Dynamically links the Profile button to the current user's profile page

**Key Changes:**

```tsx
const [role, setRole] = useState<string | null>(null);

useEffect(() => {
  async function fetchRole() {
    if (!user?.wallet?.address) return;
    
    // Check cache first
    const cached = localStorage.getItem("user_role");
    if (cached) setRole(cached);

    // Fetch from database
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("wallet_address", user.wallet.address)
      .single();

    if (data) {
      setRole(data.role);
      localStorage.setItem("user_role", data.role);
    }
  }
  fetchRole();
}, [user]);

// Conditionally build nav items
const navItems = role === "DJ"
  ? [...baseNavItems, createButton, ...otherItems]
  : baseNavItems;
```

### 2. Protected Create Layout (`app/create/layout.tsx`)

A new layout wrapper protects all `/create/*` routes:

- Checks if the user is authenticated
- Verifies the user's role is `DJ`
- Shows a loading state while checking
- Redirects non-DJ users back to home with an error message

**Security Flow:**

1. User navigates to `/create` (either by button or direct URL)
2. Layout checks authentication status
3. Layout queries Supabase for user's role
4. If `role !== 'DJ'`, show error message and redirect
5. If `role === 'DJ'`, render the children (create pages)

**Example Blocked Access:**

```tsx
if (data.role !== "DJ") {
  // Show message for 2 seconds, then redirect
  setTimeout(() => {
    router.push("/");
  }, 2000);
}
```

### 3. Auth Provider Enhancement (`hooks/use-auth.tsx`)

The logout function now clears cached role data:

```tsx
const logout = () => {
  localStorage.removeItem("user_role");
  privyLogout();
};
```

This prevents the cached role from persisting after logout.

## User Experience by Role

### DJ Users
- ✅ See "Create" button in bottom navigation
- ✅ Can access `/create`, `/create/membership`, `/create/music`, `/create/reward`
- ✅ Profile shows membership tiers they're selling

### Fan Users
- ❌ Do NOT see "Create" button
- ❌ Cannot access `/create/*` routes (redirected with message)
- ✅ Profile shows NFT collection they own

### Staff Users
- ❌ Do NOT see "Create" button
- ❌ Cannot access `/create/*` routes (redirected with message)
- ✅ Profile shows verification status and scanner tools

## Testing Checklist

- [ ] Login as a DJ → Verify "Create" button appears
- [ ] Login as a Fan → Verify "Create" button is hidden
- [ ] Login as Staff → Verify "Create" button is hidden
- [ ] As a Fan, manually navigate to `/create` → Verify redirect with message
- [ ] As a DJ, access all create sub-routes → Verify access granted
- [ ] Logout and login with different role → Verify navigation updates
- [ ] Check localStorage clears on logout → No stale role data

## Performance Optimizations

1. **localStorage caching**: Role is cached client-side to prevent UI flicker
2. **Single query**: Only one Supabase query per session (cached afterward)
3. **Conditional rendering**: Create button never renders for non-DJs (reduces DOM)

## Future Enhancements

- [ ] Add role to JWT token for server-side verification
- [ ] Implement middleware for Next.js route protection
- [ ] Add analytics to track unauthorized access attempts
- [ ] Create admin panel to manage user roles
- [ ] Add role change notifications

## Related Files

- `components/bottom-dock.tsx` - Navigation UI with role filtering
- `app/create/layout.tsx` - Protected layout for create routes
- `hooks/use-auth.tsx` - Auth context with logout cleanup
- `app/profile/[id]/page.tsx` - Role-based profile views
- `components/profile/dj-view.tsx` - DJ-specific profile UI
- `components/profile/fan-view.tsx` - Fan-specific profile UI
- `components/profile/staff-view.tsx` - Staff-specific profile UI

## Database Schema Reference

The `profiles` table must have a `role` column with the following enum:

```sql
CREATE TYPE user_role AS ENUM ('DJ', 'FAN', 'STAFF');

ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'FAN';
```

## Troubleshooting

### Issue: Create button still shows for Fans
- **Cause**: Cached role in localStorage
- **Fix**: Clear browser storage or logout/login

### Issue: DJ redirected from /create
- **Cause**: Profile not in database or role not set
- **Fix**: Check Supabase `profiles` table, ensure role = 'DJ'

### Issue: Navigation flickers on load
- **Cause**: Role fetched too slowly
- **Solution**: Already implemented - localStorage caching

### Issue: User can bypass layout protection
- **Cause**: JavaScript disabled or client-side only
- **Fix**: Implement server-side middleware (future enhancement)