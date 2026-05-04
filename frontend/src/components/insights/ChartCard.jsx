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
import "./ChartCard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

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
      beginAtZero: true,
      suggestedMax: 10,
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

function ChartCard({ title, type = "line", data }) {
  const hasData =
    data &&
    data.labels &&
    data.labels.length > 0 &&
    data.datasets &&
    data.datasets.some((dataset) => dataset.data?.some((value) => value > 0));

  return (
    <article className="chart-card">
      <h3>{title}</h3>

      <div className="chart-wrapper">
        {hasData ? (
          type === "line" ? (
            <Line data={data} options={options} />
          ) : (
            <Bar data={data} options={options} />
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