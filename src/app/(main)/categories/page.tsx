'use client'

import CategoryActions from "@/components/features/categories/category-actions";
import CategoryForm from "@/components/features/categories/category-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addCategory, editCategory, loadCategories, removeCategory } from "@/store/features/categories/categories.thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Category } from "@/types";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const transactionTypes = {
    "INCOME": "Income",
    "EXPENSE": "Expense",
}

const CategoriesPage = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const {items: categories, loading, error} = useAppSelector(state => state.categories)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    const [isDeleteOpen, setIsDeleteOpene] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)

    useEffect(() => {
        dispatch(loadCategories())
    }, [dispatch])

    useEffect(() => {
        if(error){
            toast.error(error)
        }
    }, [error])

    const handleFormSubmit = async (values: any) => {
        if(selectedCategory){
            const result = await dispatch(editCategory({id: selectedCategory.id, data: values}))

            if(editCategory.fulfilled.match(result)){
                toast.success("Category updated succcessfully!")
                setIsFormOpen(false)
            }
        } else {
            const result = await dispatch(addCategory(values))

            if(addCategory.fulfilled.match(result)){
                toast.success("Category created successfully!")
                setIsFormOpen(false)
            }
        }
    }

    const openEditDialog = (category: Category) => {
        setSelectedCategory(category)
        setIsFormOpen(true)
    }

    const openCreateDialog = () => {
        setSelectedCategory(null)
        setIsFormOpen(true)
    }

    const openDeleteDialog = (category: Category) => {
        setCategoryToDelete(category)
        setIsDeleteOpene(true)
    }

    const handleDeleteCategory = async () => {
        if(categoryToDelete){
            const result = await dispatch(removeCategory(categoryToDelete.id))

            if(removeCategory.fulfilled.match(result)){
                toast.success("Category deleted successfully!")
                setIsDeleteOpene(false)
            }
        }
    }

    const handleRowClick = (categoryId: string) => {
        router.push(`/categories/${categoryId}`)
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Button onClick={openCreateDialog}>
                    <PlusCircle className="w-4 h-4 mr-2"/>
                    Add New Category
                </Button>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading == 'pending' && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                    <Loader2 className="w-4 h-4 animate-spin"/>
                                    Loading...
                                </TableCell>
                            </TableRow>
                        )}

                        {loading == 'succeeded' && categories.length == 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">
                                    No categories found. Add one to get started!
                                </TableCell>
                            </TableRow>
                        )}

                        {loading == 'succeeded' && categories.map(cat => (
                            <TableRow
                                key={cat.id}
                                onClick={() => handleRowClick(cat.id)}
                                className="cursor-pointer hover:bg-gray-50"
                            >
                                <TableCell>{cat.name}</TableCell>
                                <TableCell>{cat.type? transactionTypes[cat.type] : '-'}</TableCell>
                                <TableCell>
                                    <CategoryActions
                                        category={cat}
                                        onEdit={() => openEditDialog(cat)}
                                        onDelete={() => openDeleteDialog(cat)}
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
                        <DialogTitle>
                            {selectedCategory? 'Edit Category' : 'Create New Category'}
                        </DialogTitle>
                    </DialogHeader>
                    <CategoryForm
                        defaultValues={selectedCategory}
                        onSubmit={handleFormSubmit}
                        isEditMode={!!selectedCategory}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpene}>
                <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account: "{categoryToDelete?.name}".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteCategory}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )

}

export default CategoriesPage;