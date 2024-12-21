import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import courseReducer from "../features/course/CourseSlice";
import moduleReducer from "../features/module/ModuleSlice"
import UserProfileReducer from '../features/userProfile/UserProfile';
import QuestionsReducer from '../features/questionsSlice/QuestionsSlice';
export const store = configureStore({
    reducer: {
        user: userReducer,
        courses: courseReducer,
        modules: moduleReducer,
        userProfile: UserProfileReducer,
        Question: QuestionsReducer,
    },
});