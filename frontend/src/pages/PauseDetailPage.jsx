import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import "./PausePage.css";

function PauseDetailPage() {
  const { slug } = useParams();
  const [pause, setPause] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPause = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/pause-suggestions/${slug}`
        );
        const data = await response.json();

        setPause(data);
      } catch (error) {
        console.error("Fout bij ophalen pauze:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPause();
  }, [slug]);

  if (loading) {
    return (
      <MainLayout title="Pauze laden" subtitle="Even geduld">
        <p className="pauseStatusText">Pauze laden...</p>
      </MainLayout>
    );
  }

  if (!pause || pause.message) {
    return (
      <MainLayout title="Pauze niet gevonden" subtitle="Deze pauze bestaat niet">
        <section className="pauseDetailWrapper">
          <Link to="/pause" className="pauseBackButton">
            ← Terug naar pauzes
          </Link>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={pause.title} subtitle={pause.description}>
      <section className="pauseDetailWrapper">
        <Link to="/pause" className="pauseBackButton">
          ← Terug naar pauzes
        </Link>

        <div className="pauseDetailContent">
          <div className="pauseDetailHeader">
            <div className="pauseDetailIconCircle">
              <span>{pause.icon}</span>
            </div>

            <div className="pauseDetailHeaderText">
              <h2>{pause.title}</h2>
              <span>{pause.duration}</span>
            </div>
          </div>

          {pause.isCategory ? (
            <div className="pauseInstructionsCard">
              <h3>Kies een ademhalingsoefening</h3>

              <div className="pauseMethodGrid">
                {pause.methods?.map((method) => (
                  <Link
                    key={method.slug}
                    to={`/pause/${method.slug}/session`}
                    state={{ pauseItem: method }}
                    className="pauseMethodCard"
                  >
                    <h4>{method.title}</h4>
                    <p>{method.description}</p>
                    <span>{method.duration}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="pauseInstructionsCard">
                <h3>{pause.instructionTitle}</h3>

                <ol className="pauseInstructionsList">
                  {pause.instructions?.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="pauseInfoCard">
                <h4>{pause.infoTitle}</h4>
                <p>{pause.infoText}</p>
              </div>

              <Link to={`/pause/${pause.slug}/session`} className="pausePrimaryButton">
                Start pauze
              </Link>
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default PauseDetailPage;