import BasespotsCell from "src/components/Basespot/BasespotsCell";
// const BasespotsPage = () => {
//   return <BasespotsCell />
// }
const BasespotsPage = ({ page = 1, map, type }) => {
  return <BasespotsCell page={page} map={map} type={type} />;
};

export default BasespotsPage;
