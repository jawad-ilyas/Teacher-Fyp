import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL for courses
const API_URL = "http://localhost:5000/api/v1/courses";

/* -------------------------------------------------------------------------- */
/*                            Thunks (Async Actions)                          */
/* -------------------------------------------------------------------------- */

// 1) Add a new course
export const addCourse = createAsyncThunk(
    "courses/addCourse",
    async (courseData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/createcourse`, courseData);
            console.log("response of the add course ", response);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// 2) Fetch courses specifically by the logged-in user
export const searchCoursesByUser = createAsyncThunk(
    "courses/searchCoursesByUser",
    async (_, { rejectWithValue }) => {
        try {
            // Get user info from localStorage
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if (!userInfo || !userInfo.data || !userInfo.data._id) {
                throw new Error("User information is missing");
            }

            // Fetch courses by userId
            const response = await axios.get(
                `${API_URL}/searchcoursesbyuser?userId=${userInfo.data._id}`
            );

            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// 3) Update a course
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

// 4) Delete a course
export const deleteCourse = createAsyncThunk(
    "courses/deleteCourse",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/deletecourse/${id}`);
            console.log("response of the delete course ", response);
            return id; // Return the deleted course ID
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// 5) Search courses (with optional filters)
export const searchCourses = createAsyncThunk(
    "courses/searchCourses",
    async ({ searchTerm, category, teacherId } = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append("query", searchTerm);
            if (category) params.append("category", category);
            if (teacherId) params.append("teacherId", teacherId);

            const response = await axios.get(
                `${API_URL}/searchcourses?${params.toString()}`
            );
            return response.data.data; // Return the fetched data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// 6) Fetch categories
export const fetchCategories = createAsyncThunk(
    "courses/fetchCategories",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/fetchcategories`);
            return response.data.data; // Return the list of categories
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// 7) Add a student to a course
export const addStudentToCourse = createAsyncThunk(
    "courses/addStudentToCourse",
    async ({ courseId, email }, { rejectWithValue }) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            if (!userInfo) throw new Error("userInfo not found");

            const token = userInfo?.data?.token; // Get token from userInfo
            const teacherId = userInfo?.data?._id; // Get teacher ID from userInfo

            if (!token || !teacherId) {
                throw new Error("Authentication details are incomplete");
            }

            // Make the API call
            const response = await axios.post(
                `${API_URL}/${courseId}/add-student`,
                { email, teacherId }, // Pass teacherId and email in the body
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass token in the Authorization header
                    },
                }
            );

            return response.data; // Expecting success message in response.data.message
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add student");
        }
    }
);

// 8) Fetch ALL courses (no filters)
export const fetchAllCourses = createAsyncThunk(
    "courses/fetchAllCourses",
    async (_, { rejectWithValue }) => {
        try {
            // If your server re-uses search endpoint without params, that’s fine:
            // const response = await axios.get(`${API_URL}/searchcourses`);
            // OR if you have a dedicated endpoint for all courses:
            const response = await axios.get(`${API_URL}/all`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

/* -------------------------------------------------------------------------- */
/* NEW: Fetch Teachers for the Teacher Dropdown                               */
/* -------------------------------------------------------------------------- */
// This is an example. Adjust to match your actual endpoint (maybe `/api/v1/users?role=teacher`)
export const fetchTeachers = createAsyncThunk(
    "courses/fetchTeachers",
    async (_, { rejectWithValue }) => {
        try {
            // Adjust URL to your actual endpoint that returns all teachers
            const response = await axios.get(`${API_URL}/teachers`)
            return response.data.data; // Return array of teachers
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);



// 2) fetchEnrolledCourses (for a student)
export const fetchEnrolledCourses = createAsyncThunk(
    "courses/fetchEnrolledCourses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/student/courses`);
            return response.data.data; // array of courses
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch courses");
        }
    }
);

// 3) getCourseMates
export const fetchCourseMates = createAsyncThunk(
    "courses/fetchCourseMates",
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/courses/${courseId}/students`);
            return response.data.data; // array of enrolledStudents
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch course mates");
        }
    }
);




/* -------------------------------------------------------------------------- */
/*                                Course Slice                                */
/* -------------------------------------------------------------------------- */

const courseSlice = createSlice({
    name: "courses",
    initialState: {
        courses: [],
        categories: [],
        teachers: [],         // <--- new state for teachers
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            /* ---------------------------- addCourse --------------------------- */
            .addCase(addCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(addCourse.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(state.courses)) {
                    state.courses.push(action.payload);
                } else {
                    console.warn("State courses is not an array. Resetting to an empty array.");
                    state.courses = [action.payload];
                }
                state.successMessage = "Course added successfully!";
            })
            .addCase(addCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ------------------------ searchCoursesByUser --------------------- */
            .addCase(searchCoursesByUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchCoursesByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(searchCoursesByUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ---------------------------- updateCourse ------------------------- */
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
                    state.courses[updatedCourseIndex] = action.payload;
                }
                state.successMessage = "Course updated successfully!";
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ---------------------------- deleteCourse ------------------------- */
            .addCase(deleteCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.loading = false;
                // Filter out the deleted course
                state.courses = state.courses.filter(
                    (course) => course._id !== action.payload
                );
                state.successMessage = "Course deleted successfully!";
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ---------------------------- searchCourses ------------------------ */
            .addCase(searchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchCourses.fulfilled, (state, action) => {
                state.loading = false;
                // Replace courses with search results
                state.courses = action.payload;
            })
            .addCase(searchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* --------------------------- fetchCategories ----------------------- */
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                // Ensure categories is always an array
                state.categories = action.payload || [];
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* ------------------------ addStudentToCourse ---------------------- */
            .addCase(addStudentToCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(addStudentToCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage =
                    action.payload?.message || "Student added successfully!";
            })
            .addCase(addStudentToCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* --------------------------- fetchAllCourses ----------------------- */
            .addCase(fetchAllCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(fetchAllCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            /* --------------------------- fetchTeachers ------------------------- */
            .addCase(fetchTeachers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTeachers.fulfilled, (state, action) => {
                state.loading = false;
                // Suppose the endpoint returns an array of teacher objects
                state.teachers = action.payload || [];
            })
            .addCase(fetchTeachers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetchEnrolledCourses
            .addCase(fetchEnrolledCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.enrolledCourses = action.payload; // array of courses
            })
            .addCase(fetchEnrolledCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetchCourseMates
            .addCase(fetchCourseMates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseMates.fulfilled, (state, action) => {
                state.loading = false;
                state.courseMates = action.payload; // array of {student, status}
            })
            .addCase(fetchCourseMates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default courseSlice.reducer;
