'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { loadBudgets, addBudget, editBudget, removeBudget } from '@/store/features/budgets';
import { loadCategories } from '@/store/features/categories';
import { BudgetForm } from '@/components/features/budgets/budget-form';
import { BudgetCard } from '@/components/features/budgets/budget-card';
import { Budget } from '@/types';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const BudgetsPage = () => {
  const dispatch = useAppDispatch();
  const { items: budgets, loading, error } = useAppSelector((state) => state.budgets);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('en-US', { month: 'long'})
  }))

  useEffect(() => {
    dispatch(loadBudgets({ year, month }));
    dispatch(loadCategories());
  }, [dispatch, year, month]);

  useEffect(() => {
    if (error) { toast.error(error); }
  }, [error]);
  
  const handleFormSubmit = async (values: { categoryId: string | null; amountLimit: number; }) => {
    const dataToSubmit = { ...values, year, month };
    
    const result = selectedBudget
      ? await dispatch(editBudget({ id: selectedBudget.id, data: dataToSubmit }))
      : await dispatch(addBudget(dataToSubmit));

    if (addBudget.fulfilled.match(result) || editBudget.fulfilled.match(result)) {
      toast.success(`Budget ${selectedBudget ? 'updated' : 'set'} successfully!`);
      setIsFormOpen(false);
      dispatch(loadBudgets({ year, month }));
    }
  };

  const openCreateDialog = () => { setSelectedBudget(null); setIsFormOpen(true); };

  const openEditDialog = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsFormOpen(true);
  };
  
  const openDeleteDialog = (budget: Budget) => {
    setBudgetToDelete(budget);
    setIsDeleteOpen(true);
  };

  const handleDeleteBudget = async () => {
    if (budgetToDelete) {
      const result = await dispatch(removeBudget(budgetToDelete.id));
      if (removeBudget.fulfilled.match(result)) {
        toast.success("Budget deleted successfully!");
        setIsDeleteOpen(false);
      }
    }
  };

  return (

    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold">Budgets</h1>

        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select month"/>
            </SelectTrigger>
            <SelectContent>
              {months.map(m => (
                <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select year"/>
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
          </Select>
        </div>

        <Button onClick={openCreateDialog}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Set New Budget
        </Button>
      </div>

      {loading === 'pending' && budgets.length === 0 && (
          <div className="flex items-center justify-center mt-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
      )}

      {loading === 'succeeded' && budgets.length === 0 && (
        <div className="text-center text-gray-500">
          <p>No budgets set for this period.</p>
          <p>Click "Set New Budget" to get started.</p>
        </div>
      )}

      {(loading === 'succeeded' || loading === 'failed') && budgets.length && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map(budget => (
            <BudgetCard 
              key={budget.id} 
              budget={budget}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBudget ? 'Edit Budget' : `Set New Budget for ${months.find(m => m.value === month)?.label} ${year}`}
            </DialogTitle>
            <DialogDescription>
              You are {selectedBudget? `updating the budget for "${selectedBudget.categoryName}" from` : 'setting a budget for'}  the period of {months.find(m => m.value === month)?.label} {year}.
            </DialogDescription>
          </DialogHeader>
          <BudgetForm onSubmit={handleFormSubmit} defaultValues={selectedBudget} isEditMode={!!selectedBudget} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the budget for "{budgetToDelete?.categoryName || 'Overall Budget'}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBudget} className="bg-red-500">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BudgetsPage;