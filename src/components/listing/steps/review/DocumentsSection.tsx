
import { FileText } from "lucide-react";
import { useFormContext } from "../../context/FormContext";

const DocumentsSection = () => {
  const { formData } = useFormContext();

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Documents</h3>
      <div className="p-4 bg-muted/50 rounded-md">
        <div className="flex flex-wrap gap-3">
          {formData.documents.map((doc, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-2 bg-background rounded-md">
              <FileText className="h-4 w-4" />
              <span className="text-sm truncate max-w-[150px]">{doc.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsSection;
