import { Category } from "@/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as categoriesApi from './categories.api'
import { CreateCategoryPayload, UpdateCategoryPayload } from './categories.api'

export const loadCategories = createAsyncThunk<Category[], void, { rejectValue: string}>(
    'categories/load',
    async (_, { rejectWithValue }) => {
        try {
            const response = await categoriesApi.getCategories();

            if(response.success && response.data){
                return response.data
            } else{
                return rejectWithValue(response.error?.message || 'Fetch categories failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage)
        }
    }
)

export const loadCategoryById = createAsyncThunk<Category, string, { rejectValue: string}>(
    'categories/loadById',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await categoriesApi.getCategoryById(categoryId);

            if(response.success && response.data){
                return response.data
            } else{
                return rejectWithValue(response.error?.message || 'Fetch category by id failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage)
        }
    }
)

export const addCategory = createAsyncThunk<Category, CreateCategoryPayload, { rejectValue: string}>(
    'categories/add',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await categoriesApi.createCategory(categoryData);

            if(response.success && response.data){
                return response.data
            } else{
                return rejectWithValue(response.error?.message || 'Add category failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage)
        }
    }
)

export const editCategory = createAsyncThunk<Category, UpdateCategoryPayload, { rejectValue: string}>(
    'categories/edit',
    async (categoryData, { rejectWithValue }) => {
        try {
            const response = await categoriesApi.updateCategory(categoryData);

            if(response.success && response.data){
                return response.data
            } else{
                return rejectWithValue(response.error?.message || 'Update category failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage)
        }
    }
)

export const removeCategory = createAsyncThunk<string, string, { rejectValue: string}>(
    'categories/remove',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await categoriesApi.deleteCategory(categoryId);

            if(response.status == 200 || response.status == 204){
                return categoryId;
            } else{
                return rejectWithValue('Delete category failed.')
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message || 'An unexpected error occured.'
            return rejectWithValue(errorMessage)
        }
    }
)