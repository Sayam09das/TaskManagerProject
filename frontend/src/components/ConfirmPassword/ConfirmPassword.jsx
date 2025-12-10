import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Eye, EyeOff, Sun, Moon, Lock,
    ArrowLeft, CheckCircle2, RefreshCw
} from 'lucide-react';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const ConfirmPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract email from URL query param
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email'); // e.g. sayamcomputer2004@gmail.com

    const [isDark, setIsDark] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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

    

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        const errors = {};

        if (!email) {
            showToast('Email is missing from URL. Please restart the reset process.', 'error');
            return;
        }

        if (!newPassword) {
            errors.newPassword = 'New password is required';
        } else {
            const check = validatePassword(newPassword);
            if (!check.isValid) {
                const parts = [];
                if (!check.minLength) parts.push('at least 8+ characters');
                if (!check.maxLength) parts.push('at most 12 characters');
                if (!check.hasUppercase) parts.push('1 uppercase letter');
                if (!check.hasNumber) parts.push('1 number');
                if (!check.hasSpecialChar) parts.push('1 special character');
                errors.newPassword = 'Password must contain: ' + parts.join(', ');
            }
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (confirmPassword !== newPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setValidationErrors(errors);
        if (Object.keys(errors).length > 0) {
            showToast('Please fix the errors below', 'error');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post(`${BACKEND_URL}/auth/reset-password`, {
                email: email,
                password: newPassword
            });

            setIsLoading(false);
            if (response?.data?.message === 'Password has been reset successfully') {
                showToast('Password reset successfully! You can now login.', 'success');
                setTimeout(() => {
                    navigate('/auth/login');
                }, 2000);
            } else {
                showToast('Something went wrong. Please try again.', 'error');
            }
        } catch (err) {
            setIsLoading(false);
            showToast(err.response?.data?.message || 'Server error. Try again.', 'error');
        }
    };

    const handleBack = () => {
        showToast('Going back to OTP verification...', 'success');
        navigate(-1); // go back to previous page
    };

    const orbColor = isDark ? 'bg-purple-500' : 'bg-blue-400';
    const backgroundClass = isDark
        ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';

    const inputClass = (fieldName) =>
        `w-full p-3 pr-12 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isDark ? 'bg-gray-800/50 text-white placeholder-gray-400' : 'bg-white/70 text-gray-900 placeholder-gray-500'
        } ${validationErrors[fieldName] ? 'border-2 border-red-500' : ''}`;

    const buttonClass = `w-full py-3 rounded-xl font-bold text-lg flex justify-center items-center gap-3 transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 ${isDark
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`;

    const passwordValidation = validatePassword(newPassword);

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
                            <Lock className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-blue-600'}`} />
                        </div>
                        <h2 className="text-3xl font-extrabold mb-2">Reset Password</h2>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Create a new secure password for your account.
                        </p>
                    </div>

                    {/* New Password Field */}
                    <div className="mb-4 relative">
                        <label className="block mb-2 font-semibold flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            New Password
                        </label>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (validationErrors.newPassword) {
                                    setValidationErrors(prev => ({ ...prev, newPassword: '' }));
                                }
                            }}
                            className={inputClass('newPassword')}
                            placeholder="Enter new password"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className={`absolute right-3 top-10 cursor-pointer transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        {validationErrors.newPassword && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                {validationErrors.newPassword}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-6 relative">
                        <label className="block mb-2 font-semibold flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Confirm Password
                        </label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (validationErrors.confirmPassword) {
                                    setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
                                }
                            }}
                            className={inputClass('confirmPassword')}
                            placeholder="Confirm new password"
                            disabled={isLoading}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handlePasswordReset(e);
                                }
                            }}
                        />
                        <button
                            type="button"
                            className={`absolute right-3 top-10 cursor-pointer transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        {validationErrors.confirmPassword && (
                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                {validationErrors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {/* Password Requirements */}
                    <div className={`mb-6 p-4 rounded-xl text-sm ${isDark ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
                        <p className="font-semibold mb-3 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Password Requirements:
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                            <div className={`flex items-center gap-2 transition-colors duration-300 ${passwordValidation.minLength && passwordValidation.maxLength ? 'text-green-400' : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${passwordValidation.minLength && passwordValidation.maxLength ? 'bg-green-400' : 'bg-current opacity-50'
                                    }`}></div>
                                8-12 characters long
                                {passwordValidation.minLength && passwordValidation.maxLength && (
                                    <CheckCircle2 className="w-4 h-4 ml-auto" />
                                )}
                            </div>
                            <div className={`flex items-center gap-2 transition-colors duration-300 ${passwordValidation.hasUppercase ? 'text-green-400' : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${passwordValidation.hasUppercase ? 'bg-green-400' : 'bg-current opacity-50'
                                    }`}></div>
                                At least 1 uppercase letter
                                {passwordValidation.hasUppercase && (
                                    <CheckCircle2 className="w-4 h-4 ml-auto" />
                                )}
                            </div>
                            <div className={`flex items-center gap-2 transition-colors duration-300 ${passwordValidation.hasNumber ? 'text-green-400' : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${passwordValidation.hasNumber ? 'bg-green-400' : 'bg-current opacity-50'
                                    }`}></div>
                                At least 1 number
                                {passwordValidation.hasNumber && (
                                    <CheckCircle2 className="w-4 h-4 ml-auto" />
                                )}
                            </div>
                            <div className={`flex items-center gap-2 transition-colors duration-300 ${passwordValidation.hasSpecialChar ? 'text-green-400' : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${passwordValidation.hasSpecialChar ? 'bg-green-400' : 'bg-current opacity-50'
                                    }`}></div>
                                At least 1 special character (!@#$%^&*)
                                {passwordValidation.hasSpecialChar && (
                                    <CheckCircle2 className="w-4 h-4 ml-auto" />
                                )}
                            </div>
                        </div>

                        {/* Password Strength Indicator */}
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-medium">Password Strength:</span>
                                <span className={`text-xs font-bold ${passwordValidation.isValid ? 'text-green-400' :
                                    newPassword.length > 0 ? 'text-yellow-400' : 'text-gray-400'
                                    }`}>
                                    {passwordValidation.isValid ? 'Strong' :
                                        newPassword.length > 0 ? 'Weak' : 'None'}
                                </span>
                            </div>
                            <div className="w-full bg-gray-600/30 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${passwordValidation.isValid ? 'bg-green-400 w-full' :
                                        newPassword.length > 0 ? 'bg-yellow-400 w-1/2' : 'w-0'
                                        }`}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePasswordReset}
                        disabled={isLoading}
                        className={buttonClass}
                    >
                        {isLoading ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Reset Password
                            </>
                        )}
                    </button>

                    {/* Security Tips */}
                    <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-purple-900/20 border border-purple-400/20' : 'bg-blue-100/50 border border-blue-200/50'}`}>
                        <h4 className="font-semibold mb-2 text-sm">💡 Security Tips:</h4>
                        <ul className={`text-xs space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            <li>• Use a unique password you haven't used before</li>
                            <li>• Consider using a password manager</li>
                            <li>• Enable two-factor authentication when available</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Floating particles effect */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-2 h-2 rounded-full opacity-10 animate-pulse ${isDark ? 'bg-purple-400' : 'bg-blue-400'
                            }`}
                        style={{
                            left: `${10 + i * 12}%`,
                            top: `${15 + i * 8}%`,
                            animationDelay: `${i * 0.7}s`,
                            animationDuration: '4s'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ConfirmPassword;