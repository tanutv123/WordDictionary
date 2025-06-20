"use client"

import CategoryStore from "./categoryStore";
import WordStore from "./wordStore";

interface Store {
    wordStore: WordStore;
    categoryStore: CategoryStore;
}

export const store: Store = {
    wordStore: new WordStore(),
    categoryStore: new CategoryStore()
};
