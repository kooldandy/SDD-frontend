/**
 * Product Redux Slice
 * 
 * Manages product state with AsyncThunks for API operations.
 * - Handles loading, success, and error states for each operation
 * - Provides thunks for list, create, update, and delete operations
 * - Implements proper error normalization and state management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Product, ProductInput } from '../products/productTypes'
import { productService } from '../products/productService'
import { NormalizedError } from '../api/apiRequest'

export interface ProductState {
  items: Product[]
  loading: boolean
  error: NormalizedError | null
  // For individual operations
  creating: boolean
  createError: NormalizedError | null
  updating: boolean
  updateError: NormalizedError | null
  deletingIds: Set<string>
  deleteError: NormalizedError | null
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
  deletingIds: new Set(),
  deleteError: null,
}

/**
 * AsyncThunk: Fetch all products
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const products = await productService.listProducts()
      return products
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

/**
 * AsyncThunk: Create a new product
 */
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (input: ProductInput, { rejectWithValue }) => {
    try {
      const product = await productService.createProduct(input)
      return product
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

/**
 * AsyncThunk: Update an existing product
 */
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, input }: { id: string; input: ProductInput }, { rejectWithValue }) => {
    try {
      const product = await productService.updateProduct(id, input)
      return product
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

/**
 * AsyncThunk: Delete a product
 */
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id)
      return id
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCreateError: (state) => {
      state.createError = null
    },
    clearUpdateError: (state) => {
      state.updateError = null
    },
    clearDeleteError: (state) => {
      state.deleteError = null
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.error = null
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as NormalizedError
      })

    // createProduct
    builder
      .addCase(createProduct.pending, (state) => {
        state.creating = true
        state.createError = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.creating = false
        state.items.push(action.payload)
        state.createError = null
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.creating = false
        state.createError = action.payload as NormalizedError
      })

    // updateProduct
    builder
      .addCase(updateProduct.pending, (state) => {
        state.updating = true
        state.updateError = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updating = false
        const index = state.items.findIndex((p) => p.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        state.updateError = null
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updating = false
        state.updateError = action.payload as NormalizedError
      })

    // deleteProduct
    builder
      .addCase(deleteProduct.pending, (state, action) => {
        state.deletingIds.add(action.meta.arg)
        state.deleteError = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload)
        state.deletingIds.delete(action.payload)
        state.deleteError = null
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deletingIds.delete(action.meta.arg)
        state.deleteError = action.payload as NormalizedError
      })
  },
})

export const { clearError, clearCreateError, clearUpdateError, clearDeleteError } =
  productSlice.actions

export default productSlice.reducer
