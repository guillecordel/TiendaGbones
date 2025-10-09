"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	// Placeholder for Firebase Authentication
	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			// TODO: Implement Firebase Authentication
			// Example:
			// import { signInWithEmailAndPassword } from 'firebase/auth';
			// import { auth } from '@/lib/firebase';
			// await signInWithEmailAndPassword(auth, email, password);
			// router.push('/dashboard');

			console.log("Login attempted with:", { email, password });

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
		} catch (error) {
			console.error("Login error:", error);
			// TODO: Show error toast/notification
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex dark-gradient">
			{/* Left side - Login Form */}
			<div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
				<div className="w-full max-w-md">
					{/* Logo - skull and text separated for independent control */}
					<div className="mb-6 sm:mb-8 flex justify-center items-center gap-2 md:gap-3 -translate-x-5 sm:-translate-x-10 translate-y-[20px] sm:translate-y-[42px]">
						{/* Skull Logo */}
						<Link href="/" className="hover:opacity-80 transition logo-icon translate-y-[5px] sm:translate-y-[15px]">
							<Image
								src="/calavera.svg"
								alt="Gbones Logo"
								width={140}
								height={140}
								className="h-24 w-24 sm:h-32 sm:w-32 md:h-36 md:w-36 drop-shadow-lg"
							/>
						</Link>

						{/* Gbones Text */}
						<Link href="/" className="hover:opacity-80 transition logo-text -ml-3 sm:-ml-5">
							<span className="text-lg sm:text-xl md:text-2xl font-brand tracking-wide text-white drop-shadow-md">
								Gbones
							</span>
						</Link>
					</div>

					{/* Form Container with Glassmorphism */}
					<div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
						<h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome back</h1>
						<p className="text-sm sm:text-base text-white/70 mb-6 sm:mb-8">Sign in to your account to continue</p>

						<form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
							{/* Email Field */}
							<div>
								<label htmlFor="email" className="block text-sm font-medium text-white mb-2">
									Email
								</label>
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									autoComplete="email"
									inputMode="email"
									placeholder="your.email@example.com"
									className="w-full px-4 py-3.5 sm:py-3 rounded-lg bg-white/5 border border-white/20 text-white text-base placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
								/>
							</div>

							{/* Password Field */}
							<div>
								<div className="flex items-center justify-between mb-2">
									<label htmlFor="password" className="block text-sm font-medium text-white">
										Password
									</label>
									<Link
										href="/forgot-password"
										className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 transition-colors"
									>
										Forgot password?
									</Link>
								</div>
								<input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									autoComplete="current-password"
									placeholder="Enter your password"
									className="w-full px-4 py-3.5 sm:py-3 rounded-lg bg-white/5 border border-white/20 text-white text-base placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
								/>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={loading}
								className="w-full py-3.5 sm:py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white font-semibold text-base rounded-lg hover:from-purple-700 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all transform active:scale-[0.98] sm:hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
							>
								{loading ? "Signing in..." : "Sign in"}
							</button>
						</form>

						{/* Sign Up Link */}
						<div className="mt-6 text-center">
							<p className="text-sm sm:text-base text-white/70">
								Don't have an account?{" "}
								<Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
									Sign up
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Right side - Branding */}
			<div className="hidden lg:flex flex-1 items-center justify-center p-12 relative">
				<div className="text-center space-y-6 max-w-lg">
					{/* Large Logo */}
					<div className="flex justify-center mb-8">
						<div className="backdrop-blur-md bg-white/5 rounded-3xl p-12 border border-white/10">
							<Image
								src="/calavera.svg"
								alt="Gbones Logo"
								width={200}
								height={200}
								className="w-48 h-48 animate-fadeIn"
							/>
						</div>
					</div>

					{/* Tagline */}
					<h2 className="text-5xl font-bold text-white mb-4">Gbones</h2>
					<p className="text-2xl text-white/80 font-light">Dark fashion with attitude</p>
					<p className="text-lg text-white/60 max-w-md mx-auto">
						Express yourself through bold designs and edgy aesthetics. Join our community of rebels.
					</p>
				</div>
			</div>
		</div>
	);
}
