// components/BottomLoader.tsx
import { Loader2 } from 'lucide-react';

interface Props {
    active: boolean
}
const BottomLoader = ({ active }: Props) => {
    if (!active) return null;
    return (
        <div className="flex justify-center py-6">
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <span className="text-sm">Loading more...</span>
            </div>
        </div>
    );
};

export default BottomLoader;
