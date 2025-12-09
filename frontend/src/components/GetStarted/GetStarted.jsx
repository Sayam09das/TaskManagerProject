import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    Zap,
    Star,
    Check,
} from 'lucide-react'

const GetStarted = () => {
    const [isDark, setIsDark] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        // Check if mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)

        // Mouse move handler with throttling for better performance
        let rafId = null
        const handleMouseMove = (e) => {
            if (rafId) return
            rafId = requestAnimationFrame(() => {
                setMousePosition({ x: e.clientX, y: e.clientY })
                rafId = null
            })
        }

        if (!isMobile) {
            window.addEventListener('mousemove', handleMouseMove)
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('resize', checkMobile)
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [isMobile])

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 12,
            },
        },
    }

    const floatingIconVariants = [
        { y: [0, -20, 0], rotate: [0, 10, 0], duration: 4 },
        { y: [0, -25, 0], rotate: [0, -15, 0], scale: [1, 1.1, 1], duration: 5 },
        { y: [0, -15, 0], scale: [1, 1.2, 1], duration: 3 },
        { y: [0, -30, 0], rotate: [0, 360, 0], duration: 8 },
        { y: [0, -20, 0], x: [0, 10, 0], duration: 6 },
        { y: [0, -15, 0], rotate: [0, -20, 0], duration: 5 },
    ]

    const features = ['Simple', 'Fast', 'Powerful']

    return (
        <div
            className={`min-h-screen transition-colors duration-500 relative overflow-hidden ${isDark
                    ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
                    : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
                }`}
        >
            {/* Enhanced Glowing Orbs - Multiple layers */}
            {!isMobile && (
                <>
                    <motion.div
                        className={`fixed w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 rounded-full pointer-events-none z-0 blur-3xl ${isDark ? 'bg-purple-500 opacity-30' : 'bg-blue-400 opacity-20'
                            }`}
                        style={{
                            left: mousePosition.x - (window.innerWidth >= 1024 ? 192 : window.innerWidth >= 640 ? 128 : 96),
                            top: mousePosition.y - (window.innerWidth >= 1024 ? 192 : window.innerWidth >= 640 ? 128 : 96),
                        }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                    <motion.div
                        className={`fixed w-64 h-64 lg:w-80 lg:h-80 rounded-full pointer-events-none z-0 blur-3xl ${isDark ? 'bg-pink-500 opacity-20' : 'bg-purple-400 opacity-15'
                            }`}
                        style={{
                            left: mousePosition.x + 100,
                            top: mousePosition.y + 100,
                        }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                    <motion.div
                        className={`fixed w-48 h-48 lg:w-64 lg:h-64 rounded-full pointer-events-none z-0 blur-3xl ${isDark ? 'bg-cyan-500 opacity-15' : 'bg-indigo-400 opacity-10'
                            }`}
                        style={{
                            left: mousePosition.x - 200,
                            top: mousePosition.y + 50,
                        }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                </>
            )}

            {/* Enhanced Grid Background with animation */}
            <div className="absolute inset-0 opacity-5">
                <motion.div
                    className={`absolute inset-0 ${isDark
                            ? 'bg-[linear-gradient(rgba(147,51,234,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.15)_1px,transparent_1px)]'
                            : 'bg-[linear-gradient(rgba(59,130,246,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.15)_1px,transparent_1px)]'
                        } bg-[size:60px_60px] sm:bg-[size:80px_80px] md:bg-[size:100px_100px]`}
                    animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'linear',
                    }}
                />
            </div>

            {/* Animated gradient overlay */}
            <motion.div
                className="absolute inset-0 opacity-30 pointer-events-none"
                animate={{
                    background: isDark
                        ? [
                            'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 50% 80%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
                        ]
                        : [
                            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 50% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
                            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                        ],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />

            {/* Enhanced Dark Mode Toggle */}
            <motion.button
                onClick={() => setIsDark(!isDark)}
                className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 ${isDark
                        ? 'bg-purple-900/60 border-purple-400/40 text-yellow-400 hover:bg-purple-800/70 shadow-2xl shadow-purple-500/30'
                        : 'bg-white/60 border-blue-400/40 text-orange-500 hover:bg-white/70 shadow-2xl shadow-blue-500/30'
                    }`}
                whileTap={{ scale: 0.9, rotate: 180 }}
                whileHover={{ scale: 1.1, rotate: 15 }}
            >
                <AnimatePresence mode="wait">
                    {isDark ? (
                        <motion.div
                            key="sun"
                            initial={{ rotate: -180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 180, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Sun className="w-5 h-5 sm:w-7 sm:h-7" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="moon"
                            initial={{ rotate: 180, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -180, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Moon className="w-5 h-5 sm:w-7 sm:h-7" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Enhanced Floating Icons */}
            <div className="absolute inset-0 overflow-hidden z-10 pointer-events-none">
                {[
                    { Icon: Crown, pos: 'top-12 left-4 sm:top-20 sm:left-10', idx: 0 },
                    { Icon: Diamond, pos: 'top-32 right-8 sm:top-40 sm:right-16', idx: 1 },
                    { Icon: Flame, pos: 'bottom-24 left-8 sm:bottom-32 sm:left-16', idx: 2 },
                    { Icon: Sparkles, pos: 'top-1/2 right-4 sm:right-8', idx: 3 },
                    { Icon: Star, pos: 'hidden md:block top-1/4 left-1/4', idx: 4 },
                    { Icon: Zap, pos: 'hidden lg:block bottom-1/4 right-1/4', idx: 5 },
                ].map(({ Icon, pos, idx }) => {
                    const colors = isDark
                        ? ['text-purple-400', 'text-pink-400', 'text-cyan-400', 'text-emerald-400', 'text-yellow-400', 'text-rose-400']
                        : ['text-blue-500', 'text-purple-500', 'text-indigo-500', 'text-teal-500', 'text-amber-500', 'text-red-500']
                    const sizes = ['w-6 h-6 sm:w-8 sm:h-8', 'w-8 h-8 sm:w-10 sm:h-10', 'w-6 h-6 sm:w-7 sm:h-7', 'w-7 h-7 sm:w-9 sm:h-9', 'w-6 h-6', 'w-8 h-8']
                    return (
                        <motion.div
                            key={idx}
                            className={`absolute ${pos} ${colors[idx]}`}
                            animate={{
                                y: floatingIconVariants[idx].y,
                                rotate: floatingIconVariants[idx].rotate || 0,
                                scale: floatingIconVariants[idx].scale || 1,
                                x: floatingIconVariants[idx].x || 0,
                            }}
                            transition={{
                                duration: floatingIconVariants[idx].duration,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        >
                            <Icon className={`${sizes[idx]} drop-shadow-2xl`} />
                        </motion.div>
                    )
                })}
            </div>

            {/* Main Content */}
            <motion.div
                className="relative z-20 min-h-screen px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center py-12 sm:py-16"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-7xl mx-auto w-full">
                    {/* Logo/Icon */}
                    <motion.div variants={itemVariants} className="mb-6 sm:mb-8 lg:mb-10">
                        <motion.div
                            className="flex items-center justify-center"
                            animate={{
                                y: [0, -8, 0],
                                rotate: [0, 5, 0, -5, 0],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <motion.div
                                className={`p-4 sm:p-6 rounded-3xl backdrop-blur-xl ${isDark
                                        ? 'bg-purple-900/40 shadow-2xl shadow-purple-500/50'
                                        : 'bg-white/40 shadow-2xl shadow-blue-500/30'
                                    }`}
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Rocket
                                    className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 ${isDark ? 'text-purple-400' : 'text-blue-600'
                                        } drop-shadow-2xl`}
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Main Heading with gradient animation */}
                    <motion.h1
                        variants={itemVariants}
                        className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-4 sm:mb-6 bg-gradient-to-r bg-clip-text text-transparent leading-tight ${isDark
                                ? 'from-purple-400 via-pink-400 to-cyan-400'
                                : 'from-blue-600 via-purple-600 to-pink-600'
                            } drop-shadow-2xl`}
                        style={{
                            backgroundSize: '200% 200%',
                        }}
                        animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        Get Started
                    </motion.h1>

                    {/* Subheading */}
                    <motion.div variants={itemVariants} className="mb-12 sm:mb-16 lg:mb-20">
                        <p
                            className={`text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-relaxed max-w-4xl mx-auto font-light px-4 ${isDark ? 'text-gray-200' : 'text-gray-700'
                                }`}
                        >
                            Simplify your daily workflow with{' '}
                            <motion.span
                                className={`font-bold bg-gradient-to-r bg-clip-text text-transparent ${isDark ? 'from-purple-400 to-pink-400' : 'from-blue-600 to-purple-600'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                style={{ display: 'inline-block' }}
                            >
                                Sehedulo task manager
                            </motion.span>
                            <br className="hidden sm:block" />
                            <span className="block mt-2 sm:mt-0 sm:inline font-semibold">
                                {' '}
                                Organize. Prioritize. Achieve.
                            </span>
                        </p>
                    </motion.div>

                    {/* Enhanced Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center"
                    >
                        {/* Login Button */}
                        <Link to="/auth/login" className="w-full sm:w-auto">
                            <motion.button
                                className={`w-full sm:w-64 h-14 sm:h-16 group px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 shadow-2xl relative overflow-hidden ${isDark
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/50'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-blue-500/50'
                                    }`}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 0.6 }}
                                />
                                <span className="flex items-center justify-center relative z-10">
                                    <LogIn className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 transition-transform group-hover:rotate-12" />
                                    Login
                                </span>
                            </motion.button>
                        </Link>

                        {/* Create Task Button */}
                        <Link to="/create-task" className="w-full sm:w-auto">
                            <motion.button
                                className={`w-full sm:w-64 h-14 sm:h-16 group px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 shadow-2xl relative overflow-hidden flex items-center justify-center ${isDark
                                        ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white hover:shadow-cyan-500/50'
                                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/50'
                                    }`}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: '100%' }}
                                    transition={{ duration: 0.6 }}
                                />
                                <span className="flex items-center justify-center relative z-10">
                                    <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 transition-transform group-hover:scale-110" />
                                    Create Task
                                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 transition-transform group-hover:translate-x-2 duration-200" />
                                </span>
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Feature Pills */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-12 sm:mt-16 flex flex-wrap gap-3 sm:gap-4 justify-center px-4"
                    >
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature}
                                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-xl border-2 ${isDark
                                        ? 'bg-purple-900/40 border-purple-400/30 text-purple-200'
                                        : 'bg-white/40 border-blue-400/30 text-blue-700'
                                    } font-semibold text-sm sm:text-base shadow-lg flex items-center gap-2`}
                                whileHover={{ scale: 1.1, y: -3 }}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    delay: 0.6 + i * 0.1,
                                    type: 'spring',
                                    stiffness: 200,
                                    damping: 10,
                                }}
                            >
                                <Check className="w-4 h-4" />
                                {feature}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default GetStarted