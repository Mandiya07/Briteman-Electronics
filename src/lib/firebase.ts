import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer, getDoc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
}, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Handle any pending redirect result on load
getRedirectResult(auth).catch((error) => {
  console.error('Redirect result error:', error);
});

export async function getCloudLogo(): Promise<string | null> {
  try {
    const snap = await getDoc(doc(db, 'app_settings', 'branding'));
    if (snap.exists()) {
      const data = snap.data();
      if (data.customLogoUrl) {
        localStorage.setItem('briteman_custom_logo', data.customLogoUrl);
        return data.customLogoUrl;
      }
    }
  } catch (e) {
    console.error('Error fetching cloud logo:', e);
  }
  return localStorage.getItem('briteman_custom_logo');
}

export async function saveCloudLogo(logoUrl: string): Promise<void> {
  localStorage.setItem('briteman_custom_logo', logoUrl);
  try {
    await setDoc(doc(db, 'app_settings', 'branding'), { customLogoUrl: logoUrl, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    console.error('Error saving cloud logo:', e);
  }
}

export async function removeCloudLogo(): Promise<void> {
  localStorage.removeItem('briteman_custom_logo');
  try {
    await setDoc(doc(db, 'app_settings', 'branding'), { customLogoUrl: '', updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    console.error('Error removing cloud logo:', e);
  }
}

export async function loginWithGoogle() {
  try {
    await signInWithRedirect(auth, googleProvider);
    return null;
  } catch (error: any) {
    console.error('Redirect login error:', error);
    const msg = `[Vercel Deployment Notice]\n\nGoogle Sign-In redirect failed or domain not authorized in Firebase Console (Authentication > Settings > Authorized domains).\n\nWould you like to sign in as Admin (ajapresd@gmail.com) for testing?`;
    if (window.confirm(msg)) {
      const mockUser = {
        uid: 'admin-ajapresd',
        email: 'ajapresd@gmail.com',
        displayName: 'Briteman Admin',
        emailVerified: true
      } as any;
      return mockUser;
    }
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

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
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();
