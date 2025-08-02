
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

type VideoBooking = { type: "video"; date: string | null; time: string; fee: number; };
type HospBooking = { type: "hospital"; hospital: string; specialist: string; date: string | null; time: string; };

const mentalDbKey = "mental_health_bookings";

// Helper: Save to localStorage
function saveBooking(b: VideoBooking | HospBooking) {
  const ex = JSON.parse(localStorage.getItem(mentalDbKey) || "[]");
  ex.push({ ...b, saved: new Date().toISOString() });
  localStorage.setItem(mentalDbKey, JSON.stringify(ex));
}

const hospitals = [
  { id: 1, name: "City Hospital", specialist: "Dr. Meera Ahuja", distance: "2.1 km", rating: 4.5 },
  { id: 2, name: "Harmony Clinic", specialist: "Dr. Sooraj Pai", distance: "3.2 km", rating: 4.7 },
  { id: 3, name: "Peace Mind Center", specialist: "Dr. Nita Solanki", distance: "4.8 km", rating: 4.4 },
];

const times = ["09:00 AM", "12:00 PM", "03:00 PM", "07:30 PM"];

const MentalHealthSupport: React.FC = () => {
  const nav = useNavigate();
  const [tab, setTab] = useState<"video" | "hospital">("video");

  // Video consult state
  const [videoDate, setVideoDate] = useState<Date>();
  const [videoTime, setVideoTime] = useState("");
  const [showVideoConfirm, setShowVideoConfirm] = useState(false);

  // Hospital consult state
  const [hospitalIdx, setHospitalIdx] = useState(0);
  const [hospDate, setHospDate] = useState<Date>();
  const [hospTime, setHospTime] = useState("");
  const [showHospConfirm, setShowHospConfirm] = useState(false);

  // Confirm screen
  const [confirmMsg, setConfirmMsg] = useState("");

  // Handlers
  function handleVideoBook() {
    setShowVideoConfirm(true);
  }
  function confirmVideoBook() {
    saveBooking({
      type: "video",
      date: videoDate ? videoDate.toDateString() : "",
      time: videoTime,
      fee: 1299,
    });
    setShowVideoConfirm(false);
    setConfirmMsg(`Your online session is booked for ${videoDate?.toDateString()} at ${videoTime}. Fee: ₹1299. A video call link will be shared 10mins before appointment.`);
  }

  function handleHospBook() {
    setShowHospConfirm(true);
  }
  function confirmHospBook() {
    const h = hospitals[hospitalIdx];
    saveBooking({
      type: "hospital",
      hospital: h.name,
      specialist: h.specialist,
      date: hospDate ? hospDate.toDateString() : "",
      time: hospTime,
    });
    setShowHospConfirm(false);
    setConfirmMsg(`Appointment confirmed at ${h.name} (${h.specialist}) on ${hospDate?.toDateString()} at ${hospTime}. Reminders set for 24h & 1h before.`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center py-4 px-2">
      <button className="self-start mb-2 ml-2 text-green-700 bg-white rounded-md px-3 py-1 shadow" onClick={() => nav(-1)}>← Back</button>
      <h1 className="text-2xl font-bold mb-2 text-blue-700 text-center">Mental Health Support</h1>
      <div className="w-full max-w-md mx-auto bg-white p-2 pt-2 rounded-xl shadow mb-2 flex gap-2">
        <button className={`flex-1 rounded-lg py-2 font-bold ${tab==="video" ? "bg-blue-200 text-blue-900" : "text-gray-600 bg-gray-50"}`} onClick={()=>setTab("video")}>Online Video Consult</button>
        <button className={`flex-1 rounded-lg py-2 font-bold ${tab==="hospital" ? "bg-blue-200 text-blue-900" : "text-gray-600 bg-gray-50"}`} onClick={()=>setTab("hospital")}>Hospital Appointment</button>
      </div>
      <div className="w-full max-w-md">
        {tab==="video" && !showVideoConfirm && !confirmMsg && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Book a Video Consultation</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="font-medium mb-1 block">Select Date</label>
                <Calendar mode="single" selected={videoDate} onSelect={setVideoDate} className="mb-3"/>
                <label className="font-medium mb-1 block">Select Time</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {times.map(t=>(
                    <button key={t} className={`rounded-lg px-3 py-2 border ${videoTime===t?"bg-blue-200 border-blue-400 font-bold":"bg-white border-gray-200"}`} onClick={()=>setVideoTime(t)}>{t}</button>
                  ))}
                </div>
                <div className="text-sm mb-2 text-gray-500">Consultation Fee: <span className="font-bold text-blue-700">₹1299</span></div>
                <button
                  disabled={!videoDate || !videoTime}
                  className="w-full mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 transition text-lg disabled:opacity-50"
                  onClick={handleVideoBook}
                >Book Consult</button>
              </div>
            </CardContent>
          </Card>
        )}
        {tab==="video" && showVideoConfirm && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Your Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>Date: <span className="font-semibold">{videoDate?.toDateString()}</span></div>
              <div>Time: <span className="font-semibold">{videoTime}</span></div>
              <div>Fee: <span className="font-semibold">₹1299</span></div>
              <button className="w-full bg-green-600 px-4 py-2 rounded-lg text-white font-bold mt-2" onClick={confirmVideoBook}>Join Video (Mock)</button>
              <button className="w-full mt-1 text-gray-500 underline" onClick={()=>setShowVideoConfirm(false)}>Back</button>
            </CardContent>
          </Card>
        )}
        {tab==="hospital" && !showHospConfirm && !confirmMsg && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Book Hospital Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="font-medium mb-1 block">Choose Hospital</label>
              <select value={hospitalIdx} onChange={e=>setHospitalIdx(Number(e.target.value))} className="w-full p-2 rounded border border-gray-300 mb-2">
                {hospitals.map((h,i)=>(
                  <option key={h.id} value={i}>{h.name} ({h.specialist}) - {h.distance} ⭐{h.rating}</option>
                ))}
              </select>
              <label className="font-medium mb-1 block">Select Date</label>
              <Calendar mode="single" selected={hospDate} onSelect={setHospDate} className="mb-3"/>
              <label className="font-medium mb-1 block">Select Time</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {times.map(t=>(
                  <button key={t} className={`rounded-lg px-3 py-2 border ${hospTime===t?"bg-blue-200 border-blue-400 font-bold":"bg-white border-gray-200"}`} onClick={()=>setHospTime(t)}>{t}</button>
                ))}
              </div>
              <button
                disabled={!hospDate || !hospTime}
                className="w-full mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 transition text-lg disabled:opacity-50"
                onClick={handleHospBook}
              >Book Appointment</button>
            </CardContent>
          </Card>
        )}
        {tab==="hospital" && showHospConfirm && (
          <Card>
            <CardHeader>
              <CardTitle>Confirm Hospital Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div>Hospital: <span className="font-semibold">{hospitals[hospitalIdx].name}</span></div>
              <div>Specialist: <span className="font-semibold">{hospitals[hospitalIdx].specialist}</span></div>
              <div>Date: <span className="font-semibold">{hospDate?.toDateString()}</span></div>
              <div>Time: <span className="font-semibold">{hospTime}</span></div>
              <button className="w-full bg-green-600 px-4 py-2 rounded-lg text-white font-bold mt-2" onClick={confirmHospBook}>Confirm Booking</button>
              <button className="w-full mt-1 text-gray-500 underline" onClick={()=>setShowHospConfirm(false)}>Back</button>
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
              <button className="w-full bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg" onClick={()=>{setConfirmMsg(""); nav("/services");}}>Back to Services</button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MentalHealthSupport;
