
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, MapPin, Building, Briefcase } from "lucide-react";
import { professionalData } from "./data/professionalData";

const ProfessionalDetail = () => {
  const { category, id } = useParams();
  
  // Find the professional by ID
  const professional = professionalData.professionals.find(p => p.id === id && p.category === category);
  
  // Find the category
  const categoryInfo = professionalData.categories.find(c => c.type === category);

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
      <div className="flex items-center mb-8">
        <Link to={`/professionals/${category}`} className="mr-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{professional.name}</h1>
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
                  {professional.description || `${professional.name} specializes in providing professional ${categoryInfo.label.toLowerCase()} services throughout the area.`}
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
