import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppProvider";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ChatbotScreen from "./components/screens/ChatbotScreen";
import SymptomChecker from "./pages/SymptomChecker";
import HomeRemedies from "./pages/HomeRemedies";
import Hospitals from "./pages/Hospitals";
import DoctorBooking from "./pages/DoctorBooking";
import MedReminders from "./pages/MedReminders";
import MentalWellBeing from "./pages/MentalWellBeing";
import HomeNursing from "./pages/HomeNursing";
import DietMeals from "./pages/DietMeals";
import PregnancyBaby from "./pages/PregnancyBaby";
import Fitness from "./pages/Fitness";
import Insurance from "./pages/Insurance";
import MyRecords from "./pages/MyRecords";
import Profile from "./pages/Profile";
import HomeScreen from "./pages/HomeScreen";
import ServicesScreen from "./pages/ServicesScreen";
import BottomTabNav from "./components/BottomTabNav";
import FabSOS from "./components/ui/FabSOS";
import FindFood from "./pages/FindFood";
import MentalHealthSupport from "./pages/MentalHealthSupport";
import HomeNursingBooking from "./pages/HomeNursingBooking";
import PregnancyCarePlan from "./pages/PregnancyCarePlan";
import SubscriptionPlans from "./pages/SubscriptionPlans";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              {/* Updated Main Navigation */}
              <Route path="/" element={<HomeScreen />} />
              <Route path="/services" element={<ServicesScreen />} />
              <Route path="/chatbot" element={<ChatbotScreen />} />
              <Route path="/records" element={<MyRecords />} />
              <Route path="/profile" element={<Profile />} />
              {/* NEW: Find Food route */}
              <Route path="/find-food" element={<FindFood />} />
              {/* Feature Routes */}
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/remedies" element={<HomeRemedies />} />
              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/doctor-booking" element={<DoctorBooking />} />
              <Route path="/medicine-reminders" element={<MedReminders />} />
              <Route path="/mental" element={<MentalWellBeing />} />
              <Route path="/nursing" element={<HomeNursing />} />
              <Route path="/diet-meals" element={<DietMeals />} />
              <Route path="/pregnancy-baby" element={<PregnancyBaby />} />
              <Route path="/fitness" element={<Fitness />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/mental-health-support" element={<MentalHealthSupport />} />
              <Route path="/home-nursing-booking" element={<HomeNursingBooking />} />
              <Route path="/pregnancy-care-plan" element={<PregnancyCarePlan />} />
              <Route path="/subscription-plans" element={<SubscriptionPlans />} />
              {/* Auth */}
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <BottomTabNav />
            <FabSOS /> {/* <-- 💡 Always-on Emergency SOS */}
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
