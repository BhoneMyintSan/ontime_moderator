"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VolunteerCard from "../../../components/VolunteerCard";

const initialVolunteers = [
	{
		id: "1",
		title: "Community Clean-Up",
		status: "Open",
		dateRange: "May 15, 2024",
		applicants: [
			{ name: "Anna Brown", email: "anna.b@email.com", showUp: true },
			{ name: "James Smith", email: "james.s@email.com", showUp: true },
			{ name: "Emily Johnson", email: "emily.j@email.com", showUp: true }
		],
		maxParticipants: 5
	},
	{
		id: "2",
		title: "Tutoring Program",
		status: "Open",
		dateRange: "Jun 1 - Jul 15, 2024",
		applicants: [
			{ name: "Michael Brown", email: "michael.b@email.com", showUp: true },
			{ name: "Jessica Davis", email: "jessica.d@email.com", showUp: true }
		],
		maxParticipants: 3
	},
	{
		id: "3",
		title: "Animal Shelter Helper",
		status: "Closed",
		dateRange: "Jul 1 - Aug 30, 2024",
		applicants: [
			{ name: "William Wilson", email: "william.w@email.com", showUp: true },
			{ name: "Sophia Miller", email: "sophia.m@email.com", showUp: true },
			{ name: "Olivia Moore", email: "olivia.m@email.com", showUp: true }
		],
		maxParticipants: 4
	}
];

export default function VolunteershipsPage() {
	const [volunteers, setVolunteers] = useState(initialVolunteers);
	const router = useRouter();

	const handleViewDetails = (id) => {
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
