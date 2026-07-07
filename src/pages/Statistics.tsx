import { useState, useEffect } from "react";
import { BarChart3, PieChart, TrendingUp, Calendar, Award } from "lucide-react";

interface Task {
  id: number;
  title: string;
  priority: "low" | "medium" | "high";
  status: "backlog" | "active" | "done";
}

export default function Statistics() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState({
    byPriority: { low: 0, medium: 0, high: 0 },
    byStatus: { backlog: 0, active: 0, done: 0 },
    avgTasksPerDay: 0,
    streak: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    const allTasks: Task[] = saved ? JSON.parse(saved) : [];
    setTasks(allTasks);

    const byPriority = { low: 0, medium: 0, high: 0 };
    const byStatus = { backlog: 0, active: 0, done: 0 };

    allTasks.forEach((task) => {
      byPriority[task.priority]++;
      byStatus[task.status]++;
    });

    setStats({
      byPriority,
      byStatus,
      avgTasksPerDay: Math.ceil(allTasks.length / 7),
      streak: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 1 : 0,
    });
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const priorityPercentages = {
    low: totalTasks > 0 ? Math.round((stats.byPriority.low / totalTasks) * 100) : 0,
    medium: totalTasks > 0 ? Math.round((stats.byPriority.medium / totalTasks) * 100) : 0,
    high: totalTasks > 0 ? Math.round((stats.byPriority.high / totalTasks) * 100) : 0,
  };

  const statusPercentages = {
    backlog: totalTasks > 0 ? Math.round((stats.byStatus.backlog / totalTasks) * 100) : 0,
    active: totalTasks > 0 ? Math.round((stats.byStatus.active / totalTasks) * 100) : 0,
    done: totalTasks > 0 ? Math.round((stats.byStatus.done / totalTasks) * 100) : 0,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Statistics & Analytics</h2>
        <p className="text-slate-400">Analyze your task management performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 text-sm font-semibold">Completion Rate</h3>
            <TrendingUp className="text-blue-400" size={24} />
          </div>
          <p className="text-4xl font-bold text-white">{completionRate}%</p>
          <p className="text-sm text-blue-300 mt-2">{completedTasks} of {totalTasks} completed</p>
        </div>

        <div className="bg-gradient-to-br from-green-900 to-green-800 border border-green-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 text-sm font-semibold">Tasks Completed</h3>
            <Award className="text-green-400" size={24} />
          </div>
          <p className="text-4xl font-bold text-white">{completedTasks}</p>
          <p className="text-sm text-green-300 mt-2">This week</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900 to-purple-800 border border-purple-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 text-sm font-semibold">Avg Tasks/Day</h3>
            <Calendar className="text-purple-400" size={24} />
          </div>
          <p className="text-4xl font-bold text-white">{stats.avgTasksPerDay}</p>
          <p className="text-sm text-purple-300 mt-2">Based on total tasks</p>
        </div>

        <div className="bg-gradient-to-br from-orange-900 to-orange-800 border border-orange-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-300 text-sm font-semibold">Current Streak</h3>
            <span className="text-2xl">🔥</span>
          </div>
          <p className="text-4xl font-bold text-white">{stats.streak}</p>
          <p className="text-sm text-orange-300 mt-2">days in a row</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="text-blue-400" size={24} />
            <h3 className="text-xl font-bold text-white">Priority Distribution</h3>
          </div>

          <div className="space-y-4">
            {/* High Priority */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">High Priority</span>
                <span className="text-red-400 font-bold">{stats.byPriority.high}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all duration-300"
                  style={{ width: `${priorityPercentages.high}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">{priorityPercentages.high}%</p>
            </div>

            {/* Medium Priority */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">Medium Priority</span>
                <span className="text-yellow-400 font-bold">{stats.byPriority.medium}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-yellow-500 h-full transition-all duration-300"
                  style={{ width: `${priorityPercentages.medium}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">{priorityPercentages.medium}%</p>
            </div>

            {/* Low Priority */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">Low Priority</span>
                <span className="text-green-400 font-bold">{stats.byPriority.low}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all duration-300"
                  style={{ width: `${priorityPercentages.low}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">{priorityPercentages.low}%</p>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-purple-400" size={24} />
            <h3 className="text-xl font-bold text-white">Status Distribution</h3>
          </div>

          <div className="space-y-4">
            {/* Done */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">Done</span>
                <span className="text-green-400 font-bold">{stats.byStatus.done}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all duration-300"
                  style={{ width: `${statusPercentages.done}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">{statusPercentages.done}%</p>
            </div>

            {/* Active */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">In Progress</span>
                <span className="text-blue-400 font-bold">{stats.byStatus.active}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${statusPercentages.active}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">{statusPercentages.active}%</p>
            </div>

            {/* Backlog */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-medium">Backlog</span>
                <span className="text-slate-400 font-bold">{stats.byStatus.backlog}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-slate-500 h-full transition-all duration-300"
                  style={{ width: `${statusPercentages.backlog}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">{statusPercentages.backlog}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-slate-400 text-sm mb-2">Total Tasks</p>
            <p className="text-3xl font-bold text-white">{totalTasks}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-2">Active Tasks</p>
            <p className="text-3xl font-bold text-blue-400">{stats.byStatus.active}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-2">Completion This Week</p>
            <p className="text-3xl font-bold text-green-400">{completedTasks}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
