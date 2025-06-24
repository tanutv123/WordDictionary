import { ServerError } from "@/models/server-error";

export default class CommonStore {
    error: ServerError | null = null;

    setError(error: ServerError) {
        this.error = error;
        console.log("Error set in CommonStore:", error);
    }
}