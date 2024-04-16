import { combineReducers, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


const API_URL = import.meta.env.VITE_TADEL_API_URL;

//ASYNC THUNK TO SEND USER DATA TO BACKEND DURING SIGN UP

export const sendUserDataToBackend = createAsyncThunk(
    "users/sendUserDataToBackend",
    async (newUserData) => {

        const response = await axios.post(`${API_URL}/users`, newUserData);

        return response.json();

    }
)


//ASYNC THUNK TO FETCH ALL TEAM MEMBERS OF USERS FROM DATABASE

export const fetchAllTeamByUser = createAsyncThunk(
    "team/fetchAllTeamByUser",
    async (originator) => {

        const response = await axios.get(`${API_URL}/team`, { params: { originator: originator } });

        return response.data;

    }
)

//ASYNC THUNK TO ADD NEW TEAM MEMBER BY A USER

export const addNewTeamMember = createAsyncThunk(
    "team/addNewTeamMember",
    async (newMemberInfo) => {

        const response = await axios.post(`${API_URL}/team`, newMemberInfo);

        return response.data[0]
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

        const {
            title,
            content,
            status,
            end_date,
            urgent,
            assignee,
            originator,
            color_tag,
            fileUpload
        } = newTaskData

        if (fileUpload === "") {
            const fileurl = null;

            const convertedData = {
                title,
                content,
                status,
                end_date,
                urgent,
                assignee,
                originator,
                color_tag,
                fileurl
            }

            const response = await axios.post(`${API_URL}/tasks`, convertedData);

            return response.data;

        } else {

            const storeRef = ref(storage, `tasks/${fileUpload.name}`);
            const fileResponse = await uploadBytes(storeRef, fileUpload);
            const fileurl = await getDownloadURL(fileResponse.ref);

            const convertedData = {
                title,
                content,
                status,
                end_date,
                urgent,
                assignee,
                originator,
                color_tag,
                fileurl
            }

            const response = await axios.post(`${API_URL}/tasks`, convertedData);

            return response.data;

        }

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

        const {
            task_id,
            title,
            content,
            status,
            end_date,
            urgent,
            assignee,
            originator,
            color_tag,
            fileUpload
        } = newEditedTaskData;

        if (fileUpload === null) {
            const fileurl = null;

            const convertedData = {
                task_id,
                title,
                content,
                status,
                end_date,
                urgent,
                assignee,
                originator,
                color_tag,
                fileurl
            }

            const response = await axios.put(`${API_URL}/tasks/${task_id}`, convertedData);

            return response.data[0];

        } else {

            const storeRef = ref(storage, `tasks/${fileUpload.name}`);
            const fileResponse = await uploadBytes(storeRef, fileUpload);
            const fileurl = await getDownloadURL(fileResponse.ref);

            const convertedData = {
                task_id,
                title,
                content,
                status,
                end_date,
                urgent,
                assignee,
                originator,
                color_tag,
                fileurl
            }

            const response = await axios.put(`${API_URL}/tasks/${task_id}`, convertedData);

            return response.data[0];
        }

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

const teamSlice = createSlice({
    name: "team",
    initialState: { team: [] },
    extraReducers: (builder) => {
        builder.addCase(fetchAllTeamByUser.fulfilled, (state, action) => {
            state.team = action.payload;
        })
        builder.addCase(addNewTeamMember.fulfilled, (state, action) => {
            state.team = [action.payload, ...state.team];
        })
    }
})

const rootReducer = combineReducers({
    tasks: tasksSlice.reducer,
    team: teamSlice.reducer
})

export { tasksSlice, teamSlice, rootReducer };