import BasespotsCell from "src/components/Basespot/BasespotsCell";

const BasespotsPage = ({ map, type, search }: { map?: number; type?: string; search?: string }) => {
  return <BasespotsCell map={map} type={type} search={search} />;
};

export default BasespotsPage;
