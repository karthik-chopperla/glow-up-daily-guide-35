import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const AVAILABLE_LOCATIONS = [
  "Eluru",
  "Bewaram", 
  "Palkollu",
  "Vijayawada",
  "Vizag"
];

interface LocationSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  value,
  onValueChange,
  label = "Select Location"
}) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choose your location" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_LOCATIONS.map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};