'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from "@/store/hooks";
import { Transaction } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    accountId: z.string().min(1, { message:"Please select an account" }),
    categoryId: z.string().min(1, { message:"Please select a category" }),
    type: z.enum(['INCOME', 'EXPENSE']),
    amount: z.string().min(1, { message: "Amount is required." })
      .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a number greater than 0.",
      }),
    description: z.string().min(1, { message: "Description is required"}),
    transactionDate: z.string().min(1, { message: "Date is required"})
})

type FormValues = z.infer<typeof formSchema>

interface TransactionFormProps {
    onSubmit: (values: any) => void;
    defaultValues: Transaction | null;
    isEditMode: boolean;
}

const TransactionForm = ({onSubmit, defaultValues, isEditMode}: TransactionFormProps) => {
    const { items: accounts } = useAppSelector(state => state.accounts)
    const { items: categories } = useAppSelector(state => state.categories)
    const { loading } = useAppSelector(state => state.transactions)
    const isLoading = loading == 'pending'

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accountId: defaultValues?.accountId || '',
            categoryId: defaultValues?.categoryId || '',
            type: defaultValues?.type || 'EXPENSE',
            amount: defaultValues?.amount.toString() || '',
            description: defaultValues?.description || '',
            transactionDate: defaultValues?.transactionDate || new Date().toISOString().split('T')[0]
        }
    })

    const handleFormSubmit = (values: FormValues) => {
        const finalValues = {
            ...values,
            amount: parseFloat(values.amount),
        };

        onSubmit(finalValues);
    };

    const selectedType = form.watch('type')

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                <FormField
                    name="transactionDate"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="accountId"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an account" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {accounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
           
                <FormField
                    name="categoryId"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                <SelectContent>
                                    {categories.filter(cat => cat.type === selectedType).map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        name="amount"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number" 
                                        placeholder="0.00" 
                                        {...field} 
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage />
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
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="EXPENSE">Expense</SelectItem>
                                        <SelectItem value="INCOME">Income</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Lunch with clients" {...field} disabled={isLoading} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {isEditMode ? 'Save Changes' : 'Create Transaction'}
                </Button>
            </form>
        </Form>
    )
}

export default TransactionForm;