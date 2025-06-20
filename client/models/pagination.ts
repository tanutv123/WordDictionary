export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedResult<T> {
    items: T;
    pagination: Pagination;

    constructor(items: T, pagination: Pagination) {
        this.items = items;
        this.pagination = pagination;
    }
}

export class PagingParams {
    pageNumber;
    pageSize;
    searchTerm;
    category: string[];
    constructor(pageNumber = 1, pageSize = 5, searchTerm = '', category = []) {
        this.pageSize = pageSize;
        this.pageNumber = pageNumber;
        this.searchTerm = searchTerm;
        this.category = category;
    }
}