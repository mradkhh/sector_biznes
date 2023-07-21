import {combineReducers} from "@reduxjs/toolkit";
import {fetchApi} from "../services/fetchServices";

export const rootReducer = combineReducers({
    [fetchApi.reducerPath]: fetchApi.reducer,
})