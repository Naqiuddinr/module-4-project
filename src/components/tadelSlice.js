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

        const response = await axios.get(`${API_URL}/tasks/${firebase_uid}`);

        return response.data;

    }
)

//ASYNC THUNK TO ADD NEW TASK BY A USER

export const addNewTaskByUser = createAsyncThunk(
    "tasks/addNewTaskByUser",
    async (newTaskData) => {

        const response = await axios.post(`${API_URL}/tasks`, newTaskData);

        console.log(response.data)
        return response.data;

    }
)


///////////////////////////////////////////////////////////////
/////////////////////////// SLICES ////////////////////////////

const tasksSlice = createSlice({
    name: "tasks",
    initialState: { tasks: [] },
    extraReducers: (builder) => {
        builder.addCase(fetchAllTaskByUser.fulfilled, (state, action) => {
            state.tasks = action.payload;
        })
        builder.addCase(addNewTaskByUser.fulfilled, (state, action) => {
            state.tasks = [...state.tasks, action.payload];
        })
    }
})

const rootReducer = combineReducers({
    tasks: tasksSlice.reducer
})

export { tasksSlice, rootReducer };