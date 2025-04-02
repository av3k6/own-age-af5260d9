
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const BusinessProfileLoading: React.FC = () => {
  return (
    <div className="container py-10">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center">
            <h2 className="text-lg font-medium">Loading your business profile</h2>
            <p className="text-muted-foreground">Please wait while we retrieve your business information</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessProfileLoading;
