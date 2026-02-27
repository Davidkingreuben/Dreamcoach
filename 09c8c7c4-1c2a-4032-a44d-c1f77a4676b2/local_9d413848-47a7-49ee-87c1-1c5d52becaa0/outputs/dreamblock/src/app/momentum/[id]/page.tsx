import MomentumClient from "./MomentumClient";

export default function MomentumPage({ params }: { params: { id: string } }) {
  return <MomentumClient dreamId={params.id} />;
}
