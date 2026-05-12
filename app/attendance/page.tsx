"use client";

import { useState, useEffect } from "react";

interface AttendanceRecord {
  _id: string;
  date: string;
  checkIn: string;
  checkOut?: string;
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchRecords = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await fetch(`/api/attendance?userId=${userId}`);
      const data = await response.json();
      if (response.ok) setRecords(data);
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAction = async (type: "check-in" | "check-out") => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/attendance/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        fetchRecords();
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert(`Failed to ${type}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const hasCheckedInToday = records.length > 0 && 
    records[0].date === new Date().toISOString().split("T")[0] && 
    !records[0].checkOut;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8 text-zinc-900 dark:text-zinc-50">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header & Clock */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Attendance Tracking</h1>
          <div className="flex flex-col items-center">
            <p className="text-6xl font-mono font-bold tracking-widest text-zinc-900 dark:text-zinc-50">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </p>
            <p className="text-zinc-500 font-medium">
              {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button
            onClick={() => handleAction("check-in")}
            disabled={isProcessing || hasCheckedInToday}
            className={`group relative h-48 rounded-3xl flex flex-col items-center justify-center space-y-4 transition-all duration-300 shadow-xl overflow-hidden ${
              hasCheckedInToday 
                ? "bg-zinc-100 dark:bg-zinc-900 cursor-not-allowed opacity-50" 
                : "bg-white dark:bg-zinc-900 hover:scale-[1.02] active:scale-95 ring-2 ring-transparent hover:ring-zinc-900/10 dark:hover:ring-zinc-50/10"
            }`}
          >
            <div className={`text-4xl ${hasCheckedInToday ? "grayscale" : "animate-pulse"}`}>📍</div>
            <div className="text-center">
              <p className="text-xl font-bold">Check In</p>
              <p className="text-sm text-zinc-500">Record your arrival time</p>
            </div>
            {hasCheckedInToday && (
              <div className="absolute top-4 right-4 bg-green-500 h-3 w-3 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
            )}
          </button>

          <button
            onClick={() => handleAction("check-out")}
            disabled={isProcessing || !hasCheckedInToday}
            className={`group relative h-48 rounded-3xl flex flex-col items-center justify-center space-y-4 transition-all duration-300 shadow-xl overflow-hidden ${
              !hasCheckedInToday 
                ? "bg-zinc-100 dark:bg-zinc-900 cursor-not-allowed opacity-50" 
                : "bg-white dark:bg-zinc-900 hover:scale-[1.02] active:scale-95 ring-2 ring-transparent hover:ring-zinc-900/10 dark:hover:ring-zinc-50/10"
            }`}
          >
            <div className="text-4xl">🚪</div>
            <div className="text-center">
              <p className="text-xl font-bold">Check Out</p>
              <p className="text-sm text-zinc-500">Record your departure time</p>
            </div>
          </button>
        </div>

        {/* Attendance History */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recent Activity</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {isLoading ? (
              <div className="p-12 text-center text-zinc-500">Loading history...</div>
            ) : records.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">No attendance records found.</div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {records.map((record) => (
                  <div key={record._id} className="p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                    <div className="space-y-1">
                      <p className="font-bold">
                        {new Date(record.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
                        {new Date(record.date).toLocaleDateString([], { weekday: 'long' })}
                      </p>
                    </div>
                    <div className="flex gap-8">
                      <div className="text-right">
                        <p className="text-xs text-zinc-400 font-medium">In</p>
                        <p className="font-mono font-bold">
                          {new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-400 font-medium">Out</p>
                        <p className="font-mono font-bold">
                          {record.checkOut 
                            ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : "--:--"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
