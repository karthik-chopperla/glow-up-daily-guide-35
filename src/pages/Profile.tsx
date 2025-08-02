
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ProfileAvatar from "../components/ProfileAvatar";
import { LogOut, Trash2, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const langs = [
  { label: "English", value: "en" },
  { label: "हिन्दी", value: "hi" },
  { label: "Marathi", value: "mr" },
  { label: "ગુજરાતી", value: "gu" },
  { label: "বাংলা", value: "bn" },
  { label: "اردو", value: "ur" },
];

export default function Profile() {
  const { user: authUser, signOut } = useAuth();
  const { toast } = useToast();
  
  // Profile state
  const [userProfile, setUserProfile] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    preferred: "",
    avatar: authUser?.avatar || "",
  });
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);

  function handleChange(field: string, value: any) {
    setUserProfile((u) => ({ ...u, [field]: value }));
  }

  async function handleLogout() {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  }

  function handleDeleteAccount() {
    setOpenDelete(false);
    // Account deletion logic would go here
    toast({
      title: "Account deletion",
      description: "Account deletion functionality will be implemented soon.",
    });
  }

  function handleExport(type: "pdf" | "csv") {
    alert(`Exporting health data as ${type.toUpperCase()}...`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex flex-col items-center py-6 px-2 md:px-0">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-2 text-green-700 text-center">Profile</h1>
        {/* Profile Card */}
        <Card className="rounded-xl shadow-md mb-6 animate-fade-in">
          <CardHeader className="flex flex-col items-center gap-2 pb-2">
            <ProfileAvatar
              src={userProfile.avatar}
              onChange={(img) => handleChange("avatar", img)}
            />
            <CardTitle className="text-center mt-2">{userProfile.name || authUser?.name || "Your Name"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* Name */}
              <div>
                <Label>Name</Label>
                <Input
                  placeholder="Enter your name"
                  value={userProfile.name}
                  onChange={e => handleChange("name", e.target.value)}
                  className="mt-1"
                />
              </div>
              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={userProfile.email}
                  onChange={e => handleChange("email", e.target.value)}
                  className="mt-1"
                  autoComplete="username"
                  disabled // Email can't be changed after signup
                />
              </div>
              {/* Phone */}
              <div>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={userProfile.phone}
                  onChange={e => handleChange("phone", e.target.value)}
                  className="mt-1"
                  autoComplete="tel"
                />
              </div>
              {/* Date of Birth */}
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={userProfile.dob}
                  onChange={e => handleChange("dob", e.target.value)}
                  className="mt-1"
                />
              </div>
              {/* Gender */}
              <div>
                <Label>Gender</Label>
                <Select value={userProfile.gender} onValueChange={v => handleChange("gender", v)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Address */}
              <div>
                <Label>Address</Label>
                <Input
                  placeholder="Your address"
                  value={userProfile.address}
                  onChange={e => handleChange("address", e.target.value)}
                  className="mt-1"
                  autoComplete="street-address"
                />
              </div>
              {/* Preferred Doctor/Hospital (optional) */}
              <div>
                <Label>Preferred Doctor/Hospital <span className="text-xs text-gray-400">(optional)</span></Label>
                <Input
                  placeholder="Type a name or hospital..."
                  value={userProfile.preferred}
                  onChange={e => handleChange("preferred", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card className="rounded-xl shadow-md mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="pb-1 text-green-800">Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Change Password (mock) */}
            <div className="flex items-center justify-between py-2 border-b">
              <span>Change Password</span>
              <Button size="sm" variant="outline" className="text-green-700 border-green-300" onClick={() => alert("Password change not implemented.")}>
                Change
              </Button>
            </div>
            {/* Theme toggle */}
            <div className="flex items-center justify-between py-2 border-b">
              <span>Theme</span>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={v => setTheme(v ? "dark" : "light")}
                aria-label="Toggle Dark Mode"
              />
            </div>
            {/* Language Preference */}
            <div className="flex items-center justify-between py-2 border-b">
              <span>Language</span>
              <Select value={language} onValueChange={v => setLanguage(v)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                  <ChevronDown />
                </SelectTrigger>
                <SelectContent>
                  {langs.map(l => <SelectItem value={l.value} key={l.value}>{l.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* Notification Preferences */}
            <div className="flex items-center justify-between py-2 border-b">
              <span>Notifications</span>
              <Switch checked={notifications} onCheckedChange={setNotifications} aria-label="Notifications On/Off" />
            </div>
            {/* Subscription Plan (mock, navigates to plans) */}
            <div className="flex items-center justify-between py-2 border-b">
              <span>Subscription Plan</span>
              <Button size="sm" variant="outline" className="text-yellow-800 border-yellow-300" onClick={() => window.location.href = "/subscription-plans"}>
                View/Upgrade
              </Button>
            </div>
            {/* Manage Health Records Access */}
            <div className="flex items-center justify-between py-2 border-b">
              <span>Manage Health Records Access</span>
              <Button size="sm" variant="outline" className="border-blue-300" onClick={() => alert("This feature is not implemented yet.")}>
                Edit
              </Button>
            </div>
            {/* Export health data */}
            <div className="flex items-center justify-between py-2">
              <span>Export Health Data</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleExport("pdf")} variant="outline">PDF</Button>
                <Button size="sm" onClick={() => handleExport("csv")} variant="outline">CSV</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Actions */}
        <div className="flex gap-4 mb-4">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow font-semibold"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </Button>
          <Button
            className="flex-1 bg-red-500 hover:bg-red-600 text-white shadow font-semibold"
            onClick={() => setOpenDelete(true)}
          >
            <Trash2 className="w-5 h-5 mr-2" /> Delete Account
          </Button>
        </div>
      </div>
      {/* Delete account confirmation dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="text-center max-w-xs">
          <DialogTitle className="text-red-700 pb-1">Delete Account?</DialogTitle>
          <div className="mb-3 text-gray-700">This action cannot be undone.<br />Are you sure you want to delete your account?</div>
          <Button variant="destructive" className="w-full mb-2" onClick={handleDeleteAccount}>
            Yes, Delete My Account
          </Button>
          <Button variant="outline" className="w-full" onClick={() => setOpenDelete(false)}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
