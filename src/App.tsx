import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppProvider";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import RoleSelection from "./pages/RoleSelection";
import PartnerDashboard from "./pages/PartnerDashboard";
import PartnerHomepage from "./pages/PartnerHomepage";
import ProtectedRoute from "./components/ProtectedRoute";
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
import Settings from "./pages/Settings";
import HomeScreen from "./pages/HomeScreen";
import PatientDashboard from "./pages/PatientDashboard";
// Keeping PartnerHome for backward compatibility
import PartnerHome from "./pages/PartnerHome";
import ServicesScreen from "./pages/ServicesScreen";
import BottomTabNav from "./components/BottomTabNav";
import FabSOS from "./components/ui/FabSOS";
import FindFood from "./pages/FindFood";
import MentalHealthSupport from "./pages/MentalHealthSupport";
import HomeNursingBooking from "./pages/HomeNursingBooking";
import PregnancyCarePlan from "./pages/PregnancyCarePlan";
import SubscriptionPlans from "./pages/SubscriptionPlans";

const queryClient = new QueryClient();

// Public Route Component (only accessible when not logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  console.log('PublicRoute - user:', user, 'loading:', loading);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user) {
    console.log('PublicRoute - User found, redirecting to /');
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, profile } = useAuth();
  
  console.log('AppRoutes - user:', user, 'profile:', profile);
  
  return (
    <>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/welcome" element={
          <PublicRoute>
            <Welcome />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        <Route path="/signin" element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        } />
        <Route path="/auth" element={
          <PublicRoute>
            <Auth />
          </PublicRoute>
        } />
        
        {/* Role Selection Route */}
        <Route path="/role-selection" element={
          <ProtectedRoute>
            <RoleSelection />
          </ProtectedRoute>
        } />
        
        {/* Partner Dashboard */}
        <Route path="/partner-dashboard" element={
          <ProtectedRoute requireRole="partner">
            <PartnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/partner-homepage" element={
          <ProtectedRoute requireRole="partner">
            <PartnerHomepage />
          </ProtectedRoute>
        } />
        
        {/* User Routes */}
        <Route path="/home" element={
          <ProtectedRoute requireRole="user">
            <HomeScreen />
          </ProtectedRoute>
        } />
        
        {/* Root Route - redirects to welcome for unauthenticated users */}
        <Route path="/" element={
          user ? (
            <ProtectedRoute>
              {profile?.role === 'patient' ? (
                <>
                  {console.log('Redirecting to /patient-dashboard')}
                  <Navigate to="/patient-dashboard" replace />
                </>
              ) : profile?.role === 'doctor' || profile?.role === 'pharmacy_partner' || profile?.role === 'elder_expert' || profile?.role === 'nurse' ? (
                <>
                  {console.log('Redirecting to partner dashboard')}
                  <Navigate to="/partner-dashboard" replace />
                </>
              ) : (
                <>
                  {console.log('No role, redirecting to /role-selection')}
                  <Navigate to="/role-selection" replace />
                </>
              )}
            </ProtectedRoute>
          ) : (
            <Navigate to="/welcome" replace />
          )
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
        <Route path="/patient-dashboard" element={
          <ProtectedRoute requireRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/partner-dashboard" element={
          <ProtectedRoute requireRole="doctor">
            <PartnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      {/* Only show navigation when user is logged in and has a role */}
      {user && profile?.role && (
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
