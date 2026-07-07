import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  Target,
  Zap,
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  priority: "low" | "medium" | "high";
  status: "backlog" | "active" | "done";
}

interface StatCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    const allTasks: Task[] = saved ? JSON.parse(saved) : [];
    setTasks(allTasks);

    const completed = allTasks.filter((t) => t.status === "done").length;
    const inProgress = allTasks.filter((t) => t.status === "active").length;
    const pending = allTasks.filter((t) => t.status === "backlog").length;
    const completionRate =
      allTasks.length > 0 ? Math.round((completed / allTasks.length) * 100) : 0;

    setStats({
      total: allTasks.length,
      completed,
      inProgress,
      pending,
      completionRate,
    });
  }, []);

  const statCards: StatCard[] = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: <Calendar size={28} />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: <CheckCircle2 size={28} />,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: <Clock size={28} />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: <AlertCircle size={28} />,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
  ];

  const recentTasks = tasks.slice(-5).reverse();
  const highPriorityTasks = tasks.filter((t) => t.priority === "high" && t.status !== "done");

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="rounded-3xl border border-slate-700/70 bg-slate-900/70 p-8 shadow-glow backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
              <Sparkles size={16} />
              Productive workspace overview
            </div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Turn your task flow into a calm, focused command center.</h2>
            <p className="mt-3 text-lg text-slate-400">
              Monitor progress, manage priorities, and keep momentum strong from one elegant dashboard.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Target size={18} className="text-blue-400" />
              Focus goal: {stats.completionRate}% completion
            </div>
            <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
              Review priorities <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <div className={`${card.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
              <div className={card.color}>{card.icon}</div>
            </div>
            <p className="text-slate-400 text-sm mb-2">{card.title}</p>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={24} className="text-blue-400" />
              Progress Overview
            </h3>
            <span className="text-2xl font-bold text-blue-400">{stats.completionRate}%</span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-300">Overall Completion</p>
              <p className="text-sm text-slate-400">
                {stats.completed} of {stats.total} tasks
              </p>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>

            {/* Breakdown */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Done</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Active</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Backlog</p>
                <p className="text-2xl font-bold text-red-400">{stats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-slate-300">Completion Rate</span>
              <span className="text-lg font-bold text-blue-400">{stats.completionRate}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-slate-300">Tasks This Week</span>
              <span className="text-lg font-bold text-green-400">{stats.total}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-slate-300">High Priority</span>
              <span className="text-lg font-bold text-red-400">{highPriorityTasks.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <span className="text-slate-300">Productivity</span>
              <span className="text-lg font-bold text-purple-400">85%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-6">
          <div className="mb-4 flex items-center gap-2 text-white">
            <Zap size={18} className="text-yellow-400" />
            <h3 className="text-xl font-semibold">Momentum boost</h3>
          </div>
          <p className="text-slate-400">
            Keep your team aligned with a clear overview of what is moving, what is waiting, and what is already done.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-6">
          <div className="mb-4 flex items-center gap-2 text-white">
            <Sparkles size={18} className="text-cyan-300" />
            <h3 className="text-xl font-semibold">Daily rhythm</h3>
          </div>
          <p className="text-slate-300">
            A structured flow helps you prioritize the right work and reduce noise throughout the day.
          </p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        {recentTasks.length > 0 ? (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors duration-200 border-l-4"
                style={{
                  borderColor:
                    task.priority === "high"
                      ? "#C24A4A"
                      : task.priority === "medium"
                      ? "#C98A2E"
                      : "#6B8F71",
                }}
              >
                <div className="flex-1">
                  <p className="text-white font-medium">{task.title}</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)} •{" "}
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    task.status === "done"
                      ? "bg-green-500/20 text-green-400"
                      : task.status === "active"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-slate-600 text-slate-300"
                  }`}
                >
                  {task.status === "done"
                    ? "Completed"
                    : task.status === "active"
                    ? "In Progress"
                    : "Pending"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No tasks yet. Start by creating your first task!</p>
        )}
      </div>
    </div>
  );
}
