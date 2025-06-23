import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"; // or wherever your Search icon is from

interface DebouncedSearchProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const DebouncedSearch: React.FC<DebouncedSearchProps> = ({ searchTerm, setSearchTerm }) => {
    const [localValue, setLocalValue] = useState(searchTerm);

    useEffect(() => {
        setLocalValue(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (localValue !== searchTerm) {
                setSearchTerm(localValue);
            }
        }, 400);

        return () => clearTimeout(handler);
    }, [localValue]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
                id="search"
                placeholder="Search by word or definition..."
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="pl-10"
            />
        </div>
    );
};

export default DebouncedSearch;
