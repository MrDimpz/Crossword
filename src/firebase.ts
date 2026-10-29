import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import {
  calculatePuzzleScore,
  ClueDifficulty,
  getEasierDifficulty,
  GridSizeOption,
  LeaderboardEntry,
  PlayerProfile,
} from './types/crossword';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const FIREBASE_PROJECT_ID = firebaseConfig.projectId;
const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Sanitization helpers matching firebase-blueprint.json & firestore.rules
export function sanitizeValidId(raw: string, maxLen: number = 128): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, maxLen);
  return cleaned.length > 0 ? cleaned : 'default_id';
}

export function sanitizeDisplayName(raw: string): string {
  const trimmed = raw.trim().slice(0, 40);
  return trimmed.length >= 1 ? trimmed : 'Cruciverbalist';
}

export interface FormattedAuthError {
  message: string;
  code: string;
  isUnauthorizedDomain: boolean;
  isProviderDisabled: boolean;
  hostname: string;
  projectId: string;
}

export function formatFirebaseAuthError(err: unknown): FormattedAuthError {
  const rawMessage = err instanceof Error ? err.message : String(err);
  const codeMatch = rawMessage.match(/\((auth\/[^)]+)\)/);
  const code =
    (err as { code?: string })?.code || (codeMatch ? codeMatch[1] : 'auth/unknown');
  const hostname =
    typeof window !== 'undefined' && window.location?.hostname
      ? window.location.hostname
      : 'your-custom-domain.com';

  if (
    code === 'auth/unauthorized-domain' ||
    rawMessage.includes('auth/unauthorized-domain')
  ) {
    return {
      code: 'auth/unauthorized-domain',
      isUnauthorizedDomain: true,
      isProviderDisabled: false,
      hostname,
      projectId: FIREBASE_PROJECT_ID,
      message: `Domain "${hostname}" is not yet authorized in Firebase Authentication for Google Sign-In. You can register/sign in with Email below, or add "${hostname}" to Firebase Console → Authentication → Settings → Authorized domains.`,
    };
  }

  if (
    code === 'auth/operation-not-allowed' ||
    rawMessage.includes('auth/operation-not-allowed')
  ) {
    return {
      code: 'auth/operation-not-allowed',
      isUnauthorizedDomain: false,
      isProviderDisabled: true,
      hostname,
      projectId: FIREBASE_PROJECT_ID,
      message:
        'Email/Password Sign-In is not enabled yet in Firebase Console. Enable "Email/Password" under Firebase Console → Authentication → Sign-in method, or continue with your Instant Device Account below.',
    };
  }

  if (code === 'auth/email-already-in-use') {
    return {
      code,
      isUnauthorizedDomain: false,
      isProviderDisabled: false,
      hostname,
      projectId: FIREBASE_PROJECT_ID,
      message:
        'An account with this email already exists. Switch to "Sign In with Email" to log in.',
    };
  }

  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/wrong-password' ||
    code === 'auth/user-not-found'
  ) {
    return {
      code,
      isUnauthorizedDomain: false,
      isProviderDisabled: false,
      hostname,
      projectId: FIREBASE_PROJECT_ID,
      message:
        'Invalid email or password. Please check your credentials or switch to "Register with Email" to create a new account.',
    };
  }

  if (code === 'auth/weak-password') {
    return {
      code,
      isUnauthorizedDomain: false,
      isProviderDisabled: false,
      hostname,
      projectId: FIREBASE_PROJECT_ID,
      message: 'Password must be at least 6 characters long.',
    };
  }

  if (code === 'auth/invalid-email') {
    return {
      code,
      isUnauthorizedDomain: false,
      isProviderDisabled: false,
      hostname,
      projectId: FIREBASE_PROJECT_ID,
      message: 'Please enter a valid email address.',
    };
  }

  if (code === 'auth/popup-closed-by-user') {
    return {
      code,
      isUnauthorizedDomain: false,
      isProviderDisabled: false,
      hostname,
      projectId: FIREBASE_PROJECT_ID,
      message:
        'Google sign-in popup was closed before completing. You can also register or sign in with your Email address.',
    };
  }

  if (code === 'auth/popup-blocked') {
    return {
      code,
      isUnauthorizedDomain: false,
      isProviderDisabled: false,
      hostname,
      projectId: FIREBASE_PROJECT_ID,
      message:
        'Sign-in popup was blocked by the browser. Please allow popups or sign in directly with Email & Password below.',
    };
  }

  // Check if rawMessage is a serialized FirestoreErrorInfo JSON object
  if (rawMessage.startsWith('{') && rawMessage.includes('"operationType"')) {
    try {
      const parsed = JSON.parse(rawMessage) as Partial<FirestoreErrorInfo>;
      if (parsed.error) {
        return {
          code: 'firestore/error',
          isUnauthorizedDomain: false,
          isProviderDisabled: false,
          hostname,
          projectId: FIREBASE_PROJECT_ID,
          message: `Cloud sync notice (${parsed.operationType || 'sync'}): ${parsed.error}`,
        };
      }
    } catch {
      // fall through
    }
  }

  return {
    code,
    isUnauthorizedDomain: false,
    isProviderDisabled: false,
    hostname,
    projectId: FIREBASE_PROJECT_ID,
    message: rawMessage,
  };
}

