import type { Metadata } from "next";
import { Login } from "@/ui/auth/Login";

export const metadata: Metadata = {
	title: "Login | Gbones",
	description: "Sign in to your Gbones account",
};

export default function LoginPage() {
	return <Login />;
}
