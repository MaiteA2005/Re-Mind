import "./css/PauseProgressBar.css";

function PauseProgressBar({ progress }) {
  return (
    <div className="pauseProgressBar">
      <div
        className="pauseProgressFill"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default PauseProgressBar;