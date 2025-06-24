import React from 'react';

interface ValidationErrorProps {
    error: string[];
}

const ValidationError: React.FC<ValidationErrorProps> = ({ error }) => {
    if (!error || error.length === 0) return null;

    return (
        <div className="mt-2 rounded-md bg-red-100 p-3 text-sm text-red-700 shadow-sm">
            <ul className="list-disc list-inside space-y-1">
                {error.map((err, index) => (
                    <li key={index}>{err}</li>
                ))}
            </ul>
        </div>
    );
};

export default ValidationError;
