import LootcratesCell from "src/components/Lootcrate/LootcratesCell";

const LootcratesPage = ({ map = "", search = "", type = "", color = "" }) => {
  return <LootcratesCell map={map} search={search} type={type} color={color} />;
};

export default LootcratesPage;
