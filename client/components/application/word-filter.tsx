import { useStore } from "@/store/useStore";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Filter, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectTrigger } from "../ui/select";
import { Button } from "../ui/button";
import DebouncedSearch from "./debouced-search";

function WordFilter() {
    const { wordStore, categoryStore } = useStore();
    const { categories } = categoryStore;
    const { selectedCategories, setSelectedCategories, searchTerm, setSearchTerm, pagination } = wordStore;
    const [categorySearch, setCategorySearch] = useState("");

    useEffect(() => {
        // Load words and categories when the component mounts
        categoryStore.loadCategories();
    }, [categoryStore]);

    // Filter categories based on search
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    // Helper to toggle category selection
    const toggleCategory = (name: string) => {
        if (selectedCategories.includes(name)) {
            setSelectedCategories(selectedCategories.filter((c) => c !== name));
        } else {
            setSelectedCategories([...selectedCategories, name]);
        }
    };
    return (
        <>
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                                Search Words
                            </Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <DebouncedSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            </div>
                        </div>
                        <div className="sm:w-64">
                            <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                                Filter by Category
                            </Label>
                            <Select open={undefined}>
                                <SelectTrigger className="w-full">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <span className="truncate">
                                        {selectedCategories.length === 0
                                            ? "Select categories"
                                            : selectedCategories.join(", ")}
                                    </span>
                                </SelectTrigger>
                                <SelectContent className="max-h-72 overflow-y-auto">
                                    <div className="p-2">
                                        <Input
                                            placeholder="Search categories..."
                                            value={categorySearch}
                                            onChange={e => setCategorySearch(e.target.value)}
                                            className="mb-2"
                                        />
                                    </div>
                                    {filteredCategories.length === 0 ? (
                                        <div className="px-4 py-2 text-muted-foreground text-sm">No categories found</div>
                                    ) : (
                                        filteredCategories.map((category) => (
                                            <div
                                                key={category.id}
                                                className="flex items-center px-4 py-2 cursor-pointer hover:bg-accent"
                                                onClick={() => toggleCategory(category.name)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category.name)}
                                                    readOnly
                                                    className="mr-2"
                                                />
                                                <span>{category.name}</span>
                                            </div>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        {(searchTerm || selectedCategories.length > 0) && (
                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedCategories([]);
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Results count */}
                    <div className="mt-4 text-sm text-muted-foreground">
                        Showing {pagination && pagination.itemsPerPage * pagination.currentPage} of {pagination && pagination.totalItems} words
                        {searchTerm && ` matching "${searchTerm}"`}
                        {selectedCategories.length !== 0 && ` in categories "${selectedCategories.join(", ")}"`}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}


export default observer(WordFilter);