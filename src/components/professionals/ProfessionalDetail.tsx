
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, MapPin, Building, Briefcase, Edit } from "lucide-react";
import { professionalData } from "./data/professionalData";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const ProfessionalDetail = () => {
  const { category, id } = useParams();
  const { user } = useAuth();
  const [isBusinessOwner, setIsBusinessOwner] = useState(false);
  const [professional, setProfessional] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  
  // Find the professional data - first check localStorage, then fallback to static data
  useEffect(() => {
    // Try to get updated data from localStorage first
    const localBusinessData = localStorage.getItem("localBusinessData");
    let businessData = localBusinessData ? JSON.parse(localBusinessData) : [...professionalData.professionals];
    
    // Find the business by ID and category
    const foundProfessional = businessData.find(p => p.id === id && p.category === category);
    setProfessional(foundProfessional || null);
    
    // Find the category info
    const foundCategory = professionalData.categories.find(c => c.type === category);
    setCategoryInfo(foundCategory || null);
  }, [category, id]);
  
  // Check if current user is assigned to this business using localStorage
  useEffect(() => {
    if (!user || !id) return;

    console.log("ProfessionalDetail: checking business ownership for:", user.email);
    
    try {
      // Get the business assignments from localStorage
      const savedAssignments = localStorage.getItem("businessAssignments");
      const businessAssignments = savedAssignments ? JSON.parse(savedAssignments) : [];
      
      console.log("Business assignments:", businessAssignments);
      
      // Check if the current user's email matches any business assignment for this business ID
      const isOwner = businessAssignments.some(
        (assignment) => assignment.businessId === id && assignment.email === user.email
      );
      
      console.log("Is business owner:", isOwner);
      setIsBusinessOwner(isOwner);
    } catch (error) {
      console.error("Error checking business ownership:", error);
      setIsBusinessOwner(false);
    }
  }, [user, id]);

  if (!professional || !categoryInfo) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold text-center mb-8">Professional Not Found</h1>
        <div className="flex justify-center">
          <Link to={category ? `/professionals/${category}` : "/professionals"}>
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to {categoryInfo?.label || "Professionals"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link to={`/professionals/${category}`} className="mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{professional.name}</h1>
        </div>
        
        {isBusinessOwner && (
          <Link to="/business/edit">
            <Button variant="default">
              <Edit className="mr-2 h-4 w-4" />
              Edit Business Profile
            </Button>
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">About</h3>
                <p className="text-muted-foreground mt-1">
                  {`${professional.name} specializes in providing professional ${categoryInfo.label.toLowerCase()} services throughout the area.`}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Area of Expertise</h3>
                <p className="text-muted-foreground mt-1">{professional.expertise}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Service Area</h3>
                <p className="text-muted-foreground mt-1">
                  {professional.serviceArea || "Greater Vancouver and surrounding areas"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Why Choose {professional.name}?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Professional and reliable service</li>
                <li>Experienced and certified specialists</li>
                <li>Comprehensive inspection reports</li>
                <li>Excellent customer service</li>
                <li>Competitive pricing</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{professional.phone}</p>
                  <p className="text-sm text-muted-foreground">Call for inquiries</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{professional.email}</p>
                  <p className="text-sm text-muted-foreground">Email for more information</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{professional.address}</p>
                  <p className="text-sm text-muted-foreground">Office location</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Contact Professional
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">• Licensed & Insured</p>
              <p className="text-sm">• Member of Professional Association</p>
              <p className="text-sm">• X+ Years of Experience</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetail;
