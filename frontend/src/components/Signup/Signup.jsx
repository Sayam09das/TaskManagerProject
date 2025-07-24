import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Sun, Moon, UserPlus, User, Mail, Lock } from 'lucide-react';

const Signup = () => {
    const [isDark, setIsDark] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [validationErrors, setValidationErrors] = useState({});

    // Proxy email domains list
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

    // Toast functionality
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 4000);
    };

    // Validation functions
    const validateFullName = (name) => {
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        return nameRegex.test(name.trim());
    };

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) return false;

        // Check for proxy/temporary email domains
        const domain = email.split('@')[1]?.toLowerCase();
        return !proxyDomains.includes(domain);
    };

    const validatePassword = (password) => {
        const minLength = password.length >= 4;
        const maxLength = password.length <= 12;
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        return {
            isValid: minLength && maxLength && hasUppercase && hasNumber && hasSpecialChar,
            minLength,
            maxLength,
            hasUppercase,
            hasNumber,
            hasSpecialChar
        };
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear validation error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    const handleSignup = async (e) => {
        e.preventDefault();
        const errors = {};

        // Full Name validation
        if (!formData.fullName.trim()) {
            errors.fullName = 'Full name is required';
        } else if (!validateFullName(formData.fullName)) {
            errors.fullName = 'Full name must be 2-50 characters and contain only letters';
        }

        // Email validation
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            const domain = formData.email.split('@')[1]?.toLowerCase();
            if (proxyDomains.includes(domain)) {
                errors.email = 'Temporary/proxy email addresses are not allowed';
            } else {
                errors.email = 'Please enter a valid email address';
            }
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required';
        } else {
            const passwordCheck = validatePassword(formData.password);
            if (!passwordCheck.isValid) {
                let errorMsg = 'Password must contain: ';
                const missing = [];
                if (!passwordCheck.minLength) missing.push('at least 4 characters');
                if (!passwordCheck.maxLength) missing.push('at most 12 characters');
                if (!passwordCheck.hasUppercase) missing.push('1 uppercase letter');
                if (!passwordCheck.hasNumber) missing.push('1 number');
                if (!passwordCheck.hasSpecialChar) missing.push('1 special character');
                errors.password = errorMsg + missing.join(', ');
            }
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
            showToast('Please fix the errors below', 'error');
            return;
        }

        // ✅ BACKEND REGISTER API CALL HERE
        try {
            const res = await axios.post('http://localhost:3000/auth/register', {
                name: formData.fullName,
                email: formData.email,
                password: formData.password
            });

            if (res.status === 201 || res.status === 200) {
                showToast('Account created successfully! Welcome aboard!', 'success');
                setTimeout(() => {
                    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
                    window.location.href = '/schedulo'; // ✅ redirect added
                }, 2000);
            } else {
                showToast('Unexpected response. Please try again.', 'error');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                showToast(error.response.data.message, 'error');
            } else {
                showToast('Something went wrong. Please try again later.', 'error');
            }
        }
    };




    const orbColor = isDark ? 'bg-purple-500' : 'bg-blue-400';
    const backgroundClass = isDark
        ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';

    const inputClass = (fieldName) => `w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isDark ? 'bg-gray-800/50 text-white placeholder-gray-400' : 'bg-white/70 text-gray-900 placeholder-gray-500'
        } ${validationErrors[fieldName] ? 'border-2 border-red-500' : ''}`;

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

            {/* Signup Form */}
            <div className="relative z-10 flex items-center justify-center min-h-screen py-8">
                <div
                    className={`w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-md border-2 transform transition-all duration-600 ${isDark
                        ? 'bg-purple-900/20 border-purple-400/30 text-white'
                        : 'bg-white/40 border-blue-400/20 text-gray-900'
                        }`}
                    style={{
                        animation: 'fadeInUp 0.6s ease-out'
                    }}
                >
                    <h2 className="text-4xl font-extrabold mb-6 text-center">Sign Up</h2>
                    <p className={`text-center mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Create your account to get started
                    </p>

                    {/* Full Name Field */}
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={inputClass('fullName')}
                            placeholder="Enter your full name"
                        />
                        {validationErrors.fullName && (
                            <p className="text-red-400 text-sm mt-1">{validationErrors.fullName}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={inputClass('email')}
                            placeholder="Enter your email"
                        />
                        {validationErrors.email && (
                            <p className="text-red-400 text-sm mt-1">{validationErrors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mb-4 relative">
                        <label className="block mb-2 font-semibold flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`${inputClass('password')} pr-12`}
                            placeholder="Create a password"
                        />
                        <span
                            className={`absolute right-3 top-10 cursor-pointer transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </span>
                        {validationErrors.password && (
                            <p className="text-red-400 text-sm mt-1">{validationErrors.password}</p>
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
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`${inputClass('confirmPassword')} pr-12`}
                            placeholder="Confirm your password"
                        />
                        <span
                            className={`absolute right-3 top-10 cursor-pointer transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                }`}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </span>
                        {validationErrors.confirmPassword && (
                            <p className="text-red-400 text-sm mt-1">{validationErrors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Password Requirements */}
                    <div className={`mb-6 p-3 rounded-lg text-sm ${isDark ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
                        <p className="font-semibold mb-2">Password Requirements:</p>
                        <ul className="space-y-1">
                            <li className={`flex items-center gap-2 ${formData.password.length >= 4 && formData.password.length <= 12 ? 'text-green-400' : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                4-12 characters long
                            </li>
                            <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-400' : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                At least 1 uppercase letter
                            </li>
                            <li className={`flex items-center gap-2 ${/\d/.test(formData.password) ? 'text-green-400' : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                At least 1 number
                            </li>
                            <li className={`flex items-center gap-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-green-400' : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                <span className="w-1 h-1 bg-current rounded-full"></span>
                                At least 1 special character
                            </li>
                        </ul>
                    </div>

                    <button
                        onClick={handleSignup}
                        className={`w-full py-3 rounded-xl font-bold text-lg flex justify-center items-center gap-3 transition-all duration-300 shadow-xl hover:scale-103 active:scale-98 ${isDark
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                            }`}
                    >
                        <UserPlus className="w-5 h-5" /> Create Account
                    </button>

                    <p className={`text-center mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Already have an account?
                        <span className={`ml-1 cursor-pointer font-semibold ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-blue-600 hover:text-blue-700'}`}>
                            Sign in
                        </span>
                    </p>
                </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hover\\:scale-103:hover {
          transform: scale(1.03);
        }
        
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
        
        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }
        
        .active\\:scale-95:active {
          transform: scale(0.95);
        }
      `}</style>
        </div>
    );
};

export default Signup;