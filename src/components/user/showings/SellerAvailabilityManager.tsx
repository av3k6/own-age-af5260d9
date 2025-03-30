
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SellerAvailability, PropertyListing } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Clock, Plus } from "lucide-react";

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const DEFAULT_START_TIME = "09:00";
const DEFAULT_END_TIME = "17:00";

interface AvailabilityFormProps {
  propertyId: string;
  onSaved: () => void;
}

const AvailabilityForm = ({ propertyId, onSaved }: AvailabilityFormProps) => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [availabilities, setAvailabilities] = useState<SellerAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Create initial state with default availability for all days
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!user || !propertyId) return;
      
      setIsLoading(true);
      try {
        // Fetch existing availability settings
        const { data, error } = await supabase
          .from('seller_availability')
          .select('*')
          .eq('seller_id', user.id)
          .eq('property_id', propertyId);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Format the data from the database
          const formattedData = data.map(item => ({
            id: item.id,
            sellerId: item.seller_id,
            propertyId: item.property_id,
            dayOfWeek: item.day_of_week,
            startTime: item.start_time,
            endTime: item.end_time,
            isAvailable: item.is_available,
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at),
          })) as SellerAvailability[];
          
          setAvailabilities(formattedData);
        } else {
          // Create default availability for all days
          const defaultAvailabilities = DAYS_OF_WEEK.map(day => ({
            id: `temp-${day.value}`,
            sellerId: user.id,
            propertyId,
            dayOfWeek: day.value,
            startTime: DEFAULT_START_TIME,
            endTime: DEFAULT_END_TIME,
            isAvailable: day.value !== 0 && day.value !== 6, // Weekdays available by default
            createdAt: new Date(),
            updatedAt: new Date(),
          })) as SellerAvailability[];
          
          setAvailabilities(defaultAvailabilities);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
        toast({
          title: "Error",
          description: "Failed to load your availability settings.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailability();
  }, [user, propertyId, supabase, toast]);
  
  const handleToggleDay = (dayOfWeek: number) => {
    setAvailabilities(prev => 
      prev.map(avail => 
        avail.dayOfWeek === dayOfWeek 
          ? { ...avail, isAvailable: !avail.isAvailable } 
          : avail
      )
    );
  };
  
  const handleTimeChange = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    setAvailabilities(prev => 
      prev.map(avail => 
        avail.dayOfWeek === dayOfWeek 
          ? { ...avail, [field]: value } 
          : avail
      )
    );
  };

  const handleSaveAvailability = async () => {
    if (!user || !propertyId) return;
    
    setIsSaving(true);
    try {
      // Get IDs of existing records to determine which to update vs. insert
      const existingIds = availabilities
        .filter(a => !a.id.toString().startsWith('temp-'))
        .map(a => a.id);
      
      // Records to update (existing)
      const toUpdate = availabilities.filter(a => !a.id.toString().startsWith('temp-')).map(a => ({
        id: a.id,
        seller_id: a.sellerId,
        property_id: a.propertyId,
        day_of_week: a.dayOfWeek,
        start_time: a.startTime,
        end_time: a.endTime,
        is_available: a.isAvailable,
        updated_at: new Date(),
      }));
      
      // Records to insert (new)
      const toInsert = availabilities.filter(a => a.id.toString().startsWith('temp-')).map(a => ({
        seller_id: a.sellerId,
        property_id: a.propertyId,
        day_of_week: a.dayOfWeek,
        start_time: a.startTime,
        end_time: a.endTime,
        is_available: a.isAvailable,
        created_at: new Date(),
        updated_at: new Date(),
      }));
      
      // Perform updates
      if (toUpdate.length > 0) {
        const { error: updateError } = await supabase
          .from('seller_availability')
          .upsert(toUpdate);
          
        if (updateError) throw updateError;
      }
      
      // Perform inserts
      if (toInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('seller_availability')
          .insert(toInsert);
          
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Success",
        description: "Your availability settings have been saved.",
      });
      
      onSaved();
    } catch (error) {
      console.error("Error saving availability:", error);
      toast({
        title: "Error",
        description: "Failed to save your availability settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Set Your Availability</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure when you're available for property showings. Buyers will only be able to request
            showings during these hours.
          </p>
        </div>
        
        {DAYS_OF_WEEK.map(day => {
          const availability = availabilities.find(a => a.dayOfWeek === day.value);
          if (!availability) return null;
          
          return (
            <div key={day.value} className="flex items-center space-x-4">
              <div className="w-32">
                <Switch 
                  checked={availability.isAvailable}
                  onCheckedChange={() => handleToggleDay(day.value)}
                />
                <span className="ml-2">{day.label}</span>
              </div>
              
              {availability.isAvailable && (
                <div className="flex items-center space-x-2 flex-1">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      type="time"
                      value={availability.startTime}
                      onChange={(e) => handleTimeChange(day.value, 'startTime', e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <span className="text-muted-foreground">to</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      type="time"
                      value={availability.endTime}
                      onChange={(e) => handleTimeChange(day.value, 'endTime', e.target.value)}
                      className="w-32"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        <Button 
          onClick={handleSaveAvailability} 
          className="mt-4"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Availability
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

interface CalendarIntegrationFormProps {
  propertyId: string;
}

const CalendarIntegrationForm = ({ propertyId }: CalendarIntegrationFormProps) => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [isGoogleEnabled, setIsGoogleEnabled] = useState(false);
  const [isAppleEnabled, setIsAppleEnabled] = useState(false);
  const [isOutlookEnabled, setIsOutlookEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchCalendarIntegrations = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('calendar_integrations')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Set state based on existing integrations
          setIsGoogleEnabled(data.some(i => i.provider === 'google' && i.is_enabled));
          setIsAppleEnabled(data.some(i => i.provider === 'apple' && i.is_enabled));
          setIsOutlookEnabled(data.some(i => i.provider === 'outlook' && i.is_enabled));
        }
      } catch (error) {
        console.error("Error fetching calendar integrations:", error);
        toast({
          title: "Error",
          description: "Failed to load your calendar integrations.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCalendarIntegrations();
  }, [user, supabase, toast]);
  
  const handleSaveIntegrations = async () => {
    toast({
      title: "Coming Soon",
      description: "Calendar integration is coming soon. This is a placeholder UI for now.",
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Calendar Integrations</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your external calendars to sync showing appointments automatically.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between border p-4 rounded-md">
            <div>
              <h4 className="font-medium">Google Calendar</h4>
              <p className="text-sm text-muted-foreground">
                Sync showing requests with your Google Calendar
              </p>
            </div>
            <Switch 
              checked={isGoogleEnabled}
              onCheckedChange={setIsGoogleEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between border p-4 rounded-md">
            <div>
              <h4 className="font-medium">Apple Calendar</h4>
              <p className="text-sm text-muted-foreground">
                Sync showing requests with your Apple Calendar
              </p>
            </div>
            <Switch 
              checked={isAppleEnabled}
              onCheckedChange={setIsAppleEnabled}
            />
          </div>
          
          <div className="flex items-center justify-between border p-4 rounded-md">
            <div>
              <h4 className="font-medium">Outlook Calendar</h4>
              <p className="text-sm text-muted-foreground">
                Sync showing requests with your Outlook Calendar
              </p>
            </div>
            <Switch 
              checked={isOutlookEnabled}
              onCheckedChange={setIsOutlookEnabled}
            />
          </div>
        </div>
        
        <div className="border-t pt-4">
          <Button 
            onClick={handleSaveIntegrations}
            className="mt-4"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Calendar Settings"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface PropertySelectorProps {
  selectedPropertyId: string;
  onPropertyChange: (propertyId: string) => void;
}

const PropertySelector = ({ selectedPropertyId, onPropertyChange }: PropertySelectorProps) => {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('property_listings')
          .select('*')
          .eq('seller_id', user.id);
          
        if (error) throw error;
        
        if (data) {
          const formattedProperties = data.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description || "",
            price: p.price || 0,
            address: p.address || { street: "", city: "", state: "", zipCode: "" },
            propertyType: p.property_type || "house",
            bedrooms: p.bedrooms || 0,
            bathrooms: p.bathrooms || 0,
            squareFeet: p.square_feet || 0,
            yearBuilt: p.year_built || 0,
            features: p.features || [],
            images: p.images || [],
            sellerId: p.seller_id,
            status: p.status || "active",
            createdAt: new Date(p.created_at),
            updatedAt: new Date(p.updated_at),
          })) as PropertyListing[];
          
          setProperties(formattedProperties);
          
          // Set the first property as selected if no property is selected yet
          if (!selectedPropertyId && formattedProperties.length > 0) {
            onPropertyChange(formattedProperties[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error",
          description: "Failed to load your properties.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [user, supabase, toast, selectedPropertyId, onPropertyChange]);
  
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading properties...</span>
      </div>
    );
  }
  
  if (properties.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md">
        <p className="text-muted-foreground mb-2">You don't have any properties listed yet.</p>
        <Button variant="outline" size="sm" asChild>
          <a href="/sell">
            <Plus className="h-4 w-4 mr-2" />
            Create Listing
          </a>
        </Button>
      </div>
    );
  }
  
  return (
    <Select value={selectedPropertyId} onValueChange={onPropertyChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a property" />
      </SelectTrigger>
      <SelectContent>
        {properties.map((property) => (
          <SelectItem key={property.id} value={property.id}>
            {property.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default function SellerAvailabilityManager() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("availability");
  
  const handlePropertyChange = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
  };
  
  const handleAvailabilitySaved = () => {
    // This function can be used to refresh data if needed
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Showing Availability</CardTitle>
        <CardDescription>
          Set your availability for property showings
        </CardDescription>
        
        <div className="mt-4">
          <Label htmlFor="property-select">Select a Property</Label>
          <PropertySelector 
            selectedPropertyId={selectedPropertyId}
            onPropertyChange={handlePropertyChange}
          />
        </div>
      </CardHeader>
      
      {selectedPropertyId && (
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="availability">Set Availability</TabsTrigger>
              <TabsTrigger value="calendar">Calendar Integration</TabsTrigger>
            </TabsList>
            <TabsContent value="availability">
              <AvailabilityForm 
                propertyId={selectedPropertyId}
                onSaved={handleAvailabilitySaved}
              />
            </TabsContent>
            <TabsContent value="calendar">
              <CalendarIntegrationForm propertyId={selectedPropertyId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
      
      <CardFooter className="flex justify-between border-t pt-6">
        <p className="text-sm text-muted-foreground">
          Your availability settings will be visible to potential buyers.
        </p>
      </CardFooter>
    </Card>
  );
}
