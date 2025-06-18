"use client"

import { useState } from "react"
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash,
  BookOpen,
  Check,
  X,
  Search,
  Filter,
  Send,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import ChatBox from "@/components/application/chat-box";
import WordComparison from "@/components/application/word-comparison";

// Types for our data structure
type Example = {
  id: string
  text: string
}

type Synonym = {
  id: string
  word: string
  examples: Example[]
  showExamples: boolean
  isEditing: boolean
}

type Word = {
  id: string
  word: string
  definition: string
  information: string
  category: string
  imageUrl?: string
  expanded: boolean
  synonyms: Synonym[]
  isEditing: boolean
}

export default function DictionaryPage() {
  // Sample initial data
  const [words, setWords] = useState<Word[]>([
    {
      id: "1",
      word: "Happy",
      definition: "Feeling or showing pleasure or contentment",
      information: "Adjective describing a positive emotional state",
      category: "Emotions",
      imageUrl: "/placeholder.svg?height=300&width=400",
      expanded: false,
      isEditing: false,
      synonyms: [
        {
          id: "s1",
          word: "Joyful",
          examples: [
            { id: "e1", text: "She felt joyful after receiving the good news." },
            { id: "e2", text: "The joyful children played in the park." },
          ],
          showExamples: false,
          isEditing: false,
        },
        {
          id: "s2",
          word: "Cheerful",
          examples: [{ id: "e3", text: "He greeted us with a cheerful smile." }],
          showExamples: false,
          isEditing: false,
        },
      ],
    },
    {
      id: "2",
      word: "Beautiful",
      definition: "Pleasing the senses or mind aesthetically",
      information: "Adjective describing something that is attractive or pleasing in appearance",
      category: "Appearance",
      imageUrl: "/placeholder.svg?height=300&width=400",
      expanded: false,
      isEditing: false,
      synonyms: [
        {
          id: "s3",
          word: "Gorgeous",
          examples: [{ id: "e4", text: "The sunset was absolutely gorgeous." }],
          showExamples: false,
          isEditing: false,
        },
        {
          id: "s4",
          word: "Stunning",
          examples: [{ id: "e5", text: "She looked stunning in her new dress." }],
          showExamples: false,
          isEditing: false,
        },
      ],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Get unique categories for the filter dropdown
  const categories = ["All", ...Array.from(new Set(words.map((word) => word.category)))]

  // Filter words based on search term and category
  const filteredWords = words.filter((word) => {
    const matchesSearch =
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || word.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Toggle expanded state for a word card
  const toggleExpand = (wordId: string) => {
    setWords(words.map((word) => (word.id === wordId ? { ...word, expanded: !word.expanded } : word)))
  }

  // Toggle examples visibility for a synonym
  const toggleExamples = (wordId: string, synonymId: string) => {
    setWords(
        words.map((word) =>
            word.id === wordId
                ? {
                  ...word,
                  synonyms: word.synonyms.map((syn) =>
                      syn.id === synonymId ? { ...syn, showExamples: !syn.showExamples } : syn,
                  ),
                }
                : word,
        ),
    )
  }

  // Toggle editing state for a word
  const toggleEditWord = (wordId: string) => {
    setWords(words.map((word) => (word.id === wordId ? { ...word, isEditing: !word.isEditing } : word)))
  }

  // Toggle editing state for a synonym
  const toggleEditSynonym = (wordId: string, synonymId: string) => {
    setWords(
        words.map((word) =>
            word.id === wordId
                ? {
                  ...word,
                  synonyms: word.synonyms.map((syn) =>
                      syn.id === synonymId ? { ...syn, isEditing: !syn.isEditing } : syn,
                  ),
                }
                : word,
        ),
    )
  }

  // Add a new synonym to a word
  const addSynonym = (wordId: string) => {
    const newSynonym: Synonym = {
      id: `s${Date.now()}`,
      word: "",
      examples: [],
      showExamples: false,
      isEditing: true,
    }

    setWords(
        words.map((word) =>
            word.id === wordId
                ? {
                  ...word,
                  synonyms: [...word.synonyms, newSynonym],
                }
                : word,
        ),
    )
  }

  // Add a new example to a synonym
  const addExample = (wordId: string, synonymId: string) => {
    const newExample: Example = {
      id: `e${Date.now()}`,
      text: "New example",
    }

    setWords(
        words.map((word) =>
            word.id === wordId
                ? {
                  ...word,
                  synonyms: word.synonyms.map((syn) =>
                      syn.id === synonymId
                          ? {
                            ...syn,
                            examples: [...syn.examples, newExample],
                            showExamples: true,
                          }
                          : syn,
                  ),
                }
                : word,
        ),
    )
  }

  // Save edited word
  const saveWord = (wordId: string, updatedWord: Partial<Word>) => {
    setWords(words.map((word) => (word.id === wordId ? { ...word, ...updatedWord, isEditing: false } : word)))
  }

  // Save edited synonym
  const saveSynonym = (wordId: string, synonymId: string, updatedSynonym: Partial<Synonym>) => {
    setWords(
        words.map((word) =>
            word.id === wordId
                ? {
                  ...word,
                  synonyms: word.synonyms.map((syn) =>
                      syn.id === synonymId ? { ...syn, ...updatedSynonym, isEditing: false } : syn,
                  ),
                }
                : word,
        ),
    )
  }

  // Delete a synonym
  const deleteSynonym = (wordId: string, synonymId: string) => {
    setWords(
        words.map((word) =>
            word.id === wordId
                ? {
                  ...word,
                  synonyms: word.synonyms.filter((syn) => syn.id !== synonymId),
                }
                : word,
        ),
    )
  }

  // Delete an example
  const deleteExample = (wordId: string, synonymId: string, exampleId: string) => {
    setWords(
        words.map((word) =>
            word.id === wordId
                ? {
                  ...word,
                  synonyms: word.synonyms.map((syn) =>
                      syn.id === synonymId
                          ? {
                            ...syn,
                            examples: syn.examples.filter((ex) => ex.id !== exampleId),
                          }
                          : syn,
                  ),
                }
                : word,
        ),
    )
  }

  // Update example text
  const updateExample = (wordId: string, synonymId: string, exampleId: string, text: string) => {
    setWords(
        words.map((word) =>
            word.id === wordId
                ? {
                  ...word,
                  synonyms: word.synonyms.map((syn) =>
                      syn.id === synonymId
                          ? {
                            ...syn,
                            examples: syn.examples.map((ex) => (ex.id === exampleId ? { ...ex, text } : ex)),
                          }
                          : syn,
                  ),
                }
                : word,
        ),
    )
  }

  // Remove image from word
  const removeImage = (wordId: string) => {
    setWords(words.map((word) => (word.id === wordId ? { ...word, imageUrl: undefined } : word)))
  }

  // Add a new word card
  const addWord = () => {
    const newWord: Word = {
      id: `w${Date.now()}`,
      word: "New Word",
      definition: "Definition goes here",
      information: "Additional information",
      category: "General",
      expanded: false,
      isEditing: true,
      synonyms: [],
    }
    setWords([...words, newWord])
  }

  // Delete a word
  const deleteWord = (wordId: string) => {
    setWords(words.filter((word) => word.id !== wordId))
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
                            <SelectItem key={category} value={category}>
                              {category}
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
                  Showing {filteredWords.length} of {words.length} words
                  {searchTerm && ` matching "${searchTerm}"`}
                  {selectedCategory !== "All" && ` in "${selectedCategory}"`}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              {filteredWords.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center text-muted-foreground">
                        <p>No words found matching your criteria.</p>
                        {(searchTerm || selectedCategory !== "All") && (
                            <Button
                                variant="link"
                                onClick={() => {
                                  setSearchTerm("")
                                  setSelectedCategory("All")
                                }}
                                className="mt-2"
                            >
                              Clear filters to see all words
                            </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
              ) : (
                  filteredWords.map((word) => (
                      <Card key={word.id} className="w-full overflow-hidden">
                        {word.isEditing ? (
                            // Edit mode for word
                            <CardContent className="pt-6">
                              <div className="grid gap-4">
                                <div>
                                  <Label htmlFor={`word-${word.id}`}>Word</Label>
                                  <Input
                                      id={`word-${word.id}`}
                                      value={word.word}
                                      onChange={(e) =>
                                          setWords(words.map((w) => (w.id === word.id ? { ...w, word: e.target.value } : w)))
                                      }
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`definition-${word.id}`}>Definition</Label>
                                  <Textarea
                                      id={`definition-${word.id}`}
                                      value={word.definition}
                                      onChange={(e) =>
                                          setWords(words.map((w) => (w.id === word.id ? { ...w, definition: e.target.value } : w)))
                                      }
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`info-${word.id}`}>Additional Information</Label>
                                  <Textarea
                                      id={`info-${word.id}`}
                                      value={word.information}
                                      onChange={(e) =>
                                          setWords(words.map((w) => (w.id === word.id ? { ...w, information: e.target.value } : w)))
                                      }
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`category-${word.id}`}>Category</Label>
                                  <Input
                                      id={`category-${word.id}`}
                                      value={word.category}
                                      onChange={(e) =>
                                          setWords(words.map((w) => (w.id === word.id ? { ...w, category: e.target.value } : w)))
                                      }
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`image-${word.id}`} className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" /> Image URL (optional)
                                  </Label>
                                  <div className="flex gap-2">
                                    <Input
                                        id={`image-${word.id}`}
                                        value={word.imageUrl || ""}
                                        placeholder="Enter image URL or leave empty for no image"
                                        onChange={(e) =>
                                            setWords(words.map((w) => (w.id === word.id ? { ...w, imageUrl: e.target.value } : w)))
                                        }
                                        className="flex-1"
                                    />
                                    {word.imageUrl && (
                                        <Button variant="outline" size="icon" onClick={() => removeImage(word.id)}>
                                          <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Add an optional image to visualize this word
                                  </p>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => toggleEditWord(word.id)}>
                                    <X className="mr-2 h-4 w-4" /> Cancel
                                  </Button>
                                  <Button
                                      onClick={() =>
                                          saveWord(word.id, {
                                            word: word.word,
                                            definition: word.definition,
                                            information: word.information,
                                            category: word.category,
                                            imageUrl: word.imageUrl,
                                          })
                                      }
                                  >
                                    <Check className="mr-2 h-4 w-4" /> Save
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                        ) : (
                            // Display mode for word
                            <>
                              <CardHeader className="pb-3">
                                <div className="flex justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                      <h2 className="text-2xl font-bold">{word.word}</h2>
                                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                                {word.category}
                              </span>
                                    </div>
                                    <CardDescription className="mt-1">{word.information}</CardDescription>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => toggleEditWord(word.id)}>
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => deleteWord(word.id)}>
                                      <Trash className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => toggleExpand(word.id)}>
                                      {word.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                      <span className="sr-only">{word.expanded ? "Collapse" : "Expand"}</span>
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>

                              <CardContent>
                                <div className="flex flex-col md:flex-row gap-6">
                                  <div className="flex-1">
                                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Definition</h3>
                                    <p className="text-lg">{word.definition}</p>
                                  </div>

                                  {word.imageUrl && (
                                      <div className="md:w-1/4 min-w-[120px] max-w-[180px]">
                                        <div className="relative aspect-square rounded-md overflow-hidden border">
                                          <Image
                                              src={word.imageUrl || "/placeholder.svg"}
                                              alt={`Visual representation of ${word.word}`}
                                              fill
                                              className="object-cover"
                                          />
                                        </div>
                                        <p className="text-xs text-center text-muted-foreground mt-1">Visual representation</p>
                                      </div>
                                  )}
                                </div>

                                {word.expanded && (
                                    <div className="mt-6 pt-6 border-t">
                                      <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-medium">Synonyms</h3>
                                        <Button size="sm" onClick={() => addSynonym(word.id)}>
                                          <Plus className="mr-2 h-3 w-3" /> Add Synonym
                                        </Button>
                                      </div>

                                      <div className="pl-4 border-l-2 border-gray-200 space-y-4">
                                        {word.synonyms.length === 0 ? (
                                            <p className="text-muted-foreground italic">No synonyms added yet.</p>
                                        ) : (
                                            word.synonyms.map((synonym) => (
                                                <div key={synonym.id} className="border rounded-md p-3">
                                                  {synonym.isEditing ? (
                                                      // Edit mode for synonym
                                                      <div className="grid gap-3">
                                                        <div>
                                                          <Label htmlFor={`syn-${synonym.id}`}>Synonym</Label>
                                                          <Input
                                                              id={`syn-${synonym.id}`}
                                                              value={synonym.word}
                                                              onChange={(e) =>
                                                                  setWords(
                                                                      words.map((w) =>
                                                                          w.id === word.id
                                                                              ? {
                                                                                ...w,
                                                                                synonyms: w.synonyms.map((s) =>
                                                                                    s.id === synonym.id ? { ...s, word: e.target.value } : s,
                                                                                ),
                                                                              }
                                                                              : w,
                                                                      ),
                                                                  )
                                                              }
                                                          />
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                          <Button
                                                              variant="outline"
                                                              size="sm"
                                                              onClick={() => toggleEditSynonym(word.id, synonym.id)}
                                                          >
                                                            <X className="mr-2 h-3 w-3" /> Cancel
                                                          </Button>
                                                          <Button
                                                              size="sm"
                                                              onClick={() =>
                                                                  saveSynonym(word.id, synonym.id, {
                                                                    word: synonym.word,
                                                                  })
                                                              }
                                                          >
                                                            <Check className="mr-2 h-3 w-3" /> Save
                                                          </Button>
                                                        </div>
                                                      </div>
                                                  ) : (
                                                      // Display mode for synonym
                                                      <>
                                                        <div className="flex justify-between items-center">
                                                          <span className="font-medium">{synonym.word}</span>
                                                          <div className="flex gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => toggleEditSynonym(word.id, synonym.id)}
                                                            >
                                                              <Edit className="h-3 w-3" />
                                                              <span className="sr-only">Edit</span>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => deleteSynonym(word.id, synonym.id)}
                                                            >
                                                              <Trash className="h-3 w-3" />
                                                              <span className="sr-only">Delete</span>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => toggleExamples(word.id, synonym.id)}
                                                            >
                                                              <BookOpen className="h-3 w-3" />
                                                              <span className="sr-only">Examples</span>
                                                            </Button>
                                                          </div>
                                                        </div>

                                                        {synonym.showExamples && (
                                                            <div className="mt-3 pl-3 border-l border-gray-200">
                                                              <div className="flex items-center justify-between mb-2">
                                                                <h4 className="text-sm font-medium">Examples</h4>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => addExample(word.id, synonym.id)}
                                                                >
                                                                  <Plus className="mr-1 h-3 w-3" /> Add Example
                                                                </Button>
                                                              </div>

                                                              {synonym.examples.length === 0 ? (
                                                                  <p className="text-sm text-muted-foreground italic">
                                                                    No examples added yet.
                                                                  </p>
                                                              ) : (
                                                                  <ul className="space-y-2">
                                                                    {synonym.examples.map((example) => (
                                                                        <li key={example.id} className="flex items-start gap-2">
                                                                          <div className="flex-1">
                                                                            <Input
                                                                                value={example.text}
                                                                                onChange={(e) =>
                                                                                    updateExample(word.id, synonym.id, example.id, e.target.value)
                                                                                }
                                                                                className="text-sm"
                                                                            />
                                                                          </div>
                                                                          <Button
                                                                              variant="ghost"
                                                                              size="icon"
                                                                              className="h-8 w-8"
                                                                              onClick={() => deleteExample(word.id, synonym.id, example.id)}
                                                                          >
                                                                            <Trash className="h-3 w-3" />
                                                                            <span className="sr-only">Delete</span>
                                                                          </Button>
                                                                        </li>
                                                                    ))}
                                                                  </ul>
                                                              )}
                                                            </div>
                                                        )}
                                                      </>
                                                  )}
                                                </div>
                                            ))
                                        )}
                                      </div>
                                    </div>
                                )}
                              </CardContent>
                            </>
                        )}
                      </Card>
                  ))
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="xl:col-span-1">
            {/* Word Comparison Section */}
            <WordComparison/>
            {/* AI Chatbot Section */}
            <ChatBox/>
          </div>
        </div>
      </div>
  )
}
