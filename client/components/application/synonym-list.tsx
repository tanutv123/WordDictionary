import { Synonym } from "@/models/word";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, Check, X } from "lucide-react";
import React from "react";

type SynonymListProps = {
    synonyms: Synonym[];
    wordId: string;
    onEdit: (wordId: string, synonymId: string) => void;
    onSave: (wordId: string, synonymId: string, updated: Partial<Synonym>) => void;
    onDelete: (wordId: string, synonymId: string) => void;
    onChange: (wordId: string, synonymId: string, text: string) => void;
};

export default function SynonymList({ synonyms, wordId, onEdit, onSave, onDelete, onChange }: SynonymListProps) {
    return (
        <div className="pl-4 border-l-2 border-gray-200 space-y-4">
            {synonyms.length === 0 ? (
                <p className="text-muted-foreground italic">No synonyms added yet.</p>
            ) : (
                synonyms.map((synonym) => (
                    <div key={synonym.id} className="border rounded-md p-3">
                        {synonym.isEditing ? (
                            <div className="flex gap-2">
                                <Input
                                    value={synonym.text}
                                    onChange={(e) => onChange(wordId, synonym.id, e.target.value)}
                                    className="flex-1"
                                />
                                <Button onClick={() => onSave(wordId, synonym.id, { text: synonym.text })}>
                                    <Check className="mr-2 h-4 w-4" /> Save
                                </Button>
                                <Button variant="outline" onClick={() => onEdit(wordId, synonym.id)}>
                                    <X className="mr-2 h-4 w-4" /> Cancel
                                </Button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{synonym.text}</span>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" onClick={() => onEdit(wordId, synonym.id)}>
                                        <Edit className="h-3 w-3" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => onDelete(wordId, synonym.id)}>
                                        <Trash className="h-3 w-3" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
