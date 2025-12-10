import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Sun, Moon, UserPlus, User, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Moved outside component to prevent re-initialization
const proxyDomains = [
    'tempmail.org', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
    'temp-mail.org', 'throwaway.email', 'fakeinbox.com', 'maildrop.cc',
    'yopmail.com', 'sharklasers.com', 'tempail.com', 'dispostable.com',
    'emkei.cz', 'emailondeck.com', 'getnada.com', 'tempmailo.com',
    'mohmal.com', 'mintemail.com', 'dropmail.me', 'burnermail.io'
];

const Signup = () => {
    const [isDark, setIsDark] = useState(false);
    const navigate = useNavigate();
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

    const validateFullName = (name) => /^[a-zA-Z\s]{2,50}$/.test(name.trim());

    const validateEmail = (email) => {
        const emailRegex = /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const domain = email.split('@')[1]?.toLowerCase();
        return emailRegex.test(email) && !proxyDomains.includes(domain);
    };

    const validatePassword = (password) => {
        const checks = {
            minLength: password.length >= 8,
            maxLength: password.length <= 12,
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };
        return { ...checks, isValid: Object.values(checks).every(Boolean) };
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const errors = {};

        if (!formData.fullName.trim()) {
            errors.fullName = 'Full name is required';
        } else if (!validateFullName(formData.fullName)) {
            errors.fullName = 'Use 2–50 characters with letters and spaces only';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            const domain = formData.email.split('@')[1]?.toLowerCase();
            errors.email = proxyDomains.includes(domain)
                ? 'Temporary/proxy emails are not allowed'
                : 'Please enter a valid email address';
        }

        const pwdCheck = validatePassword(formData.password);
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (!pwdCheck.isValid) {
            const issues = [];
            if (!pwdCheck.minLength) issues.push('8+ chars');
            if (!pwdCheck.maxLength) issues.push('≤12 chars');
            if (!pwdCheck.hasUppercase) issues.push('1 uppercase letter');
            if (!pwdCheck.hasNumber) issues.push('1 number');
            if (!pwdCheck.hasSpecialChar) issues.push('1 special character');
            errors.password = `Password must include: ${issues.join(', ')}`;
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setValidationErrors(errors);

        if (Object.keys(errors).length > 0) {
            showToast('Fix the highlighted errors', 'error');
            return;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // ✅ This is important!
                body: JSON.stringify({
                    name: formData.fullName,
                    email: formData.email,
                    password: formData.password
                })
            });


            const data = await res.json();
            if (res.ok) {
                showToast('Signup successful! Logging in...', 'success');

                // Immediately log in the user after signup
                const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const loginData = await loginRes.json();

                if (loginRes.ok) {
                    showToast('Login successful! Redirecting...', 'success');
                    setTimeout(() => navigate('/auth/login'), 1500);
                } else {
                    showToast(loginData.message || 'Login after signup failed', 'error');
                }

            }

            else {
                showToast(data.message || 'Signup failed', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Server error. Try again later.', 'error');
        }
    };

    const orbColor = isDark ? 'bg-purple-500' : 'bg-blue-400';
    const backgroundClass = isDark
        ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';

    const inputClass = (field) =>
        `w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isDark ? 'bg-gray-800/50 text-white placeholder-gray-400' : 'bg-white/70 text-gray-900 placeholder-gray-500'
        } ${validationErrors[field] ? 'border-2 border-red-500' : ''}`;

    return (
        <div className={`min-h-screen transition-colors duration-500 relative overflow-hidden ${backgroundClass}`}>
            {/* Toast */}
            {toast.show && (
                <div
                    className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg backdrop-blur-xl border-2 max-w-md text-center ${toast.type === 'error'
                        ? 'bg-red-900/80 border-red-400/50 text-red-100'
                        : 'bg-green-900/80 border-green-400/50 text-green-100'
                        }`}
                >
                    {toast.message}
                </div>
            )}

            {/* Orb */}
            <div
                className={`fixed w-64 h-64 rounded-full pointer-events-none z-0 blur-3xl opacity-20 ${orbColor}`}
                style={{ left: mousePosition.x - 128, top: mousePosition.y - 128 }}
            />

            {/* Dark Mode Toggle */}
            <button
                onClick={() => setIsDark(!isDark)}
                className={`fixed top-6 right-6 z-50 p-4 rounded-2xl backdrop-blur-xl border-2 shadow-xl hover:scale-105 active:scale-95 transition-all ${isDark
                    ? 'bg-purple-900/50 border-purple-400/30 text-yellow-400 hover:bg-purple-800/60'
                    : 'bg-blue-900/10 border-blue-400/30 text-orange-500 hover:bg-blue-800/20'
                    }`}
            >
                {isDark ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
            </button>

            {/* Signup Form */}
            <div className="relative z-10 flex items-center justify-center min-h-screen py-8">
                <div
                    className={`w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-md border-2 animate-fadeInUp ${isDark
                        ? 'bg-purple-900/20 border-purple-400/30 text-white'
                        : 'bg-white/40 border-blue-400/20 text-gray-900'
                        }`}
                >
                    {/* Heading */}
                    <h2 className="text-4xl font-extrabold mb-6 text-center">Sign Up</h2>
                    <p className={`text-center mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Create your account to get started
                    </p>

                    {/* Fields */}
                    {[
                        { name: 'fullName', label: 'Full Name', icon: <User className="w-4 h-4" />, type: 'text' },
                        { name: 'email', label: 'Email Address', icon: <Mail className="w-4 h-4" />, type: 'email' }
                    ].map(({ name, label, icon, type }) => (
                        <div className="mb-4" key={name}>
                            <label className="block mb-2 font-semibold flex items-center gap-2">
                                {icon}
                                {label}
                            </label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleInputChange}
                                className={inputClass(name)}
                                placeholder={`Enter your ${label.toLowerCase()}`}
                            />
                            {validationErrors[name] && <p className="text-red-400 text-sm mt-1">{validationErrors[name]}</p>}
                        </div>
                    ))}

                    {/* Password */}
                    {[
                        { name: 'password', label: 'Password', value: showPassword, toggle: setShowPassword },
                        { name: 'confirmPassword', label: 'Confirm Password', value: showConfirmPassword, toggle: setShowConfirmPassword }
                    ].map(({ name, label, value, toggle }) => (
                        <div className="mb-4 relative" key={name}>
                            <label className="block mb-2 font-semibold flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                {label}
                            </label>
                            <input
                                type={value ? 'text' : 'password'}
                                name={name}
                                value={formData[name]}
                                onChange={handleInputChange}
                                className={`${inputClass(name)} pr-12`}
                                placeholder={label}
                            />
                            <span
                                className={`absolute right-3 top-10 cursor-pointer ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                onClick={() => toggle(!value)}
                            >
                                {value ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </span>
                            {validationErrors[name] && <p className="text-red-400 text-sm mt-1">{validationErrors[name]}</p>}
                        </div>
                    ))}

                    {/* Password Tips */}
                    <div className={`mb-6 p-3 rounded-lg text-sm ${isDark ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
                        <p className="font-semibold mb-2">Password Requirements:</p>
                        <ul className="space-y-1">
                            {[
                                { condition: formData.password.length >= 8 && formData.password.length <= 12, text: '8–12 characters long' },
                                { condition: /[A-Z]/.test(formData.password), text: 'At least 1 uppercase letter' },
                                { condition: /\d/.test(formData.password), text: 'At least 1 number' },
                                { condition: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password), text: 'At least 1 special character' }
                            ].map(({ condition, text }, idx) => (
                                <li
                                    key={idx}
                                    className={`flex items-center gap-2 ${condition ? 'text-green-400' : isDark ? 'text-gray-400' : 'text-gray-600'}`}
                                >
                                    <span className="w-1 h-1 bg-current rounded-full"></span>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>


                    {/* Submit Button */}
                    <button
                        onClick={handleSignup}
                        className={`w-full py-3 rounded-xl font-bold text-lg flex justify-center items-center gap-3 transition-all shadow-xl hover:scale-103 active:scale-98 ${isDark
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                            }`}
                    >
                        <UserPlus className="w-5 h-5" /> Create Account
                    </button>

                    <p className={`text-center mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Already have an account?
                        <Link
                            to="/auth/login"
                            className={`ml-2 font-medium ${isDark ? 'text-purple-300 hover:text-purple-100' : 'text-blue-600 hover:text-blue-800'
                                }`}
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>

            {/* Animations */}
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
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .hover\\:scale-103:hover {
          transform: scale(1.03);
        }
        .active\\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
        </div>
    );
};

export default Signup;
