import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/students';

/* -------------------------------------------------------------------------- */
/*                        FETCH SINGLE STUDENT                                */
/* -------------------------------------------------------------------------- */
export const fetchSingleStudent = createAsyncThunk(
    'student/fetchSingleStudent',
    async (studentId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${studentId}`);
            return response.data.data; // The student object
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch student');
        }
    }
);

/* -------------------------------------------------------------------------- */
/*                        UPDATE SINGLE STUDENT                               */
/* -------------------------------------------------------------------------- */
export const updateSingleStudent = createAsyncThunk(
    'student/updateSingleStudent',
    async ({ studentId, updates }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/${studentId}`, updates);
            return response.data.data; // updated student
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update student');
        }
    }
);

/* -------------------------------------------------------------------------- */
/*                        DELETE SINGLE STUDENT                               */
/* -------------------------------------------------------------------------- */
export const deleteSingleStudent = createAsyncThunk(
    'student/deleteSingleStudent',
    async (studentId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${studentId}`);
            return studentId; // Return the ID so we can remove from state if needed
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete student');
        }
    }
);

const studentSlice = createSlice({
    name: 'student',
    initialState: {
        currentStudent: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchSingleStudent
            .addCase(fetchSingleStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentStudent = null;
            })
            .addCase(fetchSingleStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.currentStudent = action.payload;
            })
            .addCase(fetchSingleStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // updateSingleStudent
            .addCase(updateSingleStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateSingleStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.currentStudent = action.payload;
                state.successMessage = 'Student updated successfully!';
            })
            .addCase(updateSingleStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // deleteSingleStudent
            .addCase(deleteSingleStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteSingleStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = 'Student deleted successfully!';
                // if you keep an array of students in state, you can remove them here
            })
            .addCase(deleteSingleStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default studentSlice.reducer;
