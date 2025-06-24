"use client";

import { useStore } from "@/store/useStore";
import { observer } from "mobx-react-lite";

function ServerErrorPage() {
    const { commonStore } = useStore();
    const { error } = commonStore;

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6 border border-red-300">
                <h1 className="text-3xl font-bold text-red-600 mb-2">500 - Internal Server Error</h1>
                <p className="mb-4">
                    An unhandled exception occurred while processing your request.
                </p>

                <div className="bg-gray-900 text-green-300 p-4 rounded-lg font-mono text-sm whitespace-pre overflow-auto">
                    <p className="text-red-400 font-bold mb-2">{error?.message}</p>
                    <pre>{error?.details}</pre>
                </div>
                <p className="text-gray-600">
                    Please try again later or contact support.
                </p>
            </div>
        </div>
    );
}

export default observer(ServerErrorPage);
