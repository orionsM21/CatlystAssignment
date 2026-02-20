import { configureStore } from "@reduxjs/toolkit";
import todoReducer from './reduxSlice'

export const store = configureStore({
    reducer: {
        todo: todoReducer
    }
})