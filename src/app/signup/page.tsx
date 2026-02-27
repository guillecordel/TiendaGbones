import type { Metadata } from "next";
import { Signup } from "@/ui/auth/Signup";

export const metadata: Metadata = {
	title: "Sign Up | Gbones",
	description: "Create your Gbones account and join the community",
};

export default function SignupPage() {
	return <Signup />;
}
