
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NoBusinessAssigned: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>No Business Assigned</CardTitle>
          <CardDescription>
            You haven't been assigned as the owner/operator of any business listings yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please contact an administrator to be assigned to your business listing.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => navigate('/professionals')}>
            Return to Professionals
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoBusinessAssigned;
