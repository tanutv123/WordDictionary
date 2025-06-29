"use client"

import { useEffect, useState } from "react"
import {
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatBox from "@/components/application/chat-box";
import WordComparison from "@/components/application/word-comparison";
import { observer } from "mobx-react-lite"
import { useStore } from "@/store/useStore"
import WordList from "@/components/application/word-list"
import WordCardSkeleton from "@/components/application/word-card-skeleton"
import InfiniteScroll from "react-infinite-scroller"
import { PagingParams } from "@/models/pagination"
import BottomLoader from "@/components/application/bottom-loader"
import WordFilter from "@/components/application/word-filter"


function DictionaryPage() {
  const { wordStore, categoryStore } = useStore();
  const { words, pagination, setPagingParams, loading, loadWords, setAddWord } = wordStore;
  const { categories } = categoryStore;
  const [loadingNext, setLoadingNext] = useState(false);

  useEffect(() => {
    // Load words and categories when the component mounts
    wordStore.loadWords();
  }, [wordStore]);

  // Filter words based on search term and category
  // const filteredWords = words.filter((word) => {
  //   const matchesSearch =
  //     (word.text?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
  //     (word.definition?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  //   const matchesCategory = selectedCategory === "All" || word.category === selectedCategory
  //   return matchesSearch && matchesCategory
  // })

  function handleGetNext() {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadWords()
      .finally(() => {
        setLoadingNext(false);
      })
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Dictionary Section */}
        <div className="xl:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Dictionary</h1>
            <Button onClick={setAddWord}>
              <Plus className="mr-2 h-4 w-4" /> Add Word
            </Button>
          </div>

          {/* Filter Section */}
          <WordFilter />


          <div className="grid gap-6">
            {
              loading && words.length === 0 && !loadingNext ? (
                <WordCardSkeleton />
              ) : (
                <InfiniteScroll
                  pageStart={1}
                  loadMore={handleGetNext}
                  hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                  initialLoad={false}
                >
                  <WordList />
                </InfiniteScroll>
              )
            }
            <BottomLoader active={loadingNext} />
          </div>
        </div>

        {/* Right Section */}
        <div className="xl:col-span-1">
          <WordComparison />
          <ChatBox />
        </div>
      </div>
    </div>
  )
}

export default observer(DictionaryPage);
