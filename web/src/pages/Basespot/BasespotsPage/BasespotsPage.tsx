import BasespotsCell from "src/components/Basespot/BasespotsCell";

const BasespotsPage = ({ map, type }: { map?: number; type?: string }) => {
  return <BasespotsCell map={map} type={type} />;
};

export default BasespotsPage;
