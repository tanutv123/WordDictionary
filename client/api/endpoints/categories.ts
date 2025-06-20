import { Category } from "@/models/word";
import { endpoint1 } from "../axios";
import { createRequests } from "../requests";

const requests = createRequests(endpoint1);

const Categories = {
    list: () => requests.get<Category[]>('categories'),
};

export default Categories;
