import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const ExpertOnboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [formData, setFormData] = useState({
    expert_name: '',
    expertise_area: '',
    service_charge: 0,
    work_description: '',
    years_experience: 0,
    address: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.expert_name || !formData.expertise_area || !formData.service_charge) {
      toast({
        title: "Missing Information",
        description: "Name, expertise area, and service charge are required.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Update profile with expert information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.expert_name,
          expertise_area: formData.expertise_area,
          service_charge: formData.service_charge,
          work_description: formData.work_description,
          years_experience: formData.years_experience,
          address: formData.address,
          phone: formData.phone,
          partner_setup_complete: true
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      toast({
        title: "Success!",
        description: "Expert profile setup completed successfully."
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete setup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expert Profile Setup</CardTitle>
        <CardDescription>Set up your expert advisory profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expert_name">Expert Name *</Label>
            <Input
              id="expert_name"
              value={formData.expert_name}
              onChange={(e) => handleInputChange('expert_name', e.target.value)}
              placeholder="Your professional name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expertise_area">Expertise Area *</Label>
            <Input
              id="expertise_area"
              value={formData.expertise_area}
              onChange={(e) => handleInputChange('expertise_area', e.target.value)}
              placeholder="e.g., Traditional Medicine, Ayurveda, Nutrition"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_charge">Service Charge (₹) *</Label>
            <Input
              id="service_charge"
              type="number"
              value={formData.service_charge}
              onChange={(e) => handleInputChange('service_charge', Number(e.target.value))}
              placeholder="Advisory fee per session"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="years_experience">Years of Experience</Label>
            <Input
              id="years_experience"
              type="number"
              value={formData.years_experience}
              onChange={(e) => handleInputChange('years_experience', Number(e.target.value))}
              placeholder="Years of expertise"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="work_description">Work Description</Label>
          <Textarea
            id="work_description"
            value={formData.work_description}
            onChange={(e) => handleInputChange('work_description', e.target.value)}
            placeholder="Describe your expertise, approach, and what you offer to clients..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Practice/Office Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Your practice or consultation address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Contact Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Your contact number"
          />
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={loading || !formData.expert_name || !formData.expertise_area || !formData.service_charge}
          className="w-full"
          size="lg"
        >
          {loading ? "Setting up..." : "Complete Expert Profile"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExpertOnboarding;