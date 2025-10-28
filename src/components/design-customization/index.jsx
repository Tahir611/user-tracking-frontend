import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useDesignTracking } from "@/context/design-tracking-context";

const colorOptions = [
  { name: "Blue", value: "#3b82f6", class: "bg-blue-500" },
  { name: "Green", value: "#10b981", class: "bg-green-500" },
  { name: "Purple", value: "#8b5cf6", class: "bg-purple-500" },
  { name: "Red", value: "#ef4444", class: "bg-red-500" },
  { name: "Orange", value: "#f97316", class: "bg-orange-500" },
  { name: "Pink", value: "#ec4899", class: "bg-pink-500" },
  { name: "Indigo", value: "#6366f1", class: "bg-indigo-500" },
  { name: "Teal", value: "#14b8a6", class: "bg-teal-500" },
];

const fontOptions = [
  { name: "Inter", value: "Inter" },
  { name: "Roboto", value: "Roboto" },
  { name: "Poppins", value: "Poppins" },
  { name: "Open Sans", value: "Open Sans" },
  { name: "Lato", value: "Lato" },
  { name: "Montserrat", value: "Montserrat" },
];

const animationSpeeds = [
  { name: "Slow", value: "slow" },
  { name: "Normal", value: "normal" },
  { name: "Fast", value: "fast" },
];

const layoutStyles = [
  { name: "Minimal", value: "minimal" },
  { name: "Detailed", value: "detailed" },
  { name: "Modern", value: "modern" },
  { name: "Classic", value: "classic" },
];

export default function DesignCustomization({ isOpen, onClose }) {
  const {
    userPreferences,
    updatePreferences,
    trackColorInteraction,
    trackFontInteraction,
    trackPerceptiveAnimation,
    trackHierarchy,
    isLoading,
  } = useDesignTracking();

  const [localPreferences, setLocalPreferences] = useState(userPreferences);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalPreferences(userPreferences);
  }, [userPreferences]);

  const handleColorChange = (colorValue) => {
    const newColors = localPreferences.preferredColors.includes(colorValue)
      ? localPreferences.preferredColors.filter(c => c !== colorValue)
      : [...localPreferences.preferredColors.slice(0, 2), colorValue];
    
    setLocalPreferences(prev => ({
      ...prev,
      preferredColors: newColors,
    }));
    setHasChanges(true);
    
    // Track color interaction
    trackColorInteraction();
  };

  const handleFontChange = (fontValue) => {
    setLocalPreferences(prev => ({
      ...prev,
      preferredFonts: [fontValue, ...prev.preferredFonts.filter(f => f !== fontValue).slice(0, 2)],
    }));
    setHasChanges(true);
    
    // Track font interaction
    trackFontInteraction();
  };

  const handleAnimationSpeedChange = (speed) => {
    setLocalPreferences(prev => ({
      ...prev,
      preferredAnimationSpeed: speed,
    }));
    setHasChanges(true);
    
    // Track animation interaction
    trackPerceptiveAnimation();
  };

  const handleLayoutStyleChange = (style) => {
    setLocalPreferences(prev => ({
      ...prev,
      preferredLayoutStyle: style,
    }));
    setHasChanges(true);
    
    // Track hierarchy interaction
    trackHierarchy();
  };

  const handleSavePreferences = async () => {
    await updatePreferences(localPreferences);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalPreferences(userPreferences);
    setHasChanges(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Design Customization</h2>
            <Button variant="outline" onClick={onClose}>
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            {/* Color Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Color Preferences</CardTitle>
                <CardDescription>
                  Select your preferred colors (up to 3)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className={`
                        w-16 h-16 rounded-lg border-2 transition-all duration-200
                        ${color.class}
                        ${localPreferences.preferredColors.includes(color.value)
                          ? 'border-gray-800 scale-110 shadow-lg'
                          : 'border-gray-300 hover:scale-105'
                        }
                      `}
                      onClick={() => handleColorChange(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Font Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Font Preferences</CardTitle>
                <CardDescription>
                  Choose your preferred font family
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={localPreferences.preferredFonts[0]}
                  onValueChange={handleFontChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Animation Speed */}
            <Card>
              <CardHeader>
                <CardTitle>Animation Speed</CardTitle>
                <CardDescription>
                  Control the speed of animations and transitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={localPreferences.preferredAnimationSpeed}
                  onValueChange={handleAnimationSpeedChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select animation speed" />
                  </SelectTrigger>
                  <SelectContent>
                    {animationSpeeds.map((speed) => (
                      <SelectItem key={speed.value} value={speed.value}>
                        {speed.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Layout Style */}
            <Card>
              <CardHeader>
                <CardTitle>Layout Style</CardTitle>
                <CardDescription>
                  Choose your preferred interface layout style
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={localPreferences.preferredLayoutStyle}
                  onValueChange={handleLayoutStyleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select layout style" />
                  </SelectTrigger>
                  <SelectContent>
                    {layoutStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
              Reset Changes
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSavePreferences}
                disabled={!hasChanges || isLoading}
              >
                {isLoading ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
