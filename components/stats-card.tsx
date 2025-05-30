import type { ReactNode } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsCardProps {
  icon: ReactNode
  title: string
  value: string
  trend: string
  trendUp: boolean
}

export default function StatsCard({ icon, title, value, trend, trendUp }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription className="flex items-center pt-1">
          {trendUp ? (
            <span className="flex items-center text-green-500">
              <ArrowUp className="mr-1 h-4 w-4" />
              {trend}
            </span>
          ) : (
            <span className="flex items-center text-red-500">
              <ArrowDown className="mr-1 h-4 w-4" />
              {trend}
            </span>
          )}
          <span className="ml-1 text-muted-foreground">from last month</span>
        </CardDescription>
      </CardContent>
    </Card>
  )
}

