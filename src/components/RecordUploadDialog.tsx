
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

const RECORD_TYPES = [
  "Prescription",
  "Report",
  "Scan",
  "Bill",
  "Other",
];

type NewRecord = {
  name: string;
  date: string; // ISO string
  type: string;
  notes: string;
  file: File | null;
};

interface RecordUploadDialogProps {
  onUpload: (r: NewRecord) => void;
}

const RecordUploadDialog: React.FC<RecordUploadDialogProps> = ({ onUpload }) => {
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState<NewRecord>({
    name: "",
    date: "",
    type: "",
    notes: "",
    file: null,
  });

  const [fileLabel, setFileLabel] = useState("Choose file...");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setRecord((r) => ({ ...r, [name]: value }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setRecord((r) => ({ ...r, file }));
    setFileLabel(file ? file.name : "Choose file...");
  }

  function handleDate(e: React.ChangeEvent<HTMLInputElement>) {
    setRecord((r) => ({ ...r, date: e.target.value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!record.name || !record.date || !record.type || !record.file) return;
    onUpload(record);
    setOpen(false);
    setRecord({
      name: "",
      date: "",
      type: "",
      notes: "",
      file: null,
    });
    setFileLabel("Choose file...");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="font-semibold px-4 py-2 rounded-lg shadow mb-3">
          + Upload New Record
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Upload Medical Record</DialogTitle>
        <form className="space-y-4 mt-2" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium mb-1">Record Name</label>
            <Input name="name" required value={record.name} maxLength={40} onChange={handleChange} placeholder="e.g. CBC Blood Report"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Record Date</label>
            <Input
              type="date"
              name="date"
              required
              value={record.date}
              onChange={handleDate}
              max={format(new Date(), "yyyy-MM-dd")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Record Type</label>
            <select
              name="type"
              required
              value={record.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring"
            >
              <option value="" disabled>Select type</option>
              {RECORD_TYPES.map((t) => (
                <option value={t} key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">File (PDF, image, scan)</label>
            <input
              type="file"
              required
              accept=".pdf,image/*"
              name="file"
              onChange={handleFile}
              className="w-full block text-sm border border-gray-300 rounded-lg bg-white px-3 py-1.5"
            />
            <span className="block text-xs text-gray-500 mt-1">{fileLabel}</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea
              name="notes"
              value={record.notes}
              onChange={handleChange}
              className="w-full min-h-[56px] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring"
              maxLength={200}
              placeholder="Extra info (optional)"
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full mt-4">
              Upload Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecordUploadDialog;
