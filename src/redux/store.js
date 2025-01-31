import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import miscSlice from "./reducers/misc";
import chatSlice from "./reducers/chat";
import api from "./api/api";

const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [miscSlice.name]: miscSlice.reducer,
        [chatSlice.name]: chatSlice.reducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (defaultMiddleware) => [...defaultMiddleware(), api.middleware],
});

export default store;
