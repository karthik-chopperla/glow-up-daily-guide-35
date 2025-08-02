
import React, { useState } from "react";
import BackButton from "../components/BackButton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useApp } from "@/contexts/AppProvider";
import AddMedicineDialog from "../components/MedReminders/AddMedicineDialog";
import ReminderCard from "../components/MedReminders/ReminderCard";
import AdherenceChart from "../components/MedReminders/AdherenceChart";

const MedReminders = () => {
  const { reminders, setReminders } = useApp();
  const [openDialog, setOpenDialog] = useState(false);

  // For editing:
  const [editReminder, setEditReminder] = useState(null);

  const handleDelete = (id: string) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const handleEdit = (reminder: any) => {
    setEditReminder(reminder);
    setOpenDialog(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4 bg-gradient-to-br from-pink-50 to-blue-50">
      <div className="w-full max-w-md">
        <BackButton label="All Services" />
        <h1 className="text-2xl font-bold mb-4 text-pink-600">Medicine Reminders</h1>
        <p className="text-gray-600 mb-4">Track your medicines, refill, and never miss a dose.</p>
        <div className="flex justify-end mb-3">
          <Button
            onClick={() => { setOpenDialog(true); setEditReminder(null); }}
            className="gap-2"
          >
            <Plus /> Add Medicine
          </Button>
        </div>
        <AddMedicineDialog
          open={openDialog}
          setOpen={setOpenDialog}
          editReminder={editReminder}
        />
        {reminders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 min-h-[160px] flex items-center justify-center text-gray-400">
            No medicines added yet.
          </div>
        ) : (
          <div className="space-y-2">
            {reminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onEdit={() => handleEdit(reminder)}
                onDelete={() => handleDelete(reminder.id)}
              />
            ))}
          </div>
        )}
        <div className="mt-8">
          <AdherenceChart />
        </div>
      </div>
    </div>
  );
};

export default MedReminders;
