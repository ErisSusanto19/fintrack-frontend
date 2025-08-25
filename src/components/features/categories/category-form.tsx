'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from "@/store/hooks";
import { Category } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1, { message: "Category name is required"}),
    type: z.string().min(1, { message: "Type is required"}),
})

type FormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
    onSubmit: (values: FormValues) => void;
    defaultValues?: Category | null;
    isEditMode: boolean
}

const transactionTypes = [
    {value: "INCOME", display: "Income"},
    {value: "EXPENSE", display: "Expense"},
]

const CategoryForm = ({onSubmit, defaultValues, isEditMode}: CategoryFormProps) => {
    const { loading } = useAppSelector(state => state.categories)
    const isLoading = loading == 'pending' 

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: defaultValues?.name || '',
            type: defaultValues?.type || ''
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g Sallary, Transportation, Food" {...field} disabled={isLoading}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    name="type"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {transactionTypes.map(type => (
                                        <SelectItem key={type.value} value={type.value}>{type.display}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin"/>}
                    {isEditMode? 'Save Changes' : 'Create Category'}
                </Button>
            </form>
        </Form>
    )
}

export default CategoryForm;