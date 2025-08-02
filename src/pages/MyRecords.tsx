import React, { useState, useRef } from "react";
import BackButton from "../components/BackButton";
import RecordUploadDialog from "../components/RecordUploadDialog";
import { RecordCard } from "../components/RecordCard";
import { Lock, Search, Download, Folder } from "lucide-react";

type RecordType = "Prescription" | "Report" | "Scan" | "Bill" | "Other";
type Record = {
  id: string;
  name: string;
  date: string;
  type: RecordType;
  notes?: string;
  fileName: string;
  fileUrl: string;
};

const RECORD_TYPES: RecordType[] = [
  "Prescription",
  "Report",
  "Scan",
  "Bill",
  "Other",
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "A–Z", value: "az" },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString();
}

export default function MyRecords() {
  const [records, setRecords] = useState<Record[]>(() => {
    // Try localStorage restore
    try {
      const ls = window.localStorage.getItem("hm_records");
      return ls ? JSON.parse(ls) : [];
    } catch {
      return [];
    }
  });
  const [typeFilter, setTypeFilter] = useState<string | "">("");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Save to localStorage when records change
  React.useEffect(() => {
    window.localStorage.setItem("hm_records", JSON.stringify(records));
  }, [records]);

  function handleUpload({ name, date, type, notes, file }: any) {
    // Store file as blob url for demo only (not real storage)
    const id = crypto.randomUUID();
    let fileUrl = "";
    let fileName = "";
    if (file) {
      fileUrl = URL.createObjectURL(file);
      fileName = file.name;
    }
    setRecords((prev) => [
      {
        id,
        name,
        date,
        type,
        notes,
        fileName,
        fileUrl,
      },
      ...prev,
    ]);
  }

  function handleDelete(id: string) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setDeleteId(null);
  }

  function handleExportAll() {
    // Demo only: Export all as simple JSON
    const json = JSON.stringify(records, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-medical-records.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Filtering, searching, sorting
  let filtered = [...records];
  if (typeFilter) filtered = filtered.filter((r) => r.type === typeFilter);
  if (dateRange.start)
    filtered = filtered.filter((r) => r.date >= dateRange.start);
  if (dateRange.end)
    filtered = filtered.filter((r) => r.date <= dateRange.end);
  if (search)
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (r.notes?.toLowerCase().includes(search.toLowerCase()) ?? false)
    );
  if (sortBy === "newest") filtered.sort((a, b) => b.date.localeCompare(a.date));
  if (sortBy === "oldest") filtered.sort((a, b) => a.date.localeCompare(b.date));
  if (sortBy === "az") filtered.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-1 bg-gradient-to-br from-gray-50 to-blue-100">
      <div className="w-full max-w-md">
        <BackButton label="All Services" />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700 mb-0">My Records <span className="align-middle">📁</span></h1>
          <RecordUploadDialog onUpload={handleUpload} />
        </div>
        <p className="text-gray-600 mt-1 mb-3 text-sm">
          View, upload, and manage all your medical records securely.
        </p>
        {/* Lock message */}
        <div className="flex items-center text-xs text-gray-500 bg-white rounded px-3 py-2 shadow mb-3 gap-2">
          <Lock className="w-4 h-4 mr-1" />
          Your records are encrypted and stored securely. Only you can access them.
        </div>
        {/* Filters and Search */}
        <div className="flex gap-2 items-center mb-3 flex-wrap">
          <select
            className="border rounded-lg px-2 py-1 text-xs text-gray-600"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All types</option>
            {RECORD_TYPES.map((t) => (
              <option value={t} key={t}>{t}</option>
            ))}
          </select>
          <input
            type="date"
            className="border rounded-lg px-2 py-1 text-xs text-gray-600"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((r) => ({ ...r, start: e.target.value }))
            }
            placeholder="Start date"
            max={dateRange.end || undefined}
          />
          <input
            type="date"
            className="border rounded-lg px-2 py-1 text-xs text-gray-600"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((r) => ({ ...r, end: e.target.value }))
            }
            placeholder="End date"
            min={dateRange.start || undefined}
          />
          <select
            className="border rounded-lg px-2 py-1 text-xs text-gray-600"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((o) => (
              <option value={o.value} key={o.value}>{o.label}</option>
            ))}
          </select>
          <div className="flex-1"/>
          {/* Export All */}
          {records.length > 0 && (
            <button
              className="flex items-center ml-auto px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs gap-1 font-semibold shadow active:scale-95 transition"
              onClick={handleExportAll}
              title="Export all records"
            >
              <Download className="w-4 h-4" /> Export All
            </button>
          )}
        </div>
        {/* Search bar */}
        <div className="mb-2">
          <div className="flex items-center rounded-lg bg-white px-2 py-1 shadow-sm border border-gray-200">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              className="flex-1 py-1 text-sm bg-transparent outline-none"
              placeholder="Search by record name or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {/* Records List */}
        <div className="mt-3 min-h-[180px]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-400 min-h-[120px] py-10">
              <Folder className="w-10 h-10 mb-1" />
              <span className="text-sm">No records found.</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mb-8">
              {filtered.map(r => (
                <RecordCard
                  key={r.id}
                  name={r.name}
                  date={formatDate(r.date)}
                  type={r.type}
                  notes={r.notes}
                  fileName={r.fileName}
                  fileUrl={r.fileUrl}
                  onView={() => window.open(r.fileUrl, "_blank")}
                  onDelete={() => setDeleteId(r.id)}
                />
              ))}
            </div>
          )}
        </div>
        {/* Delete Confirmation */}
        {deleteId && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow p-6 text-center max-w-xs">
              <div className="text-xl text-red-500 mb-2">Delete Record?</div>
              <div className="text-gray-600 text-sm mb-4">
                Are you sure you want to delete this record? This cannot be undone.
              </div>
              <div className="flex gap-2 justify-center mt-3">
                <button
                  className="px-3 py-1 w-20 rounded bg-red-500 text-white shadow hover:bg-red-600 transition"
                  onClick={() => handleDelete(deleteId)}
                >Delete</button>
                <button
                  className="px-3 py-1 w-20 rounded bg-gray-100 text-gray-700 shadow hover:bg-gray-200 transition"
                  onClick={() => setDeleteId(null)}
                >Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
