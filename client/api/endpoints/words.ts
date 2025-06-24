import { Word, WordForm } from "@/models/word";
import { endpoint1 } from "../axios";
import { createRequests } from "../requests";
import { PaginatedResult } from "@/models/pagination";

const requests = createRequests(endpoint1);

const Words = {
    list: (params: URLSearchParams) => requests.get<PaginatedResult<Word[]>>('words?' + params.toString()),
    create: (data: WordForm) => requests.post<Word>('words', data),
    update: (data: Word) => requests.put<Word>('words', data),
}

export default Words;