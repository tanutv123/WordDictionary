import { Word, Synonym } from "@/models/word";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash, ChevronUp, ChevronDown, Check, X, Loader2Icon } from "lucide-react";
import SynonymList from "./synonym-list";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup"
import { observer } from "mobx-react-lite";
import { useStore } from "@/store/useStore";
import { Select, SelectContent, SelectTrigger } from "../ui/select";
import { v4 as uuid } from "uuid";
import ValidationError from "../error/validation-error";
import { set } from "date-fns";


type WordCardProps = {
    word: Word;
    onToggleExpand: (wordId: string) => void;
    onToggleEdit: (wordId: string, isAddedCancel?: boolean) => void;
    onDelete: (wordId: string) => void;
    onAddSynonym: (wordId: string) => void;
    onEditSynonym: (wordId: string, synonymId: string) => void;
    onSaveSynonym: (wordId: string, synonymId: string, updated: Partial<Synonym>) => void;
    onDeleteSynonym: (wordId: string, synonymId: string) => void;
    onChangeSynonym: (wordId: string, synonymId: string, text: string) => void;
    onSaveWord: (wordId: string, updated: Partial<Word>) => Promise<void>;
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
    const { categoryStore, wordStore } = useStore();
    const { categories } = categoryStore;
    const [loadingSave, setLoadingSave] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const validationSchema = Yup.object({
        text: Yup.string().required("Word is required."),
        definition: Yup.string().required("Definition is required."),
        categoryIds: Yup.array().of(Yup.string()).required("At least one category is required."),
        examples: Yup.array().of(Yup.object({
            text: Yup.string().required("Example text is required.")
        })).min(1, "At least one example is required.")
    });
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(categorySearch.toLowerCase())
    );
    return (
        <Card className="w-full mb-3 overflow-hidden">
            {word.isEditing ? (
                <CardContent className="pt-6">
                    <Formik
                        initialValues={{ id: word.id, text: word.text || "", definition: word.definition || "", categoryIds: word.categoryIds || [], categories: word.categories || [], examples: word.examples || [], error: [] }}
                        enableReinitialize
                        validationSchema={validationSchema}
                        onSubmit={(values, { setErrors }) => {
                            setLoadingSave(true);
                            onSaveWord(word.id, values)
                                .catch((error) => { if (Array.isArray(error)) setErrors({ error }); })
                                .finally(() => setLoadingSave(false));
                        }}
                    >
                        {({ isSubmitting, isValid, dirty, resetForm, errors, setFieldValue, values, touched }) => (
                            <Form className="grid gap-4">
                                <div>
                                    <ValidationError error={errors.error as unknown as string[]} />
                                </div>
                                <div>
                                    <Label htmlFor={`word-${word.id}`}>Word</Label>
                                    <Field
                                        as={Input}
                                        id={`word-${word.id}`}
                                        name="text"
                                        className={errors.text && touched.text ? "border-red-500" : ""}
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
                                        className={errors.definition && touched.definition ? "border-red-500" : ""}
                                        autoComplete="off"
                                    />
                                    <ErrorMessage name="definition" component="p" className="text-xs text-red-500 mt-1" />
                                </div>
                                {/* Examples input section */}
                                <div>
                                    <Label>Examples</Label>
                                    <FieldArray name="examples">
                                        {({ push, remove }) => (
                                            <div className="space-y-2">
                                                {values.examples && values.examples.length > 0 &&
                                                    values.examples.map((example: any, idx: number) => {
                                                        const fieldName = `examples[${idx}].text`;
                                                        const error =
                                                            Array.isArray(errors.examples) &&
                                                                errors.examples[idx] &&
                                                                typeof errors.examples[idx] === "object" &&
                                                                "text" in errors.examples[idx]
                                                                ? (errors.examples[idx] as any).text
                                                                : undefined;

                                                        const touchedField =
                                                            Array.isArray(touched.examples) &&
                                                            touched.examples[idx] &&
                                                            typeof touched.examples[idx] === "object" &&
                                                            "text" in touched.examples[idx];

                                                        return (
                                                            <div key={idx} className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-2">
                                                                    <Field
                                                                        as={Input}
                                                                        name={fieldName}
                                                                        placeholder={`Example ${idx + 1}`}
                                                                        className={
                                                                            touchedField && error
                                                                                ? "border-red-500"
                                                                                : ""
                                                                        }
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => remove(idx)}
                                                                        disabled={values.examples.length === 1}
                                                                    >
                                                                        <Trash className="h-4 w-4" />
                                                                    </Button>
                                                                </div>

                                                                <ErrorMessage
                                                                    name={fieldName}
                                                                    component="p"
                                                                    className="text-xs text-red-500 ml-1"
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => push({ id: uuid(), text: "" })}
                                                >
                                                    <Plus className="mr-2 h-3 w-3" /> Add Example
                                                </Button>
                                            </div>
                                        )}
                                    </FieldArray>
                                </div>
                                <div>
                                    <Field name="categoryIds">
                                        {({ field }: { field: any }) => (
                                            <div>
                                                <Label htmlFor={`categories-${word.id}`}>Categories</Label>
                                                <div className="relative">
                                                    <Select
                                                        open={undefined}
                                                    >
                                                        <SelectTrigger className={`w-full ${errors.categoryIds ? "border-red-500" : ""}`}>
                                                            <span className="truncate">
                                                                {values.categoryIds.length === 0
                                                                    ? "Select categories"
                                                                    : values.categories.join(", ")}
                                                            </span>
                                                        </SelectTrigger>
                                                        <SelectContent className="max-h-72 overflow-y-auto">
                                                            <div className="p-2">
                                                                <Input
                                                                    placeholder="Search categories..."
                                                                    value={categorySearch}
                                                                    onChange={e => setCategorySearch(e.target.value)}
                                                                    className="mb-2"
                                                                />
                                                            </div>
                                                            {filteredCategories.length === 0 ? (
                                                                <div className="px-4 py-2 text-muted-foreground text-sm">No categories found</div>
                                                            ) : (
                                                                filteredCategories.map((cat) => (
                                                                    <div
                                                                        key={cat.id}
                                                                        className="flex items-center px-4 py-2 cursor-pointer hover:bg-accent"
                                                                        onClick={() => {
                                                                            const isSelected = values.categoryIds.includes(cat.id);
                                                                            const newSelected = isSelected
                                                                                ? values.categoryIds.filter((c: string) => c !== cat.id)
                                                                                : [...values.categoryIds, cat.id];
                                                                            const newCategoryNames = isSelected
                                                                                ? values.categories.filter((c: string) => c !== cat.name)
                                                                                : [...values.categories, cat.name];
                                                                            setFieldValue("categoryIds", newSelected);
                                                                            setFieldValue("categories", newCategoryNames);
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={values.categoryIds.includes(cat.id)}
                                                                            readOnly
                                                                            className="mr-2"
                                                                        />
                                                                        <span>{cat.name}</span>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                    </Field>
                                    <ErrorMessage name="categoryIds" component="p" className="text-xs text-red-500 mt-1" />
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
                                        {loadingSave ? <Loader2Icon className="animate-spin" /> : <><Check className="mr-2 h-4 w-4" /> Save</>}
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
                                <h3 className="text-lg mb-1">Definition</h3>
                                <p className="text-sm font-medium text-muted-foreground">{word.definition}</p>
                            </div>
                        </div>
                        {word.examples && word.examples.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium mb-2">Examples</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    {word.examples.map((example, index) => (
                                        <li key={index} className="text-sm text-muted-foreground">
                                            {example.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
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

export default observer(WordCard);