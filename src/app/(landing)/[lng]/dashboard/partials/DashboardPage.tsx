"use client"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Activity,
  CreditCard,
  MessageSquare,
  MessagesSquare,
  TrendingUp
} from "lucide-react"
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  YAxis,
  AreaChart,
  Area
} from "recharts"

import type { ReactElement } from "react"

export default function DashboardPage(): ReactElement {
  const cardsData = [
    {
      title: "Total Revenue",
      description: "Total Revenue",
      icon: MessagesSquare,
      value: 1250.0,
      percentage: 18,
      percentageIcon: TrendingUp
    },
    {
      title: "Avg Messages per Chat",
      description: "Avg Messages per Chat",
      icon: CreditCard,
      value: 1250.0,
      percentage: 18,
      percentageIcon: TrendingUp
    },
    {
      title: "Bot Ratings",
      description: "Bot Ratings",
      icon: Activity,
      value: 1250.0,
      percentage: 18,
      percentageIcon: TrendingUp
    },
    {
      title: "Messages Sent",
      description: "Messages Sent",
      icon: MessageSquare,
      value: 1250.0,
      percentage: 18,
      percentageIcon: TrendingUp
    }
  ]

  const chartData = [
    { day: "Sun", usage: 6 },
    { day: "Mon", usage: 3 },
    { day: "Tue", usage: 1 },
    { day: "Wed", usage: 4 },
    { day: "Thu", usage: 8 },
    { day: "Fri", usage: 3 },
    { day: "Sat", usage: 6 }
  ]

  const AreaChartData = [
    { day: "Sun", spentTime: 3 },
    { day: "Mon", spentTime: 5 },
    { day: "Tue", spentTime: 15 },
    { day: "Wed", spentTime: 7 },
    { day: "Thu", spentTime: 9 },
    { day: "Fri", spentTime: 7 },
    { day: "Sat", spentTime: 8 }
  ]

  return (
    <div>
      <div className="flex flex-wrap justify-center w-full gap-4">
        {cardsData.map((card, index) => (
          <Card key={index} className="w-72">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardDescription>{card.title}</CardDescription>
                <card.icon
                  strokeWidth={1}
                  size={20}
                  className="text-muted-foreground"
                />
              </div>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value.toLocaleString("en-US")}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex gap-2 font-medium line-clamp-1">
                +{card.percentage}% from last 7 days{" "}
                <card.percentageIcon
                  strokeWidth={1}
                  size={20}
                  className="size-4"
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="grid-cols-2 gap-4 md:grid">
        {/* Usage Graph */}
        <Card className=" min-h-[300px] py-5 mt-10">
          <div className="pb-10 pl-6">
            <CardTitle>Usage Graph</CardTitle>
            <CardDescription className="flex items-center gap-2">
              Trending up by 5.2% <TrendingUp strokeWidth={1} />
            </CardDescription>
          </div>
          <ResponsiveContainer width="100%" className="-ml-6" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={5}
                axisLine={false}
                className="text-sm text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                domain={[0, 8]}
                allowDecimals={false}
              />
              <Bar dataKey="usage" fill="#0F172A" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Time spent via Bot */}
        <Card className=" min-h-[300px] py-5 mt-10">
          <div className="pb-10 pl-6">
            <CardTitle>Time spent via Bot</CardTitle>
            <CardDescription className="flex items-center gap-2">
              Trending up by 5.2% <TrendingUp strokeWidth={1} />
            </CardDescription>
          </div>
          <ResponsiveContainer width="100%" className="-ml-6" height={300}>
            <AreaChart
              accessibilityLayer
              data={AreaChartData}
              margin={{
                left: 12,
                right: 12
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={5}
                axisLine={false}
                className="text-sm text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                domain={[0, 20]}
                allowDecimals={false}
              />
              <Area
                type="monotone"
                dataKey="spentTime"
                stroke="#000000"
                strokeWidth={1}
                fill="#E4E4E7"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
