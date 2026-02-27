import CoachClient from "./CoachClient";

export default function CoachPage({ params }: { params: { id: string } }) {
  return <CoachClient dreamId={params.id} />;
}
