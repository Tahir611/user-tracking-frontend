import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDesignTracking } from "@/context/design-tracking-context";

const designFactors = [
  { key: "visualGraphics", label: "Visual Graphics", color: "bg-blue-500" },
  { key: "color", label: "Color", color: "bg-green-500" },
  { key: "activityNoticeability", label: "Activity Noticeability", color: "bg-yellow-500" },
  { key: "entryPoint", label: "Entry Point", color: "bg-red-500" },
  { key: "font", label: "Font", color: "bg-purple-500" },
  { key: "gestalt", label: "Gestalt", color: "bg-indigo-500" },
  { key: "hierarchy", label: "Hierarchy", color: "bg-pink-500" },
  { key: "perceptiveAnimation", label: "Perceptive Animation", color: "bg-orange-500" },
  { key: "transitionNavigation", label: "Transition/Navigation", color: "bg-teal-500" },
];

export default function DesignAnalytics({ isOpen, onClose }) {
  const { getAnalytics, designTracking } = useDesignTracking();
  const [analytics, setAnalytics] = useState(null);
  const [timeframe, setTimeframe] = useState("all");
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getAnalytics(timeframe);
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
    }
  }, [isOpen, timeframe]);

  const getMaxValue = () => {
    if (!analytics) return 1;
    return Math.max(...Object.values(analytics.factorBreakdown)) || 1;
  };

  const getProgressPercentage = (value) => {
    return (value / getMaxValue()) * 100;
  };

  const getTopFactors = () => {
    if (!analytics) return [];
    
    return designFactors
      .map(factor => ({
        ...factor,
        value: analytics.factorBreakdown[factor.key] || 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Design Analytics Dashboard</h2>
            <Button variant="outline" onClick={onClose}>
              ✕
            </Button>
          </div>

          {/* Timeframe Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Time Period</label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="today">Today</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading analytics...</div>
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Interactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {analytics.totalInteractions}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Most Active Factor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold">
                      {getTopFactors()[0]?.label || "None"}
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {getTopFactors()[0]?.value || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Layout Style</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-semibold capitalize">
                      {analytics.preferences?.preferredLayoutStyle || "Modern"}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Design Factors Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Design Factors Analysis</CardTitle>
                  <CardDescription>
                    Your interaction patterns with different design elements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {designFactors.map((factor) => {
                      const value = analytics.factorBreakdown[factor.key] || 0;
                      const percentage = getProgressPercentage(value);
                      
                      return (
                        <div key={factor.key} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{factor.label}</span>
                            <span className="text-sm text-gray-600">{value} interactions</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${factor.color}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Top 3 Factors */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Design Preferences</CardTitle>
                  <CardDescription>
                    Your most interacted design factors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getTopFactors().map((factor, index) => (
                      <div key={factor.key} className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold mb-2">#{index + 1}</div>
                        <div className="font-semibold">{factor.label}</div>
                        <div className="text-2xl font-bold text-blue-600 mt-2">
                          {factor.value}
                        </div>
                        <div className="text-sm text-gray-600">interactions</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Preferences</CardTitle>
                  <CardDescription>
                    Your saved design preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Preferred Colors</h4>
                      <div className="flex space-x-2">
                        {analytics.preferences?.preferredColors?.map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Preferred Fonts</h4>
                      <div className="space-y-1">
                        {analytics.preferences?.preferredFonts?.slice(0, 3).map((font, index) => (
                          <div key={index} style={{ fontFamily: font }} className="text-sm">
                            {font}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Animation Speed</h4>
                      <span className="capitalize">
                        {analytics.preferences?.preferredAnimationSpeed || "Normal"}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Layout Style</h4>
                      <span className="capitalize">
                        {analytics.preferences?.preferredLayoutStyle || "Modern"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              {analytics.recentActivity && analytics.recentActivity.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Your latest design interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.recentActivity.slice(0, 10).map((activity, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <div>
                            <span className="font-medium">{activity.action}</span>
                            <span className="text-gray-600 ml-2">({activity.factor})</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No analytics data available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
