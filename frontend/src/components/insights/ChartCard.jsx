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
import "./css/ChartCard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

function getChartOptions(type) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          padding: 18,
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: type === "bar" ? 5 : 10,
        ticks: {
          stepSize: type === "bar" ? 1 : 2,
          precision: 0,
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
}

function hasUsableData(data) {
  if (!data?.labels?.length) return false;
  if (!data?.datasets?.length) return false;

  return data.datasets.some((dataset) =>
    dataset.data?.some((value) => Number(value) > 0)
  );
}

function ChartCard({ title, type = "line", data }) {
  const hasData = hasUsableData(data);
  const options = getChartOptions(type);

  return (
    <article className="chart-card">
      <h3>{title}</h3>

      <div className="chart-wrapper">
        {hasData ? (
          type === "bar" ? (
            <Bar data={data} options={options} />
          ) : (
            <Line data={data} options={options} />
          )
        ) : (
          <div className="chart-empty">
            Nog niet genoeg data om deze grafiek te tonen.
          </div>
        )}
      </div>
    </article>
  );
}

export default ChartCard;