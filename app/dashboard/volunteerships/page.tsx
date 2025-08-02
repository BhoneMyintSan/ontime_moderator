"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VolunteerCard from "../../../components/cards/VolunteerCard";
import mockVolunteerships from "../../../data/mockVolunteerships";

interface Volunteership {
	id: string;
	title: string;
	status: string;
	dateRange: string;
	applicants: any[];
}

export default function VolunteershipsPage() {
	const [volunteers, setVolunteers] = useState<Volunteership[]>(mockVolunteerships);
	const router = useRouter();

	const handleViewDetails = (id: string) => {
		router.push(`/dashboard/volunteerships/${id}`);
	};

	return (
		<div className="max-w-6xl mx-auto mt-10 px-2 sm:px-4">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
				<h1 className="text-2xl sm:text-3xl font-bold text-white">
					Volunteer Activity
				</h1>
				<Link href="/dashboard/volunteerships/new">
					<button className="bg-[#6366f1] hover:bg-[#4f46e5] px-5 py-2 rounded-lg text-white font-semibold text-base shadow transition w-full sm:w-auto">
						+ New Activity
					</button>
				</Link>
			</div>
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{volunteers.map((v) => (
					<VolunteerCard
						key={v.id}
						data={{
							...v,
							applicants: v.applicants.length // Pass count for card
						}}
						onViewDetails={() => handleViewDetails(v.id)}
					/>
				))}
			</div>
		</div>
	);
}