
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { provinces } from "@/utils/provinceData";
import { 
  FileText, 
  Home, 
  Camera, 
  Ruler, 
  Building, 
  ClipboardCheck, 
  FileInput,
  CalculatorIcon
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const DocumentRequirements = () => {
  const [selectedProvince, setSelectedProvince] = useState<string>("ON");
  
  const getDocumentRequirements = (provinceCode: string) => {
    switch (provinceCode) {
      case "BC":
        return [
          { 
            icon: <Camera className="h-5 w-5 text-primary" />, 
            title: "Photo ID", 
            description: "Valid driver's licence or passport for each title holder" 
          },
          { 
            icon: <FileText className="h-5 w-5 text-primary" />, 
            title: "Proof of Ownership", 
            description: "Property Tax Statement or Title Certificate" 
          },
          { 
            icon: <FileText className="h-5 w-5 text-primary" />, 
            title: "Copy of Property Title", 
            description: "Must be dated within 30 days" 
          },
          { 
            icon: <Home className="h-5 w-5 text-primary" />, 
            title: "Legal Suite Registration", 
            description: "Only if your property contains a legal suite" 
          },
          { 
            icon: <Building className="h-5 w-5 text-primary" />, 
            title: "Condo/Strata Documents", 
            description: "If applicable: bylaws, strata plan, etc." 
          },
          { 
            icon: <Home className="h-5 w-5 text-primary" />, 
            title: "Mobile/Manufactured Home Registry", 
            description: "If listing a mobile/manufactured home" 
          }
        ];
      case "AB":
        return [
          { 
            icon: <Camera className="h-5 w-5 text-primary" />, 
            title: "Photo ID", 
            description: "Valid driver's licence or passport for each title holder" 
          },
          { 
            icon: <Ruler className="h-5 w-5 text-primary" />, 
            title: "RMS Measurement Report", 
            description: "As required by RECA for all listings" 
          },
          { 
            icon: <FileText className="h-5 w-5 text-primary" />, 
            title: "Land Title Certificate", 
            description: "" 
          },
          { 
            icon: <FileText className="h-5 w-5 text-primary" />, 
            title: "Property Tax Statement", 
            description: "" 
          },
          { 
            icon: <Home className="h-5 w-5 text-primary" />, 
            title: "Legal Suite Registration", 
            description: "If applicable" 
          }
        ];
      default:
        return [
          { 
            icon: <Camera className="h-5 w-5 text-primary" />, 
            title: "Photo ID", 
            description: "" 
          },
          { 
            icon: <FileText className="h-5 w-5 text-primary" />, 
            title: "Proof of Ownership", 
            description: "Property Tax Statement or Title Certificate" 
          }
        ];
    }
  };

  // Get province's full name
  const getProvinceName = (code: string) => {
    const province = provinces.find(p => p.value === code);
    return province ? province.fullName : code;
  };

  // Common documents for all provinces
  const commonDocuments = [
    {
      icon: <FileInput className="h-5 w-5 text-primary" />,
      title: "Online MLS® System Listing Contract",
      description: "Flexible, no lock-in, modifiable at any time."
    },
    {
      icon: <CalculatorIcon className="h-5 w-5 text-primary" />,
      title: "Online Data Input Form",
      description: "Used to populate your listing on REALTOR.ca (price, size, features, etc.)"
    }
  ];

  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Listing Document Requirements by Province</h1>
      <p className="text-muted-foreground mb-8">
        Find out what documents you'll need to list your property on REALTOR.ca
      </p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🧭 Start Here: Select Your Province</h2>
        <div className="max-w-xs">
          <Select value={selectedProvince} onValueChange={setSelectedProvince}>
            <SelectTrigger>
              <SelectValue placeholder="Select Province" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {provinces.map(province => (
                  <SelectItem key={province.value} value={province.value}>
                    {province.fullName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents Required in {getProvinceName(selectedProvince)}
          </CardTitle>
          <CardDescription>
            Make sure you have these documents ready before listing your property
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {getDocumentRequirements(selectedProvince).map((doc, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-0.5">{doc.icon}</div>
                <div>
                  <h3 className="font-medium">{doc.title}</h3>
                  {doc.description && <p className="text-sm text-muted-foreground">{doc.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Common Documents We Help You With (All Provinces)
          </CardTitle>
          <CardDescription>
            These will be provided through our platform to simplify your listing process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {commonDocuments.map((doc, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-0.5">{doc.icon}</div>
                <div>
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentRequirements;