export async function signInWithGoogleAccount(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  await ensureUserPublicProfile(result.user);
  return result.user;
}

export async function registerWithEmailAccount(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const safeName = sanitizeDisplayName(
    displayName || email.split('@')[0] || 'Cruciverbalist'
  );
  const result = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );
  try {
    await updateProfile(result.user, { displayName: safeName });
  } catch {
    // Non-fatal if auth profile update fails; Firestore profile still stores displayName
  }
  await ensureUserPublicProfile(result.user, safeName);
  return result.user;
}

export async function signInWithEmailAccount(
  email: string,
  password: string
): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email.trim(), password);
  await ensureUserPublicProfile(result.user);
  return result.user;
}

export async function resetEmailPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

export async function signOutPlayerAccount(): Promise<void> {
  await signOut(auth);
}

// Per-UID serialization locks to prevent concurrent getDoc/setDoc race conditions on sign-in
const profileSyncLocks = new Map<string, Promise<PlayerProfile>>();
const progressSyncLocks = new Map<string, Promise<ClueDifficulty>>();

/**
 * Ensures the authenticated user has a valid UserPublicProfile document in /users/{uid}.
 * Serialized per UID so simultaneous calls from onAuthStateChanged and signIn handlers never race.
 */
export async function ensureUserPublicProfile(
  user: User,
  customDisplayName?: string
): Promise<PlayerProfile> {
  const uid = sanitizeValidId(user.uid, 128);
  const prevLock = profileSyncLocks.get(uid) || Promise.resolve(null as unknown as PlayerProfile);

  const nextTask = prevLock
    .catch(() => null as unknown as PlayerProfile)
    .then(async () => {
      const userPath = `users/${uid}`;
      const userRef = doc(db, 'users', uid);
      let currentOp: OperationType = OperationType.GET;

      try {
        const snap = await getDoc(userRef);
        const fallbackName = sanitizeDisplayName(
          customDisplayName ||
            user.displayName ||
            user.email?.split('@')[0] ||
            'Cruciverbalist'
        );
        const safePhoto = (user.photoURL || '').slice(0, 500);

        if (!snap.exists()) {
          currentOp = OperationType.CREATE;
          await setDoc(userRef, {
            uid,
            displayName: fallbackName,
            photoURL: safePhoto,
            puzzlesSolved: 0,
            totalScore: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          return {
            uid,
            displayName: fallbackName,
            photoURL: safePhoto,
            puzzlesSolved: 0,
            totalScore: 0,
          };
        } else {
          const data = snap.data();
          const existingName = sanitizeDisplayName(
            customDisplayName || data.displayName || fallbackName
          );
          if (customDisplayName && existingName !== data.displayName) {
            currentOp = OperationType.UPDATE;
            await updateDoc(userRef, {
              displayName: existingName,
              photoURL: safePhoto,
              updatedAt: serverTimestamp(),
            });
          }
          return {
            uid,
            displayName: existingName,
            photoURL:
              typeof data.photoURL === 'string' ? data.photoURL : safePhoto,
            puzzlesSolved:
              typeof data.puzzlesSolved === 'number' ? data.puzzlesSolved : 0,
            totalScore:
              typeof data.totalScore === 'number' ? data.totalScore : 0,
          };
        }
      } catch (error) {
        handleFirestoreError(error, currentOp, userPath);
      }
    });

  profileSyncLocks.set(uid, nextTask);
  return nextTask;
}

/**
 * Updates a signed-in player's display handle in /users/{uid}.
 */
export async function updatePlayerCallsign(
  user: User,
  newDisplayName: string
): Promise<PlayerProfile> {
  const uid = sanitizeValidId(user.uid, 128);
  const userPath = `users/${uid}`;
  const userRef = doc(db, 'users', uid);
  const safeName = sanitizeDisplayName(newDisplayName);
  const safePhoto = (user.photoURL || '').slice(0, 500);

  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      return await ensureUserPublicProfile(user, safeName);
    }
    await updateDoc(userRef, {
      displayName: safeName,
      photoURL: safePhoto,
      updatedAt: serverTimestamp(),
    });
    const data = snap.data();
    return {
      uid,
      displayName: safeName,
      photoURL: safePhoto,
      puzzlesSolved:
        typeof data.puzzlesSolved === 'number' ? data.puzzlesSolved : 0,
      totalScore: typeof data.totalScore === 'number' ? data.totalScore : 0,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}

/**
 * Syncs a signed-in player's easiest clue difficulty base and completion state for a puzzle
 * to /users/{uid}/puzzle_progress/{puzzleId}.
 */
export async function syncPuzzleProgressToCloud(
  user: User,
  rawPuzzleId: string,
  chosenDifficulty: ClueDifficulty,
  completed: boolean = false
): Promise<ClueDifficulty> {
  const uid = sanitizeValidId(user.uid, 128);
  const puzzleId = sanitizeValidId(rawPuzzleId, 100);
  const lockKey = `${uid}_${puzzleId}`;
  const prevLock =
    progressSyncLocks.get(lockKey) ||
    Promise.resolve(chosenDifficulty as ClueDifficulty);

  const nextTask = prevLock
    .catch(() => chosenDifficulty)
    .then(async () => {
      const progressPath = `users/${uid}/puzzle_progress/${puzzleId}`;
      const progressRef = doc(db, 'users', uid, 'puzzle_progress', puzzleId);
      let currentOp: OperationType = OperationType.GET;

      try {
        await ensureUserPublicProfile(user);
        const snap = await getDoc(progressRef);
        if (!snap.exists()) {
          currentOp = OperationType.CREATE;
          await setDoc(progressRef, {
            uid,
            puzzleId,
            easiestDifficultyUsed: chosenDifficulty,
            completed,
            updatedAt: serverTimestamp(),
          });
          return chosenDifficulty;
        } else {
          const existingData = snap.data();
          const prevDiff: ClueDifficulty =
            existingData.easiestDifficultyUsed === 'easy' ||
            existingData.easiestDifficultyUsed === 'medium' ||
            existingData.easiestDifficultyUsed === 'hard'
              ? existingData.easiestDifficultyUsed
              : chosenDifficulty;
          const monotonicEasiest = getEasierDifficulty(
            prevDiff,
            chosenDifficulty
          );
          const nextCompleted = Boolean(existingData.completed) || completed;

          if (
            monotonicEasiest !== prevDiff ||
            nextCompleted !== Boolean(existingData.completed)
          ) {
            currentOp = OperationType.UPDATE;
            await updateDoc(progressRef, {
              easiestDifficultyUsed: monotonicEasiest,
              completed: nextCompleted,
              updatedAt: serverTimestamp(),
            });
          }
          return monotonicEasiest;
        }
      } catch (error) {
        handleFirestoreError(error, currentOp, progressPath);
      }
    });

  progressSyncLocks.set(lockKey, nextTask);
  return nextTask;
}

/**
 * Subscribes to a signed-in player's puzzle_progress subcollection.
 */
export function subscribeToUserPuzzleProgress(
  uid: string,
  onUpdate: (easiestMap: Record<string, ClueDifficulty>) => void
) {
  const safeUid = sanitizeValidId(uid, 128);
  const path = `users/${safeUid}/puzzle_progress`;
  const q = query(
    collection(db, 'users', safeUid, 'puzzle_progress'),
    where('uid', '==', safeUid)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const map: Record<string, ClueDifficulty> = {};
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        if (
          d &&
          typeof d.puzzleId === 'string' &&
          (d.easiestDifficultyUsed === 'easy' ||
            d.easiestDifficultyUsed === 'medium' ||
            d.easiestDifficultyUsed === 'hard')
        ) {
          map[d.puzzleId] = d.easiestDifficultyUsed;
        }
      });
      onUpdate(map);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Subscribes to the global permanent cloud leaderboard (/leaderboard_scores where isPublic == true).
 */
export function subscribeToCloudLeaderboard(
  onUpdate: (entries: LeaderboardEntry[]) => void
) {
  const path = 'leaderboard_scores';
  const q = query(
    collection(db, 'leaderboard_scores'),
    where('isPublic', '==', true)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: LeaderboardEntry[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        if (!d) return;
        const gridSize: GridSizeOption = d.gridSize === 8 ? 8 : 20;
        const easiest: ClueDifficulty =
          d.easiestDifficultyUsed === 'easy' ||
          d.easiestDifficultyUsed === 'medium' ||
          d.easiestDifficultyUsed === 'hard'
            ? d.easiestDifficultyUsed
            : 'medium';
        const clueDiff: ClueDifficulty =
          d.clueDifficulty === 'easy' ||
          d.clueDifficulty === 'medium' ||
          d.clueDifficulty === 'hard'
            ? d.clueDifficulty
            : easiest;

        const safeSecs =
          typeof d.timeSeconds === 'number' ? d.timeSeconds : 300;
        const computedScore = calculatePuzzleScore(easiest, safeSecs);

        items.push({
          id: docSnap.id,
          uid: typeof d.uid === 'string' ? d.uid : undefined,
          playerName:
            typeof d.playerName === 'string' ? d.playerName : 'Cruciverbalist',
          puzzleId: typeof d.puzzleId === 'string' ? d.puzzleId : 'daily',
          puzzleTitle:
            typeof d.puzzleTitle === 'string'
              ? d.puzzleTitle
              : 'Daily Crossword',
          themeName:
            typeof d.themeName === 'string' ? d.themeName : 'General Knowledge',
          gridSize,
          score: computedScore,
          timeSeconds: safeSecs,
          hintsUsed: typeof d.hintsUsed === 'number' ? d.hintsUsed : 0,
          easiestDifficultyUsed: easiest,
          clueDifficulty: clueDiff,
          accuracy: typeof d.accuracy === 'number' ? d.accuracy : 100,
          completedAt:
            typeof d.completedAt === 'string' ? d.completedAt : '2026-10-29',
          isCloudSynced: true,
        });
      });

      items.sort((a, b) => b.score - a.score || a.timeSeconds - b.timeSeconds);
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Permanently records a completed puzzle score to /leaderboard_scores/{scoreId} and updates career stats in /users/{uid}.
 */
export async function recordCloudLeaderboardScore(
  user: User,
  entry: {
    playerName: string;
    puzzleId: string;
    puzzleTitle: string;
    themeName: string;
    gridSize: GridSizeOption;
    timeSeconds: number;
    hintsUsed: number;
    easiestDifficultyUsed: ClueDifficulty;
    clueDifficulty: ClueDifficulty;
    accuracy: number;
    completedAt: string;
  }
): Promise<PlayerProfile> {
  const uid = sanitizeValidId(user.uid, 128);
  const safePuzzleId = sanitizeValidId(entry.puzzleId, 100);
  const scoreId = sanitizeValidId(`${uid}_${safePuzzleId}`, 128);
  const scorePath = `leaderboard_scores/${scoreId}`;
  const scoreRef = doc(db, 'leaderboard_scores', scoreId);
  const userRef = doc(db, 'users', uid);

  try {
    // 1. Ensure user profile exists and sync display name
    const profile = await ensureUserPublicProfile(user, entry.playerName);

    // 2. Sync progress document so easiestDifficultyUsed is permanently locked
    const effectiveEasiest = await syncPuzzleProgressToCloud(
      user,
      safePuzzleId,
      entry.easiestDifficultyUsed,
      true
    );

    const safePlayerName = sanitizeDisplayName(
      entry.playerName || profile.displayName
    );
    const safeTitle = (entry.puzzleTitle || 'Daily Crossword')
      .trim()
      .slice(0, 120);
    const safeTheme = (entry.themeName || 'General Knowledge')
      .trim()
      .slice(0, 100);
    const safeGridSize: GridSizeOption = entry.gridSize === 8 ? 8 : 20;
    const safeTimeSeconds = Math.max(
      1,
      Math.min(864000, Math.round(entry.timeSeconds || 1))
    );
    const safeHints = Math.max(
      0,
      Math.min(5000, Math.round(entry.hintsUsed || 0))
    );
    const safeAccuracy = Math.max(
      0,
      Math.min(100, Math.round(entry.accuracy ?? 100))
    );
    const safeCompletedAt = (entry.completedAt || '2026-10-29').slice(0, 20);

    const existingScoreSnap = await getDoc(scoreRef);
    let scoreDelta = 0;
    let solvedDelta = 0;

    if (!existingScoreSnap.exists()) {
      const finalScore = calculatePuzzleScore(
        effectiveEasiest,
        safeTimeSeconds
      );
      await setDoc(scoreRef, {
        scoreId,
        uid,
        playerName: safePlayerName,
        puzzleId: safePuzzleId,
        puzzleTitle: safeTitle,
        themeName: safeTheme,
        gridSize: safeGridSize,
        score: finalScore,
        timeSeconds: safeTimeSeconds,
        hintsUsed: safeHints,
        easiestDifficultyUsed: effectiveEasiest,
        clueDifficulty: entry.clueDifficulty,
        accuracy: safeAccuracy,
        completedAt: safeCompletedAt,
        isPublic: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      scoreDelta = finalScore;
      solvedDelta = 1;
    } else {
      const prevData = existingScoreSnap.data();
      const prevEasiest: ClueDifficulty =
        prevData.easiestDifficultyUsed === 'easy' ||
        prevData.easiestDifficultyUsed === 'medium' ||
        prevData.easiestDifficultyUsed === 'hard'
          ? prevData.easiestDifficultyUsed
          : effectiveEasiest;
      const mergedEasiest = getEasierDifficulty(prevEasiest, effectiveEasiest);
      const bestTimeSeconds = Math.min(
        typeof prevData.timeSeconds === 'number'
          ? prevData.timeSeconds
          : safeTimeSeconds,
        safeTimeSeconds
      );
      const nextFinalScore = calculatePuzzleScore(
        mergedEasiest,
        bestTimeSeconds
      );
      const prevScore =
        typeof prevData.score === 'number'
          ? prevData.score
          : calculatePuzzleScore(prevEasiest, bestTimeSeconds);

      await updateDoc(scoreRef, {
        playerName: safePlayerName,
        score: nextFinalScore,
        timeSeconds: bestTimeSeconds,
        hintsUsed: safeHints,
        easiestDifficultyUsed: mergedEasiest,
        clueDifficulty: entry.clueDifficulty,
        accuracy: safeAccuracy,
        completedAt: safeCompletedAt,
        updatedAt: serverTimestamp(),
      });
      scoreDelta = nextFinalScore - prevScore;
      solvedDelta = 0;
    }

    // 3. Update career totals in /users/{uid}
    const nextSolved = Math.max(0, profile.puzzlesSolved + solvedDelta);
    const nextTotalScore = Math.max(0, profile.totalScore + scoreDelta);
    const safePhoto = (user.photoURL || profile.photoURL || '').slice(0, 500);

    await updateDoc(userRef, {
      displayName: safePlayerName,
      photoURL: safePhoto,
      puzzlesSolved: nextSolved,
      totalScore: nextTotalScore,
      updatedAt: serverTimestamp(),
    });

    return {
      uid,
      displayName: safePlayerName,
      photoURL: safePhoto,
      puzzlesSolved: nextSolved,
      totalScore: nextTotalScore,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, scorePath);
  }
}
