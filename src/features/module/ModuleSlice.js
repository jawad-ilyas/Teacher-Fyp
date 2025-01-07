import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API Base URL
const API_URL = "http://localhost:5000/api/v1/modules"; // Update with your backend endpoint

// Async thunk to add a new module
export const addModule = createAsyncThunk(
    "modules/addModule",
    async (moduleData, { rejectWithValue }) => {
        try {
            console.log("module data for the course creation time ", moduleData)
            const response = await axios.post(`${API_URL}/create`, moduleData);
            return response.data.data; // Return the created module data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);
export const fetchSingleModule = createAsyncThunk(
    "modules/fetchSingleModule",
    async (moduleId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/modules/${moduleId}`);
            // The module with questions populated
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch module");
        }
    }
);
// Async thunk to fetch all modules for a specific course
export const fetchModulesByCourse = createAsyncThunk(
    "modules/fetchModulesByCourse",
    async ({ courseId, teacherId }, { rejectWithValue }) => {
        try {
            // Get teacher info from localStorage
            // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            // const teacherId = userInfo?.data?._id;

            // // Validate teacher ID
            // if (!teacherId) {
            //     throw new Error("Teacher ID is missing from localStorage.");
            // }

            // Make API request with courseId and teacherId
            const response = await axios.get(
                `http://localhost:5000/api/v1/modules/course/${courseId}?teacher=${teacherId}`
            );

            return response.data.data; // Return fetched modules
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);


// Async thunk to delete a module
export const deleteModule = createAsyncThunk(
    "modules/deleteModule",
    async (moduleId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${API_URL}/delete/${moduleId}`);
            console.log("response into the delete case ", response)
            return moduleId; // Return the ID of the deleted module
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);


// Async thunk to update a module
export const updateModule = createAsyncThunk(
    "modules/updateModule",
    async (updatedModule, { rejectWithValue }) => {
        try {
            const { id, course, teacher, ...data } = updatedModule; // Extract IDs and module data
            console.log("id", id, "course", course)
            const response = await axios.put(
                `http://localhost:5000/api/v1/modules/update/${id}`,
                { ...data, course, teacher }
            );
            return response.data.data; // Return the updated module data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);
export const addQuestionsToModule = createAsyncThunk(
    "modules/addQuestionsToModule",
    async ({ moduleId, courseId, questionsData }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/v1/modules/${moduleId}/add-questions`,
                { courseId, questionsData }
            );
            return response.data.data; // updated module
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to add questions");
        }
    }
);

export const deleteQuestionFromModule = createAsyncThunk(
    "modules/deleteQuestionFromModule",
    async ({ moduleId, questionId }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `http://localhost:5000/api/v1/modules/${moduleId}/questions/${questionId}`
            );
            return { moduleId, questionId }; // Return IDs to update state
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete the question.");
        }
    }
);

// Redux slice for modules
const moduleSlice = createSlice({
    name: "modules",
    initialState: {
        modules: [], // Stores modules for the selected course
        loading: false,
        error: null,
        currentModule: null,

        successMessage: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSingleModule.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentModule = null;
            })
            .addCase(fetchSingleModule.fulfilled, (state, action) => {
                state.loading = false;
                state.currentModule = action.payload; // The module doc
            })
            .addCase(fetchSingleModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle add module
            .addCase(addModule.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(addModule.fulfilled, (state, action) => {
                state.loading = false;
                state.modules.push(action.payload); // Add the new module to the state
                state.successMessage = "Module added successfully!";
            })
            .addCase(addModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle fetch modules by course
            .addCase(fetchModulesByCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchModulesByCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.modules = action.payload; // Replace the module list with the fetched data
            })
            .addCase(fetchModulesByCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle delete module
            .addCase(deleteModule.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(deleteModule.fulfilled, (state, action) => {
                state.loading = false;
                state.modules = state.modules.filter((module) => module._id !== action.payload); // Remove the deleted module
                state.successMessage = "Module deleted successfully!";
            })
            .addCase(deleteModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle update module
            .addCase(updateModule.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(updateModule.fulfilled, (state, action) => {
                state.loading = false;
                const updatedIndex = state.modules.findIndex(
                    (module) => module._id === action.payload._id
                );
                if (updatedIndex !== -1) {
                    state.modules[updatedIndex] = action.payload; // Update the module in the state
                }
                state.successMessage = "Module updated successfully!";
            })
            .addCase(updateModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addQuestionsToModule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addQuestionsToModule.fulfilled, (state, action) => {
                state.loading = false;
                // action.payload is the updated module
                state.currentModule = action.payload;
            })
            .addCase(addQuestionsToModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteQuestionFromModule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteQuestionFromModule.fulfilled, (state, action) => {
                state.loading = false;
                const { moduleId, questionId } = action.payload;

                if (state.currentModule && state.currentModule._id === moduleId) {
                    state.currentModule.questions = state.currentModule.questions.filter(
                        (q) => q.question._id !== questionId
                    );
                }

                state.successMessage = "Question deleted successfully!";
            })
            .addCase(deleteQuestionFromModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export default moduleSlice.reducer;
