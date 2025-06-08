"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Droplet } from "lucide-react";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const API_BASE_URL = 'http://localhost:8000/api';

export function BloodCompatibilityChecker() {
  const [donorType, setDonorType] = useState<string>("");
  const [recipientType, setRecipientType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    compatible: boolean;
    message: string;
    using_python_fallback?: boolean;
  } | null>(null);

  const checkCompatibility = async () => {
    if (!donorType || !recipientType) return;
    
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/compatibility`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donorType,
          recipientType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check compatibility");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({
        compatible: false,
        message: "Failed to check compatibility. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-6 w-6 text-red-500" />
          Blood Compatibility Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="donor-type">Donor's Blood Type</Label>
          <Select value={donorType} onValueChange={setDonorType}>
            <SelectTrigger>
              <SelectValue placeholder="Select donor's blood type" />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_TYPES.map((type) => (
                <SelectItem key={`donor-${type}`} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient-type">Recipient's Blood Type</Label>
          <Select value={recipientType} onValueChange={setRecipientType}>
            <SelectTrigger>
              <SelectValue placeholder="Select recipient's blood type" />
            </SelectTrigger>
            <SelectContent>
              {BLOOD_TYPES.map((type) => (
                <SelectItem key={`recipient-${type}`} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full" 
          onClick={checkCompatibility}
          disabled={!donorType || !recipientType || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Compatibility"
          )}
        </Button>

        {result && (
          <div 
            className={`p-4 rounded-md mt-4 ${
              result.compatible 
                ? "bg-green-50 text-green-800" 
                : "bg-red-50 text-red-800"
            }`}
          >
            <p className="font-medium">{result.message}</p>
            {result.using_python_fallback && (
              <p className="text-sm mt-2 text-amber-800">
                Note: Using Python fallback implementation
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
