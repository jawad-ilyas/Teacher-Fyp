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
        userInfo: null,    // Will store the entire response (including token, role, etc.)
        loading: false,
        error: null,
    },
    reducers: {
        // If you want a logout action, you could add something like:
        // logout: (state) => {
        //   state.userInfo = null;
        //   localStorage.removeItem("userInfo");
        // },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;

                // Save user info to localStorage
                // The shape of action.payload may be something like:
                // { status: 200, message: '...', data: { _id, name, email, token, ... } }
                // so adjust if needed. 
                localStorage.setItem("userInfo", JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Register
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

export default userSlice.reducer;
