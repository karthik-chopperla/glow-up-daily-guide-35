
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  doctorName: string;
}

const timeSlots = [
  "09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"
];

const BookingModal: React.FC<BookingModalProps> = ({ open, onClose, doctorName }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [confirmed, setConfirmed] = useState(false);

  const handleBook = () => {
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 1800);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogTitle>
          <span role="img" aria-label="Doctor">🗓️</span> Book Appointment with {doctorName}
        </DialogTitle>
        {!confirmed ? (
          <>
            {/* Date Picker */}
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Select date</label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">Select time</label>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map(t => (
                  <Button
                    key={t}
                    variant={t === selectedTime ? "default" : "outline"}
                    size="sm"
                    className="px-3 py-1"
                    onClick={() => setSelectedTime(t)}
                  >{t}</Button>
                ))}
              </div>
            </div>
            <Button disabled={!selectedDate || !selectedTime} className="w-full mt-2" onClick={handleBook}>Confirm Booking</Button>
          </>
        ) : (
          <div className="text-center p-5">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-green-700 font-medium">Appointment booked successfully!</div>
            <div className="mt-1 text-gray-600 text-sm">
              {selectedDate && selectedTime && (
                <>For <b>{format(selectedDate, "PPP")}</b> at <b>{selectedTime}</b></>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
