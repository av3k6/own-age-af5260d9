
interface PropertyDescriptionProps {
  description: string;
}

export default function PropertyDescription({ description }: PropertyDescriptionProps) {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-zen-gray-800 mb-4">Description</h2>
      <p className="text-zen-gray-600 whitespace-pre-line">
        {description}
      </p>
    </div>
  );
}
