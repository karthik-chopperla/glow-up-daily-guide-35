
import React from "react";
import { Folder, Download, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecordCardProps {
  name: string;
  date: string; // ISO
  type: string;
  notes?: string;
  fileUrl: string;
  fileName: string;
  onView: () => void;
  onDelete: () => void;
}

export const RecordCard: React.FC<RecordCardProps> = ({
  name,
  date,
  type,
  notes,
  fileUrl,
  fileName,
  onView,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow flex flex-col gap-2 p-4 mb-3 border transition">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-blue-50 p-2">
          <Folder className="text-blue-500" size={22} />
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-800 text-base">{name}</div>
          <div className="text-xs text-gray-500">{date}</div>
        </div>
        <span className="bg-blue-100 px-2 py-1 rounded-full text-xs text-blue-600 font-semibold">{type}</span>
      </div>
      {notes && (
        <div className="text-xs text-gray-500 pl-9">{notes}</div>
      )}
      <div className="flex items-center gap-2 justify-end mt-1">
        <Button size="sm" variant="ghost" onClick={onView} title="View/Download">
          <Download className="w-4 h-4 mr-1" /> <span className="sr-only">Download</span>
        </Button>
        <Button size="sm" variant="ghost" onClick={onDelete} title="Delete" className="text-red-500">
          <Trash className="w-4 h-4" /> <span className="sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
};
