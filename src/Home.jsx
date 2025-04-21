import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', projects: '' });
  const [resume, setResume] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    setError(null); // Clear errors when user makes changes
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Invalid email format';
    if (!resume) return 'Resume is required';
    if (!formData.projects.trim()) return 'At least one project link is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('projects', JSON.stringify(formData.projects.split(',')));
      if (resume) data.append('resume', resume);
      if (video) data.append('video', video);

      const res = await axios.post('http://localhost:5000/api/portfolio', data);
      setSubmitSuccess(true);
      
      // navigate to the new portfolio after a brief delay
      setTimeout(() => {
        navigate(`/portfolio/${res.data.id}`);
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.error || 
        err.message || 
        'An error occurred while creating your portfolio'
      );
      // scroll to error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-2xl mx-auto transform transition-all duration-300 hover:shadow-3xl">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-600">Portfolio created successfully! Redirecting...</p>
            </div>
          </div>
        )}

        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Smart Portfolio Builder
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Your Name</label>
            <input
              name="name"
              placeholder="Enter your full name"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Resume (PDF)</label>
            <div className="relative">
              <input
                type="file"
                onChange={(e) => setResume(e.target.files[0])}
                accept="application/pdf"
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Introduction Video (Optional)</label>
            <input
              type="file"
              onChange={(e) => setVideo(e.target.files[0])}
              accept="video/*"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 transition duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Project Links</label>
            <input
              name="projects"
              placeholder="Enter project URLs separated by commas"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              required
            />
            <p className="text-xs text-gray-500">Example: https://project1.com, https://project2.com</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center py-4 rounded-lg font-medium transition duration-300 transform 
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-[1.02] active:scale-[0.98]'
              } text-white shadow-lg`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Creating Portfolio...
              </>
            ) : (
              'Generate Portfolio'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}