import { combineReducers, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const API_URL = import.meta.env.VITE_TADEL_API_URL;

//ASYNC THUNK TO SEND USER DATA TO BACKEND DURING SIGN UP

export const sendUserDataToBackend = createAsyncThunk(
    "users/sendUserDataToBackend",
    async (newUserData) => {

        const response = await axios.post(`${API_URL}/users`, newUserData);

        return response.json();

    }
)

//ASYNC THUNK TO FETCH ALL TASK ACCORDING TO CURRENT USER

export const fetchAllTaskByUser = createAsyncThunk(
    "tasks/fetchAllTaskByUser",
    async (firebase_uid) => {

        console.log(firebase_uid)

        const response = await axios.get(`${API_URL}/tasks/${firebase_uid}`);

        console.log(response)
        return response.data;

    }
)

const tasksSlice = createSlice({
    name: "tasks",
    initialState: { tasks: [] },
    extraReducers: (builder) => {
        builder.addCase(fetchAllTaskByUser.fulfilled, (state, action) => {
            state.tasks = action.payload;
        })
    }
})

const rootReducer = combineReducers({
    tasks: tasksSlice.reducer
})

export { tasksSlice, rootReducer };