"use client";
import { useRouter } from 'next/navigation';
import VolunteerCard from '../../../components/VolunteerCard';
import Link from 'next/link';

const volunteerships = [
	{
		id: 1,
		title: 'Community Clean-Up',
		applicants: 15,
		status: 'Open',
		dateRange: 'May 15 - Jun 30, 2024'
	},
	{
		id: 2,
		title: 'Tutoring Program',
		applicants: 8,
		status: 'Open',
		dateRange: 'Jun 1 - Jul 15, 2024'
	},
	{
		id: 3,
		title: 'Animal Shelter Helper',
		applicants: 12,
		status: 'Closed',
		dateRange: 'Jul 1 - Aug 30, 2024'
	}
];

export default function Volunteerships() {
	const router = useRouter();

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
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{volunteerships.map((data) => (
					<VolunteerCard
						key={data.id}
						data={data}
						onViewDetails={() =>
							router.push(`/dashboard/volunteerships/${data.id}`)
						}
					/>
				))}
			</div>
		</div>
	);
}
