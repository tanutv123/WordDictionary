import { useContext } from "react";
import { StoreContext } from "@/store/storeWrapper";

export const useStore = () => {
    return useContext(StoreContext);
};