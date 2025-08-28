'use client'

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { RecurringTransaction } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { parseCronExpression } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
    accountId: z.string().min(1, { message: "Please select an account"}),
    categoryId: z.string().min(1, { message: "Please select a category"}),
    type: z.enum(['INCOME', 'EXPENSE']),
    amount: z.string().min(1, { message: "Amount is required" })
        .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
            message: "Amount must be a number greater than 0."
        }),
    frequency: z.enum(['MONTHLY', 'WEEKLY', 'DAILY']),
    // day: z.string().min(1, { message: "Day is required" })
    //     .refine(val => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 1 && parseInt(val, 10) <= 31, {
    //         message: "Please enter a valid day (1-31)."
    //     }),
    day: z.string().optional(),
    startDate: z.date().min(1, { message: "Start date is required" }),
    endDate: z.date().optional().nullable(),
    description: z.string().min(1, { message: "Description is required"}),
    isActive: z.boolean()
})
.superRefine((data, ctx) => {
    if ((data.frequency === 'WEEKLY' || data.frequency === 'MONTHLY') && (!data.day || data.day.trim() === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['day'],
            message: 'Please select a day for the chosen frequency.',
        });
    }

    if (data.frequency === 'WEEKLY' && data.day) {
        const dayNum = parseInt(data.day, 10);
        if (dayNum < 1 || dayNum > 7) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['day'],
                message: 'Please select a valid day of the week.',
            });
        }
    }
});

type FormValuesAsString = z.infer<typeof formSchema>;

export type RecurringFormValues = {
  accountId: string;
  categoryId: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  frequency: 'MONTHLY' | 'WEEKLY' | 'DAILY';
  day: number;
  startDate: Date;
  endDate: Date | null | undefined;
  description: string;
  isActive: boolean;
};

interface RecurringFormProps {
    onSubmit: (values: any) => void;
    defaultValues: RecurringTransaction | null;
    isEditMode: boolean;
}

const daysOfWeek = [
    { value: 1, label: 'Monday' }, { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' }, { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' }, { value: 6, label: 'Saturday' }, { value: 7, label: 'Sunday' }
];

const RecurringForm = ({onSubmit, defaultValues, isEditMode}: RecurringFormProps ) => {
    const { items: accounts } = useAppSelector(state => state.accounts)
    const { items: categories } = useAppSelector(state => state.categories)
    const { loading } = useAppSelector(state => state.recurring)
    const isLoading = loading == 'pending'

    const initialSchedule = defaultValues 
        ? parseCronExpression(defaultValues.cronExpression)
        : { frequency: 'MONTHLY', day: new Date().getDate() };

    const form = useForm<FormValuesAsString>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accountId: defaultValues?.accountId || '',
            categoryId: defaultValues?.categoryId || '',
            type: defaultValues?.type || 'EXPENSE',
            amount: defaultValues?.amount?.toString() || '',
            frequency: defaultValues ? initialSchedule.frequency as 'MONTHLY' | 'WEEKLY' | 'DAILY' : 'MONTHLY',
            day: defaultValues? initialSchedule.day.toString() : '',
            startDate: defaultValues?.startDate? new Date(defaultValues.startDate) : new Date(),
            endDate: defaultValues?.endDate? new Date(defaultValues.endDate) : null,
            description: defaultValues?.description || '',
            isActive: defaultValues?.isActive ?? true,
        },
    })

    const selectedFrequency = form.watch('frequency')
    const selectedType = form.watch('type')

    const handleFormSubmit = (values: FormValuesAsString) => {
        console.log('submit button clicked');

        let dayForPayload: number;
        if (values.frequency === 'DAILY') {
            dayForPayload = 1;
        } else {
            dayForPayload = parseInt(values.day!, 10);
        }
        
        const finalValues = {
            ...values,
            amount: parseFloat(values.amount),
            day: dayForPayload,
        };

        console.log(finalValues);
        
        onSubmit(finalValues);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className='flex flex-col h-full max-h-[70vh]'>
                <div className='flex-grow space-y-4 overflow-y-auto pr-4 pl-2 py-2'>
                    <FormField
                        name="accountId"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Account</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={ isEditMode || isLoading}>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditMode || isLoading}>
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

                    <div className='grid grid-cols-2 gap-4'>
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditMode || isLoading}>
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

                    <div className='grid grid-cols-2 gap-4'>
                        <FormField
                            name="frequency"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Frequency</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="DAILY">Daily</SelectItem>
                                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        {selectedFrequency === 'MONTHLY' && (
                            <FormField name="day" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Day of Month</FormLabel>
                                    <FormControl>
                                        <Input type="number" min={1} max={31} {...field} disabled={isLoading} />
                                    </FormControl>
                                </FormItem>
                            )} />
                        )}
                
                        {selectedFrequency === 'WEEKLY' && (
                            <FormField name="day" control={form.control} render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Day of Week</FormLabel>
                                    <Select onValueChange={(val) => field.onChange(val)} defaultValue={field.value || ''} disabled={isLoading}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a day" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {daysOfWeek.map(d => <SelectItem key={d.value} value={d.value.toString()}>{d.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField name="startDate" control={form.control} render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")} disabled={isEditMode || isLoading}>
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="endDate" control={form.control} render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>End Date (Optional)</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                            </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar 
                                            mode="single"
                                            selected={field.value ?? undefined} 
                                            onSelect={field.onChange} 
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    {isEditMode && (
                        <FormField
                            name="isActive"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Status</FormLabel>
                                        <FormDescription>
                                            Set whether this schedule is active or inactive.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value ?? false}
                                            onCheckedChange={field.onChange}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                <div className='flex-shrink-0 pt-3 border-t'>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isEditMode ? 'Save Changes' : 'Create Schedule'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default RecurringForm;