import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Plus, X} from "lucide-react";
import {useState} from "react";

function WordComparison() {
    // Word comparison state - new design
    const [targetWord, setTargetWord] = useState("")
    const [comparisonWords, setComparisonWords] = useState<string[]>([])
    const [newComparisonWord, setNewComparisonWord] = useState("")
    const [comparisonResults, setComparisonResults] = useState<{ word: string; similarity: number }[]>([])
    const [showComparison, setShowComparison] = useState(false)

    const addComparisonWord = () => {
        if (newComparisonWord.trim() && !comparisonWords.includes(newComparisonWord.trim()) && comparisonWords.length < 8) {
            setComparisonWords([...comparisonWords, newComparisonWord.trim()])
            setNewComparisonWord("")
        }
    }

    const removeComparisonWord = (word: string) => {
        setComparisonWords(comparisonWords.filter((w) => w !== word))
    }

    const runComparison = () => {
        if (!targetWord.trim() || comparisonWords.length === 0) return

        // Simulate comparison results with random percentages for demo
        const results = comparisonWords
            .map((word) => ({
                word,
                similarity: Math.floor(Math.random() * 100) + 1,
            }))
            .sort((a, b) => b.similarity - a.similarity)

        setComparisonResults(results)
        setShowComparison(true)
    }

    const clearComparison = () => {
        setTargetWord("")
        setComparisonWords([])
        setNewComparisonWord("")
        setComparisonResults([])
        setShowComparison(false)
    }
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">%</span>
                    </div>
                    Word Similarity Checker
                </CardTitle>
                <CardDescription>
                    Enter a target word and compare other words against it to see how similar they are.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Target Word Section */}
                    <div className="text-center">
                        <Label className="text-sm font-medium mb-2 block">Target Word</Label>
                        <div className="max-w-md mx-auto">
                            <Input
                                placeholder="Enter the main word to compare against..."
                                value={targetWord}
                                onChange={(e) => setTargetWord(e.target.value)}
                                className="text-center text-lg font-medium"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            This is the reference word that others will be compared to
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Compare Against</span>
                        </div>
                    </div>

                    {/* Comparison Words Section */}
                    <div>
                        <Label className="text-sm font-medium mb-3 block">Words to Compare</Label>

                        {/* Add new word input */}
                        <div className="flex gap-2 mb-4">
                            <Input
                                placeholder="Enter a word to compare..."
                                value={newComparisonWord}
                                onChange={(e) => setNewComparisonWord(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && addComparisonWord()}
                                className="flex-1"
                            />
                            <Button
                                onClick={addComparisonWord}
                                disabled={!newComparisonWord.trim() || comparisonWords.length >= 8}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Add
                            </Button>
                        </div>

                        {/* Comparison words grid */}
                        {comparisonWords.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                                {comparisonWords.map((word, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-secondary text-secondary-foreground px-3 py-2 rounded-lg text-sm"
                                    >
                                        <span className="truncate">{word}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 ml-2 hover:bg-secondary-foreground/20"
                                            onClick={() => removeComparisonWord(word)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                <p className="text-sm">No comparison words added yet</p>
                                <p className="text-xs mt-1">
                                    Add words above to compare against "{targetWord || "your target word"}"
                                </p>
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground mb-4">
                            Add up to 8 words to compare. You can enter any words, not just ones from your dictionary.
                        </p>

                        {/* Action buttons */}
                        <div className="flex gap-2 justify-center">
                            <Button
                                onClick={runComparison}
                                disabled={!targetWord.trim() || comparisonWords.length === 0}
                                className="min-w-[120px]"
                            >
                                Compare Words
                            </Button>

                            {(targetWord || comparisonWords.length > 0) && (
                                <Button variant="outline" onClick={clearComparison}>
                                    Clear All
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Comparison Results */}
                    {showComparison && comparisonResults.length > 0 && (
                        <div className="border-t pt-6">
                            <div className="text-center mb-4">
                                <h4 className="font-medium text-lg">Similarity Results</h4>
                                <p className="text-sm text-muted-foreground">
                                    Comparing against: <span className="font-medium">"{targetWord}"</span>
                                </p>
                            </div>

                            <div className="space-y-3">
                                {comparisonResults.map(({ word, similarity }, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <span className="font-medium">{word}</span>
                                                <div className="text-xs text-muted-foreground">vs {targetWord}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 min-w-[140px]">
                                            <div className="flex-1 bg-muted rounded-full h-3">
                                                <div
                                                    className={`h-3 rounded-full transition-all duration-700 ${
                                                        similarity >= 80
                                                            ? "bg-green-500"
                                                            : similarity >= 60
                                                                ? "bg-blue-500"
                                                                : similarity >= 40
                                                                    ? "bg-yellow-500"
                                                                    : "bg-red-500"
                                                    }`}
                                                    style={{ width: `${similarity}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold w-12 text-right">{similarity}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-4 bg-muted rounded-lg">
                                <h5 className="text-sm font-medium mb-3">Similarity Scale</h5>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                                        <span>80%+ Highly Similar</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                        <span>60-79% Very Similar</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                                        <span>40-59% Somewhat Similar</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                                        <span>0-39% Different</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default WordComparison;