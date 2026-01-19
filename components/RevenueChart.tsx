"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RevenuePoint = {
  name: string;
  revenue: number;
};

type Props = {
  data: RevenuePoint[];
};

export function RevenueChart({ data }: Props) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4b52f0" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4b52f0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#64748b" }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#64748b" }} 
            tickFormatter={(value) => `€${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#fff", 
              borderRadius: "8px", 
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" 
            }}
            itemStyle={{ color: "#1e293b", fontWeight: 600 }}
            formatter={(value) => [`€${value}`, "Ingresos"]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#4b52f0"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
