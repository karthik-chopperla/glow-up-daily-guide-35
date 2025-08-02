
import React from "react";
import { Reminder, useApp } from "@/contexts/AppProvider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Bell, BellOff } from "lucide-react";

// Helper: capitalize first letter
function cap(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const ReminderCard: React.FC<{
  reminder: Reminder;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ reminder, onEdit, onDelete }) => {
  const { setReminders, reminders } = useApp();

  // Notification enabled state (local for now)
  const [notifOn, setNotifOn] = React.useState(true);
  const [refillAlert, setRefillAlert] = React.useState(reminder.autoRefill);

  const handleRefillToggle = (checked: boolean) => {
    setRefillAlert(checked);
    setReminders(
      reminders.map((r) =>
        r.id === reminder.id ? { ...r, autoRefill: checked } : r
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow flex flex-col px-4 py-3">
      <div className="flex justify-between items-center mb-1">
        <div className="font-bold text-pink-600">{reminder.name}</div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Edit size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
      <div className="mb-1 text-sm text-gray-600">{reminder.dose}</div>
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="bg-pink-50 text-pink-700 px-2 py-0.5 rounded text-xs">
          {reminder.frequency}
        </span>
        {reminder.times.map((t: string, i: number) => (
          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs" key={i}>
            {t}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex gap-3 items-center">
          <span className="flex items-center gap-1">
            <Switch
              checked={notifOn}
              onCheckedChange={setNotifOn}
              id={`notif-${reminder.id}`}
            />
            {notifOn ? (
              <>
                <Bell className="ml-1 w-4 h-4" /> <span>On</span>
              </>
            ) : (
              <>
                <BellOff className="ml-1 w-4 h-4" /> <span>Off</span>
              </>
            )}
            <span className="ml-1">Notifications</span>
          </span>
          <span className="flex items-center gap-1">
            <Switch
              checked={refillAlert}
              onCheckedChange={handleRefillToggle}
              id={`refill-${reminder.id}`}
            />
            <span>Refill alert</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
