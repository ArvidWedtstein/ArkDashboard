import BasespotsCell from "src/components/Basespot/BasespotsCell";
// const BasespotsPage = () => {
//   return <BasespotsCell />
// }
const BasespotsPage = ({ page = 1, map }) => {
  return <BasespotsCell page={page} map={map} />;
};

export default BasespotsPage;
