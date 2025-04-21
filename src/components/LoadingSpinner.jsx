export default function LoadingSpinner({ size = 'default', message = 'Loading...' }) {
    const sizeClasses = {
        small: 'h-4 w-4',
        default: 'h-8 w-8',
        large: 'h-16 w-16'
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]} mb-2`}></div>
            {message && <p className="text-gray-600">{message}</p>}
        </div>
    );
} 