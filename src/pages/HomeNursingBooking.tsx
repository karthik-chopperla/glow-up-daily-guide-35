
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";

const careTypes = [
  "Wound Care",
  "IV Therapy",
  "Post-Surgery",
  "Elderly Care",
  "Long-Term Illness",
  "Rehab",
] as const;
type CareType = typeof careTypes[number];

const nurseDbKey = "home_nursing_bookings";

const HomeNursingBooking: React.FC = () => {
  const nav = useNavigate();
  const [type, setType] = useState<CareType>("Wound Care");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");

  function handleBook() {
    setShowConfirm(true);
  }
  function confirmBook() {
    const bookings = JSON.parse(localStorage.getItem(nurseDbKey) || "[]");
    bookings.push({
      type,
      date: date ? date.toDateString() : "",
      time,
      address,
      created: new Date().toISOString(),
    });
    localStorage.setItem(nurseDbKey, JSON.stringify(bookings));
    setShowConfirm(false);
    setConfirmMsg(`Your nurse is scheduled for ${type} on ${date?.toDateString()} at ${time}.`);
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-4 px-2 bg-gradient-to-br from-yellow-50 to-orange-50">
      <button className="self-start mb-2 ml-2 text-green-700 bg-white rounded-md px-3 py-1 shadow" onClick={() => nav(-1)}>← Back</button>
      <h1 className="text-2xl font-bold mb-2 text-yellow-700 text-center">Book Home Nursing</h1>
      <div className="w-full max-w-md">
        {!showConfirm && !confirmMsg && (
          <Card>
            <CardHeader>
              <CardTitle>Request a Home Nurse</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="font-medium mb-1 block">Service Type</label>
              <select className="w-full border rounded mb-3 p-2" value={type} onChange={(e)=>setType(e.target.value as CareType)}>
                {careTypes.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <label className="font-medium mb-1 block">Date</label>
              <Calendar mode="single" selected={date} onSelect={setDate} className="mb-3"/>
              <label className="font-medium mb-1 block">Time</label>
              <Input value={time} onChange={e=>setTime(e.target.value)} type="time" className="mb-3"/>
              <label className="font-medium mb-1 block">Address</label>
              <Input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Enter address" className="mb-3"/>
              <button
                disabled={!date || !time || !address}
                className="w-full rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 transition text-lg disabled:opacity-50 mt-2"
                onClick={handleBook}
              >Book Nurse</button>
            </CardContent>
          </Card>
        )}
        {showConfirm && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div>Service: <span className="font-semibold">{type}</span></div>
              <div>Date: <span className="font-semibold">{date?.toDateString()}</span></div>
              <div>Time: <span className="font-semibold">{time}</span></div>
              <div>Address: <span className="font-semibold">{address}</span></div>
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-bold mt-2" onClick={confirmBook}>Confirm Booking</button>
              <button className="w-full mt-1 text-gray-500 underline" onClick={()=>setShowConfirm(false)}>Back</button>
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
              <button className="w-full bg-yellow-500 text-white font-semibold px-5 py-2 rounded-lg" onClick={()=>{setConfirmMsg(""); nav("/services");}}>Back to Services</button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HomeNursingBooking;
