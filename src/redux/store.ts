import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modals/modalSlice"
import { productsApi } from "@/api/api-slice";


export const store = configureStore({
  reducer: {
    modal: modalReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
