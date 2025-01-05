import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import courseReducer from "../features/course/CourseSlice";
import moduleReducer from "../features/module/ModuleSlice"
import UserProfileReducer from '../features/userProfile/UserProfile';
import QuestionsReducer from '../features/questionsSlice/QuestionsSlice';
import teacherReducer from "../features/teacher/teacherSlice";
import teacherProfileSlice from '../features/teacherProfile/teacherProfileSlice';
import enrolledStudentsReducer from "../features/student/enrolledStudentsSlice";
import studentReducer from "../features/student/studentSlice"
import compilerReducer from "../features/compiler/compilerSlice";
import adminSubmissionsReducer from "../features/adminSubmissions/adminSubmissionsSlice";
export const store = configureStore({
    reducer: {
        user: userReducer,
        courses: courseReducer,
        modules: moduleReducer,
        userProfile: UserProfileReducer,
        Question: QuestionsReducer,
        teacher: teacherReducer,
        teacherProfile: teacherProfileSlice,
        enrolledStudents: enrolledStudentsReducer,
        student: studentReducer,
        compiler: compilerReducer,
        adminSubmissions: adminSubmissionsReducer,



    },
});