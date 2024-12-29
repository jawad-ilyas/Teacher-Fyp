// components/ErrorAlert.js


const ErrorAlert = ({ message }) => {
    if (!message) return null;

    return (
        <div style={{ color: 'red', backgroundColor: '#fdd', padding: '10px', borderRadius: '5px' }}>
            {message}
        </div>
    );
};

export default ErrorAlert;
