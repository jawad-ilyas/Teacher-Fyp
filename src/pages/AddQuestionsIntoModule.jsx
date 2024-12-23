import { useParams } from "react-router-dom";

const AddQuestionsIntoModule = () => {
    const { courseId, moduleId } = useParams();

    return (
        <div>
            <h1>Add Questions into Module</h1>
            <p>Course ID: {courseId}</p>
            <p>Module ID: {moduleId}</p>
        </div>
    );
};

export default AddQuestionsIntoModule;
