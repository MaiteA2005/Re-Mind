import MainLayout from "../components/layout/MainLayout";
import { formatDateTime } from "../utils/date";
import "./DagAfsluistingPage.css";

function EndOfDayPage() {
  return (
    <MainLayout
      title="Einde van de dag"
      subtitle={formatDateTime()}
    >
      
    </MainLayout>
  );
}

export default EndOfDayPage;