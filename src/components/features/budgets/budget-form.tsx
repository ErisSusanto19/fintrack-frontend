'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from "@/store/hooks";
import { Budget } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    categoryId: z.string().nullable(),
    amountLimit: z.string().min(1, { message: "Limit amount is required."})
        .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
            message: "Limit amount must be greater than 0."
        })
})

type FormValues = z.infer<typeof formSchema>

interface BudgetFormProps {
    onSubmit: (values: any) => void;
    defaultValues: Budget | null;
    isEditMode: boolean;
}

export const BudgetForm = ({onSubmit, defaultValues, isEditMode}: BudgetFormProps) => {
    const { items: categories } = useAppSelector(state => state.categories)
    const { loading } = useAppSelector(state => state.budgets)
    const isLoading = loading == 'pending'

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: defaultValues?.categoryId || '',
            amountLimit: defaultValues?.amountLimit.toString() || ''
        }
    })

    const handleFormSubmit = (values: FormValues) => {
        const finalValues = {
            ...values,
            amountLimit: parseFloat(values.amountLimit)
        }

        onSubmit(finalValues);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                {!isEditMode && (
                    <FormField
                        name="categoryId"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={(value) => field.onChange(value === "null" ? null : value)} defaultValue={field.value ?? undefined} disabled={isLoading}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    name="amountLimit"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Limit</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number" 
                                    placeholder="e.g., 2000000" 
                                    {...field} 
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isEditMode ? 'Save Changes' : 'Set Budget'}
                </Button>
            </form>
        </Form>
    )
}