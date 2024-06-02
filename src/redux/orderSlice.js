import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../utils/axiosInstance";
import { refreshTokens } from './userSlice';

// Helper function to get the access token
const getAccessToken = () => {
    const userToken = JSON.parse(localStorage.getItem('userToken'));
    return userToken ? userToken.accessToken : null;
};

// Helper function to retry requests after token refresh
const retryRequest = async (dispatch, action, ...args) => {
    await dispatch(refreshTokens());
    const token = getAccessToken();
    if (token) {
        return dispatch(action(...args));
    } else {
        throw new Error('Failed to refresh token');
    }
};

// Create order thunk
export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData, { dispatch, rejectWithValue }) => {
        try {
            const token = getAccessToken();
            
            if (!token) {
                return rejectWithValue('No access token found');
            }
            const response = await axiosInstance.post(`/api/orders`, orderData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                return retryRequest(dispatch, createOrder, orderData);
            }
            return rejectWithValue(error.message);
        }
    }
);

// Get order thunk
export const getOrder = createAsyncThunk(
    'orders/getOrder',
    async (orderId, { dispatch, rejectWithValue }) => {
        try {
            const token = getAccessToken();
            if (!token) {
                return rejectWithValue('No access token found');
            }
            const response = await axiosInstance.get(`/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                return retryRequest(dispatch, getOrder, orderId);
            }
            return rejectWithValue(error.message);
        }
    }
);

// Get all orders thunk
export const getAllOrders = createAsyncThunk(
    'orders/getAllOrders',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const token = getAccessToken();
            if (!token) {
                return rejectWithValue('No access token found');
            }
            const response = await axiosInstance.get(`/api/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                return retryRequest(dispatch, getAllOrders);
            }
            return rejectWithValue(error.message);
        }
    }
);

// Edit order thunk
export const editOrder = createAsyncThunk(
    'orders/editOrder',
    async ({ id, orderData }, { dispatch, rejectWithValue }) => {
        try {
            const token = getAccessToken();
            if (!token) {
                return rejectWithValue('No access token found');
            }
            const response = await axiosInstance.put(`/api/orders/${id}`, orderData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                return retryRequest(dispatch, editOrder, { id, orderData });
            }
            return rejectWithValue(error.message);
        }
    }
);

// Update order status thunk
export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ id, status }, { dispatch, rejectWithValue }) => {
        try {
            const token = getAccessToken();
            if (!token) {
                return rejectWithValue('No access token found');
            }
            const response = await axiosInstance.put(`/api/orders/${id}`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                return retryRequest(dispatch, updateOrderStatus, { id, status });
            }
            return rejectWithValue(error.message);
        }
    }
);

// Delete order thunk
export const deleteOrder = createAsyncThunk(
    'orders/deleteOrder',
    async (orderId, { dispatch, rejectWithValue }) => {
        try {
            const token = getAccessToken();
            if (!token) {
                return rejectWithValue('No access token found');
            }
            const response = await axiosInstance.delete(`/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                return retryRequest(dispatch, deleteOrder, orderId);
            }
            return rejectWithValue(error.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        currentOrder: null,
        status: 'idle',
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders.push(action.payload); 
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(getOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOrder = action.payload;
            })
            .addCase(getOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(getAllOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(editOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(editOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = state.orders.filter(order => order._id !== action.meta.arg);
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateOrderStatus.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedOrder = action.payload;
                const existingOrder = state.orders.find(order => order._id === updatedOrder._id);
                if (existingOrder) {
                    existingOrder.status = updatedOrder.status;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export default orderSlice.reducer;
