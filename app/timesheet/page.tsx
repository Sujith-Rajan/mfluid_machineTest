"use client";

import { useState, useEffect } from "react";

interface TimesheetEntry {
  _id: string;
  date: string;
  hours: number;
  task: string;
  description: string;
  status: string;
}

export default function TimesheetPage() {
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<TimesheetEntry>>({
    date: new Date().toISOString().split("T")[0],
    hours: 8,
    task: "",
    description: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/timesheets");
      const data = await response.json();
      if (response.ok) setEntries(data);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Keep consistent with fetchEntries call if needed, but fetchEntries is better
    fetchEntries();
  }, []);

  const fetchUsers = () => {}; // Dummy to avoid reference errors if any were added

  const handleAddEntry = () => {
    setCurrentEntry({
      date: new Date().toISOString().split("T")[0],
      hours: 8,
      task: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleEditEntry = (entry: TimesheetEntry) => {
    setCurrentEntry({ ...entry, date: entry.date.split("T")[0] });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const isEditing = !!currentEntry._id;
    const url = isEditing ? `/api/timesheets/${currentEntry._id}` : "/api/timesheets";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentEntry),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchEntries();
        alert(isEditing ? "Entry updated!" : "Entry created!");
      } else {
        const data = await response.json();
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      alert("Failed to save entry");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 text-zinc-900 dark:text-zinc-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Timesheet</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Track and manage your daily work hours.</p>
          </div>
          <button
            onClick={handleAddEntry}
            className="px-6 py-3 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg flex items-center gap-2"
          >
            <span>+</span> New Entry
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Total Entries</p>
            <p className="text-3xl font-bold mt-1">{entries.length}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Total Hours</p>
            <p className="text-3xl font-bold mt-1">{entries.reduce((acc, curr) => acc + curr.hours, 0)}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 font-medium uppercase tracking-wider">Avg. Hours/Day</p>
            <p className="text-3xl font-bold mt-1">
              {entries.length ? (entries.reduce((acc, curr) => acc + curr.hours, 0) / entries.length).toFixed(1) : 0}
            </p>
          </div>
        </div>

        {/* Entries Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center space-y-4">
              <div className="h-12 w-12 border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-50 rounded-full animate-spin" />
              <p className="text-zinc-500">Loading your timesheets...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-20 text-center space-y-4">
              <div className="text-5xl text-zinc-300">📅</div>
              <p className="text-zinc-500">No entries yet. Start by adding a new one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                    <th className="p-5 text-sm font-semibold">Date</th>
                    <th className="p-5 text-sm font-semibold">Task</th>
                    <th className="p-5 text-sm font-semibold">Hours</th>
                    <th className="p-5 text-sm font-semibold">Status</th>
                    <th className="p-5 text-sm font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {entries.map((entry) => (
                    <tr key={entry._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="p-5 text-sm font-medium">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-5">
                        <p className="text-sm font-semibold">{entry.task}</p>
                        <p className="text-xs text-zinc-500 truncate max-w-xs">{entry.description}</p>
                      </td>
                      <td className="p-5 text-sm font-bold">{entry.hours}h</td>
                      <td className="p-5">
                        <span
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                            entry.status === "Approved"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : entry.status === "Rejected"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="px-4 py-2 text-xs font-bold border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-50 dark:hover:text-zinc-900 transition-all active:scale-95 shadow-sm"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{currentEntry._id ? "Edit Entry" : "New Timesheet Entry"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50">
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <input
                      type="date"
                      value={currentEntry.date}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, date: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 outline-none focus:ring-2 focus:ring-zinc-900/10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={currentEntry.hours}
                      onChange={(e) => setCurrentEntry({ ...currentEntry, hours: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 outline-none focus:ring-2 focus:ring-zinc-900/10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Task Name</label>
                  <input
                    type="text"
                    placeholder="E.g., UI Development"
                    value={currentEntry.task}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, task: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 outline-none focus:ring-2 focus:ring-zinc-900/10"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    placeholder="Describe what you worked on..."
                    rows={3}
                    value={currentEntry.description}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 outline-none focus:ring-2 focus:ring-zinc-900/10 resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 px-4 py-3 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 rounded-xl font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Entry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
