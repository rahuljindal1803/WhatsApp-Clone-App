import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "../components/features/userSlice";

export const store = configureStore({
  reducer: {
    auth: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
