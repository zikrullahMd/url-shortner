import { useEffect, useState } from "react";
import { PieChart, Pie } from "recharts";



const data02 = [
  { name: "A1", value: 100 },
  { name: "A2", value: 300 },
  { name: "B1", value: 100 },
  { name: "B2", value: 80 },
  { name: "B3", value: 40 },
  { name: "B4", value: 30 },
  { name: "B5", value: 50 },
  { name: "C1", value: 100 },
  { name: "C2", value: 200 },
  { name: "D1", value: 150 },
  { name: "D2", value: 50 }
];

export default function DeviceStats({stats}) {
    const [data,setData] = useState([])
    useEffect(()=>{
        const groupedData = Object.entries(Object.groupBy(stats, (stat) => stat.device)).map(([device, deviceArray]) => ({
            name: device,
            value: deviceArray.length,
          }));
          setData(groupedData);
          console.log("Data",data);
    },[stats])
  return (
    <div style={{width:"100%", height: 300}}>
        <PieChart width={700} height={400}>
        <Pie
            data={data}
            cx={200}
            cy={200}
            innerRadius={70}
            outerRadius={90}
            fill="#82ca9d"
            label={(data)=>`${data.name}`}
        />
        </PieChart>
    </div>
  );
}
