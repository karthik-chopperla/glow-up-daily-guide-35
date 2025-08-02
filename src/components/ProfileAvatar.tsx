
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit } from "lucide-react";

// No default photo URL — only neutral SVG fallback will be used

export default function ProfileAvatar({
  src,
  onChange,
}: {
  src?: string;
  onChange: (url: string) => void;
}) {
  const [preview, setPreview] = useState<string | undefined>(src || "");
  const fileInput = useRef<HTMLInputElement>(null);

  function handleEditClick() {
    fileInput.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreview(reader.result);
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  // Only show AvatarImage if a custom photo is uploaded
  const showImage = !!(preview || src);

  return (
    <div className="relative w-24 h-24 mx-auto">
      <Avatar className="w-24 h-24 ring-2 ring-green-200 shadow bg-white">
        {showImage ? (
          <AvatarImage
            src={preview || src}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        ) : (
          <AvatarFallback>
            {/* Neutral SVG silhouette icon, visually centered */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              className="w-12 h-12 text-gray-400"
              aria-label="Default profile avatar"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="24" cy="24" r="24" fill="#F4F7FA"/>
              <circle cx="24" cy="19" r="8" fill="#CBD5E1"/>
              <path
                d="M24 31c-7 0-13 2.5-13 5.5V40a2 2 0 002 2h22a2 2 0 002-2v-3.5c0-3-6-5.5-13-5.5z"
                fill="#CBD5E1"
              />
            </svg>
          </AvatarFallback>
        )}
      </Avatar>
      <button
        className="absolute bottom-1 right-1 bg-white/90 border rounded-full shadow p-1 hover:bg-green-100 transition"
        type="button"
        aria-label="Edit Profile Picture"
        onClick={handleEditClick}
      >
        <Edit className="w-5 h-5 text-green-700" />
      </button>
      <input
        type="file"
        ref={fileInput}
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

