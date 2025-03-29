
import { formatCurrency } from "@/lib/formatters";
import { useFormContext } from "../../context/FormContext";

const BasicInformation = () => {
  const { formData } = useFormContext();

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Basic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-md">
        <div>
          <p className="text-sm text-muted-foreground">Property Title</p>
          <p className="font-medium">{formData.title}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Property Type</p>
          <p className="font-medium">{formData.propertyType}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Asking Price</p>
          <p className="font-medium">{formatCurrency(formData.price)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Address</p>
          <p className="font-medium">
            {formData.address.street}, {formData.address.city}, {formData.address.state} {formData.address.zipCode}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
