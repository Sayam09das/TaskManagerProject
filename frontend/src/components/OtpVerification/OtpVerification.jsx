import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, ArrowLeft, Shield, CheckCircle2, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;



const OtpVerification = () => {
    const location = useLocation(); // ✅ Move inside component
    const email = new URLSearchParams(location.search).get('email');
    const [isDark, setIsDark] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [otpTimer, setOtpTimer] = useState(300);
    const navigate = useNavigate();
    const [canResendOtp, setCanResendOtp] = useState(false);

    const otpRefs = useRef([]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // OTP Timer
    useEffect(() => {
        let interval;
        if (otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer(prev => {
                    if (prev <= 1) {
                        setCanResendOtp(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    // Toast functionality
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000);
    };

    // Handle OTP input
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Take only the last digit
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    // Handle OTP backspace
    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    if (!email) {
        showToast('Email is missing. Please go back and enter your email again.', 'error');
        return;
    }

    // Handle OTP verification
    const handleOtpVerification = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            showToast('Please enter all 6 digits', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${BACKEND_URL}/auth/verify-otp`,
                { email, otp: otpString },
                { withCredentials: true }
            );

            setIsLoading(false);
            showToast(response.data.message || 'OTP verified successfully!', 'success');
            navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);

        } catch (err) {
            setIsLoading(false);
            if (err.response?.data?.message) {
                showToast(err.response.data.message, 'error');
            } else {
                showToast('Server error. Please try again later.', 'error');
            }
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        setIsLoading(true);
        try {
            await axios.post(`${BACKEND_URL}/auth/resend-otp`, { email }, { withCredentials: true });
            setOtpTimer(300); // Reset 5-minute timer
            setCanResendOtp(false); // Disable button until timer ends
            setOtp(['', '', '', '', '', '']); // Clear OTP inputs
            showToast('New OTP sent to your email!', 'success');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to resend OTP', 'error');
        } finally {
            setIsLoading(false);
        }
    };




    // Handle back navigation
    const handleBack = () => {
        showToast('Going back to forgot password', 'success');
    };

    // Format timer display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const orbColor = isDark ? 'bg-purple-500' : 'bg-blue-400';
    const backgroundClass = isDark
        ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';

    const buttonClass = `w-full py-3 rounded-xl font-bold text-lg flex justify-center items-center gap-3 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 ${isDark
        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`;

    return (
        <div className={`min-h-screen transition-colors duration-500 relative overflow-hidden ${backgroundClass}`}>
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg backdrop-blur-xl border-2 transition-all duration-300 max-w-md text-center ${toast.type === 'error'
                    ? 'bg-red-900/80 border-red-400/50 text-red-100'
                    : 'bg-green-900/80 border-green-400/50 text-green-100'
                    }`}>
                    {toast.message}
                </div>
            )}

            {/* Glowing Orb */}
            <div
                className={`fixed w-64 h-64 rounded-full pointer-events-none z-0 blur-3xl opacity-20 transition-all duration-500 ease-out ${orbColor}`}
                style={{
                    left: mousePosition.x - 128,
                    top: mousePosition.y - 128,
                }}
            />

            {/* Dark Mode Toggle */}
            <button
                onClick={() => setIsDark(!isDark)}
                className={`fixed top-6 right-6 z-50 p-4 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 ${isDark
                    ? 'bg-purple-900/50 border-purple-400/30 text-yellow-400 hover:bg-purple-800/60'
                    : 'bg-blue-900/10 border-blue-400/30 text-orange-500 hover:bg-blue-800/20'
                    }`}
            >
                {isDark ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
            </button>

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen py-8">
                <div
                    className={`w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-md border-2 transform transition-all duration-600 ${isDark
                        ? 'bg-purple-900/20 border-purple-400/30 text-white'
                        : 'bg-white/40 border-blue-400/20 text-gray-900'
                        }`}
                >
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className={`mb-4 flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-blue-600 hover:text-blue-700'
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <div className="text-center mb-8">
                        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-purple-600/20' : 'bg-blue-600/20'
                            }`}>
                            <Shield className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-blue-600'}`} />
                        </div>
                        <h2 className="text-3xl font-extrabold mb-2">Verify Your Email</h2>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            We've sent a 6-digit code to
                        </p>
                        <p className={`text-sm font-semibold ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>
                            {email}
                        </p>
                    </div>

                    <div>
                        <div className="mb-6">
                            <label className="block mb-4 font-semibold text-center">
                                Enter 6-Digit Code
                            </label>
                            <div className="flex justify-center gap-3 mb-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => otpRefs.current[index] = el}
                                        type="text"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        className={`w-12 h-12 text-center text-xl font-bold rounded-xl border-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 ${isDark
                                            ? 'bg-gray-800/50 border-gray-700/50 text-white focus:border-purple-400'
                                            : 'bg-white/70 border-gray-200/50 text-gray-900 focus:border-blue-400'
                                            }`}
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>

                            {/* Timer */}
                            <div className="text-center mb-4">
                                {otpTimer > 0 ? (
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Code expires in{' '}
                                        <span className={`font-semibold ${isDark ? 'text-purple-400' : 'text-blue-600'}`}>
                                            {formatTime(otpTimer)}
                                        </span>
                                    </p>
                                ) : (
                                    <p className="text-sm text-red-400">Code expired</p>
                                )}
                            </div>

                            {/* Resend Button */}
                            {canResendOtp && (
                                <div className="text-center mb-4">
                                    <button
                                        onClick={handleResendOtp}
                                        disabled={isLoading}
                                        className={`text-sm font-semibold transition-all duration-300 hover:scale-105 ${isDark
                                            ? 'text-purple-400 hover:text-purple-300'
                                            : 'text-blue-600 hover:text-blue-700'
                                            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? 'Sending...' : 'Resend Code'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleOtpVerification}
                            disabled={isLoading || otp.join('').length !== 6}
                            className={buttonClass}
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Verify Code
                                </>
                            )}
                        </button>
                    </div>

                    <p className={`text-center mt-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Didn't receive the code?{' '}
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={otpTimer > 0 || isLoading}
                            className={`font-semibold transition-all duration-300 
            ${otpTimer === 0 && !isLoading
                                    ? isDark
                                        ? 'text-purple-400 hover:text-purple-300'
                                        : 'text-blue-600 hover:text-blue-700'
                                    : 'opacity-50 cursor-not-allowed'
                                }`}
                        >
                            {isLoading ? 'Sending...' : `Click to resend${otpTimer > 0 ? ` (${otpTimer}s)` : ''}`}
                        </button>
                    </p>


                </div>
            </div>
        </div>
    );
};

export default OtpVerification;