// src/components/Loader.jsx
const Loader = () => {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="w-20 h-20 border-[10px] border-yellow-400 border-l-transparent border-r-transparent rounded-full animate-spin-slow"></div>
        </div>
    );
};

export default Loader;
