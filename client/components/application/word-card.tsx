import { Word, Synonym } from "@/models/word";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash, ChevronUp, ChevronDown, Check, X } from "lucide-react";
import SynonymList from "./synonym-list";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

type WordCardProps = {
    word: Word;
    onToggleExpand: (wordId: string) => void;
    onToggleEdit: (wordId: string) => void;
    onDelete: (wordId: string) => void;
    onAddSynonym: (wordId: string) => void;
    onEditSynonym: (wordId: string, synonymId: string) => void;
    onSaveSynonym: (wordId: string, synonymId: string, updated: Partial<Synonym>) => void;
    onDeleteSynonym: (wordId: string, synonymId: string) => void;
    onChangeSynonym: (wordId: string, synonymId: string, text: string) => void;
    onSaveWord: (wordId: string, updated: Partial<Word>) => void;
};

function WordCard({
    word,
    onToggleExpand,
    onToggleEdit,
    onDelete,
    onAddSynonym,
    onEditSynonym,
    onSaveSynonym,
    onDeleteSynonym,
    onChangeSynonym,
    onSaveWord,
}: WordCardProps) {
    return (
        <Card className="w-full mb-3 overflow-hidden">
            {word.isEditing ? (
                <CardContent className="pt-6">
                    <Formik
                        initialValues={{ text: word.text || "", definition: word.definition || "" }}
                        enableReinitialize
                        validate={values => {
                            const errors: { text?: string; definition?: string } = {};
                            if (!values.text || values.text.trim() === "") {
                                errors.text = "Word is required.";
                            }
                            if (!values.definition || values.definition.trim() === "") {
                                errors.definition = "Definition is required.";
                            }
                            return errors;
                        }}
                        onSubmit={(values) => {
                            onSaveWord(word.id, { text: values.text, definition: values.definition });
                        }}
                    >
                        {({ isSubmitting, isValid, dirty, resetForm }) => (
                            <Form className="grid gap-4">
                                <div>
                                    <Label htmlFor={`word-${word.id}`}>Word</Label>
                                    <Field
                                        as={Input}
                                        id={`word-${word.id}`}
                                        name="text"
                                        autoComplete="off"
                                    />
                                    <ErrorMessage name="text" component="p" className="text-xs text-red-500 mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor={`definition-${word.id}`}>Definition</Label>
                                    <Field
                                        as={Textarea}
                                        id={`definition-${word.id}`}
                                        name="definition"
                                        autoComplete="off"
                                    />
                                    <ErrorMessage name="definition" component="p" className="text-xs text-red-500 mt-1" />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => {
                                            onToggleEdit(word.id);
                                            resetForm();
                                        }}
                                    >
                                        <X className="mr-2 h-4 w-4" /> Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting || !isValid || !dirty}>
                                        <Check className="mr-2 h-4 w-4" /> Save
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </CardContent>
            ) : (
                <div key={word.id}>
                    <CardHeader className="pb-3">
                        <div className="flex justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold">{word.text}</h2>
                                    {
                                        word.categories.map((category, index) => (
                                            <span key={index} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                                                {category}
                                            </span>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => onToggleEdit(word.id)}>
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => onDelete(word.id)}>
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => onToggleExpand(word.id)}>
                                    {word.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    <span className="sr-only">{word.expanded ? "Collapse" : "Expand"}</span>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Definition</h3>
                                <p className="text-lg">{word.definition}</p>
                            </div>
                        </div>
                        {word.expanded && (
                            <div className="mt-6 pt-6 border-t">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-medium">Synonyms</h3>
                                    <Button size="sm" onClick={() => onAddSynonym(word.id)}>
                                        <Plus className="mr-2 h-3 w-3" /> Add Synonym
                                    </Button>
                                </div>
                                <SynonymList
                                    synonyms={word.synonyms}
                                    wordId={word.id}
                                    onEdit={onEditSynonym}
                                    onSave={onSaveSynonym}
                                    onDelete={onDeleteSynonym}
                                    onChange={onChangeSynonym}
                                />
                            </div>
                        )}
                    </CardContent>
                </div>
            )}
        </Card>
    );
}

export default WordCard;