'use client'

import { TransactionActions } from "@/components/features/transactions/transaction-actions";
import TransactionForm from "@/components/features/transactions/transaction-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { loadAccounts } from "@/store/features/accounts";
import { loadCategories } from "@/store/features/categories";
import { addTransaction, editTransaction, loadTransactions, removeTransaction, setCurrentPage } from "@/store/features/transactions";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Transaction } from "@/types";
import { Loader2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const TransactionsPage = () => {
    const dispatch = useAppDispatch()
    const { items: transactions, loading, error, page, size, totalPages } = useAppSelector(state => state.transactions)

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

    const [dialogKey, setDialogKey] = useState(Date.now());

    useEffect(() => {
        dispatch(loadTransactions({page, size}))
        dispatch(loadAccounts())
        dispatch(loadCategories())
    }, [dispatch, page, size])

    const openCreateDialog = () => {
        setSelectedTransaction(null);
        setDialogKey(Date.now());
        setIsDialogOpen(true);
    };
    
    const openEditDialog = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setDialogKey(Date.now());
        setIsDialogOpen(true);
    };

    const openDeleteDialog = (transaction: Transaction) => {
        setTransactionToDelete(transaction);
        setIsDeleteOpen(true);
    };

    const handleFormSubmit = async (values: any) => {
        if (selectedTransaction) {
            const result = await dispatch(editTransaction({ id: selectedTransaction.id, data: values }));
            if (editTransaction.fulfilled.match(result)) {
                toast.success("Transaction updated successfully!");
                setIsDialogOpen(false);
            } else {
                toast.error(result.payload as string);
            }
        } else {
            const result = await dispatch(addTransaction(values));
            
            if (addTransaction.fulfilled.match(result)) {
                toast.success("Transaction created successfully!");
                setIsDialogOpen(false);
                // dispatch(fetchTransactions({ page, size }));
            } else {
                toast.error(result.payload as string);
            }
        }
    };

    const handleDeleteTransaction = async () => {
        if (transactionToDelete) {
            const result = await dispatch(removeTransaction(transactionToDelete.id));
            if (removeTransaction.fulfilled.match(result)) {
                toast.success("Account deleted successfully!");
                setIsDeleteOpen(false);
            }
        }
    };

    const handleChangePage = (newPage: number) => {
        if(newPage >= 0 && newPage < totalPages){
            dispatch(setCurrentPage(newPage))
        }
    }
    
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <Button onClick={openCreateDialog}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add New Transaction
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading == 'pending' && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                        Loading...
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {loading == 'succeeded' && transactions.length == 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No transactions found.
                                </TableCell>
                            </TableRow>
                        )}

                        {loading == 'succeeded' && transactions.map(transaction => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.transactionDate}</TableCell>
                                <TableCell>{transaction.accountName}</TableCell>
                                <TableCell>
                                    {transaction.categoryName? (
                                        <Badge variant='outline'>{transaction.categoryName}</Badge>
                                    ) : (
                                        <span className="text-xs text-gray-400">N/A</span>
                                    )}
                                </TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell className={`text-right font-medium ${transaction.type == 'INCOME'? 'text-green-600' : 'text-red-600'}`}>
                                    {transaction.type == 'INCOME' ? "+" : "-"} {formatCurrency(transaction.amount)}
                                </TableCell>
                                <TableCell>
                                    <TransactionActions 
                                        transaction={transaction}
                                        onEdit={() => openEditDialog(transaction)}
                                        onDelete={() => openDeleteDialog(transaction)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={() => handleChangePage(page-1)}
                                className={page == 0? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                {page + 1}
                            </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationEllipsis/>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={() => handleChangePage(page+1)}
                                className={page+1 >= totalPages? 'pointer-events-none opacity-50' : ''}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <Dialog key={dialogKey} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Transaction</DialogTitle>
                    </DialogHeader>
                    <TransactionForm 
                        onSubmit={handleFormSubmit}
                        defaultValues={selectedTransaction}
                        isEditMode={!!selectedTransaction}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="my-4 p-4 bg-gray-100 rounded-lg border">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Description</span>
                            <span className="font-medium">{transactionToDelete?.description}</span>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-500">Amount</span>
                            <span className="font-medium">{transactionToDelete && formatCurrency(transactionToDelete.amount)}</span>
                        </div>
                    </div>
                    
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteTransaction} className="bg-red-500">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default TransactionsPage;