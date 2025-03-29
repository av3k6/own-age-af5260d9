
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PropertyNotFound() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold text-zen-gray-800 mb-4">Property not found</h2>
      <p className="text-zen-gray-600 mb-6">
        The property you're looking for doesn't exist or has been removed.
      </p>
      <Link to="/buy">
        <Button>Browse Properties</Button>
      </Link>
    </div>
  );
}
