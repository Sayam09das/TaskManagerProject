import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    Rocket,
    Moon,
    Sun,
    ArrowRight,
    Play,
    Crown,
    Diamond,
    Flame,
    Sparkles,
    LogIn,
} from 'lucide-react'

const GetStarted = () => {
    const [isDark, setIsDark] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div
            className={`min-h-screen transition-colors duration-500 relative overflow-hidden ${isDark
                ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
                : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
                }`}
        >
            {/* Glowing Orb */}
            <motion.div
                className={`fixed w-64 h-64 rounded-full pointer-events-none z-0 blur-3xl opacity-20 ${isDark ? 'bg-purple-500' : 'bg-blue-400'
                    }`}
                style={{
                    left: mousePosition.x - 128,
                    top: mousePosition.y - 128,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            />

            {/* Grid Background */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className={`absolute inset-0 ${isDark
                        ? 'bg-[linear-gradient(rgba(147,51,234,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.1)_1px,transparent_1px)]'
                        : 'bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)]'
                        } bg-[size:100px_100px]`}
                />
            </div>

            {/* Dark Mode Toggle */}
            <motion.button
                onClick={() => setIsDark(!isDark)}
                className={`fixed top-6 right-6 z-50 p-4 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 shadow-xl ${isDark
                    ? 'bg-purple-900/50 border-purple-400/30 text-yellow-400 hover:bg-purple-800/60'
                    : 'bg-blue-900/10 border-blue-400/30 text-orange-500 hover:bg-blue-800/20'
                    }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
            >
                {isDark ? <Sun className="w-7 h-7" /> : <Moon className="w-7 h-7" />}
            </motion.button>

            {/* Floating Icons */}
            <div className="absolute inset-0 overflow-hidden z-10">
                <motion.div
                    className={`absolute top-20 left-10 ${isDark ? 'text-purple-400' : 'text-blue-500'}`}
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Crown className="w-8 h-8 drop-shadow-lg" />
                </motion.div>
                <motion.div
                    className={`absolute top-40 right-16 ${isDark ? 'text-pink-400' : 'text-purple-500'}`}
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Diamond className="w-10 h-10 drop-shadow-lg" />
                </motion.div>
                <motion.div
                    className={`absolute bottom-32 left-16 ${isDark ? 'text-cyan-400' : 'text-indigo-500'}`}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Flame className="w-7 h-7 drop-shadow-lg" />
                </motion.div>
                <motion.div
                    className={`absolute top-1/2 right-8 ${isDark ? 'text-emerald-400' : 'text-teal-500'}`}
                    animate={{ y: [0, -25, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Sparkles className="w-9 h-9 drop-shadow-lg" />
                </motion.div>
            </div>

            {/* Main Content */}
            <motion.div
                className="relative z-20 min-h-screen px-6 text-center grid place-items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <motion.div className="mb-10" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                    <motion.div
                        className="flex items-center justify-center mb-6"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Rocket className={`w-20 h-20 ${isDark ? 'text-purple-400' : 'text-blue-600'} drop-shadow-xl`} />
                    </motion.div>

                    <h1
                        className={`text-6xl md:text-8xl lg:text-9xl font-black mb-4 bg-gradient-to-r bg-clip-text text-transparent ${isDark
                            ? 'from-purple-400 via-pink-400 to-cyan-400'
                            : 'from-blue-600 via-purple-600 to-pink-600'
                            } drop-shadow-xl`}
                    >
                        Get Started
                    </h1>
                </motion.div>

                {/* Subheading */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                >
                    <p
                        className={`text-xl md:text-3xl lg:text-4xl leading-relaxed max-w-4xl mx-auto font-light ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
                    >
                        Simplify your daily workflow with{' '}
                        <span
                            className={`font-bold bg-gradient-to-r bg-clip-text text-transparent ${isDark
                                ? 'from-purple-400 to-pink-400'
                                : 'from-blue-600 to-purple-600'
                                }`}
                        >
                            Sehedulo task manager
                        </span>
                        <br />
                        <span className="font-semibold mb-11">Organize. Prioritize. Achieve.</span>
                    </p>
                </motion.div>

                {/* Buttons */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-24"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                >
                    {/* Login Button */}
                    <Link to="/login">
                        <motion.button
                            className={`w-60 h-14 group px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl ${isDark
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                                }`}
                            whileHover={{ scale: 1.05, y: -3 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span className="flex items-center justify-center">
                                <LogIn className="w-6 h-6 mr-3" />
                                Login
                            </span>
                        </motion.button>
                    </Link>

                    {/* Create Task Button */}
                    <Link to="/create-task">
                        <motion.div
                            className={`w-60 h-14 group px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-xl flex items-center justify-center ${isDark
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                                }`}
                            whileHover={{ scale: 1.05, y: -3 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Play className="w-6 h-6 mr-3" />
                            Create Task
                            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                        </motion.div>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default GetStarted
