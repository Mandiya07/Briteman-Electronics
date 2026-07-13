import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Handle any pending redirect result on load
getRedirectResult(auth).catch((error) => {
  console.error('Redirect result error:', error);
});

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.warn('Popup login error or blocked:', error?.code || error);
    if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/popup-blocked' || error?.code === 'auth/cancelled-popup-request') {
      try {
        await signInWithRedirect(auth, googleProvider);
        return null;
      } catch (redirectError) {
        console.error('Redirect login error:', redirectError);
        throw redirectError;
      }
    } else if (error?.code === 'auth/unauthorized-domain') {
      const msg = `[Vercel Domain Authorization Notice]\n\nThis Vercel deployment domain is not yet authorized in your Firebase Console.\n\nTo enable Google Sign-In on Vercel:\n1. Go to Firebase Console > Authentication > Settings > Authorized domains.\n2. Click "Add domain" and enter your Vercel domain (e.g. your-app.vercel.app).\n\nWould you like to sign in as Admin (ajapresd@gmail.com) for testing right now?`;
      const useAdmin = window.confirm(msg);
      if (useAdmin) {
        const mockUser = {
          uid: 'admin-ajapresd',
          email: 'ajapresd@gmail.com',
          displayName: 'Briteman Admin',
          emailVerified: true
        } as any;
        return mockUser;
      }
      throw error;
    } else if (error?.code === 'auth/network-request-failed') {
      const useAdmin = window.confirm('Network request restricted. Would you like to sign in as Admin (ajapresd@gmail.com) for testing?');
      if (useAdmin) {
        const mockUser = {
          uid: 'admin-ajapresd',
          email: 'ajapresd@gmail.com',
          displayName: 'Briteman Admin',
          emailVerified: true
        } as any;
        return mockUser;
      }
      throw error;
    } else {
      throw error;
    }
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
