import agent from "@/api/agent";
import { Pagination, PagingParams } from "@/models/pagination";
import { Word } from "@/models/word";
import { log } from "console";
import { makeAutoObservable } from "mobx";


export default class WordStore {
    words: Word[] = [];
    loading = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    searchTerm = '';
    selectedCategories: string[] = [];

    constructor() {
        makeAutoObservable(this);
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

    //Loading and words related methods
    setLoading = (loading: boolean) => {
        this.loading = loading;
    }

    setWords = (words: Word[]) => {
        this.words = words;
    }

    loadWords = async () => {
        this.setLoading(true);
        try {
            const data = await agent.Words.list(this.axiosParams);
            this.setPagination(data.pagination);
            this.setWords(data.items);
            console.log('Words loaded:', this.words);
        } catch (error) {
            console.error('Failed to fetch words:', error);
        } finally {
            this.setLoading(false);
        }
    }
    //End of Loading and words related methods

}