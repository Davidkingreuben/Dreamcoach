import ResultsClient from "./ResultsClient";

export default function ResultsPage({ params }: { params: { id: string } }) {
  return <ResultsClient dreamId={params.id} />;
}
