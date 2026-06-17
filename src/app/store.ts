/**
 * Redux Store Configuration
 *
 * Configures the Redux store with:
 * - Dependency injection for AsyncThunk extra argument
 * - Product reducer
 * - Middleware configuration
 */

import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import apiClient from "../products/productApiClient";

export const store = configureStore({
  reducer: {
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore the exact path giving you trouble
        ignoredPaths: ["products.deletingIds"],

        // Alternatively, ignore a specific action type that mutates this state
        // ignoredActions: ['products/startDelete'],
      },
      thunk: {
        extraArgument: {
          api: apiClient,
        },
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
