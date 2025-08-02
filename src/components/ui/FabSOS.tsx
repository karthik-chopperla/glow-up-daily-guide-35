
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const getMockLocation = () => ({
  lat: 19.07,
  lng: 72.87,
});

const FabSOS = () => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [activated, setActivated] = useState(false);

  const handleClick = () => {
    setOpenConfirm(true);
  };

  const handleSOS = () => {
    setOpenConfirm(false);
    setActivated(true);
    setTimeout(() => setActivated(false), 3500);
  };

  // Get time
  const now = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Simulate GPS
  const coords = getMockLocation();

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              title="Emergency SOS"
              className="fixed z-50 bottom-20 right-6 md:right-12 bg-red-500 hover:bg-red-700 text-white rounded-full shadow-lg transition-all flex flex-col items-center justify-center"
              style={{ width: 64, height: 64, minWidth: 56, minHeight: 56, fontWeight: 700, fontSize: '1.2rem', boxShadow: '0 2px 12px 0 rgb(220 38 38 / 0.25)' }}
              onClick={handleClick}
              aria-label="Emergency SOS"
              tabIndex={0}
            >
              SOS
            </button>
          </TooltipTrigger>
          {/* Show tooltip only on desktop */}
          <TooltipContent side="left" className="hidden md:block">
            Emergency SOS
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent>
          <DialogTitle className="text-lg flex items-center gap-2">
            <span className="text-red-500 text-2xl">🚨</span>
            Are you in an emergency?
          </DialogTitle>
          <div className="pt-2 pb-1 text-gray-800">
            Tap again to send alert.
          </div>
          <button
            className="w-full mt-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold py-3 transition text-lg tracking-wide"
            onClick={handleSOS}
          >
            SEND SOS
          </button>
          <button
            className="block w-full mt-2 text-gray-500 hover:underline text-sm"
            onClick={() => setOpenConfirm(false)}
          >Cancel</button>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={activated} onOpenChange={setActivated}>
        <DialogContent className="text-center">
          <div className="flex justify-center text-green-600 text-3xl mb-1 pb-1">✅</div>
          <DialogTitle className="text-green-700">SOS activated</DialogTitle>
          <div className="mt-2 mb-2 text-gray-700">
            Help is on the way.<br />
            <span className="text-sm">Stay calm. <br />
            <span className="font-semibold">Time:</span> {now()} <br />
            <span className="font-semibold">GPS:</span> ({coords.lat}, {coords.lng})</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FabSOS;
