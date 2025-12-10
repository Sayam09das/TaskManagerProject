import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon, Mail, Send, RefreshCw } from 'lucide-react';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const ForgotPassword = () => {
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [email, setEmail] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const proxyDomains = [
        'tempmail.org', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
        'temp-mail.org', 'throwaway.email', 'fakeinbox.com', 'maildrop.cc',
        'yopmail.com', 'sharklasers.com', 'tempail.com', 'dispostable.com',
        'emkei.cz', 'emailondeck.com', 'getnada.com', 'tempmailo.com',
        'mohmal.com', 'mintemail.com', 'dropmail.me', 'burnermail.io'
    ];

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) return false;
        const domain = email.split('@')[1]?.toLowerCase();
        return !proxyDomains.includes(domain);
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        const errors = {};

        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            const domain = email.split('@')[1]?.toLowerCase();
            if (proxyDomains.includes(domain)) {
                errors.email = 'Temporary/proxy email addresses are not allowed';
            } else {
                errors.email = 'Please enter a valid email address';
            }
        }

        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
            showToast('Please fix the errors below', 'error');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Sending request to backend...');

            const res = await axios.post(
                `${BACKEND_URL}auth/forgot-password`,
                { email },
                { withCredentials: true }
            );

            console.log('Response:', res.data);

            setIsLoading(false);
            showToast(res.data.message || 'OTP sent to your email!', 'success');
            navigate(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
        } catch (err) {
            setIsLoading(false);
            console.error('Axios Error:', err); // ✅ View in browser console
            if (err.response?.data?.message) {
                showToast(err.response.data.message, 'error');
            } else {
                showToast('Server error. Please try again later.', 'error');
            }
        }

    };

    const handleSignInClick = () => {
        showToast('Redirecting to sign in page...', 'success');
        // Navigate if needed
        // navigate('/login');
    };

    const orbColor = isDark ? 'bg-purple-500' : 'bg-blue-400';
    const backgroundClass = isDark
        ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';

    const inputClass = (fieldName) => `w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isDark ? 'bg-gray-800/50 text-white placeholder-gray-400' : 'bg-white/70 text-gray-900 placeholder-gray-500'
        } ${validationErrors[fieldName] ? 'border-2 border-red-500' : ''}`;

    const buttonClass = `w-full py-3 rounded-xl font-bold text-lg flex justify-center items-center gap-3 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 ${isDark
        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`;

    return (
        <div className={`min-h-screen transition-colors duration-500 relative overflow-hidden ${backgroundClass}`}>
            {toast.show && (
                <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg backdrop-blur-xl border-2 transition-all duration-300 max-w-md text-center ${toast.type === 'error'
                    ? 'bg-red-900/80 border-red-400/50 text-red-100'
                    : 'bg-green-900/80 border-green-400/50 text-green-100'
                    }`}>
                    {toast.message}
                </div>
            )}

            <div
                className={`fixed w-64 h-64 rounded-full pointer-events-none z-0 blur-3xl opacity-20 transition-all duration-500 ease-out ${orbColor}`}
                style={{ left: mousePosition.x - 128, top: mousePosition.y - 128 }}
            />

            <button
                onClick={() => setIsDark(!isDark)}
                className={`fixed top-6 right-6 z-50 p-4 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 ${isDark
                    ? 'bg-purple-900/50 border-purple-400/30 text-yellow-400 hover:bg-purple-800/60'
                    : 'bg-blue-900/10 border-blue-400/30 text-orange-500 hover:bg-blue-800/20'
                    }`}
            >
                {isDark ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
            </button>

            <div className="relative z-10 flex items-center justify-center min-h-screen py-8">
                <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-md border-2 transform transition-all duration-600 ${isDark
                    ? 'bg-purple-900/20 border-purple-400/30 text-white'
                    : 'bg-white/40 border-blue-400/20 text-gray-900'
                    }`}>
                    <div className="text-center mb-8">
                        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-purple-600/20' : 'bg-blue-600/20'
                            }`}>
                            <Mail className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-blue-600'}`} />
                        </div>
                        <h2 className="text-3xl font-extrabold mb-2">Forgot Password?</h2>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            No worries! Enter your email and we'll send you a reset code.
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-semibold flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (validationErrors.email) {
                                    setValidationErrors(prev => ({ ...prev, email: '' }));
                                }
                            }}
                            className={inputClass('email')}
                            placeholder="Enter your email address"
                            disabled={isLoading}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleForgotPassword(e);
                                }
                            }}
                        />
                        {validationErrors.email && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                {validationErrors.email}
                            </p>
                        )}
                    </div>

                    <button onClick={handleForgotPassword} disabled={isLoading} className={buttonClass}>
                        {isLoading ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Send Reset Code
                            </>
                        )}
                    </button>

                    <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
                        <h4 className="font-semibold mb-2 text-sm">What happens next?</h4>
                        <ul className={`text-xs space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                You'll receive a 6-digit code via email
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                Enter the code on the next page
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                Create a new secure password
                            </li>
                        </ul>
                    </div>

                    <p className={`text-center mt-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Remember your password?{' '}
                        <Link
                            to="/auth/login"
                            className={`font-semibold transition-all duration-300 hover:scale-105 ${isDark
                                    ? 'text-purple-400 hover:text-purple-300'
                                    : 'text-blue-600 hover:text-blue-700'
                                }`}
                        >
                            Sign in
                        </Link>
                    </p>

                    <div className={`mt-4 p-3 rounded-lg text-xs text-center ${isDark ? 'bg-purple-900/20 text-purple-300' : 'bg-blue-100/50 text-blue-700'}`}>
                        🔒 We take your security seriously. The reset link will expire in 5 minutes.
                    </div>
                </div>
            </div>

            <div className="fixed inset-0 pointer-events-none z-0">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full opacity-20 animate-pulse ${isDark ? 'bg-purple-400' : 'bg-blue-400'}`}
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${20 + i * 10}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: '3s'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ForgotPassword;
