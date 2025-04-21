import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Portfolio() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getPortfolioData() {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(`http://localhost:5000/api/portfolio/${id}`);
            setPortfolio(res.data);
        } catch (err) {
            setError(
                err.response?.data?.error || 
                err.message || 
                'An error occurred while fetching the portfolio'
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPortfolioData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your portfolio...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md w-full">
                    <div className="text-center">
                        <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load portfolio</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={getPortfolioData}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition duration-200"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                {portfolio ? (
                    <div className="p-8 text-gray-900">
                        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                            Professional Portfolio
                        </h1>
                        
                        {/* Personal Info Section */}
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl font-semibold text-gray-900 mb-2">{portfolio.name}</h2>
                            <p className="text-lg text-gray-800">{portfolio.email}</p>
                        </div>

                        {/* Video Section */}
                        {portfolio.video_url && (
                            <div className="mb-12">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Introduction Video</h3>
                                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg">
                                    <video controls autoPlay loop className="w-full">
                                        <source src={`http://localhost:5000${portfolio.video_url}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        )}

                        {/* Projects Section */}
                        {portfolio.projects && portfolio.projects.length > 0 && (
                            <div className="mb-12">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Projects</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {portfolio.projects.map((project, index) => (
                                        <a
                                            key={index}
                                            href={project}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition duration-300"
                                        >
                                            <p className="text-gray-900 hover:text-blue-800">{project}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Resume Data Section */}
                        {portfolio.parsedata && (
                            <div className="prose max-w-none text-gray-900">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Resume Details</h3>
                                <div
                                    className="bg-gray-50 rounded-lg p-6 text-gray-900 resume-content"
                                    dangerouslySetInnerHTML={{ __html: portfolio.parsedata }}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-900">Loading portfolio...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
