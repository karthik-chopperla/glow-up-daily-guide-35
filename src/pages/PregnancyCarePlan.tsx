
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";

const careDbKey = "pregnancy_sub_status";
const bookingDbKey = "preggy_bookings";
const dummyGyneDrs = [
  { name: "Dr. Aparna Joshi", online: true, rating: 4.6 },
  { name: "Dr. Nivedita Patil", online: false, rating: 4.7 },
];

const PregnancyCarePlan: React.FC = () => {
  const nav = useNavigate();
  const [active, setActive] = useState(
    () => localStorage.getItem(careDbKey) === "active"
  );
  const [bookingDate, setBookingDate] = useState<Date>();
  const [bookingDrIdx, setBookingDrIdx] = useState(0);
  const [bookingTime, setBookingTime] = useState("");
  const [showBkConfirm, setShowBkConfirm] = useState(false);
  const [section, setSection] = useState<"overview" | "prenatal" | "postnatal" | "delivery">("overview");
  const [confirmMsg, setConfirmMsg] = useState("");

  function purchase() {
    setActive(true);
    localStorage.setItem(careDbKey, "active");
  }
  function bookPrenatal() {
    setShowBkConfirm(true);
  }
  function confirmPrenatal() {
    const arr = JSON.parse(localStorage.getItem(bookingDbKey) || "[]");
    arr.push({
      type: "prenatal",
      dr: dummyGyneDrs[bookingDrIdx].name,
      date: bookingDate ? bookingDate.toDateString() : "",
      time: bookingTime,
      created: new Date().toISOString(),
    });
    localStorage.setItem(bookingDbKey, JSON.stringify(arr));
    setShowBkConfirm(false);
    setConfirmMsg(`Online check-up booked with ${dummyGyneDrs[bookingDrIdx].name} on ${bookingDate?.toDateString()} at ${bookingTime}.`);
  }

  // Delivery booking (simplified, same as prenatal)
  function bookDelivery() {
    setShowBkConfirm(true);
  }
  function confirmDelivery() {
    const arr = JSON.parse(localStorage.getItem(bookingDbKey) || "[]");
    arr.push({
      type: "delivery",
      deliveryType: "Normal",
      date: bookingDate ? bookingDate.toDateString() : "",
      time: bookingTime,
      created: new Date().toISOString(),
    });
    localStorage.setItem(bookingDbKey, JSON.stringify(arr));
    setShowBkConfirm(false);
    setConfirmMsg(`Hospital delivery slot booked for ${bookingDate?.toDateString()} at ${bookingTime}.`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-4 px-2 bg-gradient-to-br from-pink-50 to-red-50">
      <button className="self-start mb-2 ml-2 text-green-700 bg-white rounded-md px-3 py-1 shadow" onClick={() => nav(-1)}>← Back</button>
      <h1 className="text-2xl font-bold mb-2 text-pink-700 text-center">Pregnancy Care Plan</h1>
      <div className="w-full max-w-md">
        {section === "overview" && (
          <Card>
            <CardHeader>
              <CardTitle>One-year Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3 text-gray-900">
                {active ? (
                  <span className="text-green-700 font-semibold">Active</span>
                ) : (
                  <span className="text-red-600 font-semibold">Expired</span>
                )}
              </div>
              <ul className="list-disc ml-5 mb-3 text-gray-700 text-sm">
                <li>Prenatal: Online gynecologist chats, nutrition tips, safe exercises</li>
                <li>Delivery: Hospital/maternity, ultrasound & check-up bookings</li>
                <li>Postnatal: Mother recovery plan, 12mo reminders, diet</li>
              </ul>
              {active ? (
                <div className="flex gap-2 flex-wrap">
                  <button className="bg-emerald-400 px-4 py-2 rounded-lg text-white mb-2" onClick={()=>setSection("prenatal")}>Prenatal Support</button>
                  <button className="bg-indigo-400 px-4 py-2 rounded-lg text-white mb-2" onClick={()=>setSection("delivery")}>Hospital & Delivery</button>
                  <button className="bg-pink-400 px-4 py-2 rounded-lg text-white mb-2" onClick={()=>setSection("postnatal")}>Postnatal Support</button>
                </div>
              ) : (
                <button className="w-full bg-pink-500 px-4 py-2 rounded-lg text-white font-bold" onClick={purchase}>Purchase for ₹4999/yr</button>
              )}
            </CardContent>
          </Card>
        )}
        {section === "prenatal" && (
          <Card>
            <CardHeader>
              <CardTitle>Prenatal Online Check-up</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="block mb-1">Select Doctor</label>
              <select className="w-full border rounded mb-2 p-2" value={bookingDrIdx} onChange={e=>setBookingDrIdx(Number(e.target.value))}>
                {dummyGyneDrs.map((d,i)=>
                  <option key={i} value={i}>{d.name} {d.online?"(Online)":"(Unavailable)"} ⭐{d.rating}</option>
                )}
              </select>
              <label className="block mb-1">Date</label>
              <Calendar mode="single" selected={bookingDate} onSelect={setBookingDate} className="mb-2" />
              <label className="block mb-1">Time</label>
              <input className="w-full border rounded p-2 mb-3" type="time" value={bookingTime} onChange={e=>setBookingTime(e.target.value)}/>
              <button disabled={!bookingDate || !bookingTime} className="bg-emerald-500 px-4 py-2 rounded-lg text-white w-full font-semibold mt-1 disabled:opacity-50" onClick={bookPrenatal}>Book Prenatal Check-up</button>
              <button className="w-full mt-2 underline text-gray-500" onClick={()=>setSection("overview")}>Back</button>
            </CardContent>
          </Card>
        )}
        {section === "delivery" && (
          <Card>
            <CardHeader>
              <CardTitle>Hospital Delivery Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="block mb-1">Delivery Type</label>
              <select className="w-full border rounded mb-2 p-2">
                <option>Normal</option>
                <option>C-Section</option>
              </select>
              <label className="block mb-1">Date</label>
              <Calendar mode="single" selected={bookingDate} onSelect={setBookingDate} className="mb-2" />
              <label className="block mb-1">Time</label>
              <input className="w-full border rounded p-2 mb-3" type="time" value={bookingTime} onChange={e=>setBookingTime(e.target.value)}/>
              <button disabled={!bookingDate || !bookingTime} className="bg-indigo-500 px-4 py-2 rounded-lg text-white w-full font-semibold mt-1 disabled:opacity-50" onClick={bookDelivery}>Book Delivery Slot</button>
              <button className="w-full mt-2 underline text-gray-500" onClick={()=>setSection("overview")}>Back</button>
            </CardContent>
          </Card>
        )}
        {section === "postnatal" && (
          <Card>
            <CardHeader>
              <CardTitle>Postnatal Support</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">Mother recovery guidance, diet plan, and 12 months of auto-scheduled reminders.</div>
              <ul className="list-disc ml-6 text-gray-700 text-sm mb-3">
                <li>Recovery guidance via app</li>
                <li>Diet plan download</li>
                <li>View/check reminders</li>
              </ul>
              <button className="w-full mt-2 underline text-gray-500" onClick={()=>setSection("overview")}>Back</button>
            </CardContent>
          </Card>
        )}
        {showBkConfirm && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div>Doctor: <span className="font-semibold">{dummyGyneDrs[bookingDrIdx].name}</span></div>
              <div>Date: <span className="font-semibold">{bookingDate?.toDateString()}</span></div>
              <div>Time: <span className="font-semibold">{bookingTime}</span></div>
              <button className="w-full bg-emerald-500 px-4 py-2 rounded-lg text-white font-bold mt-2" onClick={confirmPrenatal}>Confirm Booking</button>
              <button className="w-full mt-1 text-gray-500 underline" onClick={()=>setShowBkConfirm(false)}>Back</button>
            </CardContent>
          </Card>
        )}
        {confirmMsg && (
          <Card>
            <CardHeader>
              <CardTitle>Booking Confirmed!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">{confirmMsg}</div>
              <button className="w-full bg-pink-400 text-white font-semibold px-5 py-2 rounded-lg" onClick={()=>{setConfirmMsg(""); nav("/services");}}>Back to Services</button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PregnancyCarePlan;
