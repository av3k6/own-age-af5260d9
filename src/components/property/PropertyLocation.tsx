
import { Address } from "@/types";

interface PropertyLocationProps {
  address: Address;
}

export default function PropertyLocation({ address }: PropertyLocationProps) {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-zen-gray-800 mb-4">Location</h2>
      <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-4">
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBtdr4-5ew-7RzY5CvMo-jugKI-AR0NNY8&q=${encodeURIComponent(
            `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
          )}`}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
