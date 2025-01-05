import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/submissions";

export const updateQuestionMarks = createAsyncThunk(
    "submissions/updateQuestionMarks",
    async ({ submissionId, questionId, marksAwarded }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/${submissionId}/questions/${questionId}`, {
                marksAwarded,
            });
            return response.data?.data; // Assuming the updated question data is returned in `data`
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update marks.");
        }
    }
);


const questionMarksSlice = createSlice({
    name: "questionMarks",
    initialState: {
        submission: null, // Current submission being updated
        loading: false,   // Loading state
        error: null,      // Error state
    },
    reducers: {
        clearQuestionMarksState(state) {
            state.submission = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Update Marks
            .addCase(updateQuestionMarks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateQuestionMarks.fulfilled, (state, action) => {
                state.loading = false;
                const updatedQuestion = action.payload;

                // Update the specific question in the submission state
                if (state.submission) {
                    const questionIndex = state.submission.questions.findIndex(
                        (q) => q._id === updatedQuestion._id
                    );
                    if (questionIndex !== -1) {
                        state.submission.questions[questionIndex] = updatedQuestion;
                    }
                }
            })
            .addCase(updateQuestionMarks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearQuestionMarksState } = questionMarksSlice.actions;
export default questionMarksSlice.reducer;
