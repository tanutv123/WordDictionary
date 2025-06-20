import agent from "@/api/agent";
import { Category } from "@/models/word";
import { makeAutoObservable } from "mobx";

export default class CategoryStore {
    categories: Category[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setCategories = (categories: Category[]) => {
        this.categories = categories;
    }

    loadCategories = async () => {
        try {
            const response = await agent.Categories.list();
            this.setCategories(response);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    }
}