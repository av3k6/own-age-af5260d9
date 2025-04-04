
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X, File } from "lucide-react";
import { useFormContext } from "../context/FormContext";
import { formatFileSize, getFileIconColor } from "@/utils/fileUtils";

const DocumentUpload = () => {
  const { formData, updateFormData, goToNextStep, goToPreviousStep } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const newDocuments = [...formData.documents, ...files];
    const newDocumentNames = [...formData.documentNames, ...files.map(f => f.name)];
    
    updateFormData({ 
      documents: newDocuments,
      documentNames: newDocumentNames
    });
  };

  const removeDocument = (index: number) => {
    const newDocuments = [...formData.documents];
    const newDocumentNames = [...formData.documentNames];
    
    newDocuments.splice(index, 1);
    newDocumentNames.splice(index, 1);
    
    updateFormData({ 
      documents: newDocuments,
      documentNames: newDocumentNames
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const colorClass = getFileIconColor(fileName);
    return <File className={`h-10 w-10 ${colorClass}`} />;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="text-center p-6 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
             onClick={() => fileInputRef.current?.click()}>
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <div className="text-lg font-medium">Upload Property Documents</div>
          <p className="text-muted-foreground">
            Property plans, inspection reports, certificates, or other relevant documents
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            (Optional, but recommended for transparency)
          </p>
          <Button type="button" variant="outline" onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}>
            <Upload className="h-4 w-4 mr-2" />
            Select Documents
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {formData.documents.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-4">Uploaded Documents ({formData.documents.length})</h3>
            <div className="space-y-3">
              {formData.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background border rounded-md group hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    {getFileIcon(doc.name)}
                    <div>
                      <p className="font-medium truncate max-w-[200px] sm:max-w-xs">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocument(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={goToPreviousStep}>
          Back
        </Button>
        <Button type="submit">
          {formData.documents.length > 0 ? 'Next Step' : 'Skip & Continue'}
        </Button>
      </div>
    </form>
  );
};

export default DocumentUpload;
