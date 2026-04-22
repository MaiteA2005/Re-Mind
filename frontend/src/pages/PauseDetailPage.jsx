import { Link, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { pauseSuggestions } from "../data/pauseSuggestionsData";
import "./PausePage.css";

function PauseDetailPage() {
  const { slug } = useParams();

  const pauseItem = pauseSuggestions.find((item) => item.slug === slug);

  if (!pauseItem) {
    return (
      <MainLayout title="Pauze niet gevonden" subtitle="Deze pauze bestaat niet">
        <div className="pauseDetailWrapper">
          <Link to="/pause" className="pauseBackButton">
            ← Terug
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={pauseItem.title} subtitle={pauseItem.description}>
      <div className="pauseDetailWrapper">
        <Link to="/pause" className="pauseBackButton">
          ← Terug
        </Link>

        <div className="pauseDetailContent">
          <div className="pauseDetailHeader">
            <div className="pauseDetailIconCircle" />
            <div className="pauseDetailHeaderText">
              <h2>{pauseItem.title}</h2>
              <span>{pauseItem.durationLabel}</span>
            </div>
          </div>

          <div className="pauseInstructionsCard">
            <h3>{pauseItem.instructionTitle}</h3>

            <ol className="pauseInstructionsList">
              {pauseItem.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="pauseInfoCard">
            <h4>{pauseItem.infoTitle}</h4>
            <p>{pauseItem.infoText}</p>
          </div>

          <Link
            to={`/pause/${pauseItem.slug}/session`}
            className="pausePrimaryButton"
          >
            Start pauze
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}

export default PauseDetailPage;