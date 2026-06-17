/**
 * Redux Store Configuration
 *
 * Configures the Redux store with:
 * - Dependency injection for AsyncThunk extra argument
 * - Product reducer
 * - Middleware configuration
 */

import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../products/productSlice";
import apiClient from "../api/apiClient";
import { globalServices } from "./globalService";

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
          globalServices: globalServices,
        },
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
