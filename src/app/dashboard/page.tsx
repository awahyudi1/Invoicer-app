import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Container from "@/components/Container";
import { and, eq, isNull } from "drizzle-orm";
import { Result } from "postcss";

export default async function Home() {
	const { userId, orgId } = await auth();

	if (!userId) return;

	let results;
	if (orgId) {
		results = await db
			.select()
			.from(Invoices)
			.innerJoin(Customers, eq(Invoices.customerId, Customers.id))
			.where(eq(Invoices.organizationId, orgId));
	} else {
		results = await db
			.select()
			.from(Invoices)
			.innerJoin(Customers, eq(Invoices.customerId, Customers.id))
			.where(and(eq(Invoices.userId, userId), isNull(Invoices.organizationId)));
	}
	const invoices = results?.map(({ invoices, customers }) => {
		return {
			...invoices,
			customer: customers,
		};
	});

	return (
		<main className=" h-full my-12">
			<Container>
				<div className="flex justify-between">
					<h1 className="text-3xl font-semibold">Invoices</h1>
					<p>
						<Button className="inline-flex gap-2" variant="ghost" asChild>
							<Link href="invoices/new">
								<CirclePlus className="h-4 w-4" />
								Create Invoice
							</Link>
						</Button>
					</p>
				</div>
				<Table>
					<TableCaption>A list of your recent invoices.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px] p-4">Date</TableHead>
							<TableHead className="p-4">Customer</TableHead>
							<TableHead className="p-4">Email</TableHead>
							<TableHead className="text-center p-4">Status</TableHead>
							<TableHead className="text-right p-4">value</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invoices.map((result) => {
							return (
								<TableRow key={result.id}>
									<TableCell className="font-medium text-left p-0 ">
										<Link
											href={`/invoices/${result.id}`}
											className="block font-semibold p-4"
										>
											{new Date(result.createTs).toLocaleDateString()}
										</Link>
									</TableCell>
									<TableCell className="text-left p-0">
										<Link
											href={`/invoices/${result.id}`}
											className="font-semibold block p-4"
										>
											{result.customer.name}
										</Link>
									</TableCell>
									<TableCell className="text-left p-0">
										<Link className="block p-4" href={`/invoices/${result.id}`}>
											{result.customer.email}
										</Link>
									</TableCell>
									<TableCell className="text-center p-0">
										<Link className="p-4 block" href={`/invoices/${result.id}`}>
											<Badge
												className={cn(
													"rounded-full capitalize",
													result.status === "open" && "bg-blue-500",
													result.status === "paid" && "bg-green-600",
													result.status === "void" && "bg-zinc-700",
													result.status === "uncollectable" && "bg-red-600"
												)}
											>
												{result.status}
											</Badge>
										</Link>
									</TableCell>
									<TableCell className="text-right p-0">
										<Link
											href={`/invoices/${result.id}`}
											className="block font-semibold p-4"
										>
											${(result.value / 100).toFixed(2)}
										</Link>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Container>
		</main>
	);
}
