export type Example = {
    id: string
    text: string
}

export type Synonym = {
    id: string
    text?: string
    isEditing: boolean
}

export type Word = {
    id: string
    text?: string
    definition?: string
    parentId?: string | null
    categories: string[]
    categoryIds?: string[]
    examples: Example[]
    synonyms: Synonym[]
    expanded: boolean
    isEditing: boolean
}

export type Category = {
    id: string;
    name: string;
}

export type WordForm = {
    id?: string;
    text: string;
    definition: string;
    parentId?: string | null;
    categoryIds: string[];
    examples: string[];
}
