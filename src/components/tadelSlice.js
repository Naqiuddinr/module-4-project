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

//ASYNC THUNK TO DELETE TASK BY TASK ID

export const deleteTaskByTaskId = createAsyncThunk(
    "tasks/deleteTaskByTaskId",
    async (task_id) => {

        await axios.delete(`${API_URL}/tasks/${task_id}`)

        return { task_id }
    }
)

//ASYNC THUNK TO EDIT TASK BY TASK ID

export const editTaskByTaskId = createAsyncThunk(
    "tasks/editTaskByTaskId",
    async (newEditedTaskData) => {

        const { task_id } = newEditedTaskData;

        const response = await axios.put(`${API_URL}/tasks/${task_id}`, newEditedTaskData);

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
        builder.addCase(deleteTaskByTaskId.fulfilled, (state, action) => {
            state.tasks = state.tasks.filter((task) => task.task_id !== action.payload.task_id);
        })
        builder.addCase(editTaskByTaskId.fulfilled, (state, action) => {
            const editedTask = action.payload;
            const index = state.tasks.findIndex(task => task.task_id === editedTask.task_id);
            if (index !== -1) {
                state.tasks[index] = editedTask
            }
        })
    }
})

const rootReducer = combineReducers({
    tasks: tasksSlice.reducer
})

export { tasksSlice, rootReducer };