"use client";

import{
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

const data = [
    {
        name:"Healthy",value:18
    },
    {
        name:"Warning",value:4
    },
    {
        name:"Critical",value:2
    },
]
const COLORS = [
  "#22c55e",
  "#f59e0b",
  "#ef4444",
];

export default function ServiceHealthChart() {
  return (
    <div className="bg-white border border-gray-300 rounded-2xl p-6 mt-8
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <h2 className="text-green-900 text-xl uppercase font-semibold mb-6">
        Service Health
      </h2>

    {/*HCW*/}
      <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Healthy</span>
                    </div>

                    <span className="text-gray-600">18 (75%)</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-gray-600">Warning</span>
                    </div>

                    <span className="text-gray-600">4 (16.7%)</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">Critical</span>
                    </div>

                    <span className="text-gray-600">2 (8.3%)</span>
            </div>
        </div>

    {/*PIECHART*/}
      <div className="relative h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie 
                    data={data}
                    dataKey="value"
                    innerRadius={50}
                >

                {data.map((entry,index)=>(
                    <Cell
                        key={entry.name}
                        fill={COLORS[index]}
                    />
                ))}

                </Pie>
            </PieChart>
        </ResponsiveContainer>

    {/*TOTAL*/}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-3xl font-bold text-green-900">
                24
            </p>

            <p className="text-gray-500 text-sm">
                Total
            </p>
        </div>
    </div>
    </div>
  );
}