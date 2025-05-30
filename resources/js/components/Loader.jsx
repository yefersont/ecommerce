// src/components/Loader.jsx
const Loader = () => {
    return (
        <div className="fixed inset-12 inset-32 flex justify-center items-center bg-gray bg-opacity-70 z-50">
            <div className="w-24 h-24 border-8 border-yellow-400 border-t-yellow-600 border-solid rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;
