'use client'

import AccountForm from "@/components/features/accounts/account-form";
import { Button } from "@/components/ui/button";
import { DialogHeader } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addAccount, editAccount, loadAccounts, removeAccount } from "@/store/features/accounts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Account } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AccountActions } from "@/components/features/accounts/account-actions";
import { useRouter } from "next/navigation";

const accountTypes = {
    "BANK": "Bank",
    "EWALLET": "E-Wallet",
    "CASH": "Cash",
    "CREDIT_CARD": "Credit Card",
    "INVESTMENT": "Investment"
}

const AccountsPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch()
    const { items: accounts, loading, error} = useAppSelector(state => state.accounts)

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

    useEffect(() => {
        dispatch(loadAccounts())
    }, [dispatch]) 

    useEffect(() => {
        if(error){
            toast.error(error)
        }
    }, [error])

    const handleFormSubmit = async (values: any) => {
        if (selectedAccount) {
        const result = await dispatch(editAccount({ id: selectedAccount.id, data: values }));
        if (editAccount.fulfilled.match(result)) {
            toast.success("Account updated successfully!");
            setIsFormOpen(false);
        }
        } else {
        const result = await dispatch(addAccount(values));
        if (addAccount.fulfilled.match(result)) {
            toast.success("Account created successfully!");
            setIsFormOpen(false);
        }
        }
    };

    const openEditDialog = (account: Account) => {
        setSelectedAccount(account);
        setIsFormOpen(true);
    };

    const openCreateDialog = () => {
        setSelectedAccount(null);
        setIsFormOpen(true);
    };
    
    const openDeleteDialog = (account: Account) => {
        setAccountToDelete(account);
        setIsDeleteOpen(true);
    };

    const handleDeleteAccount = async () => {
        if (accountToDelete) {
        const result = await dispatch(removeAccount(accountToDelete.id));
        if (removeAccount.fulfilled.match(result)) {
            toast.success("Account deleted successfully!");
            setIsDeleteOpen(false);
        }
        }
    };

    const handleRowClick = (accountId: string) => {
        router.push(`/accounts/${accountId}`);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">My Accounts</h1>
                <Button onClick={openCreateDialog}>
                    <PlusCircle className="w-4 h-4 mr-2"/>
                    Add New Account
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading == 'pending' && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                                    Loading...
                                </TableCell>
                            </TableRow>
                        )}

                        {loading == 'succeeded' && accounts.length == 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                    No accounts found. Add one to get started!
                                </TableCell>
                            </TableRow>
                        )}

                        {loading == 'succeeded' && accounts.map(account => (
                            <TableRow 
                                key={account.id}
                                onClick={() => handleRowClick(account.id)}
                                className="cursor-pointer hover:bg-gray-50"
                            >
                                <TableCell>{account.name}</TableCell>
                                <TableCell>{account.type? accountTypes[account.type] : "-"}</TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR'
                                    }).format(account.balance)}
                                </TableCell>
                                <TableCell>
                                    <AccountActions
                                        account={account}
                                        onEdit={() => openEditDialog(account)}
                                        onDelete={() => openDeleteDialog(account)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>{selectedAccount ? 'Edit Account' : 'Create New Account'}</DialogTitle>
                </DialogHeader>
                <AccountForm
                    defaultValues={selectedAccount}
                    onSubmit={handleFormSubmit}
                    isEditMode={!!selectedAccount}
                />
                </DialogContent>
            </Dialog>
            
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account: "{accountToDelete?.name}".
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-500">
                    Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default AccountsPage;