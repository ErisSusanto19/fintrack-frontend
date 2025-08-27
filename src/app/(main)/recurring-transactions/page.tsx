'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RecurringFormValues } from '@/components/features/recurring/recurring-form';
import RecurringForm from '@/components/features/recurring/recurring-form';
import { loadRecurringTransactions, addRecurringTransaction, editRecurringTransaction, removeRecurringTransaction } from '@/store/features/recurring';
import { loadAccounts } from '@/store/features/accounts';
import { loadCategories } from '@/store/features/categories';
import { toast } from 'sonner';
import { RecurringTransaction } from '@/types';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { RecurringActions } from '@/components/features/recurring/recurring-actions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const generateCronExpression = (values: RecurringFormValues): string => {
    const { frequency, day } = values;
    if (frequency === 'DAILY') return '0 0 0 * * *';
    if (frequency === 'WEEKLY') return `0 0 0 * * ${day}`;
    if (frequency === 'MONTHLY') return `0 0 0 ${day} * *`;
    return '';
};

const RecurringPage = () => {
    const dispatch = useAppDispatch();
    const { items: schedules, loading } = useAppSelector((state) => state.recurring);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<RecurringTransaction | null>(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [scheduleToDelete, setScheduleToDelete] = useState<RecurringTransaction | null>(null);

    useEffect(() => {
        dispatch(loadRecurringTransactions());
        dispatch(loadAccounts());
        dispatch(loadCategories());
    }, [dispatch]);
    
    const handleFormSubmit = async (values: RecurringFormValues) => {
        const cronExpression = generateCronExpression(values);
        const payload = {
            ...values,
            cronExpression,
            startDate: format(values.startDate, 'yyyy-MM-dd'),
            endDate: values.endDate ? format(values.endDate, 'yyyy-MM-dd') : null,
        };

        const result = selectedSchedule
            ? await dispatch(editRecurringTransaction({ id: selectedSchedule.id, data: payload }))
            : await dispatch(addRecurringTransaction(payload));

        if (addRecurringTransaction.fulfilled.match(result) || editRecurringTransaction.fulfilled.match(result)) {
            toast.success(`Schedule ${selectedSchedule ? 'updated' : 'created'} successfully!`);
            setIsDialogOpen(false);
        } else {
            toast.error(result.payload as string);
        }
    };

     const handleDelete = async () => {
        if (scheduleToDelete) {
            const result = await dispatch(removeRecurringTransaction(scheduleToDelete.id));
            if (removeRecurringTransaction.fulfilled.match(result)) {
                toast.success("Schedule deleted successfully!");
                setIsDeleteOpen(false);
            }
        }
    };
    
    const openCreateDialog = () => { setSelectedSchedule(null); setIsDialogOpen(true); };
    const openEditDialog = (schedule: RecurringTransaction) => { setSelectedSchedule(schedule); setIsDialogOpen(true); };
    const openDeleteDialog = (schedule: RecurringTransaction) => { setScheduleToDelete(schedule); setIsDeleteOpen(true); };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Recurring Transactions</h1>
                <Button onClick={() => { setSelectedSchedule(null); setIsDialogOpen(true); }}>
                    <PlusCircle className="w-4 h-4 mr-2" />New Schedule
                </Button>
            </div>
            
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Next Run</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow></TableHeader>
                    <TableBody>
                        {loading === 'pending' && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    <Loader2 className="w-4 h-4 animate-spin"/>
                                    Loading...
                                </TableCell>
                            </TableRow>
                        )}

                        {loading === 'succeeded' && schedules.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    No schedules found.
                                </TableCell>
                            </TableRow>
                        )}

                        {loading === 'succeeded' && schedules.map((schedule) => (
                            <TableRow key={schedule.id}>
                                <TableCell className="font-medium">{schedule.description}</TableCell>
                                <TableCell>{schedule.categoryName}</TableCell>
                                <TableCell>{schedule.accountName}</TableCell>
                                <TableCell className={`text-right ${schedule.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(schedule.amount)}
                                </TableCell>
                                <TableCell>{'N/A'}</TableCell>
                                <TableCell>
                                    <Badge variant={schedule.isActive ? 'default' : 'destructive'}>
                                        {schedule.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <RecurringActions 
                                        schedule={schedule}
                                        onEdit={() => openEditDialog(schedule)}
                                        onDelete={() => openDeleteDialog(schedule)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{selectedSchedule ? 'Edit Schedule' : 'Create New Schedule'}</DialogTitle>
                    </DialogHeader>
                    <RecurringForm 
                        onSubmit={handleFormSubmit}
                        defaultValues={selectedSchedule}
                        isEditMode={!!selectedSchedule}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>Delete schedule for "{scheduleToDelete?.description}"?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default RecurringPage;