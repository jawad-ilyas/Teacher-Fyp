// src/features/teacher/teacherSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1";

/* -------------------------------------------------------------------------- */
/*                1) Fetch All Teachers (with advanced filters)              */
/* -------------------------------------------------------------------------- */
/**
 * GET /api/v1/teachers
 * Query params could be:
 *  - search
 *  - courseCount ("exact1", "2plus", etc.)
 *  - sortField ("createdAtAsc", "createdAtDesc", etc.)
 */
export const fetchAllTeachers = createAsyncThunk(
    "teacher/fetchAllTeachers",
    async ({ search, courseCount, sortField } = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (courseCount) params.append("courseCount", courseCount);
            if (sortField) params.append("sortField", sortField);

            const response = await axios.get(`${API_URL}/teachers?${params.toString()}`);
            // Suppose the server returns { statusCode, message, data: arrayOfTeachers }
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch teachers");
        }
    }
);

/* -------------------------------------------------------------------------- */
/*             2) Fetch Teacher By ID (Profile Page)                          */
/* -------------------------------------------------------------------------- */
/**
 * GET /api/v1/teachers/:id
 */
export const fetchTeacherById = createAsyncThunk(
    "teacher/fetchTeacherById",
    async (teacherId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/teachers/${teacherId}`);
            return response.data.data; // The teacher object
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

/* -------------------------------------------------------------------------- */
/*      3) Update Teacher Text Fields (PUT /api/v1/teachers/:id)             */
/* -------------------------------------------------------------------------- */
export const updateTeacher = createAsyncThunk(
    "teacher/updateTeacher",
    async ({ teacherId, updates }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/teachers/${teacherId}`, updates);
            return response.data.data; // Updated teacher
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update teacher");
        }
    }
);

/* -------------------------------------------------------------------------- */
/*       4) Update Teacher Image (PATCH /api/v1/teachers/:id/image)          */
/* -------------------------------------------------------------------------- */
export const updateTeacherImage = createAsyncThunk(
    "teacher/updateTeacherImage",
    async ({ teacherId, formData }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${API_URL}/teachers/${teacherId}/image`,
                formData
            );
            return response.data.data; // { _id, imageUrl }
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update teacher image");
        }
    }
);

/* -------------------------------------------------------------------------- */
/* 5) Fetch Teacher’s Courses If You Want to Show in a Modal, etc.           */
/* -------------------------------------------------------------------------- */
export const fetchTeacherCoursesForSingleTeacher = createAsyncThunk(
    "teacher/fetchTeacherCoursesForSingleTeacher",
    async (teacherId, { rejectWithValue }) => {
        try {
            // Example: GET /api/v1/courses/searchcoursesbyuser?userId=teacherId
            const response = await axios.get(
                `${API_URL}/courses/searchcoursesbyuser?userId=${teacherId}`
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch teacher courses");
        }
    }
);


/* -------------------------------------------------------------------------- */
/*                            TEACHER SLICE                                  */
/* -------------------------------------------------------------------------- */
const teacherSlice = createSlice({
    name: "teacher",
    initialState: {
        // For listing/filtering
        teachers: [],
        // For teacher detail
        teacher: null,
        // For teacher’s courses (if needed)
        teacherCourses: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchAllTeachers
            .addCase(fetchAllTeachers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllTeachers.fulfilled, (state, action) => {
                state.loading = false;
                state.teachers = action.payload;
            })
            .addCase(fetchAllTeachers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetchTeacherById
            .addCase(fetchTeacherById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.teacher = null; // or keep previous data if you prefer
            })
            .addCase(fetchTeacherById.fulfilled, (state, action) => {
                state.loading = false;
                state.teacher = action.payload;
            })
            .addCase(fetchTeacherById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // updateTeacher
            .addCase(updateTeacher.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateTeacher.fulfilled, (state, action) => {
                state.loading = false;
                state.teacher = action.payload;
                state.successMessage = "Teacher profile updated successfully!";
            })
            .addCase(updateTeacher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // updateTeacherImage
            .addCase(updateTeacherImage.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateTeacherImage.fulfilled, (state, action) => {
                state.loading = false;
                if (state.teacher) {
                    state.teacher.imageUrl = action.payload.imageUrl;
                }
                state.successMessage = "Teacher image updated successfully!";
            })
            .addCase(updateTeacherImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetchTeacherCoursesForSingleTeacher
            .addCase(fetchTeacherCoursesForSingleTeacher.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeacherCoursesForSingleTeacher.fulfilled, (state, action) => {
                state.loading = false;
                state.teacherCourses = action.payload;
            })
            .addCase(fetchTeacherCoursesForSingleTeacher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default teacherSlice.reducer;
