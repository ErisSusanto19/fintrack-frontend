'use client';

import { useAppSelector } from "@/store/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Account } from "@/types";

const formSchema = z.object({
    name: z.string().min(1, { message: 'Account name is required' }),
    type: z.string().min(1, { message: 'Account type is required' }),
    balance: z.number().min(0, { message: 'Account balance cannot be negative' }),
})

type FormValues = z.infer<typeof formSchema>

interface AccountFormProps {
    onSubmit: (values: FormValues) => void;
    defaultValues?: Account | null;
    isEditMode: boolean;
}

const accountTypes = [
    {value: "BANK", display: "Bank"},
    {value: "EWALLET", display: "E-Wallet"},
    {value: "CASH", display: "Cash"},
    {value: "CREDIT_CARD", display: "Credit Card"},
    {value: "INVESTMENT", display: "Investment"}
]

const AccountForm = ({ onSubmit, defaultValues, isEditMode }: AccountFormProps) => {
    const { loading } = useAppSelector(state => state.accounts);
    const isLoading = loading == 'pending'

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: defaultValues?.name || '',
            type: defaultValues?.type || '',
            balance: defaultValues?.balance || 0,
        }
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. BCA Bank, GoPay" {...field} disabled={isLoading}/>
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
                            <FormLabel>Account Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an account type"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {accountTypes.map(type => (
                                        <SelectItem key={type.value} value={type.value}>{type.display}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {!isEditMode && (
                    <FormField
                        name="balance"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account Balance</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number" 
                                        placeholder="0" 
                                        {...field} 
                                        onChange={event => {
                                            const value = event.target.value;
                                            field.onChange(value === '' ? '' : parseFloat(value));
                                        }}
                                        value={field.value === 0 && !form.formState.dirtyFields.balance ? '' : field.value}
                                        disabled={isLoading}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && (<Loader2 className="w-4 h-4 mr-2 animate-spin"/>)}
                    {isEditMode ? 'Save Changes' : 'Create Account'}
                </Button>
            </form>
        </Form>
    )
}

export default AccountForm;