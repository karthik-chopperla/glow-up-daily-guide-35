import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { useApp, Reminder } from "@/contexts/AppProvider";
import { v4 as uuidv4 } from "uuid";

type AddMedicineDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  editReminder: Reminder | null;
};

const frequencies = [
  "Once daily",
  "Twice daily",
  "Thrice daily",
  "Alternate days",
  "Custom",
];

const defaultTimes = {
  "Once daily": ["08:00"],
  "Twice daily": ["08:00", "20:00"],
  "Thrice daily": ["08:00", "14:00", "20:00"],
  "Alternate days": ["08:00"],
};

const AddMedicineDialog: React.FC<AddMedicineDialogProps> = ({
  open,
  setOpen,
  editReminder,
}) => {
  const { reminders, setReminders } = useApp();
  const { register, watch, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      name: "",
      dose: "",
      frequency: "Once daily",
      times: ["08:00"],
      autoRefill: false,
    },
  });

  useEffect(() => {
    if (editReminder) {
      // Ensure frequency is always part of the editReminder passed in
      reset({
        name: editReminder.name ?? "",
        dose: editReminder.dose ?? "",
        frequency: editReminder.frequency ?? "Once daily",
        times: editReminder.times ?? ["08:00"],
        autoRefill: editReminder.autoRefill ?? false,
      });
    } else {
      reset({
        name: "",
        dose: "",
        frequency: "Once daily",
        times: ["08:00"],
        autoRefill: false,
      });
    }
  }, [editReminder, reset, open]);

  const frequency = watch("frequency");
  useEffect(() => {
    if (
      frequency !== "Custom" &&
      defaultTimes[frequency as keyof typeof defaultTimes]
    ) {
      setValue("times", defaultTimes[frequency as keyof typeof defaultTimes]);
    }
  }, [frequency, setValue]);

  const onSubmit = (values: any) => {
    // Always save frequency as a string on the reminder object
    if (editReminder) {
      setReminders(
        reminders.map((r) =>
          r.id === editReminder.id ? { ...r, ...values, frequency: values.frequency } : r
        )
      );
    } else {
      setReminders([
        ...reminders,
        {
          ...values,
          frequency: values.frequency, // explicitly set frequency
          id: uuidv4(),
          taken: {},
        },
      ]);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editReminder ? "Edit Medicine" : "Add Medicine"}
          </DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4 mt-4"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <Input {...register("name", { required: true })} placeholder="Medicine Name" />
          <Input {...register("dose")} placeholder="Dosage (e.g. 500mg)" />
          <select
            {...register("frequency")}
            className="p-2 border rounded bg-background"
          >
            {frequencies.map((f) => (
              <option value={f} key={f}>{f}</option>
            ))}
          </select>
          {frequency === "Custom" ? (
            <Input
              {...register(`times.0`)}
              placeholder="Enter times (e.g. 09:00, 14:00)"
              onChange={e => {
                setValue("times", e.target.value.split(",").map((x: string) => x.trim()));
              }}
            />
          ) : (
            (defaultTimes[frequency as keyof typeof defaultTimes] || []).map(
              (time, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    type="time"
                    {...register(`times.${idx}`)}
                    className="w-full"
                    defaultValue={time}
                  />
                </div>
              )
            )
          )}
          <div className="flex items-center gap-2">
            <Switch {...register("autoRefill")} id="autoRefill" />
            <label htmlFor="autoRefill" className="text-sm">
              Enable refill alert when stock is low
            </label>
          </div>
          <Button type="submit" className="w-full">
            {editReminder ? "Save Changes" : "Add Medicine"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicineDialog;
