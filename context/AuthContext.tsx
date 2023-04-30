"use client";

import { useRouter } from "next/navigation";
import {
	createContext,
	ReactNode,
	useContext,
	useState,
	useEffect,
} from "react";
import { auth, googleProvider, githubProvider } from "@/firebase/config";
import {
	User as FirebaseUser,
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	signInWithPopup,
} from "firebase/auth";

type AuthContextType = {
	user: FirebaseUser | null;
	register: (email: string, password: string) => void;
	login: (email: string, password: string) => void;
	logout: () => void;
	updateUser: (username: string) => void;
	loginWithGoogle: () => void;
	loginWithGithub: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<FirebaseUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			setIsLoading(true);
			if (user) {
				setUser(user);
			} else {
				setUser(null);
			}
			setIsLoading(false);
		});
	}, []);

	const register = async (email: string, password: string) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			router.push("/cart");
			console.log(`Account created! Welcome ${userCredential.user.email}`);
		} catch (e) {
			const errorCode = (e as any).code;
			console.log(`Register failed ${errorCode}`);
		}
	};

	const login = async (email: string, password: string) => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			router.push("/cart");
			console.log(`Welcome ${userCredential.user.email}`);
		} catch (e) {
			const errorCode = (e as any).code;
			console.log(`Login failed ${errorCode}`);
		}
	};

	const loginWithGoogle = async () => {
		try {
			const userCredential = await signInWithPopup(auth, googleProvider);
			router.push("/cart");
			console.log(`Welcome ${userCredential.user.email}`);
		} catch (e) {
			const errorCode = (e as any).code;
			console.log(`Login failed ${errorCode}`);
		}
	};

	const loginWithGithub = async () => {
		try {
			const userCredential = await signInWithPopup(auth, githubProvider);
			router.push("/cart");
			console.log(`Welcome ${userCredential}`);
		} catch (e) {
			const errorCode = (e as any).code;
			console.log(`Login failed ${errorCode}`);
		}
	};

	const logout = async () => {
		try {
			await signOut(auth);
			router.push("/");
			console.log("Logged out!");
		} catch (error) {
			console.log("Could not logout!");
		}
	};

	const updateUser = async (username: string) => {
		await updateProfile(auth.currentUser as FirebaseUser, {
			displayName: username,
		});
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				register,
				login,
				logout,
				updateUser,
				loginWithGoogle,
				loginWithGithub,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => useContext(AuthContext);
