"use client"

import { useEffect, useState } from "react"
import {
  Plus,
  Search,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ChatBox from "@/components/application/chat-box";
import WordComparison from "@/components/application/word-comparison";
import WordCard from "@/components/application/word-card";
import { observer } from "mobx-react-lite"
import { useStore } from "@/store/useStore"
import WordList from "@/components/application/word-list"
import WordCardSkeleton from "@/components/application/word-card-skeleton"

function DictionaryPage() {
  const { wordStore, categoryStore } = useStore();
  const { words, setWords, pagination, setPagingParams, loading, setPagination } = wordStore;
  const { categories } = categoryStore;
  const [loadingNext, setLoadingNext] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    // Load words and categories when the component mounts
    wordStore.loadWords();
    categoryStore.loadCategories();
  }, [wordStore, categoryStore]);

  // Filter words based on search term and category
  // const filteredWords = words.filter((word) => {
  //   const matchesSearch =
  //     (word.text?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
  //     (word.definition?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  //   const matchesCategory = selectedCategory === "All" || word.category === selectedCategory
  //   return matchesSearch && matchesCategory
  // })

  // Add a new word card
  const addWord = () => {
    const newWord = {
      id: `w${Date.now()}`,
      text: "New Word",
      definition: "Definition goes here",
      parentId: null,
      category: "Uncategorized",
      expanded: false,
      isEditing: true,
      examples: [],
      synonyms: [],
    }
    setWords([...words, newWord])
  }


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Dictionary Section */}
        <div className="xl:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dictionary</h1>
            <Button onClick={addWord}>
              <Plus className="mr-2 h-4 w-4" /> Add Word
            </Button>
          </div>

          {/* Filter Section */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                    Search Words
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="Search by word or definition..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <Label htmlFor="category" className="text-sm font-medium mb-2 block">
                    Filter by Category
                  </Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {(searchTerm || selectedCategory !== "All") && (
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("All")
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
                {selectedCategory !== "All" && ` in category "${selectedCategory}"`}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {loading ? (
              <WordCardSkeleton/>
            ) : (
              <WordList />
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="xl:col-span-1">
          {/* Word Comparison Section */}
          <WordComparison />
          {/* AI Chatbot Section */}
          <ChatBox />
        </div>
      </div>
    </div>
  )
}

export default observer(DictionaryPage);
