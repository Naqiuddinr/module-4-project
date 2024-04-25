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

//ASYNC THUNK TO FETCH CURRENT USER DATA FROM BACKEND

export const fetchCurrentUserData = createAsyncThunk(
    "users/fetchCurrentUserData",

    async (currentUid) => {

        const response = await axios.get(`${API_URL}/users/${currentUid}`, { currentUid });

        return response.data[0]
    }
)

//ASYNC THUNK TO EDIT CURRENT USER PROFILE INFO

export const editUserProfileData = createAsyncThunk(
    "users/editUserProfileData",

    async (newProfileData) => {

        console.log(newProfileData)

        const { username, imageUpload, email } = newProfileData;

        if (imageUpload === null) {

            const response = await axios.put(`${API_URL}/users`, newProfileData);
            console.log(response.data[0])
            return response.data[0];

        } else {

            const storeRef = ref(storage, `profile_pic/${imageUpload.name}`);
            const imageResponse = await uploadBytes(storeRef, imageUpload);
            const profile_pic = await getDownloadURL(imageResponse.ref);

            const convertedData = { username, profile_pic, email };

            const response = await axios.put(`${API_URL}/users`, convertedData);
            console.log(response.data[0])
            return response.data[0];

        }


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

//ASYNC THUNK TO DELETE A TEAM MEMBER BY MEMBER ID

export const deleteTeamMemberById = createAsyncThunk(
    "team/deleteTeamMemberById",
    async (member_id) => {

        console.log(member_id)

        await axios.delete(`${API_URL}/team/${member_id}`);

        return { member_id };
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

            console.log(response)
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

            console.log(response)
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
    initialState: { tasks: [], loading: true },
    extraReducers: (builder) => {
        builder.addCase(fetchAllTaskByUser.fulfilled, (state, action) => {
            state.tasks = action.payload;
            state.loading = false;
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
        builder.addCase(deleteTeamMemberById.fulfilled, (state, action) => {
            state.team = state.team.filter((member) => member.member_id !== action.payload.member_id);
        })
    }
})

const userSlice = createSlice({
    name: "user",
    initialState: { user: [] },
    extraReducers: (builder) => {
        builder.addCase(fetchCurrentUserData.fulfilled, (state, action) => {
            state.user = action.payload;
        })
        builder.addCase(editUserProfileData.fulfilled, (state, action) => {
            state.user = action.payload;
        })
    }
})

const rootReducer = combineReducers({
    tasks: tasksSlice.reducer,
    team: teamSlice.reducer,
    user: userSlice.reducer
})

export { tasksSlice, teamSlice, userSlice, rootReducer };