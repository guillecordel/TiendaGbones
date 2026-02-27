"use client";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";

export default function TestFirebase() {
	const [status, setStatus] = useState<string>("");

	async function testAdd() {
		setStatus("Writing...");
		try {
			const ref = await addDoc(collection(db, "test"), {
				created: serverTimestamp(),
				text: "hello Gbones",
				timestamp: Date.now(),
			});
			const msg = `✅ OK: ${ref.id}`;
			setStatus(msg);
			console.log("[Firestore Success]", ref.id);
			alert(msg);
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			console.error("[Firestore Error]", err);
			setStatus(`❌ ERROR: ${message}`);
			alert(`ERROR: ${message}`);
		}
	}

	return (
		<div className="flex flex-col items-center gap-2">
			<button
				onClick={testAdd}
				className="p-4 bg-white/20 rounded text-white hover:bg-white/30 transition"
			>
				Test Firebase
			</button>
			{status && <p className="text-sm text-white/80">{status}</p>}
		</div>
	);
}
