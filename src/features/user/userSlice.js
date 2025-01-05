import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for user login
export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            // Matches your "POST /api/v1/auth/login" endpoint
            const response = await axios.post(
                "http://localhost:5000/api/v1/auth/login",
                userData
            );
            console.log("Login user response:", response?.data);
            return response.data; // e.g., { status: 200, data: {...}, message: ... }
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Something went wrong during login"
            );
        }
    }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            // Matches your "POST /api/v1/auth/registerUser" endpoint
            const response = await axios.post(
                "http://localhost:5000/api/v1/auth/registerUser",
                userData
            );
            console.log("Register user response:", response?.data);
            return response.data; // e.g., { status: 201, data: {...}, message: ... }
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Something went wrong during registration"
            );
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                localStorage.setItem("userInfo", JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
                localStorage.setItem("userInfo", JSON.stringify(action.payload));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = userSlice.actions;



export default userSlice.reducer;
