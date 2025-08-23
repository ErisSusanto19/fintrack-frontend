import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account } from '../../types'

interface AccountState {
    accounts: Account[];
    loading: boolean;
    error: string | null;
}

const initialState: AccountState = {
    accounts: [],
    loading: false,
    error: null
}

const accountSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {

    }
})

export default accountSlice.reducer;