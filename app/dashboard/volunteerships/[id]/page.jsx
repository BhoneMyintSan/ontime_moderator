'use client';

import { useParams, useRouter } from 'next/navigation';
import { FiDownload } from 'react-icons/fi';
import { useState } from 'react';
import mockVolunteerships from '../../../../data/mockVolunteerships';

export default function VolunteershipDetail() {
  const { id } = useParams();
  const router = useRouter();

  // Find the correct volunteership by id
  const volunteershipData = mockVolunteerships.find(v => v.id === id) || mockVolunteerships[0];

  // State
  const [applicants, setApplicants] = useState(volunteershipData.applicants);
  const [status, setStatus] = useState(volunteershipData.status);
  const [editMode, setEditMode] = useState(false);
  const [editInfo, setEditInfo] = useState({
    organization: volunteershipData.organization || "",
    description: volunteershipData.description || "",
    logistics: volunteershipData.logistics || "",
    requirements: volunteershipData.requirements || "",
    tokenReward: volunteershipData.tokenReward || "",
    contact: volunteershipData.contact || "",
  });

  // Handlers
  const toggleShowUp = (index) => {
    setApplicants((prev) =>
      prev.map((a, i) =>
        i === index ? { ...a, showUp: !a.showUp } : a
      )
    );
  };

  const handleRemove = (index) => {
    const applicant = applicants[index];
    if (
      window.confirm(
        `Are you sure you want to remove ${applicant.name} (${applicant.email}) from the participants?`
      )
    ) {
      setApplicants((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleInfoChange = (e) => {
    setEditInfo({ ...editInfo, [e.target.name]: e.target.value });
  };

  const saveInfo = () => {
    // In a real app, update the backend here
    setEditMode(false);
  };

  const spotsLeft = volunteershipData.maxParticipants - applicants.length;

  // Render
  return (
    <div className="max-w-4xl mx-auto bg-[#23233a] p-4 sm:p-8 rounded-2xl mt-10 shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{volunteershipData.title}</h1>
          <p className="text-[#b3b3c6] font-semibold mb-2">{volunteershipData.dateRange}</p>
          <p className="text-[#b3b3c6] text-sm">
            Max Participants: <span className="font-bold text-white">{volunteershipData.maxParticipants}</span> &nbsp;|&nbsp;
            Spots Left: <span className={`font-bold ${spotsLeft === 0 ? "text-red-400" : "text-green-400"}`}>{spotsLeft}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            className={`px-5 py-2 rounded-lg font-semibold shadow transition mb-2
              ${status === "Open"
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-red-500 text-white hover:bg-red-600"
              }`}
            onClick={() => setStatus(status === "Open" ? "Closed" : "Open")}
          >
            {status === "Open" ? "Open" : "Closed"}
          </button>
          <button className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f46e5] px-5 py-2 rounded-lg text-white font-semibold shadow transition">
            <FiDownload />
            Download List
          </button>
        </div>
      </div>

      {/* Volunteership Info */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg sm:text-xl font-bold text-white">Volunteership Information</h2>
          {!editMode && (
            <button
              className="px-4 py-1 rounded bg-[#6366f1] text-white text-sm"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
          )}
        </div>
        {editMode ? (
          <div className="space-y-3">
            <input
              className="w-full px-3 py-2 rounded bg-[#23233a] border border-[#6366f1] text-white"
              name="organization"
              value={editInfo.organization}
              onChange={handleInfoChange}
              placeholder="Organization"
            />
            <textarea
              className="w-full px-3 py-2 rounded bg-[#23233a] border border-[#6366f1] text-white"
              name="description"
              value={editInfo.description}
              onChange={handleInfoChange}
              placeholder="Description"
            />
            <input
              className="w-full px-3 py-2 rounded bg-[#23233a] border border-[#6366f1] text-white"
              name="logistics"
              value={editInfo.logistics}
              onChange={handleInfoChange}
              placeholder="Logistics"
            />
            <input
              className="w-full px-3 py-2 rounded bg-[#23233a] border border-[#6366f1] text-white"
              name="requirements"
              value={editInfo.requirements}
              onChange={handleInfoChange}
              placeholder="Requirements"
            />
            <input
              className="w-full px-3 py-2 rounded bg-[#23233a] border border-[#6366f1] text-white"
              name="tokenReward"
              value={editInfo.tokenReward}
              onChange={handleInfoChange}
              placeholder="Token Reward"
              type="number"
            />
            <input
              className="w-full px-3 py-2 rounded bg-[#23233a] border border-[#6366f1] text-white"
              name="contact"
              value={editInfo.contact}
              onChange={handleInfoChange}
              placeholder="Contact Information"
            />
            <div className="flex gap-2">
              <button
                className="px-4 py-1 rounded bg-green-500 text-white"
                onClick={saveInfo}
              >
                Save
              </button>
              <button
                className="px-4 py-1 rounded bg-gray-500 text-white"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-[#b3b3c6] space-y-1">
            <div><b>Organization:</b> {volunteershipData.organization}</div>
            <div><b>Description:</b> {volunteershipData.description}</div>
            <div><b>Logistics:</b> {volunteershipData.logistics}</div>
            <div><b>Requirements:</b> {volunteershipData.requirements}</div>
            <div><b>Token Reward:</b> {volunteershipData.tokenReward}</div>
            <div><b>Contact:</b> {volunteershipData.contact}</div>
          </div>
        )}
      </div>

      {/* Applicants Table */}
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
        Applicants ({applicants.length}/{volunteershipData.maxParticipants})
      </h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full text-base mb-2 min-w-[500px]">
          <thead>
            <tr className="text-[#b3b3c6] text-left border-b border-[#29294d]">
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Email</th>
              <th className="p-3 font-semibold">Show Up</th>
              <th className="p-3 font-semibold">Remove</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a, i) => (
              <tr key={i} className="border-b border-[#29294d] hover:bg-[#252540] transition-colors">
                <td className="p-3 font-semibold text-white">{a.name}</td>
                <td className="p-3 text-white">Applied</td>
                <td className="p-3">
                  <a href={`mailto:${a.email}`} className="text-[#8ab4f8] hover:underline">{a.email}</a>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => toggleShowUp(i)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition
                      ${a.showUp ? "bg-green-400 text-white" : "bg-gray-500 text-white"}`}
                    title={a.showUp ? "Mark as not shown" : "Mark as shown"}
                  >
                    {a.showUp ? "✔" : "✖"}
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleRemove(i)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition"
                    title="Remove participant"
                  >
                    &times;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-[#b3b3c6] px-2 py-2 gap-2">
          <span>Showing 1-{applicants.length} of {applicants.length} applicants</span>
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded bg-[#23233a] text-white border border-[#29294d]">1</button>
            <button className="w-8 h-8 rounded bg-[#23233a] text-white border border-[#29294d]">2</button>
            <button className="w-8 h-8 rounded bg-[#23233a] text-white border border-[#29294d]">3</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
        <button
          className="bg-[#29294d] px-8 py-2 rounded-lg text-white font-semibold shadow transition"
          onClick={() => router.push('/dashboard/volunteerships')}
        >
          Back
        </button>
      </div>
    </div>
  );
}
