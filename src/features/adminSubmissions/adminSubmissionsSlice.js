import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/submissions";

// Async Thunk: Fetch Submissions by Teacher, Course, and Module
export const fetchSubmissionsForAdmin = createAsyncThunk(
    "adminSubmissions/fetchSubmissions",
    async ({ teacherId, courseId, moduleId }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/submissionssubmited/${teacherId}/${courseId}/${moduleId}`
            );
            return response.data?.data; // Assuming the backend returns the data in `data`
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch submissions.");
        }
    }
);

// Async Thunk: Delete Submission
export const deleteSubmission = createAsyncThunk(
    "adminSubmissions/deleteSubmission",
    async ({ teacherId, studentId, courseId, moduleId }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${API_URL}/submissions/${teacherId}/${studentId}/${courseId}/${moduleId}`
            );
            return {
                message: response.data.message, // Optional success message
                submissionId: `${teacherId}-${studentId}-${courseId}-${moduleId}`, // Unique identifier
            };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete submission.");
        }
    }
);

const adminSubmissionsSlice = createSlice({
    name: "adminSubmissions",
    initialState: {
        submissions: [], // List of submissions
        loading: false,  // Loading state
        error: null,     // Error state
    },
    reducers: {
        clearAdminSubmissionsState(state) {
            state.submissions = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Submissions by Teacher, Course, and Module
            .addCase(fetchSubmissionsForAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubmissionsForAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.submissions = action.payload;
            })
            .addCase(fetchSubmissionsForAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Submission
            .addCase(deleteSubmission.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSubmission.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted submission from the list
                const { submissionId } = action.payload;
                state.submissions = state.submissions.filter(
                    (submission) =>
                        `${submission.teacher}-${submission.student}-${submission.course}-${submission.module}` !==
                        submissionId
                );
            })
            .addCase(deleteSubmission.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearAdminSubmissionsState } = adminSubmissionsSlice.actions;
export default adminSubmissionsSlice.reducer;
