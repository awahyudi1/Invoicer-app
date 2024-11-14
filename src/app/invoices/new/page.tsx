"use client";

import FORM from "next/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { createAction } from "@/app/actions";
import { SyntheticEvent, useState } from "react";
import SubmitButton from "@/components/submitButton";
import Container from "@/components/Container";

export default function Home() {
	const [state, setState] = useState("ready");
	async function handleOnSubmit(event: SyntheticEvent) {
		if (state === "pending") {
			event.preventDefault();
			return;
		}
		setState("pending");
	}
	return (
		<main className="h-full">
			<Container>
				<div className="flex justify-between mb-6">
					<h1 className="text-3xl font-semibold"> Create Invoices</h1>
				</div>
				<FORM
					action={createAction}
					onSubmit={handleOnSubmit}
					className="grid gap-4 max-w-xs"
				>
					<div>
						<Label htmlFor="name" className="block mb-2 font-semibold text-sm">
							Billing name
						</Label>
						<Input id="name" name="name" type="text" />
					</div>
					<div>
						<Label htmlFor="email" className="block mb-2 font-semibold text-sm">
							Billing email
						</Label>
						<Input id="email" name="email" type="email" />
					</div>
					<div>
						<Label htmlFor="value" className="block mb-2 font-semibold text-sm">
							Value
						</Label>
						<Input id="value" name="value" type="text" />
					</div>
					<div>
						<Label
							htmlFor="description"
							className="block mb-2 font-semibold text-sm"
						>
							Description
						</Label>
						<Textarea id="description" name="description"></Textarea>
					</div>
					<div>
						<SubmitButton />
					</div>
				</FORM>
			</Container>
		</main>
	);
}
