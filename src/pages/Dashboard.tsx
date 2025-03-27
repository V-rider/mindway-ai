
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  Clock,
  FileText,
  LayoutGrid,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { TestResult, TestMeta } from "@/types";

const Dashboard = () => {
  const { user } = useAuth();
  
  // Mock data for recent tests
  const recentTests: (TestMeta & { score: number })[] = [
    {
      id: "test-1",
      name: "Midterm Math Exam",
      subject: "Mathematics",
      date: "2023-10-15",
      userId: "1",
      createdAt: "2023-10-15T14:30:00Z",
      score: 78,
    },
    {
      id: "test-2",
      name: "Multiplication Quiz",
      subject: "Arithmetic",
      date: "2023-10-08",
      userId: "1",
      createdAt: "2023-10-08T10:15:00Z",
      score: 92,
    },
    {
      id: "test-3",
      name: "Fractions Assessment",
      subject: "Mathematics",
      date: "2023-09-28",
      userId: "1",
      createdAt: "2023-09-28T09:45:00Z",
      score: 65,
    },
  ];
  
  // Mock data for performance chart
  const performanceData = [
    { name: "Week 1", score: 65 },
    { name: "Week 2", score: 70 },
    { name: "Week 3", score: 68 },
    { name: "Week 4", score: 75 },
    { name: "Week 5", score: 78 },
    { name: "Week 6", score: 82 },
    { name: "Week 7", score: 85 },
  ];
  
  // Mock data for concept mastery
  const conceptData = [
    { name: "Number Operations", mastery: 85 },
    { name: "Fractions", mastery: 62 },
    { name: "Decimals", mastery: 75 },
    { name: "Geometry", mastery: 80 },
    { name: "Measurement", mastery: 70 },
  ];
  
  // Get score color based on percentage
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-500 dark:text-green-400";
    if (score >= 60) return "text-yellow-500 dark:text-yellow-400";
    return "text-red-500 dark:text-red-400";
  };
  
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.name}. Here's an overview of your math learning progress.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Average Score",
              value: "76%",
              icon: BarChart3,
              color: "bg-indigo-500",
              trend: "+8% from last month",
              trendUp: true,
            },
            {
              title: "Total Tests",
              value: "12",
              icon: FileText,
              color: "bg-purple-500",
              trend: "+3 new tests",
              trendUp: true,
            },
            {
              title: "Learning Path Progress",
              value: "68%",
              icon: BookOpen,
              color: "bg-blue-500",
              trend: "4 topics to complete",
              trendUp: true,
            },
            {
              title: "Time Spent",
              value: "28h",
              icon: Clock,
              color: "bg-pink-500",
              trend: "+5h from last week",
              trendUp: true,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="glass-card rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                    {stat.value}
                  </h3>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp
                  className={`w-3 h-3 mr-1 ${
                    stat.trendUp
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                />
                <p
                  className={`text-xs ${
                    stat.trendUp
                      ? "text-green-500 dark:text-green-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  {stat.trend}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Performance Chart */}
        <motion.div
          className="glass-card rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Performance Trend
            </h2>
            <div className="flex items-center space-x-2">
              <button className="text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">
                Last 7 weeks
              </button>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Score"]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  dot={{ r: 4, fill: "#8b5cf6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tests */}
          <motion.div
            className="glass-card rounded-xl p-6 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Recent Tests
              </h2>
              <Link
                to="/reports"
                className="text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 inline-flex items-center"
              >
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentTests.map((test) => (
                <Link key={test.id} to={`/reports/${test.id}`}>
                  <motion.div
                    className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
                      <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {test.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {test.subject} • {new Date(test.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span
                        className={`text-sm font-bold ${getScoreColor(test.score)}`}
                      >
                        {test.score}%
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-2" />
                  </motion.div>
                </Link>
              ))}
            </div>
            
            <div className="mt-6">
              <Link
                to="/upload"
                className="w-full inline-flex items-center justify-center py-3 px-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-purple-600 dark:text-purple-400 font-medium rounded-lg text-sm transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload New Test
              </Link>
            </div>
          </motion.div>
          
          {/* Concept Mastery */}
          <motion.div
            className="glass-card rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Concept Mastery
              </h2>
              <Link
                to="/learning-pathway"
                className="text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 inline-flex items-center"
              >
                View path <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={conceptData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Mastery"]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Bar dataKey="mastery" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <Link
                to="/analytics"
                className="w-full inline-flex items-center justify-center py-3 px-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-purple-600 dark:text-purple-400 font-medium rounded-lg text-sm transition-colors"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Detailed Analytics
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Quick Links */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          {[
            {
              title: "Upload Test",
              description: "Scan and analyze a new math test",
              icon: Upload,
              link: "/upload",
              color: "bg-gradient-to-br from-purple-500 to-indigo-600",
            },
            {
              title: "View Reports",
              description: "Access all your previous test reports",
              icon: FileText,
              link: "/reports",
              color: "bg-gradient-to-br from-pink-500 to-purple-600",
            },
            {
              title: "Analytics",
              description: "Track progress and identify trends",
              icon: BarChart3,
              link: "/analytics",
              color: "bg-gradient-to-br from-blue-500 to-indigo-600",
            },
            {
              title: "Learning Path",
              description: "Follow your personalized learning journey",
              icon: BookOpen,
              link: "/learning-pathway",
              color: "bg-gradient-to-br from-purple-600 to-blue-500",
            },
          ].map((link, index) => (
            <Link key={index} to={link.link}>
              <motion.div
                className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow h-full"
                whileHover={{ y: -4 }}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${link.color} flex items-center justify-center mb-4`}
                >
                  <link.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {link.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
