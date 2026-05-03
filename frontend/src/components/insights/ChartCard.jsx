import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const labels = ["09:00", "11:00", "13:00", "15:00", "17:00"];

const lineData = {
  labels,
  datasets: [
    {
      label: "Stress",
      data: [3, 4, 5, 6, 4],
      borderColor: "#df7c7f",
      backgroundColor: "#df7c7f",
      tension: 0.35,
    },
    {
      label: "Energie",
      data: [4, 3, 6, 5, 5],
      borderColor: "#78977f",
      backgroundColor: "#78977f",
      tension: 0.35,
    },
  ],
};

const barData = {
  labels,
  datasets: [
    {
      label: "Pauze genomen",
      data: [3, 4, 5, 6, 4],
      backgroundColor: "#78977f",
    },
    {
      label: "Pauze gemist",
      data: [3, 4, 5, 6, 4],
      backgroundColor: "#df7c7f",
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 12,
        font: {
          size: 11,
        },
      },
    },
  },
  scales: {
    y: {
      min: 0,
      max: 10,
      ticks: {
        stepSize: 2,
      },
      grid: {
        color: "rgba(0, 0, 0, 0.08)",
      },
    },
    x: {
      grid: {
        color: "rgba(0, 0, 0, 0.08)",
      },
    },
  },
};

function ChartCard({ title, type }) {
  return (
    <article className="chart-card">
      <h3>{title}</h3>

      <div className="chart-wrapper">
        {type === "line" ? (
          <Line data={lineData} options={options} />
        ) : (
          <Bar data={barData} options={options} />
        )}
      </div>
    </article>
  );
}

export default ChartCard;