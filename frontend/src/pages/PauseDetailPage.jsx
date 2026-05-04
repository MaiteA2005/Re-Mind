import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/base/Button";
import API_URL from "../services/api";

import PauseBackButton from "../components/pause/PauseBackButton";
import PauseHeader from "../components/pause/PauseHeader";
import PauseInstructionsCard from "../components/pause/PauseInstructionsCard";
import PauseInfoCard from "../components/pause/PauseInfoCard";
import PauseMethodCard from "../components/pause/PauseMethodCard";

import PlayWhiteIcon from "../assets/icons_wit/play_wit.svg";

import "./PausePage.css";

function PauseDetailPage() {
  const { slug } = useParams();
  const [pause, setPause] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPause = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/pause-suggestions/${slug}`
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
          <PauseBackButton />
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={pause.title} subtitle={pause.description}>
      <section className="pauseDetailWrapper">
        <PauseBackButton />

        <div className="pauseDetailContent">
          <PauseHeader
            title={pause.title}
            duration={pause.duration}
            icon={pause.icon}
          />

          {pause.isCategory ? (
            <section className="pauseInstructionsCard">
              <h3>Kies een ademhalingsoefening</h3>

              <div className="pauseMethodGrid">
                {pause.methods?.map((method) => (
                  <PauseMethodCard key={method.slug} method={method} />
                ))}
              </div>
            </section>
          ) : (
            <>
              <PauseInstructionsCard
                title={pause.instructionTitle}
                instructions={pause.instructions}
              />

              <PauseInfoCard title={pause.infoTitle} text={pause.infoText} />

              <Button
                to={`/pause/${pause.slug}/session`}
                state={{ pauseItem: pause }}
                variant="primary"
                iconLeft={PlayWhiteIcon}
                full
              >
                Start pauze
              </Button>
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

export default PauseDetailPage;