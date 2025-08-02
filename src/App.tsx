import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
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

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (only accessible when not logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <>
      <Routes>
        {/* Public Auth Route */}
        <Route path="/auth" element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomeScreen />
          </ProtectedRoute>
        } />
        <Route path="/services" element={
          <ProtectedRoute>
            <ServicesScreen />
          </ProtectedRoute>
        } />
        <Route path="/chatbot" element={
          <ProtectedRoute>
            <ChatbotScreen />
          </ProtectedRoute>
        } />
        <Route path="/records" element={
          <ProtectedRoute>
            <MyRecords />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/find-food" element={
          <ProtectedRoute>
            <FindFood />
          </ProtectedRoute>
        } />
        <Route path="/symptom-checker" element={
          <ProtectedRoute>
            <SymptomChecker />
          </ProtectedRoute>
        } />
        <Route path="/remedies" element={
          <ProtectedRoute>
            <HomeRemedies />
          </ProtectedRoute>
        } />
        <Route path="/hospitals" element={
          <ProtectedRoute>
            <Hospitals />
          </ProtectedRoute>
        } />
        <Route path="/doctor-booking" element={
          <ProtectedRoute>
            <DoctorBooking />
          </ProtectedRoute>
        } />
        <Route path="/medicine-reminders" element={
          <ProtectedRoute>
            <MedReminders />
          </ProtectedRoute>
        } />
        <Route path="/mental" element={
          <ProtectedRoute>
            <MentalWellBeing />
          </ProtectedRoute>
        } />
        <Route path="/nursing" element={
          <ProtectedRoute>
            <HomeNursing />
          </ProtectedRoute>
        } />
        <Route path="/diet-meals" element={
          <ProtectedRoute>
            <DietMeals />
          </ProtectedRoute>
        } />
        <Route path="/pregnancy-baby" element={
          <ProtectedRoute>
            <PregnancyBaby />
          </ProtectedRoute>
        } />
        <Route path="/fitness" element={
          <ProtectedRoute>
            <Fitness />
          </ProtectedRoute>
        } />
        <Route path="/insurance" element={
          <ProtectedRoute>
            <Insurance />
          </ProtectedRoute>
        } />
        <Route path="/mental-health-support" element={
          <ProtectedRoute>
            <MentalHealthSupport />
          </ProtectedRoute>
        } />
        <Route path="/home-nursing-booking" element={
          <ProtectedRoute>
            <HomeNursingBooking />
          </ProtectedRoute>
        } />
        <Route path="/pregnancy-care-plan" element={
          <ProtectedRoute>
            <PregnancyCarePlan />
          </ProtectedRoute>
        } />
        <Route path="/subscription-plans" element={
          <ProtectedRoute>
            <SubscriptionPlans />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      {/* Only show navigation when user is logged in */}
      {user && (
        <>
          <BottomTabNav />
          <FabSOS />
        </>
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
