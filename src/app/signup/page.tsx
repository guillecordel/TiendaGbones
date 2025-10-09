import { Signup } from "@/ui/auth/Signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sign Up | Gbones",
	description: "Create your Gbones account and join the community",
};

export default function SignupPage() {
	return <Signup />;
}
