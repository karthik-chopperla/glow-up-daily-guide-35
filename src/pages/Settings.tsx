import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, User, Mail, MapPin, Building, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { validateName, validatePhone, validateUrl, sanitizeInput, logSecurityEvent } from '@/utils/validation';

const PARTNER_SERVICES = [
  'AI Symptom Checker',
  'Hospital Finder & Cost Comparison',
  'Expert Elders\' Traditional Advice',
  'Doctor Consultations',
  'Emergency SOS',
  'Smart Medicine Reminders & Intake Tracking',
  'Refill Alerts & Medicine Price Comparison',
  'Diet Plan & Food Booking',
  'Mental Health & Home Nursing',
  'Pregnancy Care Plan',
  'Fitness Support',
  'Insurance Support'
];

const PARTNER_TYPES = [
  'hospital',
  'doctor',
  'expert'
];

const Settings = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
    address: '',
    partner_services: [] as string[],
    partner_type: '',
    contact_info: {
      phone: '',
      email: '',
      website: ''
    }
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || '',
        address: profile.address || '',
        partner_services: profile.partner_services || [],
        partner_type: profile.partner_type || '',
        contact_info: profile.contact_info || {
          phone: '',
          email: user?.email || '',
          website: ''
        }
      });
    }
  }, [profile, user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact_info: {
        ...prev.contact_info,
        [field]: value
      }
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      partner_services: prev.partner_services.includes(service)
        ? prev.partner_services.filter(s => s !== service)
        : [...prev.partner_services, service]
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    // Validate name
    const nameValidation = validateName(formData.full_name);
    if (!nameValidation.isValid) {
      errors.push(nameValidation.error!);
    }
    
    // Validate phone
    const phoneValidation = validatePhone(formData.contact_info.phone);
    if (!phoneValidation.isValid) {
      errors.push(phoneValidation.error!);
    }
    
    // Validate website URL
    const urlValidation = validateUrl(formData.contact_info.website);
    if (!urlValidation.isValid) {
      errors.push(urlValidation.error!);
    }
    
    return errors;
  };

  const handleSave = async () => {
    if (!user?.id) return;

    // Validate form data
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: validationErrors.join(', '),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Sanitize all inputs
      const sanitizedData = {
        full_name: sanitizeInput(formData.full_name),
        avatar_url: sanitizeInput(formData.avatar_url),
        address: sanitizeInput(formData.address),
        partner_services: formData.partner_services.map(service => sanitizeInput(service)),
        partner_type: sanitizeInput(formData.partner_type),
        contact_info: {
          phone: sanitizeInput(formData.contact_info.phone),
          email: sanitizeInput(formData.contact_info.email),
          website: sanitizeInput(formData.contact_info.website)
        },
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(sanitizedData)
        .eq('id', user.id);

      if (error) throw error;
      
      await logSecurityEvent('PROFILE_UPDATED', { userId: user.id });

      toast({
        title: "Profile updated",
        description: "Your settings have been saved successfully.",
      });

      // Force page refresh to show updated values
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your profile and preferences</p>
          </div>
        </div>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Update your basic profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleInputChange('full_name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                id="avatar_url"
                value={formData.avatar_url}
                onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                placeholder="Enter avatar image URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your address"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Update your contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.contact_info.email}
                onChange={(e) => handleContactInfoChange('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.contact_info.phone}
                onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.contact_info.website}
                onChange={(e) => handleContactInfoChange('website', e.target.value)}
                placeholder="Enter your website URL"
              />
            </div>
          </CardContent>
        </Card>

        {/* Partner-specific Settings */}
        {profile?.role && ['doctor', 'pharmacy_partner', 'elder_expert', 'nurse'].includes(profile.role) && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Partner Type
                </CardTitle>
                <CardDescription>
                  Select your business type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select 
                  value={formData.partner_type} 
                  onValueChange={(value) => handleInputChange('partner_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select partner type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTNER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  Services Provided
                </CardTitle>
                <CardDescription>
                  Select all services that your business provides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PARTNER_SERVICES.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={formData.partner_services.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                      />
                      <Label
                        htmlFor={service}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {service}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="px-8"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;