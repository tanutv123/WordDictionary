import { observer } from "mobx-react-lite";
import WordCard from "./word-card";
import { useStore } from "@/store/useStore";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

function WordList() {
    const { wordStore } = useStore();
    const { words, setWords, setExpanded, setEditWord,
        setEditSynonym, addSynonym, saveSynonym, saveWord,
        deleteSynonym, deleteWord, handleChangeSynonym,
        searchTerm, selectedCategories
    } = wordStore;

    // Delete an example
    const deleteExample = (wordId: string, exampleId: string) => {
        setWords(
            words.map((word) =>
                word.id === wordId
                    ? {
                        ...word,
                        examples: word.examples.filter((ex) => ex.id !== exampleId),
                    }
                    : word,
            ),
        )
    }

    // Update example text
    const updateExample = (wordId: string, exampleId: string, text: string) => {
        setWords(
            words.map((word) =>
                word.id === wordId
                    ? {
                        ...word,
                        examples: word.examples.map((ex) => (ex.id === exampleId ? { ...ex, text } : ex)),
                    }
                    : word,
            ),
        )
    }
    return (
        <>
            {
                words.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center text-muted-foreground">
                                <p>No words found matching your criteria.</p>
                                {(searchTerm || selectedCategories.length !== 0) && (
                                    <Button
                                        variant="link"
                                        onClick={() => {
                                            // setSearchTerm("")
                                            // setSelectedCategory("All")
                                        }}
                                        className="mt-2"
                                    >
                                        Clear filters to see all words
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : words.map((word) => (
                    <WordCard
                        key={word.id}
                        word={word}
                        onToggleExpand={setExpanded}
                        onToggleEdit={setEditWord}
                        onEditSynonym={setEditSynonym}
                        onDelete={deleteWord}
                        onAddSynonym={addSynonym}
                        onSaveSynonym={saveSynonym}
                        onDeleteSynonym={deleteSynonym}
                        onChangeSynonym={handleChangeSynonym}
                        onSaveWord={saveWord}
                    />
                ))
            }
        </>
    );
}

export default observer(WordList);