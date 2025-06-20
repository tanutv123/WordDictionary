import { Word } from "@/models/word";
import { endpoint1 } from "../axios";
import { createRequests } from "../requests";
import { PaginatedResult } from "@/models/pagination";

const requests = createRequests(endpoint1);

const Words = {
    list: (params: URLSearchParams) => requests.get<PaginatedResult<Word[]>>('words?' + params.toString()),
}

export default Words;