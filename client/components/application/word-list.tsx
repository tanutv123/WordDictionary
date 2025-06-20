import { observer } from "mobx-react-lite";
import WordCard from "./word-card";
import { useStore } from "@/store/useStore";
import { Card, CardContent } from "../ui/card";

function WordList() {
    const { wordStore } = useStore();
    const { words, setWords, loading } = wordStore;
    // Toggle expanded state for a word card
    const toggleExpand = (wordId: string) => {
        setWords(words.map((word) => (word.id === wordId ? { ...word, expanded: !word.expanded } : word)))
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
                            syn.id === synonymId ? { ...syn, isEditing: !syn.isEditing } : syn
                        ),
                    }
                    : word
            )
        )
    }

    // Add a new synonym to a word
    const addSynonym = (wordId: string) => {
        const newSynonym = {
            id: `s${Date.now()}`,
            text: "",
            isEditing: true,
        }

        setWords(
            words.map((word) =>
                word.id === wordId
                    ? {
                        ...word,
                        synonyms: [...word.synonyms, newSynonym],
                    }
                    : word
            )
        )
    }

    // Save edited word
    const saveWord = (wordId: string, updatedWord: Partial<any>) => {
        setWords(words.map((word) => (word.id === wordId ? { ...word, ...updatedWord, isEditing: false } : word)))
    }

    // Save edited synonym
    const saveSynonym = (wordId: string, synonymId: string, updatedSynonym: Partial<any>) => {
        setWords(
            words.map((word) =>
                word.id === wordId
                    ? {
                        ...word,
                        synonyms: word.synonyms.map((syn) =>
                            syn.id === synonymId ? { ...syn, ...updatedSynonym, isEditing: false } : syn
                        ),
                    }
                    : word
            )
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

    // Delete a word
    const deleteWord = (wordId: string) => {
        setWords(words.filter((word) => word.id !== wordId))
    }

    // Add a handler for changing synonym text
    const handleChangeSynonym = (wordId: string, synonymId: string, text: string) => {
        setWords(
            words.map((word) =>
                word.id === wordId
                    ? {
                        ...word,
                        synonyms: word.synonyms.map((syn) =>
                            syn.id === synonymId ? { ...syn, text } : syn
                        ),
                    }
                    : word
            )
        );
    };
    return (
        <>
            {
                words.length == 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center text-muted-foreground">
                                <p>No words found matching your criteria.</p>
                                {/* {(searchTerm || selectedCategory !== "All") && (
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
                                )} */}
                            </div>
                        </CardContent>
                    </Card>
                ) : words.map((word) => (
                    <WordCard
                        key={word.id}
                        word={word}
                        onToggleExpand={toggleExpand}
                        onToggleEdit={toggleEditWord}
                        onDelete={deleteWord}
                        onAddSynonym={addSynonym}
                        onEditSynonym={toggleEditSynonym}
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