import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { AuthArgs, User } from "../types";

// Consistent error handling
const handleFirebaseError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  return new Error("An unknown error occurred");
};

// Auth functions
const login = async (email: string, password: string) => {
  if (!email || !password) throw new Error("Email and password are required");

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

    if (!userDoc.exists()) {
      throw new Error("User data not found");
    }

    return {
      id: userCredential.user.uid,
      ...(userDoc.data() as Omit<User, "id">),
    };
  } catch (err) {
    throw handleFirebaseError(err);
  }
};

const signup = async (user: AuthArgs) => {
  if (!user.email || !user.password) {
    throw new Error("Email and password are required");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );

    const userData = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      pfp: null,
      role: "user",
      events: [],
      tickets: [],
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, "users", userCredential.user.uid), userData);

    return {
      id: userCredential.user.uid,
      ...userData,
    };
  } catch (err) {
    throw handleFirebaseError(err);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (err) {
    throw handleFirebaseError(err);
  }
};

const getCurrentUser = async (
  firebaseUser: FirebaseUser
): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

    if (!userDoc.exists()) {
      return null;
    }

    return {
      id: firebaseUser.uid,
      ...(userDoc.data() as Omit<User, "id">),
    };
  } catch (err) {
    throw handleFirebaseError(err);
  }
};

export { login, signup, logout, getCurrentUser, onAuthStateChanged };
