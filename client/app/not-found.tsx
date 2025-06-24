import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">
                404 - Not Found
            </h1>
            <p className="mb-6 text-lg text-muted-foreground">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link
                href="/"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
            >
                Go Home
            </Link>
        </div>
    );
}
