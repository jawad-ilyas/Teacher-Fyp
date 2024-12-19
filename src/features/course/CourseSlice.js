import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL
const API_URL = "http://localhost:5000/api/v1/courses";

// Async thunk to add a new course
export const addCourse = createAsyncThunk(
    "courses/addCourse",
    async (courseData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/createcourse`, courseData);

            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// Async thunk to fetch courses by userId
export const searchCoursesByUser = createAsyncThunk(
    "courses/searchCoursesByUser",
    async (_, { rejectWithValue }) => {
        try {
            // Get user info from localStorage
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));

            // Ensure userInfo is available
            if (!userInfo || !userInfo.data || !userInfo.data._id) {
                throw new Error("User information is missing");
            }

            // Fetch courses by userId
            const response = await axios.get(`${API_URL}/searchcoursesbyuser?userId=${userInfo.data._id}`);

            // Return fetched data
            return response.data.data;
        } catch (error) {
            // Handle errors
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// Async thunk to update a course
export const updateCourse = createAsyncThunk(
    "courses/updateCourse",
    async ({ id, courseData }, { rejectWithValue }) => {
        try {

            const response = await axios.put(`${API_URL}/updatecourse/${id}`, courseData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// Async thunk to delete a course
export const deleteCourse = createAsyncThunk(
    "courses/deleteCourse",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/deletecourse/${id}`);
            console.log("response of the delete course ", response)
            return id; // Return the deleted course ID
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// Async thunk to search for courses
export const searchCourses = createAsyncThunk(
    "courses/searchCourses",
    async (query, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/searchcourses?query=${query}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// Redux slice for courses
const courseSlice = createSlice({
    name: "courses",
    initialState: {
        courses: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle add course
            .addCase(addCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(addCourse.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(state.courses)) {
                    state.courses.push(action.payload); // Add the new course to the array
                } else {
                    console.warn("State courses is not an array. Resetting to an empty array.");
                    state.courses = [action.payload]; // Initialize with the new course if not already an array
                }
                state.successMessage = "Course added successfully!";
            })
            .addCase(addCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

        // Handle fetch all courses
        .addCase(searchCoursesByUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(searchCoursesByUser.fulfilled, (state, action) => {
            state.loading = false;
            state.courses = action.payload; // Replace courses with fetched data
        })
        .addCase(searchCoursesByUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Handle update course
        .addCase(updateCourse.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        })
        .addCase(updateCourse.fulfilled, (state, action) => {
            state.loading = false;
            const updatedCourseIndex = state.courses.findIndex(
                (course) => course._id === action.payload._id
            );
            if (updatedCourseIndex !== -1) {
                state.courses[updatedCourseIndex] = action.payload; // Update the course in the state
            }
            state.successMessage = "Course updated successfully!";
        })
        .addCase(updateCourse.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Handle delete course
        .addCase(deleteCourse.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        })
        .addCase(deleteCourse.fulfilled, (state, action) => {
            state.loading = false;
            state.courses = state.courses.filter((course) => course._id !== action.payload);
            state.successMessage = "Course deleted successfully!";
        })
        .addCase(deleteCourse.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        // Handle search courses
        .addCase(searchCourses.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(searchCourses.fulfilled, (state, action) => {
            state.loading = false;
            state.courses = action.payload; // Replace courses with search results
        })
        .addCase(searchCourses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
},
});

export default courseSlice.reducer;
