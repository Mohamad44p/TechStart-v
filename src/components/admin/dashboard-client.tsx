"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Image,
  Video,
  Users,
  Heart,
  AlertTriangle,
  Tag,
  Grid,
  UserPlus,
  HelpCircle,
  Plus,
  FileText,
  Settings,
  Shield,
  Briefcase,
  Mail,
  MessageSquare,
  Target,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Pie,
  PieChart,
  Area,
  AreaChart,
  Cell,
  YAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "../ui/badge";

type DashboardData = {
  postCount: number;
  tagCount: number;
  galleryCount: number;
  imageCount: number;
  videoGalleryCount: number;
  videoCount: number;
  programCount: number;
  beneficiaryCount: number;
  complaintCount: number;
  recentPosts: { title_en: string; createdAt: string }[];
  topPrograms: { name_en: string; order: number }[];
  recentComplaints: {
    complaintNumber: string;
    status: string;
    submittedAt: string;
  }[];
  teamMemberCount: number;
  faqCount: number;
  partnerCount: number;
  safeguardCount: number;
  postsByMonth: { month: string; count: number }[];
  contactSubmissionCount: number;
  workWithUsCount: number;
  programCategories: { name: string }[];
  contactSubmissions: { name: string; subject: string; status: string }[];
  monthlyStats: { month: string; posts: number; images: number; videos: number; complaints: number }[];
};

