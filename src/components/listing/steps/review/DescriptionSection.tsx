
import { useFormContext } from "../../context/FormContext";

const DescriptionSection = () => {
  const { formData } = useFormContext();

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Description</h3>
      <div className="p-4 bg-muted/50 rounded-md">
        <p>{formData.description}</p>
      </div>
    </div>
  );
};

export default DescriptionSection;
