import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
    Plus,
    Search,
    Filter,
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    Star,
    Trash2,
    Edit3,
    User,
    LogOut,
    Sun,
    Moon,
    BarChart3,
    Target,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

const TaskManager = () => {
    const [isDark, setIsDark] = useState(false);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: 'Complete project proposal',
            description: 'Finish the quarterly project proposal for client review',
            priority: 'high',
            status: 'todo',
            dueDate: '2025-07-25',
            createdAt: '2025-07-20'
        },
        {
            id: 2,
            title: 'Team meeting preparation',
            description: 'Prepare agenda and materials for weekly team sync',
            priority: 'medium',
            status: 'in-progress',
            dueDate: '2025-07-24',
            createdAt: '2025-07-21'
        },
        {
            id: 3,
            title: 'Code review',
            description: 'Review pull requests from development team',
            priority: 'low',
            status: 'completed',
            dueDate: '2025-07-23',
            createdAt: '2025-07-19'
        }
    ]);

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // User data (simulated)
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'JD',
        joinDate: 'January 2024'
    };

    // Toast functionality
    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 3000);
    };

    // Task management functions
    const addTask = () => {
        if (!newTask.title.trim()) {
            showToast('Please enter a task title', 'error');
            return;
        }

        const task = {
            id: Date.now(),
            ...newTask,
            status: 'todo',
            createdAt: new Date().toISOString().split('T')[0]
        };

        setTasks(prev => [task, ...prev]);
        setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
        setShowAddTask(false);
        showToast('Task added successfully!', 'success');
    };

    const updateTask = (id, updates) => {
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, ...updates } : task
        ));
    };

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(task => task.id !== id));
        showToast('Task deleted successfully!', 'success');
    };

    const toggleTaskStatus = (id) => {
        const task = tasks.find(t => t.id === id);
        let newStatus;

        switch (task.status) {
            case 'todo':
                newStatus = 'in-progress';
                break;
            case 'in-progress':
                newStatus = 'completed';
                break;
            case 'completed':
                newStatus = 'todo';
                break;
            default:
                newStatus = 'todo';
        }

        updateTask(id, { status: newStatus });
    };

    // Logout functionality with axios
    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await axios.post('http://localhost:3000/auth/logout', {}, {
                withCredentials: true,
            });
            showToast('Logged out successfully!', 'success');
            setTimeout(() => {
                navigate('/'); // redirect to GetStarted or Login
            }, 1000);
        } catch (error) {
            console.error('Logout failed:', error);
            showToast('Logout failed. Please try again.', 'error');
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    // Dashboard statistics
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        pending: tasks.filter(t => t.status === 'todo').length,
        overdue: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
    };

    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    const backgroundClass = isDark
        ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50';

    const cardClass = isDark
        ? 'bg-gray-800/50 border-gray-700/50'
        : 'bg-white/70 border-gray-200/50';

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'medium':
                return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'low':
                return 'text-green-500 bg-green-500/10 border-green-500/20';
            default:
                return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'in-progress':
                return <Clock className="w-5 h-5 text-blue-500" />;
            default:
                return <Circle className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${backgroundClass}`}>
            {/* Toast Notification */}
            {toast.show && (
                <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg backdrop-blur-xl border-2 transition-all duration-300 ${toast.type === 'error'
                    ? 'bg-red-900/80 border-red-400/50 text-red-100'
                    : 'bg-green-900/80 border-green-400/50 text-green-100'
                    }`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <header className={`sticky top-0 z-40 backdrop-blur-xl border-b-2 ${isDark ? 'bg-gray-900/80 border-gray-700/50' : 'bg-white/80 border-gray-200/50'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                <Target className="w-6 h-6 text-white" />
                            </div>
                            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                TaskFlow
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Dark Mode Toggle */}
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className={`p-2 rounded-xl transition-all duration-300 ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-orange-500'
                                    }`}
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </button>

                            {/* User Profile */}
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isDark ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                                    }`}>
                                    {user.avatar}
                                </div>
                                <div className={`hidden sm:block ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    <p className="font-semibold text-sm">{user.name}</p>
                                    <p className="text-xs opacity-70">{user.email}</p>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-red-900/50 text-red-400 hover:bg-red-900/70' : 'bg-red-100 text-red-600 hover:bg-red-200'
                                    }`}
                            >
                                {isLoggingOut ? (
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <LogOut className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className={`p-6 rounded-2xl border-2 backdrop-blur-md ${cardClass}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Total Tasks
                                </p>
                                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {stats.total}
                                </p>
                            </div>
                            <BarChart3 className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-blue-500'}`} />
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl border-2 backdrop-blur-md ${cardClass}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Completed
                                </p>
                                <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
                            </div>
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl border-2 backdrop-blur-md ${cardClass}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    In Progress
                                </p>
                                <p className="text-2xl font-bold text-blue-500">{stats.inProgress}</p>
                            </div>
                            <Clock className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl border-2 backdrop-blur-md ${cardClass}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Completion Rate
                                </p>
                                <p className={`text-2xl font-bold ${completionRate >= 70 ? 'text-green-500' : completionRate >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {completionRate}%
                                </p>
                            </div>
                            <TrendingUp className={`w-8 h-8 ${completionRate >= 70 ? 'text-green-500' : completionRate >= 40 ? 'text-yellow-500' : 'text-red-500'}`} />
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className={`p-6 rounded-2xl border-2 backdrop-blur-md mb-6 ${cardClass}`}>
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'
                                    }`} />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isDark ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400' : 'bg-white/70 border-gray-200/50 text-gray-900 placeholder-gray-500'
                                        }`}
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-3">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className={`px-4 py-2 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isDark ? 'bg-gray-800/50 border-gray-700/50 text-white' : 'bg-white/70 border-gray-200/50 text-gray-900'
                                        }`}
                                >
                                    <option value="all">All Status</option>
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>

                                <select
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value)}
                                    className={`px-4 py-2 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isDark ? 'bg-gray-800/50 border-gray-700/50 text-white' : 'bg-white/70 border-gray-200/50 text-gray-900'
                                        }`}
                                >
                                    <option value="all">All Priority</option>
                                    <option value="high">High</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                        </div>

                        {/* Add Task Button */}
                        <button
                            onClick={() => setShowAddTask(true)}
                            className={`px-6 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:scale-105 ${isDark ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-blue-600 text-white hover:bg-blue-500'
                                }`}
                        >
                            <Plus className="w-5 h-5" />
                            Add Task
                        </button>
                    </div>
                </div>

                {/* Add/Edit Task Form */}
                {(showAddTask || editingTask) && (
                    <div className={`p-6 rounded-2xl border-2 backdrop-blur-md mb-6 ${cardClass}`}>
                        <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {editingTask ? 'Edit Task' : 'Add New Task'}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Task title"
                                value={editingTask ? editingTask.title : newTask.title}
                                onChange={(e) => editingTask
                                    ? setEditingTask({ ...editingTask, title: e.target.value })
                                    : setNewTask({ ...newTask, title: e.target.value })
                                }
                                className={`p-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isDark ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400' : 'bg-white/70 border-gray-200/50 text-gray-900 placeholder-gray-500'
                                    }`}
                            />

                            <input
                                type="date"
                                value={editingTask ? editingTask.dueDate : newTask.dueDate}
                                onChange={(e) => editingTask
                                    ? setEditingTask({ ...editingTask, dueDate: e.target.value })
                                    : setNewTask({ ...newTask, dueDate: e.target.value })
                                }
                                className={`p-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isDark ? 'bg-gray-800/50 border-gray-700/50 text-white' : 'bg-white/70 border-gray-200/50 text-gray-900'
                                    }`}
                            />
                        </div>

                        <textarea
                            placeholder="Task description"
                            value={editingTask ? editingTask.description : newTask.description}
                            onChange={(e) => editingTask
                                ? setEditingTask({ ...editingTask, description: e.target.value })
                                : setNewTask({ ...newTask, description: e.target.value })
                            }
                            className={`w-full p-3 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 transition-all duration-200 mt-4 h-24 resize-none ${isDark ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400' : 'bg-white/70 border-gray-200/50 text-gray-900 placeholder-gray-500'
                                }`}
                        />

                        <div className="flex items-center justify-between mt-4">
                            <select
                                value={editingTask ? editingTask.priority : newTask.priority}
                                onChange={(e) => editingTask
                                    ? setEditingTask({ ...editingTask, priority: e.target.value })
                                    : setNewTask({ ...newTask, priority: e.target.value })
                                }
                                className={`px-4 py-2 rounded-xl border-2 focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${isDark ? 'bg-gray-800/50 border-gray-700/50 text-white' : 'bg-white/70 border-gray-200/50 text-gray-900'
                                    }`}
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowAddTask(false);
                                        setEditingTask(null);
                                        setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
                                    }}
                                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => {
                                        if (editingTask) {
                                            updateTask(editingTask.id, editingTask);
                                            setEditingTask(null);
                                            showToast('Task updated successfully!', 'success');
                                        } else {
                                            addTask();
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${isDark ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-blue-600 text-white hover:bg-blue-500'
                                        }`}
                                >
                                    {editingTask ? 'Update Task' : 'Add Task'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tasks List */}
                <div className="space-y-4">
                    {filteredTasks.length === 0 ? (
                        <div className={`text-center py-12 ${cardClass} rounded-2xl border-2 backdrop-blur-md`}>
                            <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                            <p className={`text-xl font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                No tasks found
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'Create your first task to get started'
                                }
                            </p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <div
                                key={task.id}
                                className={`p-6 rounded-2xl border-2 backdrop-blur-md transition-all duration-300 hover:scale-102 ${cardClass}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <button
                                            onClick={() => toggleTaskStatus(task.id)}
                                            className="mt-1 hover:scale-110 transition-transform duration-200"
                                        >
                                            {getStatusIcon(task.status)}
                                        </button>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className={`text-lg font-semibold ${task.status === 'completed'
                                                    ? isDark ? 'text-gray-500 line-through' : 'text-gray-400 line-through'
                                                    : isDark ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                    {task.title}
                                                </h3>
                                                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                                    {task.priority.toUpperCase()}
                                                </span>
                                            </div>

                                            {task.description && (
                                                <p className={`text-sm mb-3 ${task.status === 'completed'
                                                    ? isDark ? 'text-gray-600' : 'text-gray-500'
                                                    : isDark ? 'text-gray-300' : 'text-gray-600'
                                                    }`}>
                                                    {task.description}
                                                </p>
                                            )}

                                            <div className="flex items-center space-x-4 text-sm">
                                                {task.dueDate && (
                                                    <div className="flex items-center space-x-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span className={new Date(task.dueDate) < new Date() && task.status !== 'completed'
                                                            ? 'text-red-500 font-semibold'
                                                            : isDark ? 'text-gray-400' : 'text-gray-600'
                                                        }>
                                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}
                                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    Created: {new Date(task.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={() => setEditingTask(task)}
                                            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${isDark ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-600 hover:bg-blue-100'
                                                }`}
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-100'
                                                }`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* CSS for hover effects */}
            <style jsx>{`
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }
        
        .hover\\:scale-110:hover {
          transform: scale(1.1);
        }
      `}</style>
        </div>
    );
};

export default TaskManager;