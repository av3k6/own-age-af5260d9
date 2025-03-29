
interface PropertyFeaturesProps {
  features: string[];
}

export default function PropertyFeatures({ features }: PropertyFeaturesProps) {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-zen-gray-800 mb-4">Property Features</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <div className="w-2 h-2 bg-zen-blue-500 rounded-full mr-2"></div>
            <span className="text-zen-gray-700">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
