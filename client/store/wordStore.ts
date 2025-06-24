import agent from "@/api/agent";
import { Pagination, PagingParams } from "@/models/pagination";
import { Word, WordForm } from "@/models/word";
import { makeAutoObservable, reaction } from "mobx";
import { v4 as uuid } from 'uuid';


export default class WordStore {
    words: Word[] = [];
    loading = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    searchTerm = '';
    selectedCategories: string[] = [];

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => [this.searchTerm, this.selectedCategories],
            () => {
                this.setPagingParams(new PagingParams());
                this.words = [];
                this.loadWords();
            }
        );
    }


    //Pagination related methods
    setPagingParams = (params: PagingParams) => {
        params.searchTerm = this.searchTerm;
        params.category = this.selectedCategories;
        this.pagingParams = params;
    }

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        params.append('searchTerm', this.pagingParams.searchTerm.toString());
        this.pagingParams.category.forEach(category => {
            params.append('categories', category);
        });
        return params;
    }
    //End of Pagination related methods

    //Start of Search and Category related methods
    setSelectedCategories = (categories: string[]) => {
        this.selectedCategories = categories;
    }

    setSearchTerm = (term: string) => {
        this.searchTerm = term;
    }
    //End of Search and Category related methods

    //Start of Word Manipulation methods

    setExpanded = (wordId: string) => {
        this.words = this.words.map((word) =>
            word.id === wordId ? { ...word, expanded: !word.expanded } : word
        );
    }

    setEditWord = (wordId: string) => {
        if (wordId.includes('new')) {
            this.words = this.words.filter((word) => word.id !== wordId);
            return;
        }
        this.words = this.words.map((word) =>
            word.id === wordId ? { ...word, isEditing: !word.isEditing } : word
        );
    }

    setAddWord = () => {
        const newWord = {
            id: `new-${uuid()}`,
            text: "",
            definition: "",
            parentId: null,
            categories: [],
            expanded: false,
            isEditing: true,
            examples: [],
            synonyms: [],
        }
        this.words = [newWord, ...this.words];
    }

    deleteWord = (wordId: string) => {
        this.words = this.words.filter((word) => word.id !== wordId);
    }
    saveWord = async (wordId: string, updatedWord: Partial<Word>) => {
        if (wordId.includes('new')) {
            //Add word logic
            let wordForm = {
                id: updatedWord.id,
                text: updatedWord.text || "",
                definition: updatedWord.definition || "",
                parentId: updatedWord.parentId || null,
                categoryIds: updatedWord.categoryIds || [],
                examples: updatedWord.examples ? updatedWord.examples.map(ex => ex.text) : [],
            } as WordForm

            let result = await agent.Words.create(wordForm);
            if (result) {
                this.words = this.words.filter((word) => word.id !== wordId);
                this.words = [result, ...this.words];
            }
        } else {
            let result = await agent.Words.update(updatedWord as Word);
            this.words = this.words
                .map((word) => (word.id === wordId ? { ...word, ...result, isEditing: false } : word));
        }
    }
    //End of Word Manipulation methods

    //Start of Synonym related methods
    addSynonym = (wordId: string) => {
        const newSynonym = {
            id: `s${Date.now()}`,
            text: "",
            isEditing: true,
        }

        this.words = this.words.map((word) =>
            word.id === wordId
                ? {
                    ...word,
                    synonyms: [...word.synonyms, newSynonym],
                }
                : word
        )
    }

    setEditSynonym = (wordId: string, synonymId: string) => {
        this.words = this.words.map((word) =>
            word.id === wordId
                ? {
                    ...word,
                    synonyms: word.synonyms.map((syn) =>
                        syn.id === synonymId ? { ...syn, isEditing: !syn.isEditing } : syn
                    ),
                }
                : word
        )
    }

    deleteSynonym = (wordId: string, synonymId: string) => {
        this.words = this.words.map((word) =>
            word.id === wordId
                ? {
                    ...word,
                    synonyms: word.synonyms.filter((syn) => syn.id !== synonymId),
                }
                : word
        )
    }

    saveSynonym = (wordId: string, synonymId: string, updatedSynonym: Partial<any>) => {
        this.words = this.words.map((word) =>
            word.id === wordId
                ? {
                    ...word,
                    synonyms: word.synonyms.map((syn) =>
                        syn.id === synonymId ? { ...syn, ...updatedSynonym, isEditing: false } : syn
                    ),
                }
                : word
        )
    }

    handleChangeSynonym = (wordId: string, synonymId: string, text: string) => {
        this.words = this.words.map((word) =>
            word.id === wordId
                ? {
                    ...word,
                    synonyms: word.synonyms.map((syn) =>
                        syn.id === synonymId ? { ...syn, text } : syn
                    ),
                }
                : word
        );
    };
    //End of Synonym related methods

    //Loading and words related methods
    setLoading = (loading: boolean) => {
        this.loading = loading;
    }

    setWords = (words: Word[]) => {
        this.words = this.words.concat(words);
    }

    loadWords = async () => {
        this.setLoading(true);
        try {
            const data = await agent.Words.list(this.axiosParams);
            this.setPagination(data.pagination);
            this.setWords(data.items);
        } catch (error) {
            console.error('Failed to fetch words:', error);
        } finally {
            this.setLoading(false);
        }
    }
    //End of Loading and words related methods

}