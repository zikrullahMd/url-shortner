import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";






export default function Location({stats}) {
  const [data,setData] = useState([])
  useEffect(()=>{
    const groupedData = Object.entries(Object.groupBy(stats, (stat) => stat.city)).map(([city, statsArray]) => ({
      name: city,
      uv: statsArray.length,
    }));
    setData(groupedData);
  },[stats])
  const CustomTooltip = (props) => {
    return (
      <Tooltip
        {...props}
        contentStyle={{ backgroundColor: 'black', color: 'white' }}
      />
    );
  };
  return (
    <div style={{width: "100%", height: 300}}>
      <ResponsiveContainer>

      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip labelStyle={{color: "green"}}/>
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#black"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
