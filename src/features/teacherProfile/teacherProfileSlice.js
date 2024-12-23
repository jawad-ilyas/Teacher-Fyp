import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* -------------------------------------------------------------------------- */
/*                    FETCH TEACHER BY ID (Thunk)                             */
/* -------------------------------------------------------------------------- */
/**
 * Calls GET /api/v1/teachers/:teacherId
 * Returns the teacher object (excluding password)
 */
export const fetchTeacherById = createAsyncThunk(
    "teacherProfile/fetchTeacherById",
    async (teacherId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/teachers/${teacherId}`);
            // The API returns { statusCode, message, data, success? }
            // We'll take `response.data.data` as the teacher object
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);
// 1) Update teacher fields (non-image)
export const updateTeacher = createAsyncThunk(
    "teacherProfile/updateTeacher",
    async ({ teacherId, updates }, { rejectWithValue }) => {
        try {
            // PUT /api/v1/teachers/:id
            const response = await axios.put(
                `http://localhost:5000/api/v1/teachers/${teacherId}`,
                updates
            );
            return response.data.data; // The updated teacher object
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to update teacher"
            );
        }
    }
);

// 2) Update teacher image
export const updateTeacherImage = createAsyncThunk(
    "teacherProfile/updateTeacherImage",
    async ({ teacherId, formData }, { rejectWithValue }) => {
        try {
            // PATCH /api/v1/teachers/:id/image
            // formData should contain the file in "image" field
            const response = await axios.patch(
                `http://localhost:5000/api/v1/teachers/${teacherId}/image`,
                formData,

            );
            return response.data.data; // Contains { _id, imageUrl }
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Failed to update teacher image"
            );
        }
    }
);





// We'll modify fetchAllTeachers to accept an object of filters
export const fetchAllTeachers = createAsyncThunk(
    "teacher/fetchAllTeachers",
    async ({ search, sortField, sortOrder } = {}, { rejectWithValue }) => {
        try {
            // Build query params
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (sortField) params.append("sortField", sortField);
            if (sortOrder) params.append("sortOrder", sortOrder);

            const response = await axios.get(
                `http://localhost:5000/api/v1/teachers?${params.toString()}`
            );
            return response.data.data; // assume { status: 200, data: [teachers], ... }
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);











/* -------------------------------------------------------------------------- */
/*                          TEACHER PROFILE SLICE                             */
/* -------------------------------------------------------------------------- */
const teacherProfileSlice = createSlice({
    name: "teacherProfile",
    initialState: {
        teacher: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTeacherById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeacherById.fulfilled, (state, action) => {
                state.loading = false;
                state.teacher = action.payload;
            })
            .addCase(fetchTeacherById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateTeacher.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateTeacher.fulfilled, (state, action) => {
                state.loading = false;
                state.teacher = action.payload; // updated teacher
                state.successMessage = "Teacher profile updated successfully!";
            })
            .addCase(updateTeacher.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // For updateTeacherImage
            .addCase(updateTeacherImage.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateTeacherImage.fulfilled, (state, action) => {
                state.loading = false;
                // action.payload = { _id, imageUrl }
                if (state.teacher) {
                    state.teacher.imageUrl = action.payload.imageUrl;
                }
                state.successMessage = "Teacher image updated successfully!";
            })
            .addCase(updateTeacherImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllTeachers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllTeachers.fulfilled, (state, action) => {
                state.loading = false;
                state.teachers = action.payload; // array of teachers
            })
            .addCase(fetchAllTeachers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default teacherProfileSlice.reducer;
