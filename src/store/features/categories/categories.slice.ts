import { Category } from "@/types"
import { createSlice } from "@reduxjs/toolkit";
import { addCategory, editCategory, loadCategories, loadCategoryById, removeCategory } from "./categories.thunk";

interface CategoryState {
    items: Category[];
    selectedItem: Category | null;
    loading: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CategoryState = {
    items: [],
    selectedItem: null,
    loading: 'idle',
    error: null
}

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //LOAD
            .addCase(loadCategories.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(loadCategories.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items = action.payload
            })
            .addCase(loadCategories.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //LOAD BY ID
            .addCase(loadCategoryById.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(loadCategoryById.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.selectedItem = action.payload
            })
            .addCase(loadCategoryById.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //ADD
            .addCase(addCategory.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items.push(action.payload)
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //EDIT
            .addCase(editCategory.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(editCategory.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                const index = state.items.findIndex(cat => cat.id == action.payload.id)
                if(index !== -1) {
                    state.items[index] = action.payload
                }
            })
            .addCase(editCategory.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })

            //REMOVE
            .addCase(removeCategory.pending, (state) => {
                state.loading = 'pending'
                state.error = null
            })
            .addCase(removeCategory.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.items = state.items.filter(cat => cat.id !== action.payload)
            })
            .addCase(removeCategory.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.payload as string
            })
    }
})

export default categoriesSlice.reducer;