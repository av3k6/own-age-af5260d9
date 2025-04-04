
import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Card, CardContent } from "@/components/ui/card";
import { DocumentMetadata } from "@/types/document";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createLogger } from "@/utils/logger";

const logger = createLogger("PropertyFloorPlans");

interface PropertyFloorPlansProps {
  propertyId: string;
}

const PropertyFloorPlans = ({ propertyId }: PropertyFloorPlansProps) => {
  const [floorPlans, setFloorPlans] = useState<DocumentMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchFloorPlans = async () => {
      if (!propertyId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fix the column name issue: use 'type' instead of 'document_type'
        const { data, error: fetchError } = await supabase
          .from("property_documents")
          .select("*")
          .eq("property_id", propertyId)
          .eq("category", "floor_plans");

        if (fetchError) {
          throw fetchError;
        }

        if (data && data.length > 0) {
          // Transform DB documents to DocumentMetadata format
          const plans: DocumentMetadata[] = data.map(doc => ({
            id: doc.id,
            name: doc.name,
            type: doc.type, // Using the correct column name
            size: doc.size,
            url: doc.url,
            path: doc.path,
            uploadedBy: doc.uploaded_by,
            createdAt: doc.created_at,
            propertyId: doc.property_id,
            category: doc.category,
            description: doc.description
          }));
          
          logger.info(`Found ${plans.length} floor plans`);
          setFloorPlans(plans);
        } else {
          logger.info("No floor plans found for property");
          setFloorPlans([]);
        }
      } catch (err: any) {
        logger.error("Strategy error:", err);
        setError("Failed to load floor plans");
        setFloorPlans([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFloorPlans();
  }, [propertyId, supabase]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-bold mb-4">Floor Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (floorPlans.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No floor plans available for this property
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Floor Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {floorPlans.map((plan) => (
          <Card key={plan.id} className="overflow-hidden">
            <CardContent className="p-0">
              {plan.url ? (
                <a href={plan.url} target="_blank" rel="noopener noreferrer">
                  <div className="bg-muted p-6 flex flex-col items-center justify-center h-48">
                    <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium">{plan.name}</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {plan.type} • {(plan.size / 1024).toFixed(0)} KB
                    </span>
                  </div>
                </a>
              ) : (
                <div className="bg-muted p-6 flex flex-col items-center justify-center h-48">
                  <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                  <span className="text-sm font-medium">{plan.name}</span>
                  <span className="text-xs text-muted-foreground">No preview available</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PropertyFloorPlans;
