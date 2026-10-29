# Security Specification — Cruciverbalist (20×20 & 8×8 Daily Crosswords)

## 1. Data Invariants
1. **Global Default-Deny Catch-All**: All paths default to `allow read, write: if false;` unless explicitly matched.
2. **PII Isolation (`UserPublicProfile`)**: `/users/{userId}` never stores PII (`email`, `phone`, `address`). Only non-PII fields (`uid`, `displayName`, `photoURL`, `puzzlesSolved`, `totalScore`, `createdAt`, `updatedAt`) are allowed.
3. **Verified Identity Integrity**: Every write operation (`create`, `update`, `delete`) requires `isSignedIn() && isVerifiedUser()` (`request.auth.token.email_verified == true`), and the `uid` field in incoming data must strictly equal `request.auth.uid`.
4. **Master Gate (`PlayerPuzzleProgress`)**: A sub-document at `/users/{userId}/puzzle_progress/{puzzleId}` can only be read or written if `request.auth.uid == userId` and the parent user profile `/users/$(userId)` exists (`exists(/databases/$(database)/documents/users/$(userId))`).
5. **Fixed Score Integrity (`LeaderboardScore`)**: `score` must strictly match the fixed score for `easiestDifficultyUsed` (`easy` -> `1000`, `medium` -> `2000`, `hard` -> `3000`), and `gridSize` must be either `8` or `20`.
6. **Temporal Integrity**: `createdAt` and `updatedAt` must equal `request.time` on `create`, `createdAt` is immutable on `update`, and `updatedAt` must equal `request.time` on `update`.
7. **Query Enforcement (`allow list`)**: `allow list` on `/leaderboard_scores` requires `existing().isPublic == true` (never blanket `allow read: if true`).

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Payload 1 (Identity Spoofing on Profile Create)**: Authenticated as `user_A`, attempting to create `/users/user_B` or setting `uid: "user_B"`.
2. **Payload 2 (Unverified Email Write)**: Authenticated as `user_A` with `email_verified: false`, attempting to create `/users/user_A`.
3. **Payload 3 (Shadow Field Injection on Profile)**: Creating `/users/user_A` with extra field `isAdmin: true` or `email: "leak@example.com"`.
4. **Payload 4 (Denial-of-Wallet Oversized String)**: Creating `/users/user_A` with a `displayName` of 500 characters (`maxLength` is 40).
5. **Payload 5 (ID Poisoning)**: Creating `/leaderboard_scores/bad$id!@#` with invalid characters outside `^[a-zA-Z0-9_\-]+$`.
6. **Payload 6 (Score Tampering / Arbitrary Score)**: Creating a `/leaderboard_scores/{scoreId}` entry with `easiestDifficultyUsed: "easy"` and `score: 3000` (must be `1000`).
7. **Payload 7 (Orphaned Score Without User Profile)**: Creating a `/leaderboard_scores/{scoreId}` entry when `/users/$(request.auth.uid)` does not exist.
8. **Payload 8 (Cross-User Score Overwrite)**: Authenticated as `user_B`, attempting to update `/leaderboard_scores/{scoreId}` owned by `user_A`.
9. **Payload 9 (Immutable Field Mutation on Update)**: Updating `/leaderboard_scores/{scoreId}` while mutating `createdAt`, `uid`, or `puzzleId`.
10. **Payload 10 (Forged Client Timestamp)**: Creating `/users/user_A` with a past or future timestamp `createdAt != request.time`.
11. **Payload 11 (Orphaned Subcollection Write Bypassing Master Gate)**: Writing to `/users/user_A/puzzle_progress/daily-2026-10-29` when parent `/users/user_A` does not exist.
12. **Payload 12 (Difficulty Downgrade Bypass on Progress Update)**: Updating `/users/user_A/puzzle_progress/daily-2026-10-29` with an unlisted shadow key `hacked: true`.
