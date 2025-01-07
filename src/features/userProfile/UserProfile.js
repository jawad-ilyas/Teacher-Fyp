import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const API_URL = "http://localhost:5000/api/v1/user"
// Fetch user profile (GET /api/v1/user/profile)
export const fetchUserProfile = createAsyncThunk(
    "userProfile/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if (!userInfo) throw new Error("userInfo not found");

            // If your server structure is:
            // response.data => { status: 200, message: "...", data: { userData... } }
            // we typically need the token. 
            const token = userInfo?.data?.token
                || userInfo?.token;
            // depends on how your server response is shaped!

            if (!token) throw new Error("JWT token not found in userInfo");

            const response = await axios.get("http://localhost:5000/api/v1/user/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // If your backend returns the user in `response.data.data`,
            // return that user object. 
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch profile"
            );
        }
    }
);

// Update user profile (PUT /api/v1/user/profile)
export const updateUserProfile = createAsyncThunk(
    "userProfile/updateUserProfile",
    async (updatedData, { rejectWithValue }) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if (!userInfo) throw new Error("userInfo not found");

            const token = userInfo?.data?.token
                || userInfo?.token;
            if (!token) throw new Error("JWT token not found");

            const response = await axios.put(
                "http://localhost:5000/api/v1/user/profile",
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json", // Ensure proper content type

                    },
                }
            );
            // Typically the updated user is in `response.data.data`
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to update profile"
            );
        }
    }
);



export const updateUserProfileImage = createAsyncThunk(
    "userProfile/updateUserProfileImage",
    async (formData, { rejectWithValue }) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            console.log("userinfo ", userInfo?.data?.token)
            if (!userInfo?.data?.token) {
                console.error("User is not logged in or token is missing.");
                return rejectWithValue("User authentication failed.");
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo?.data?.token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            // Debug: Log formData before making the request
            for (let [key, value] of formData.entries()) {
                console.log(`FormData Key: ${key}, Value:`, value);
            }

            // Debug: Log the API endpoint and config
            console.log(`API Endpoint: ${API_URL}/${userInfo?.data?._id}/updateUserProfileImage`);
            console.log("Config Headers:", config.headers);

            // Make the API request
            const response = await axios.post(
                `${API_URL}/${userInfo?.data?._id}/updateUserProfileImage`,
                formData,
                config
            );

            // Debug: Log the response from the server
            console.log("API Response:", response.data);

            // Return the updated data
            return response.data.data;
        } catch (error) {
            // Debug: Log the full error object for analysis
            console.error("Error Response:", error.response);

            // Return a meaningful error message
            return rejectWithValue(
                error.response?.data?.message || "Failed to update profile image"
            );
        }
    }
);


const userProfileSlice = createSlice({
    name: "userProfile",
    initialState: {
        user: null,           // This stores the "profile" info
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch user profile
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                // `action.payload` is the user object from `response.data.data`
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update user profile
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                // Update the user in state with the newly updated data
                state.user = action.payload;
                state.successMessage = "Profile updated successfully!";
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUserProfileImage.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateUserProfileImage.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // Update the user in the state with new image
                state.successMessage = "Profile image updated successfully!";
            })
            .addCase(updateUserProfileImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userProfileSlice.reducer;