export default function DashboardClient({
  dashboardData,
}: {
  dashboardData: DashboardData;
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const statCards = [
    {
      title: "Posts",
      value: dashboardData.postCount,
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      title: "Tags",
      value: dashboardData.tagCount,
      icon: Tag,
      color: "text-indigo-500",
    },
    {
      title: "Galleries",
      value: dashboardData.galleryCount,
      icon: Grid,
      color: "text-teal-500",
    },
    {
      title: "Images",
      value: dashboardData.imageCount,
      icon: Image,
      color: "text-green-500",
    },
    {
      title: "Video Galleries",
      value: dashboardData.videoGalleryCount,
      icon: Grid,
      color: "text-purple-500",
    },
    {
      title: "Videos",
      value: dashboardData.videoCount,
      icon: Video,
      color: "text-red-500",
    },
    {
      title: "Programs",
      value: dashboardData.programCount,
      icon: Briefcase,
      color: "text-orange-500",
    },
    {
      title: "Beneficiaries",
      value: dashboardData.beneficiaryCount,
      icon: Heart,
      color: "text-pink-500",
    },
    {
      title: "Complaints",
      value: dashboardData.complaintCount,
      icon: AlertTriangle,
      color: "text-yellow-500",
    },
    {
      title: "Team Members",
      value: dashboardData.teamMemberCount,
      icon: UserPlus,
      color: "text-cyan-500",
    },
    {
      title: "FAQs",
      value: dashboardData.faqCount,
      icon: HelpCircle,
      color: "text-purple-600",
    },
    {
      title: "Partners",
      value: dashboardData.partnerCount,
      icon: Users,
      color: "text-gray-500",
    },
    {
      title: "Safeguards",
      value: dashboardData.safeguardCount,
      icon: Shield,
      color: "text-green-600",
    },
    {
      title: "Contact Submissions",
      value: dashboardData.contactSubmissionCount,
      icon: Mail,
      color: "text-amber-500",
    },
    {
      title: "Work Opportunities",
      value: dashboardData.workWithUsCount,
      icon: Briefcase,
      color: "text-violet-500",
    },
    {
      title: "Program Categories",
      value: dashboardData.programCategories.length,
      icon: Target,
      color: "text-emerald-500",
    },
  ];

  const contentOverviewData = [
    { name: "Posts", value: dashboardData.postCount },
    { name: "Images", value: dashboardData.imageCount },
    { name: "Videos", value: dashboardData.videoCount },
    { name: "Programs", value: dashboardData.programCount },
    { name: "Beneficiaries", value: dashboardData.beneficiaryCount },
  ];

  const contentOverviewConfig: ChartConfig = {
    Posts: { label: "Posts", color: "hsl(var(--chart-1))" },
    Images: { label: "Images", color: "hsl(var(--chart-2))" },
    Videos: { label: "Videos", color: "hsl(var(--chart-3))" },
    Programs: { label: "Programs", color: "hsl(var(--chart-4))" },
    Beneficiaries: { label: "Beneficiaries", color: "hsl(var(--chart-5))" },
  };

  const contentDistributionData = [
    { name: "Posts", value: dashboardData.postCount },
    { name: "Images", value: dashboardData.imageCount },
    { name: "Videos", value: dashboardData.videoCount },
    { name: "Programs", value: dashboardData.programCount },
  ];

  const contentDistributionConfig: ChartConfig = {
    Posts: { label: "Posts", color: "hsl(var(--chart-1))" },
    Images: { label: "Images", color: "hsl(var(--chart-2))" },
    Videos: { label: "Videos", color: "hsl(var(--chart-3))" },
    Programs: { label: "Programs", color: "hsl(var(--chart-4))" },
  };

  const ContentOverviewChart = () => (
    <ChartContainer config={contentOverviewConfig}>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={contentOverviewData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="name"
            axisLine={false}
            tickLine={false}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip 
            content={<ChartTooltipContent />}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Legend />
          <Bar
            dataKey="value"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );

  const ContentDistributionChart = () => (
    <ChartContainer config={contentDistributionConfig} className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={contentDistributionData}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={(entry) => entry.name}
            labelLine={{ stroke: 'hsl(var(--foreground))' }}
          >
            {contentDistributionData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`}
                fill={`hsl(var(--chart-${index + 1}))`}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );

  const ContentTrendsChart = () => (
    <ChartContainer config={{
      posts: { label: "Posts", color: "hsl(var(--chart-1))" },
      images: { label: "Images", color: "hsl(var(--chart-2))" },
      videos: { label: "Videos", color: "hsl(var(--chart-3))" },
      complaints: { label: "Complaints", color: "hsl(var(--chart-4))" },
    }}>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart
          data={dashboardData.monthlyStats}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="month"
            axisLine={false}
            tickLine={false}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="posts"
            stackId="1"
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1)/0.2)"
          />
          <Area
            type="monotone"
            dataKey="images"
            stackId="1"
            stroke="hsl(var(--chart-2))"
            fill="hsl(var(--chart-2)/0.2)"
          />
          <Area
            type="monotone"
            dataKey="videos"
            stackId="1"
            stroke="hsl(var(--chart-3))"
            fill="hsl(var(--chart-3)/0.2)"
          />
          <Area
            type="monotone"
            dataKey="complaints"
            stackId="1"
            stroke="hsl(var(--chart-4))"
            fill="hsl(var(--chart-4)/0.2)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="mr-2 h-4 w-4" /> Add New Post
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Link>
          </Button>
        </div>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <TabsContent value="overview" className="space-y-8">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {card.title}
                        </CardTitle>
                        <card.icon className={`h-4 w-4 ${card.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Content Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ContentOverviewChart />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {dashboardData.recentPosts.map((post, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center"
                        >
                          <BookOpen className="mr-2 h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">
                            {post.title_en}
                          </span>
                          <span className="ml-auto text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                    <Button className="w-full mt-4" variant="outline" asChild>
                      <Link href="/admin/posts">View All Posts</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Complaints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {dashboardData.recentComplaints.map(
                        (complaint, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center"
                          >
                            <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">
                              {complaint.complaintNumber}
                            </span>
                            <span className="ml-2 text-sm">
                              {complaint.status}
                            </span>
                            <span className="ml-auto text-sm text-gray-500">
                              {new Date(
                                complaint.submittedAt
                              ).toLocaleDateString()}
                            </span>
                          </motion.li>
                        )
                      )}
                    </ul>
                    <Button className="w-full mt-4" variant="outline" asChild>
                      <Link href="/admin/complaints">View All Complaints</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Content Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ContentDistributionChart />
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Content Trends</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ContentTrendsChart />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Contact Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {dashboardData.contactSubmissions.map((submission, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between p-2 rounded-lg border"
                          >
                            <div className="flex items-center space-x-4">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{submission.name}</p>
                                <p className="text-xs text-muted-foreground">{submission.subject}</p>
                              </div>
                            </div>
                            <Badge variant={submission.status === 'new' ? 'default' : 'secondary'}>
                              {submission.status}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-8">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Posts by Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{
                      count: { label: "Posts", color: "hsl(var(--chart-1))" }
                    }}>
                      <AreaChart
                        data={dashboardData.postsByMonth.map((item) => ({
                          month: new Date(item.month).toLocaleString(
                            "default",
                            { month: "short" }
                          ),
                          count: Number(item.count),
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="hsl(var(--chart-1))"
                          fill="hsl(var(--chart-1))"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Top Programs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{
                      order: { label: "Program Order", color: "hsl(var(--chart-2))" }
                    }}>
                      <BarChart
                        data={dashboardData.topPrograms.map((program) => ({
                          name: program.name_en,
                          order: program.order,
                        }))}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="order"
                          fill="hsl(var(--chart-2))"
                          radius={4}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Generate a report of all content items.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/admin/reports/content">
                        <FileText className="mr-2 h-4 w-4" /> Generate Report
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Complaint Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Review and analyze complaint trends.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/admin/reports/complaints">
                        <FileText className="mr-2 h-4 w-4" /> Generate Report
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Program Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Analyze the performance of various programs.</p>
                    <Button className="mt-4" asChild>
                      <Link href="/admin/reports/programs">
                        <FileText className="mr-2 h-4 w-4" /> Generate Report
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
