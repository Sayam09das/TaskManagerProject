import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Sun, Moon, LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const Login = () => {
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

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
        }, 3000);
    };


    const validatePassword = (password) => {
        return {
            minLength: password.length >= 8 && password.length <= 12,
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        };
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            let data = {};
            try {
                data = await res.json();
            } catch {
                data = {};
            }

            if (!res.ok) {
                showToast(data.message || 'Login failed', 'error');
                return;
            }

            localStorage.setItem('authToken', data.token);
            showToast('Login successful!', 'success');
            navigate('/schedulo'); // ✅ fixed
        } catch (err) {
            console.error(err);
            showToast('Something went wrong!', 'error');
        }
    };


    const orbColor = isDark ? 'bg-purple-500' : 'bg-blue-400';
    const backgroundClass = isDark
        ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';

    return (
        <div className={`min-h-screen transition-colors duration-500 relative overflow-hidden ${backgroundClass}`}>
            {/* Toast Notification */}
            {toast.show && (
                <div
                    className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg backdrop-blur-xl border-2 transition-all duration-300 ${toast.type === 'error'
                        ? 'bg-red-900/80 border-red-400/50 text-red-100'
                        : 'bg-green-900/80 border-green-400/50 text-green-100'
                        }`}
                >
                    {toast.message}
                </div>
            )}

            {/* Glowing Orb */}
            <div
                className={`fixed w-64 h-64 rounded-full pointer-events-none z-0 blur-3xl opacity-20 transition-all duration-500 ease-out ${orbColor}`}
                style={{ left: mousePosition.x - 128, top: mousePosition.y - 128 }}
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

            {/* Password */}
            <div className="mb-5 relative">
                <label className="block mb-2 font-semibold">Password</label>

                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 pr-12 transition-all duration-200 ${isDark ? 'bg-gray-800/50 text-white' : 'bg-white/70 text-gray-900'
                        }`}
                    placeholder="********"
                />

                <span
                    className={`absolute right-3 top-10 cursor-pointer transition-colors duration-200 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                        }`}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeOff /> : <Eye />}
                </span>
            </div>

            {/* Password Requirements */}
            <div className={`mb-4 p-3 rounded-lg text-sm ${isDark ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
                <p className="font-semibold mb-2">Password Requirements:</p>
                <ul className="space-y-1">
                    {[
                        { condition: password.length >= 8 && password.length <= 12, text: '8–12 characters long' },
                        { condition: /[A-Z]/.test(password), text: 'At least 1 uppercase letter' },
                        { condition: /\d/.test(password), text: 'At least 1 number' },
                        { condition: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), text: 'At least 1 special character' }
                    ].map(({ condition, text }, idx) => (
                        <li
                            key={idx}
                            className={`flex items-center gap-2 ${condition ? 'text-green-400' : isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}
                        >
                            <span className="w-1 h-1 bg-current rounded-full"></span>
                            {text}
                        </li>
                    ))}
                </ul>
            </div>


            {/* Keyframe Animation */}
            <style>{`
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

export default Login;
