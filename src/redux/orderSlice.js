import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from "../utils/axiosInstance";
import { refreshTokens } from './userSlice';


const getTokenFromLocalStorage = () => {
    const userToken = JSON.parse(localStorage.getItem('userToken'));
    return userToken ? userToken.accessToken : null;
};

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData, { getState, dispatch }) => {
       try {
        const token = JSON.parse(localStorage.getItem('userToken')).accessToken;
        if (!token) {
            console.error('No access token found');
        }
        const response = await axiosInstance.post(`/api/orders`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
       } catch (error) {
        if (error.response?.status === 401) {
            await dispatch(refreshTokens());
            return createOrder(orderData, { getState, dispatch });
        }
       }
    }
);

export const getOrder = createAsyncThunk(
    'orders/getOrder',
    async (orderId, { getState }) => {
        const token = JSON.parse(localStorage.getItem('userToken')).accessToken
        const response = await axiosInstance.get(`/api/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
);

export const getAllOrders = createAsyncThunk(
    'orders/getAllOrders',
    async (_, { getState }) => {
        const token = JSON.parse(localStorage.getItem('userToken')).accessToken
        const response = await axiosInstance.get(`/api/orders/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
);

export const editOrder = createAsyncThunk(
    'orders/editOrder',
    async ({ id, orderData }, { getState }) => {
        const token = JSON.parse(localStorage.getItem('userToken')).accessToken
        const response = await axiosInstance.put(`/api/orders/${id}`, orderData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
);

export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ id, status }, { getState }) => {
        const token = JSON.parse(localStorage.getItem('userToken')).accessToken
        const response = await axiosInstance.put(`/api/orders/${id}`, { status }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
);

export const deleteOrder = createAsyncThunk(
    'orders/deleteOrder',
    async (orderId, { getState }) => {
        const token = JSON.parse(localStorage.getItem('userToken')).accessToken;
        const response = await axiosInstance.delete(`/api/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
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
                state.orders.push(action.payload.order); 
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
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
                state.error = action.error.message;
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
                state.error = action.error.message;
            })
            .addCase(editOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.orders.findIndex(order => order._id === action.payload.order._id);
                if (index !== -1) {
                    state.orders[index] = action.payload.order;
                }
            })
            .addCase(editOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
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
                state.error = action.error.message;
            })
            .addCase(updateOrderStatus.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedOrder = action.payload.order;
                const existingOrder = state.orders.find(order => order._id === updatedOrder._id);
                if (existingOrder) {
                    existingOrder.status = updatedOrder.status;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default orderSlice.reducer;
