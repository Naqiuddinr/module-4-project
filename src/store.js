import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./components/tadelSlice";



export default configureStore({
    reducer: rootReducer
})