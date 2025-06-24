"use client"

import CategoryStore from "./categoryStore";
import CommonStore from "./commonStore";
import WordStore from "./wordStore";

interface Store {
    wordStore: WordStore;
    categoryStore: CategoryStore;
    commonStore: CommonStore;
}

export const store: Store = {
    wordStore: new WordStore(),
    categoryStore: new CategoryStore(),
    commonStore: new CommonStore()
};
