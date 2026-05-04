import { useState } from "react";
import Button from "../base/Button";
import "./DashboardFocusAction.css";

import completeIcon from "../../assets/icons_zwart/name_one_win_zwart.svg";
import documentIcon from "../../assets/icons_zwart/notitie_zwart.svg";

function DashboardFocusAction({ todayFocus, focusLoading, onCompleteFocus }) {
  const [isFocusPopupOpen, setIsFocusPopupOpen] = useState(false);
  const hasFocus = todayFocus && !todayFocus.focusCompleted;

  return (
    <div className="focusPopupWrapper">
      <button
        className="pageHeaderButton"
        type="button"
        aria-label="Focus voor vandaag openen"
        onClick={() => setIsFocusPopupOpen((prev) => !prev)}
      >
        <img src={documentIcon} alt="" className="pageHeaderIcon" />
      </button>

      {hasFocus && <span className="focusBadge" />}

      {isFocusPopupOpen && (
        <div className="focusPopup">
          <h3>Focus voor vandaag:</h3>

          {focusLoading ? (
            <p>Focus laden...</p>
          ) : !todayFocus ? (
            <p>Er is nog geen focus voor vandaag ingesteld.</p>
          ) : todayFocus.focusCompleted ? (
            <p>Je hebt je focus voor vandaag afgerond. Goed bezig.</p>
          ) : (
            <>
              <p>{todayFocus.tomorrowFocus}</p>

              <Button variant="secondary" onClick={onCompleteFocus} iconLeft={completeIcon} full>
                Markeer als voltooid
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardFocusAction;