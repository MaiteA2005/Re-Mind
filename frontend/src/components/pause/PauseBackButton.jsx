import Button from "../base/Button";
import "./PauseBackButton.css";

import ArrowLeft from "../../assets/icons_zwart/pijl_links_zwart.svg";

function PauseBackButton({ to = "/pause", children = "Terug naar pauzes" }) {
  return (
    <div className="pauseBackButtonWrapper">
      <Button to={to} variant="secondary" iconLeft={ArrowLeft}>
        {children}
      </Button>
    </div>
  );
}

export default PauseBackButton;