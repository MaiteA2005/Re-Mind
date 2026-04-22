import { Link, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { pauseSuggestions } from "../data/pauseSuggestionsData";
import "./PausePage.css";

function PauseCompletePage() {
  const { slug } = useParams();

  const pauseItem = pauseSuggestions.find((item) => item.slug === slug);

  if (!pauseItem) {
    return (
      <MainLayout title="Pauze niet gevonden" subtitle="Deze pauze bestaat niet">
        <div className="pauseCompleteWrapper">
          <Link to="/pause" className="pausePrimaryButton">
            Terug naar pauzes
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={pauseItem.completeTitle} subtitle={pauseItem.completeText}>
      <div className="pauseCompleteWrapper">
        <div className="pauseCompleteContent">
          <div className="pauseCompleteIcon">✓</div>
          <h2>{pauseItem.completeTitle}</h2>
          <p>{pauseItem.completeText}</p>

          <div className="pauseCompleteButtons">
            <Link to="/dashboard" className="pausePrimaryButton">
              Verder werken
            </Link>

            <Link to="/pause" className="pauseOutlineButton pauseOutlineLink">
              Nog een pauze
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default PauseCompletePage;