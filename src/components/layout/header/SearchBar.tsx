
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <input
        type="text"
        placeholder="Search properties..."
        className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-64 bg-background text-foreground transition-colors"
      />
    </div>
  );
};

export default SearchBar;
