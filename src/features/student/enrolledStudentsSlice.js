// enrolledStudentsSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL
const API_URL = "http://localhost:5000/api/v1/courses";

/* -------------------------------------------------------------------------- */
/*                  FETCH ENROLLED STUDENTS FOR A COURSE                      */
/* -------------------------------------------------------------------------- */
export const fetchEnrolledStudents = createAsyncThunk(
    "enrolledStudents/fetchEnrolledStudents",
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${courseId}/enrolled-students`);
            // response.data.data is array of { student, status }
            console.log("response of the enrolled student " , response.data.data)
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch enrolled students");
        }
    }
);

/* -------------------------------------------------------------------------- */
/*                  REMOVE A STUDENT FROM A COURSE                            */
/* -------------------------------------------------------------------------- */
export const removeEnrolledStudent = createAsyncThunk(
    "enrolledStudents/removeEnrolledStudent",
    async ({ courseId, studentId }, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${courseId}/enrolled-students/${studentId}`);
            return { studentId };
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to remove student");
        }
    }
);

const enrolledStudentsSlice = createSlice({
    name: "enrolledStudents",
    initialState: {
        students: [], // array of { student: { _id, name, email, role }, status }
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // fetchEnrolledStudents
        builder
            .addCase(fetchEnrolledStudents.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.students = [];
            })
            .addCase(fetchEnrolledStudents.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload;
            })
            .addCase(fetchEnrolledStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // removeEnrolledStudent
            .addCase(removeEnrolledStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeEnrolledStudent.fulfilled, (state, action) => {
                state.loading = false;
                // action.payload = { studentId }
                state.students = state.students.filter(
                    (s) => s.student._id !== action.payload.studentId
                );
            })
            .addCase(removeEnrolledStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default enrolledStudentsSlice.reducer;
