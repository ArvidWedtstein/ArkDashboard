import type { FindMapById } from "types/graphql";

import type { CellSuccessProps, CellFailureProps } from "@redwoodjs/web";

import Map from "src/components/Map/Map";

export const QUERY = gql`
  query FindMapById($id: BigInt!) {
    map: map(id: $id) {
      id
      created_at
      name
      loot_crates
      oil_veins
      water_veins
      wyvern_nests
      ice_wyvern_nests
      gas_veins
      deinonychus_nests
      charge_nodes
      plant_z_nodes
      drake_nests
      glitches
      magmasaur_nests
      poison_trees
      mutagen_bulbs
      carniflora
      notes
      img
    }
  }
`;

export const Loading = () => <div>Loading...</div>;

export const Empty = () => <div>Map not found</div>;
const map = { "id": 1, "created_at": "2023-02-19T19:30:36.019193+00:00", "name": "Valguero", "loot_crates": [[{ "lat": 33.67161, "lon": 88.53222 }, { "lat": 32.25693, "lon": 84.06038 }, { "lat": 25.92985, "lon": 73.65098 }, { "lat": 33.70374, "lon": 68.8739 }, { "lat": 39.87885, "lon": 67.6003 }, { "lat": 44.34221, "lon": 64.88092 }, { "lat": 50.23377, "lon": 64.64588 }, { "lat": 48.59635, "lon": 67.80238 }, { "lat": 47.12564, "lon": 72.89946 }, { "lat": 38.81974, "lon": 75.98248 }, { "lat": 33.27677, "lon": 79.80968 }, { "lat": 32.6408, "lon": 76.7117 }, { "lat": 30.48358, "lon": 70.84197 }, { "lat": 28.98476, "lon": 80.76839 }, { "lat": 35.14817, "lon": 78.05606 }, { "lat": 43.49935, "lon": 74.70493 }, { "lat": 38.78425, "lon": 65.1682 }, { "lat": 28.48671, "lon": 65.95562 }], [{ "lat": 74.27105, "lon": 40.08296 }], [{ "lat": 72.46281, "lon": 35.73545 }], [{ "lat": 71.43328, "lon": 38.1713 }], [{ "lat": 35.63975, "lon": 52.16481 }], [{ "lat": 45.50877, "lon": 90.73582 }], [{ "lat": 70.15047, "lon": 39.19777 }], [{ "lat": 23.86945, "lon": 9.22398 }, { "lat": 23.38749, "lon": 3.162701 }, { "lat": 15.89452, "lon": 4.565213 }, { "lat": 13.45579, "lon": 7.583912 }, { "lat": 6.216898, "lon": 5.414631 }, { "lat": 5.203235, "lon": 18.18073 }, { "lat": 7.022191, "lon": 26.87624 }, { "lat": 19.46935, "lon": 13.69912 }, { "lat": 17.95482, "lon": 10.0741 }, { "lat": 19.79275, "lon": 23.44784 }, { "lat": 19.26466, "lon": 15.99152 }, { "lat": 22.02871, "lon": 24.11466 }, { "lat": 15.48881, "lon": 25.85861 }, { "lat": 23.2832, "lon": 19.61549 }, { "lat": 25.68965, "lon": 23.27687 }, { "lat": 23.4073, "lon": 28.93593 }, { "lat": 19.90772, "lon": 33.75642 }, { "lat": 16.67601, "lon": 36.47868 }, { "lat": 19.96787, "lon": 42.01331 }, { "lat": 27.31709, "lon": 42.42244 }, { "lat": 13.60153, "lon": 37.28131 }, { "lat": 9.318515, "lon": 38.39034 }, { "lat": 5.259797, "lon": 42.13133 }, { "lat": 11.78909, "lon": 43.64951 }, { "lat": 24.02165, "lon": 39.64845 }, { "lat": 22.78896, "lon": 35.59718 }, { "lat": 14.10529, "lon": 30.39109 }, { "lat": 17.44413, "lon": 32.39189 }, { "lat": 8.880003, "lon": 31.4573 }, { "lat": 6.087686, "lon": 37.73621 }, { "lat": 17.78131, "lon": 43.39979 }, { "lat": 23.77569, "lon": 43.80441 }, { "lat": 25.68966, "lon": 40.38773 }, { "lat": 17.43615, "lon": 27.38103 }], [{ "lat": 96.06665, "lon": 79.12104 }, { "lat": 91.80581, "lon": 83.24639 }, { "lat": 96.32272, "lon": 86.27744 }, { "lat": 90.85616, "lon": 87.57302 }, { "lat": 88.05507, "lon": 78.36791 }, { "lat": 92.23986, "lon": 75.57721 }, { "lat": 87.60773, "lon": 75.76949 }, { "lat": 87.21678, "lon": 85.26783 }, { "lat": 88.02412, "lon": 89.70323 }, { "lat": 91.56889, "lon": 93.93403 }, { "lat": 96.23638, "lon": 90.82222 }, { "lat": 92.42777, "lon": 89.24128 }, { "lat": 85.4062, "lon": 91.90309 }, { "lat": 85.7715, "lon": 94.31849 }, { "lat": 83.71598, "lon": 97.85508 }, { "lat": 80.26776, "lon": 95.4615 }, { "lat": 73.60052, "lon": 93.3798 }, { "lat": 73.24114, "lon": 96.84926 }, { "lat": 79.48649, "lon": 89.45018 }, { "lat": 78.26945, "lon": 90.13674 }, { "lat": 85.3353, "lon": 85.99367 }, { "lat": 81.70465, "lon": 87.97417 }, { "lat": 84.56937, "lon": 76.83668 }, { "lat": 79.52308, "lon": 80.38775 }, { "lat": 80.32246, "lon": 74.36863 }, { "lat": 75.60167, "lon": 74.3901 }, { "lat": 72.25408, "lon": 74.39047 }, { "lat": 72.60923, "lon": 77.19237 }, { "lat": 73.5949, "lon": 79.3692 }, { "lat": 73.21514, "lon": 86.01206 }, { "lat": 77.96854, "lon": 87.14827 }, { "lat": 80.53984, "lon": 86.88793 }, { "lat": 80.36686, "lon": 82.24723 }, { "lat": 69.88628, "lon": 92.3413 }, { "lat": 68.16895, "lon": 97.18913 }, { "lat": 66.09938, "lon": 94.50846 }, { "lat": 63.54346, "lon": 89.33695 }, { "lat": 59.82088, "lon": 95.98133 }, { "lat": 64.62278, "lon": 86.81663 }, { "lat": 68.62979, "lon": 87.97634 }, { "lat": 69.48549, "lon": 81.45819 }, { "lat": 70.2862, "lon": 76.99763 }, { "lat": 69.91298, "lon": 74.1599 }, { "lat": 66.53435, "lon": 79.35384 }, { "lat": 62.24723, "lon": 76.41152 }, { "lat": 61.12279, "lon": 78.92549 }, { "lat": 60.63269, "lon": 82.94893 }], [{ "lat": 36.13969, "lon": 50.98236 }], [{ "lat": 48.79096, "lon": 90.31256 }], [{ "lat": 13.4236, "lon": 72.75334 }], [{ "lat": 14.584, "lon": 26.3105 }], [{ "lat": 11.48995, "lon": 45.47763 }, { "lat": 10.76472, "lon": 53.94971 }, { "lat": 11.23481, "lon": 57.36025 }, { "lat": 13.06893, "lon": 55.49512 }, { "lat": 16.24143, "lon": 49.29398 }, { "lat": 19.90517, "lon": 49.67806 }, { "lat": 25.02366, "lon": 47.52828 }, { "lat": 20.38304, "lon": 46.39158 }, { "lat": 14.40615, "lon": 50.0957 }, { "lat": 15.20265, "lon": 47.84461 }, { "lat": 15.85029, "lon": 58.58306 }, { "lat": 24.37003, "lon": 57.05316 }, { "lat": 26.85071, "lon": 46.76458 }, { "lat": 19.01845, "lon": 56.42537 }, { "lat": 14.02617, "lon": 51.75008 }, { "lat": 16.26268, "lon": 55.82924 }, { "lat": 20.6762, "lon": 57.8568 }, { "lat": 26.14756, "lon": 50.83118 }, { "lat": 12.67915, "lon": 59.98537 }, { "lat": 10.6762, "lon": 62.06183 }, { "lat": 10.20672, "lon": 68.45094 }, { "lat": 11.88574, "lon": 72.16542 }, { "lat": 9.71256, "lon": 72.81384 }, { "lat": 11.22909, "lon": 74.48162 }, { "lat": 11.08727, "lon": 77.45172 }, { "lat": 8.447519, "lon": 81.0755 }, { "lat": 3.994756, "lon": 81.75536 }, { "lat": 5.457799, "lon": 84.18692 }, { "lat": 3.950668, "lon": 86.2138 }, { "lat": 11.11104, "lon": 82.88779 }, { "lat": 5.145754, "lon": 90.23626 }, { "lat": 8.284733, "lon": 92.49736 }, { "lat": 5.504987, "lon": 96.33829 }, { "lat": 9.71229, "lon": 94.29211 }, { "lat": 11.6502, "lon": 90.47406 }, { "lat": 14.13302, "lon": 92.33069 }, { "lat": 14.82394, "lon": 96.7146 }, { "lat": 16.76505, "lon": 99.45905 }, { "lat": 21.54063, "lon": 97.06038 }, { "lat": 21.03084, "lon": 92.92305 }, { "lat": 23.35791, "lon": 89.42881 }, { "lat": 20.20075, "lon": 89.05039 }, { "lat": 13.94762, "lon": 87.97396 }, { "lat": 21.04072, "lon": 87.64677 }, { "lat": 25.77997, "lon": 81.43533 }, { "lat": 26.37432, "lon": 78.84881 }, { "lat": 26.96964, "lon": 76.8446 }, { "lat": 24.71287, "lon": 71.29581 }, { "lat": 26.3833, "lon": 69.56706 }, { "lat": 22.16605, "lon": 70.664 }, { "lat": 21.62622, "lon": 74.60954 }, { "lat": 26.1675, "lon": 64.89146 }, { "lat": 22.87911, "lon": 64.83785 }, { "lat": 25.32892, "lon": 59.38245 }, { "lat": 18.25524, "lon": 63.71424 }, { "lat": 14.62766, "lon": 66.78101 }], [{ "lat": 48.06274, "lon": 58.96704 }], [{ "lat": 41.31025, "lon": 37.22136 }, { "lat": 34.19885, "lon": 39.0757 }, { "lat": 35.83532, "lon": 33.89395 }, { "lat": 39.80673, "lon": 17.96752 }, { "lat": 38.1419, "lon": 25.0299 }, { "lat": 39.84549, "lon": 29.85869 }, { "lat": 46.30715, "lon": 32.9377 }, { "lat": 36.18269, "lon": 18.66619 }, { "lat": 54.35852, "lon": 30.67541 }, { "lat": 48.75452, "lon": 35.62613 }], [{ "lat": 62.25383, "lon": 10.97802 }, { "lat": 66.91337, "lon": 2.679549 }, { "lat": 57.99907, "lon": 5.533317 }, { "lat": 70.70922, "lon": 5.672565 }, { "lat": 67.11315, "lon": 9.335584 }, { "lat": 59.10816, "lon": 13.51963 }, { "lat": 65.48472, "lon": 13.60825 }, { "lat": 70.85738, "lon": 14.32108 }, { "lat": 76.93475, "lon": 14.03897 }, { "lat": 75.52343, "lon": 10.67269 }, { "lat": 83.35849, "lon": 11.88236 }, { "lat": 83.74756, "lon": 3.853633 }, { "lat": 81.08358, "lon": 1.412106 }, { "lat": 73.44165, "lon": 4.644112 }, { "lat": 82.05186, "lon": 8.300686 }, { "lat": 81.05192, "lon": 13.4863 }, { "lat": 90.09515, "lon": 7.618797 }, { "lat": 89.78062, "lon": 4.896471 }, { "lat": 96.79689, "lon": 6.731565 }, { "lat": 99.07101, "lon": 10.87319 }, { "lat": 95.86759, "lon": 14.35487 }, { "lat": 90.41616, "lon": 13.52497 }, { "lat": 95.63754, "lon": 18.94753 }, { "lat": 95.9544, "lon": 28.95102 }, { "lat": 87.38894, "lon": 26.91773 }, { "lat": 90.22145, "lon": 16.42203 }, { "lat": 93.71949, "lon": 28.43147 }, { "lat": 89.00492, "lon": 24.46695 }, { "lat": 87.57165, "lon": 17.62073 }, { "lat": 98.83777, "lon": 27.80724 }, { "lat": 97.26647, "lon": 30.42914 }, { "lat": 95.85459, "lon": 35.9679 }, { "lat": 99.13197, "lon": 41.47153 }, { "lat": 87.30106, "lon": 36.4553 }, { "lat": 89.67246, "lon": 33.08125 }, { "lat": 87.64484, "lon": 44.21246 }, { "lat": 84.55785, "lon": 20.37109 }, { "lat": 78.04875, "lon": 16.54844 }, { "lat": 76.95482, "lon": 15.72818 }, { "lat": 74.00243, "lon": 16.35508 }, { "lat": 75.57927, "lon": 28.09814 }, { "lat": 81.85478, "lon": 28.34691 }, { "lat": 74.04821, "lon": 22.24531 }, { "lat": 73.19368, "lon": 28.94633 }, { "lat": 69.74628, "lon": 36.64335 }, { "lat": 69.56202, "lon": 40.92134 }, { "lat": 78.64639, "lon": 41.281 }, { "lat": 77.59046, "lon": 40.57202 }, { "lat": 83.349, "lon": 38.08999 }, { "lat": 81.19618, "lon": 33.24582 }, { "lat": 74.44343, "lon": 32.79269 }, { "lat": 75.82453, "lon": 32.10897 }, { "lat": 81.19801, "lon": 36.01918 }, { "lat": 77.4926, "lon": 28.01066 }, { "lat": 84.08149, "lon": 26.65939 }, { "lat": 80.51483, "lon": 15.07423 }, { "lat": 58.36562, "lon": 20.31212 }, { "lat": 60.54999, "lon": 16.50449 }, { "lat": 66.61352, "lon": 20.62746 }, { "lat": 67.92126, "lon": 24.41 }, { "lat": 67.9463, "lon": 27.79887 }, { "lat": 66.19167, "lon": 41.74607 }, { "lat": 64.15191, "lon": 38.1418 }, { "lat": 64.16221, "lon": 42.93387 }, { "lat": 62.06557, "lon": 42.50884 }, { "lat": 60.6419, "lon": 28.04393 }], [{ "lat": 71.11371, "lon": 36.76841 }], [{ "lat": 50.45426, "lon": 74.13829 }, { "lat": 43.93052, "lon": 75.18554 }, { "lat": 42.73067, "lon": 77.51613 }, { "lat": 50.69366, "lon": 79.70124 }, { "lat": 45.87621, "lon": 80.49511 }, { "lat": 50.82375, "lon": 81.85476 }, { "lat": 55.81176, "lon": 79.99564 }, { "lat": 48.38132, "lon": 87.54698 }, { "lat": 55.85805, "lon": 74.79194 }, { "lat": 54.79784, "lon": 77.83039 }, { "lat": 55.82539, "lon": 91.51234 }, { "lat": 53.94637, "lon": 94.89695 }, { "lat": 50.12918, "lon": 90.42608 }, { "lat": 46.19611, "lon": 93.07747 }, { "lat": 43.55485, "lon": 94.80512 }, { "lat": 44.46934, "lon": 90.8308 }, { "lat": 52.30412, "lon": 91.91329 }, { "lat": 39.65808, "lon": 76.50468 }, { "lat": 36.84779, "lon": 74.18363 }, { "lat": 31.83407, "lon": 75.28551 }, { "lat": 28.96499, "lon": 76.21862 }, { "lat": 30.64458, "lon": 79.94203 }, { "lat": 29.00438, "lon": 81.32986 }, { "lat": 38.89983, "lon": 77.0993 }, { "lat": 29.9595, "lon": 89.5232 }, { "lat": 28.83384, "lon": 93.22899 }, { "lat": 31.24996, "lon": 95.35323 }, { "lat": 34.06714, "lon": 96.02281 }, { "lat": 36.53782, "lon": 95.0704 }, { "lat": 37.2598, "lon": 95.30711 }, { "lat": 38.61332, "lon": 95.99618 }, { "lat": 39.48484, "lon": 93.28061 }], [{ "lat": 46.82475, "lon": 46.18723 }, { "lat": 43.36825, "lon": 45.45235 }, { "lat": 48.37768, "lon": 46.87732 }, { "lat": 53.56164, "lon": 51.4222 }, { "lat": 54.87563, "lon": 52.88535 }, { "lat": 53.15597, "lon": 54.81677 }, { "lat": 49.23124, "lon": 56.34474 }, { "lat": 43.38338, "lon": 55.48891 }, { "lat": 44.16174, "lon": 47.10793 }, { "lat": 54.91355, "lon": 57.30752 }, { "lat": 37.36802, "lon": 45.26711 }, { "lat": 31.68571, "lon": 46.01524 }, { "lat": 31.05507, "lon": 49.61641 }, { "lat": 27.91186, "lon": 53.98468 }, { "lat": 27.95224, "lon": 58.13773 }, { "lat": 34.10162, "lon": 58.13757 }, { "lat": 39.7136, "lon": 55.70935 }, { "lat": 41.73238, "lon": 54.69288 }, { "lat": 32.81312, "lon": 53.03703 }, { "lat": 31.7266, "lon": 60.16003 }, { "lat": 31.4291, "lon": 66.04755 }, { "lat": 37.20944, "lon": 68.32584 }, { "lat": 40.89779, "lon": 67.68755 }, { "lat": 40.11226, "lon": 60.74096 }, { "lat": 29.85914, "lon": 71.84824 }, { "lat": 49.56938, "lon": 63.1254 }, { "lat": 48.07092, "lon": 68.26508 }, { "lat": 50.18708, "lon": 72.02502 }, { "lat": 55.32206, "lon": 68.63744 }, { "lat": 56.2082, "lon": 72.06376 }, { "lat": 53.87116, "lon": 61.58462 }, { "lat": 51.47551, "lon": 59.86411 }, { "lat": 48.10218, "lon": 60.26043 }, { "lat": 43.07451, "lon": 68.55731 }], [{ "lat": 30.45865, "lon": 1.984647 }, { "lat": 33.2783, "lon": 2.906494 }, { "lat": 36.80313, "lon": 11.7318 }, { "lat": 33.06562, "lon": 12.04762 }, { "lat": 28.48434, "lon": 5.536013 }, { "lat": 29.9387, "lon": 10.31494 }, { "lat": 31.47616, "lon": 14.31575 }, { "lat": 28.70827, "lon": 14.28873 }, { "lat": 40.82811, "lon": 13.75857 }, { "lat": 35.45806, "lon": 13.65958 }, { "lat": 41.88846, "lon": 8.467566 }, { "lat": 44.41968, "lon": 8.276327 }, { "lat": 43.74099, "lon": 12.43675 }, { "lat": 50.08169, "lon": 12.61745 }, { "lat": 50.13762, "lon": 9.17727 }, { "lat": 49.48386, "lon": 6.996986 }, { "lat": 54.38226, "lon": 13.23032 }, { "lat": 55.56115, "lon": 8.293298 }, { "lat": 56.30579, "lon": 14.43653 }, { "lat": 50.80678, "lon": 12.88555 }, { "lat": 30.0114, "lon": 21.93218 }, { "lat": 37.24478, "lon": 21.28057 }, { "lat": 41.32672, "lon": 19.27259 }, { "lat": 39.44095, "lon": 24.62779 }, { "lat": 35.10864, "lon": 26.90424 }, { "lat": 35.48514, "lon": 18.07973 }, { "lat": 31.29511, "lon": 18.64832 }, { "lat": 28.13246, "lon": 24.43252 }, { "lat": 29.86616, "lon": 27.98499 }, { "lat": 32.62686, "lon": 20.83144 }, { "lat": 45.78249, "lon": 21.45529 }, { "lat": 52.43758, "lon": 19.91725 }, { "lat": 54.41323, "lon": 18.17369 }, { "lat": 49.42974, "lon": 16.41842 }, { "lat": 51.35537, "lon": 23.68321 }, { "lat": 50.51911, "lon": 26.26608 }, { "lat": 43.21829, "lon": 26.5211 }, { "lat": 46.46372, "lon": 17.80397 }, { "lat": 47.87203, "lon": 26.2048 }, { "lat": 40.87299, "lon": 38.61411 }, { "lat": 40.48114, "lon": 35.73533 }, { "lat": 39.29483, "lon": 30.84438 }, { "lat": 34.27579, "lon": 30.6994 }, { "lat": 30.31077, "lon": 29.94459 }, { "lat": 30.87446, "lon": 38.53309 }, { "lat": 29.06374, "lon": 40.67941 }, { "lat": 33.75138, "lon": 43.33005 }, { "lat": 40.37568, "lon": 43.62066 }, { "lat": 36.29277, "lon": 38.27237 }, { "lat": 44.9184, "lon": 38.83366 }, { "lat": 44.64414, "lon": 42.05017 }, { "lat": 42.61076, "lon": 41.48336 }, { "lat": 51.73577, "lon": 38.08723 }, { "lat": 54.45424, "lon": 41.41279 }, { "lat": 56.68862, "lon": 38.94291 }, { "lat": 55.93086, "lon": 35.4329 }, { "lat": 56.75647, "lon": 32.80771 }], [{ "lat": 74.30769, "lon": 35.82294 }], [{ "lat": 98.36818, "lon": 49.2983 }, { "lat": 93.0599, "lon": 49.49731 }, { "lat": 88.76578, "lon": 55.64359 }, { "lat": 94.50153, "lon": 58.32411 }, { "lat": 97.30391, "lon": 58.16849 }, { "lat": 87.33741, "lon": 45.05572 }, { "lat": 90.08905, "lon": 53.78851 }, { "lat": 94.03818, "lon": 71.57199 }, { "lat": 91.09353, "lon": 64.4628 }, { "lat": 92.28585, "lon": 68.22747 }, { "lat": 89.23507, "lon": 67.67776 }, { "lat": 88.35011, "lon": 71.72562 }, { "lat": 89.81223, "lon": 70.81958 }, { "lat": 85.85643, "lon": 66.06138 }, { "lat": 84.27855, "lon": 71.43758 }, { "lat": 82.29158, "lon": 67.27421 }, { "lat": 77.37501, "lon": 68.93484 }, { "lat": 77.55709, "lon": 70.57308 }, { "lat": 75.25163, "lon": 71.25191 }, { "lat": 74.8325, "lon": 65.5568 }, { "lat": 76.99275, "lon": 63.69327 }, { "lat": 78.74353, "lon": 61.31728 }, { "lat": 72.75082, "lon": 61.18627 }, { "lat": 72.46915, "lon": 71.37605 }, { "lat": 67.4742, "lon": 68.4177 }, { "lat": 70.57641, "lon": 72.78166 }, { "lat": 67.07308, "lon": 73.23714 }, { "lat": 65.20037, "lon": 69.98514 }, { "lat": 64.53503, "lon": 64.56646 }, { "lat": 65.07584, "lon": 61.86806 }, { "lat": 58.60583, "lon": 72.84769 }, { "lat": 59.06907, "lon": 63.08069 }, { "lat": 59.40339, "lon": 59.71616 }, { "lat": 66.68791, "lon": 59.89071 }, { "lat": 70.01844, "lon": 63.36086 }, { "lat": 70.56124, "lon": 62.11822 }, { "lat": 70.5158, "lon": 59.7839 }, { "lat": 81.64625, "lon": 58.09325 }, { "lat": 80.59383, "lon": 58.57488 }, { "lat": 77.78612, "lon": 56.34263 }, { "lat": 76.72932, "lon": 52.41206 }, { "lat": 77.56294, "lon": 49.58853 }, { "lat": 72.6336, "lon": 52.45113 }, { "lat": 72.16447, "lon": 57.20223 }, { "lat": 73.83785, "lon": 57.905 }, { "lat": 75.007, "lon": 58.8237 }, { "lat": 84.86214, "lon": 54.93019 }, { "lat": 93.44173, "lon": 50.72248 }, { "lat": 69.07863, "lon": 57.80942 }, { "lat": 67.19171, "lon": 57.73684 }, { "lat": 67.10835, "lon": 50.34832 }, { "lat": 65.5796, "lon": 54.02144 }, { "lat": 62.23147, "lon": 45.68147 }, { "lat": 71.20039, "lon": 46.68384 }, { "lat": 60.50887, "lon": 57.17685 }, { "lat": 59.0228, "lon": 58.46576 }], [{ "lat": 47.37207, "lon": 87.9472 }], [{ "lat": 35.04105, "lon": 52.25463 }], [{ "lat": 67.06041, "lon": 89.18638 }], [{ "lat": 35.03076, "lon": 51.3279 }], [{ "lat": 48.36902, "lon": 91.65801 }], [{ "lat": 47.78096, "lon": 87.9907 }], [{ "lat": 72.2583, "lon": 36.57885 }], [{ "lat": 48.14048, "lon": 55.70063 }, { "lat": 35.73671, "lon": 61.88152 }, { "lat": 37.80344, "lon": 59.75179 }, { "lat": 49.06663, "lon": 56.4979 }, { "lat": 39.96358, "lon": 57.53624 }, { "lat": 41.89982, "lon": 58.94891 }, { "lat": 44.67968, "lon": 59.32336 }, { "lat": 46.67828, "lon": 58.66087 }, { "lat": 44.68348, "lon": 58.42085 }, { "lat": 47.81453, "lon": 58.03282 }, { "lat": 36.81499, "lon": 61.05803 }, { "lat": 40.69569, "lon": 59.37859 }, { "lat": 47.4036, "lon": 59.50909 }, { "lat": 37.56802, "lon": 61.715 }, { "lat": 38.57643, "lon": 58.13889 }]], "oil_veins": [{ "x": -273640, "y": 1300, "z": -4890, "lat": 50.1593, "lon": 16.4698 }, { "x": -258500, "y": -3540, "z": -3670, "lat": 49.56623, "lon": 18.32496 }, { "x": -267940, "y": -6680, "z": -5030, "lat": 49.18147, "lon": 17.16824 }, { "x": -267780, "y": 7070, "z": -5060, "lat": 50.86632, "lon": 17.18785 }, { "x": 109442, "y": -14431, "z": 3657, "lat": 48.23171, "lon": 63.41037 }, { "x": 218528, "y": 69912, "z": -4526, "lat": 58.5666, "lon": 76.77711 }, { "x": 277278, "y": 132491, "z": -2066, "lat": 66.23465, "lon": 83.97599 }, { "x": 273000, "y": 110689, "z": -3404, "lat": 63.56317, "lon": 83.45179 }, { "x": 280276, "y": 148801, "z": -1850, "lat": 68.23318, "lon": 84.34334 }, { "x": 245632, "y": 131862, "z": -11273, "lat": 66.15758, "lon": 80.09827 }, { "x": -303443.2, "y": -128577.7, "z": -5588, "lat": 34.24486, "lon": 12.81789 }, { "x": -316715, "y": -98044, "z": -4201, "lat": 37.98628, "lon": 11.19164 }, { "x": -76541, "y": -172503, "z": 9639, "lat": 28.86252, "lon": 40.62113 }, { "x": -78276, "y": -125892, "z": 2794, "lat": 34.57395, "lon": 40.40853 }, { "x": -77389, "y": -173405, "z": 9638, "lat": 28.75199, "lon": 40.51722 }, { "x": -91, "y": -161523, "z": 3233, "lat": 30.20794, "lon": 49.98885 }, { "x": 240233, "y": -156951, "z": -4257, "lat": 30.76817, "lon": 79.43671 }, { "x": 246239, "y": -156396, "z": -4255, "lat": 30.83617, "lon": 80.17265 }, { "x": 253203, "y": -168385, "z": -2093, "lat": 29.36711, "lon": 81.02598 }, { "x": -12267, "y": -108697, "z": 5699, "lat": 36.68092, "lon": 48.49688 }, { "x": 221148.6, "y": -90606.32, "z": 2291.006, "lat": 38.89765, "lon": 77.09823 }, { "x": 108358, "y": -14158, "z": 3658, "lat": 48.26517, "lon": 63.27754 }, { "x": -292774, "y": -87706, "z": -5586, "lat": 39.25303, "lon": 14.12523 }, { "x": -273530, "y": -52322, "z": -8013, "lat": 43.58878, "lon": 16.48327 }, { "x": -377020, "y": -373380, "z": 19630, "lat": 4.248254, "lon": 3.80223 }, { "x": 382930, "y": -335640, "z": 2980, "lat": 8.872687, "lon": 96.92195 }, { "x": 157740, "y": -309790, "z": 4700, "lat": 12.04019, "lon": 69.32852 }, { "x": -331550, "y": -189360, "z": 10250, "lat": 26.79696, "lon": 9.373852 }, { "x": 78900, "y": -254270, "z": -6040, "lat": 18.84328, "lon": 59.66793 }, { "x": -267620, "y": 7700, "z": 10610, "lat": 50.94351, "lon": 17.20745 }, { "x": -101440, "y": -346840, "z": 8020, "lat": 7.500307, "lon": 37.57015 }, { "x": -162120, "y": -121210, "z": -6440, "lat": 35.14765, "lon": 30.13479 }, { "x": -266850, "y": -5090, "z": 10250, "lat": 49.3763, "lon": 17.3018 }, { "x": -248290, "y": 40690, "z": 10410, "lat": 54.98591, "lon": 19.57603 }, { "x": -333380, "y": -175360, "z": 10320, "lat": 28.51244, "lon": 9.149614 }, { "x": 350930, "y": -360760, "z": 8260, "lat": 5.794633, "lon": 93.00086 }, { "x": -280770, "y": -95390, "z": -4820, "lat": 38.31148, "lon": 15.59613 }, { "x": 115900, "y": -290820, "z": -2790, "lat": 14.36466, "lon": 64.20169 }, { "x": -19680, "y": -270130, "z": 5140, "lat": 16.89989, "lon": 47.58853 }, { "x": -312470, "y": -348310, "z": 12940, "lat": 7.320182, "lon": 11.7118 }, { "x": -116320, "y": -354170, "z": 7410, "lat": 6.602132, "lon": 35.74685 }, { "x": -46290, "y": -347810, "z": 3590, "lat": 7.381449, "lon": 44.3279 }, { "x": -209120, "y": -197610, "z": -11970, "lat": 25.78606, "lon": 24.37569 }, { "x": -181310, "y": -160620, "z": -4510, "lat": 30.31859, "lon": 27.78336 }], "water_veins": [{ "x": 19771, "y": 40431, "z": -11045, "lat": 54.95417, "lon": 52.42262 }, { "x": 207868, "y": -117487, "z": -4842, "lat": 35.60385, "lon": 75.4709 }, { "x": -32821, "y": -31064, "z": -7011, "lat": 46.19361, "lon": 45.97831 }], "wyvern_nests": [{ "x": 260499.8, "y": -299494.8, "z": -20771.22, "lat": 13.3017, "lon": 81.92009 }, { "x": 227584.2, "y": -307242.9, "z": -22773.85, "lat": 12.3523, "lon": 77.88681 }, { "x": 210566, "y": -290066.2, "z": -29236, "lat": 14.45703, "lon": 75.8015 }, { "x": 207584, "y": -285905.1, "z": -22091.69, "lat": 14.9669, "lon": 75.4361 }, { "x": 204343.5, "y": -300917.6, "z": -30660.68, "lat": 13.12736, "lon": 75.03903 }, { "x": 188150.9, "y": -311684.8, "z": -33415.81, "lat": 11.80801, "lon": 73.05489 }, { "x": 176258, "y": -317872.8, "z": -43013.33, "lat": 11.04977, "lon": 71.5976 }, { "x": 188231.1, "y": -282928.5, "z": -38519.48, "lat": 15.33164, "lon": 73.06471 }, { "x": 176767.8, "y": -274065.4, "z": -37285.05, "lat": 16.41767, "lon": 71.66007 }, { "x": 158340.4, "y": -308231.6, "z": -37855.13, "lat": 12.23115, "lon": 69.40209 }, { "x": 164027, "y": -293305, "z": -42347.34, "lat": 14.06016, "lon": 70.09889 }], "ice_wyvern_nests": [{ "x": 180273, "y": -329536, "z": -3055.818, "lat": 9.620635, "lon": 72.08957 }, { "x": 182147, "y": -330577, "z": -7336.78, "lat": 9.493077, "lon": 72.3192 }, { "x": 191192, "y": -334870, "z": -3891.546, "lat": 8.967039, "lon": 73.42752 }, { "x": 211391, "y": -336113, "z": -1212.37, "lat": 8.814729, "lon": 75.90259 }, { "x": 221332, "y": -337762, "z": -6596.858, "lat": 8.61267, "lon": 77.1207 }, { "x": 228350, "y": -335524, "z": -7259.544, "lat": 8.886901, "lon": 77.98064 }, { "x": 230545, "y": -345331, "z": -3188.101, "lat": 7.68521, "lon": 78.2496 }, { "x": 219036, "y": -347508, "z": -7173.388, "lat": 7.418454, "lon": 76.83936 }, { "x": 213999, "y": -346576, "z": -2392.148, "lat": 7.532656, "lon": 76.22216 }, { "x": 190175.9, "y": -344937.4, "z": -292.739, "lat": 7.73344, "lon": 73.30302 }, { "x": 183324.2, "y": -342863.8, "z": -7659.627, "lat": 7.987526, "lon": 72.46345 }], "gas_veins": [{ "x": 236680.5, "y": -111051.4, "z": -54212.04, "lat": 36.39243, "lon": 79.00141 }, { "x": 171646.5, "y": -179409.3, "z": -63864.97, "lat": 28.01626, "lon": 71.03253 }, { "x": 232774.3, "y": -256926.6, "z": -46334.99, "lat": 18.51776, "lon": 78.52277 }, { "x": 200347, "y": -246355.8, "z": -46523.19, "lat": 19.81304, "lon": 74.54932 }, { "x": 341770.1, "y": -229832.6, "z": -44441.71, "lat": 21.83769, "lon": 91.87846 }, { "x": 137538, "y": -47077.28, "z": -48351.12, "lat": 44.23143, "lon": 66.85308 }, { "x": 184884.2, "y": -46746.39, "z": -48334.33, "lat": 44.27198, "lon": 72.6546 }, { "x": 184079.4, "y": -155746.4, "z": -42818.95, "lat": 30.91577, "lon": 72.55599 }, { "x": 272902.6, "y": -133970.6, "z": -54846.02, "lat": 33.58405, "lon": 83.43985 }, { "x": 184202.3, "y": -148948.9, "z": -42808.54, "lat": 31.7487, "lon": 72.57105 }, { "x": 261981.7, "y": -129892.3, "z": -43024.71, "lat": 34.08378, "lon": 82.10167 }, { "x": 311518.7, "y": -125837.2, "z": -39935.38, "lat": 34.58067, "lon": 88.17164 }, { "x": 156401.1, "y": -22385.36, "z": -63017.98, "lat": 47.25703, "lon": 69.16445 }, { "x": 138442.2, "y": -73668.93, "z": -62596.8, "lat": 40.97305, "lon": 66.96388 }, { "x": 262528.7, "y": -130061.3, "z": -43024.71, "lat": 34.06307, "lon": 82.1687 }, { "x": 282148.6, "y": -134153.6, "z": -54842.02, "lat": 33.56162, "lon": 84.5728 }, { "x": 271930.6, "y": -134153.6, "z": -54852.02, "lat": 33.56162, "lon": 83.32075 }, { "x": 271938.6, "y": -133520.6, "z": -54856.02, "lat": 33.63919, "lon": 83.32173 }, { "x": 136734, "y": -47380.28, "z": -48351.12, "lat": 44.19431, "lon": 66.75457 }, { "x": 99431.97, "y": -192132.5, "z": -50821.74, "lat": 26.45724, "lon": 62.1838 }, { "x": 96820.97, "y": -192969.5, "z": -50965.74, "lat": 26.35468, "lon": 61.86386 }, { "x": 136740.8, "y": -183551.8, "z": -64006.61, "lat": 27.50866, "lon": 66.7554 }, { "x": 136349.8, "y": -184707.8, "z": -64002.09, "lat": 27.36701, "lon": 66.70749 }, { "x": 137268, "y": -48039.28, "z": -48351.12, "lat": 44.11356, "lon": 66.82 }, { "x": 155966.5, "y": -239716.6, "z": -45551.05, "lat": 20.62657, "lon": 69.1112 }, { "x": 156096.5, "y": -240289.6, "z": -45551.05, "lat": 20.55635, "lon": 69.12713 }, { "x": 154913.5, "y": -239948.6, "z": -45551.05, "lat": 20.59814, "lon": 68.98217 }, { "x": 308451.7, "y": -222309.8, "z": -45291.49, "lat": 22.75949, "lon": 87.79582 }, { "x": 307818.7, "y": -223046.8, "z": -45291.49, "lat": 22.66918, "lon": 87.71826 }, { "x": 307520.7, "y": -222136.8, "z": -45291.49, "lat": 22.78069, "lon": 87.68175 }, { "x": 245827.9, "y": -123753.5, "z": -42298.98, "lat": 34.83599, "lon": 80.12228 }, { "x": 246412.9, "y": -123323.5, "z": -42336.98, "lat": 34.88868, "lon": 80.19396 }, { "x": 245729.9, "y": -122607.5, "z": -42367.98, "lat": 34.97641, "lon": 80.11027 }, { "x": 250733.5, "y": -187106.8, "z": -58259.29, "lat": 27.07306, "lon": 80.72338 }, { "x": 252023.5, "y": -186119.8, "z": -58259.29, "lat": 27.194, "lon": 80.88145 }, { "x": 255851.9, "y": -176116.2, "z": -58259.96, "lat": 28.41978, "lon": 81.35056 }, { "x": 185414.2, "y": -45595.39, "z": -48334.33, "lat": 44.41302, "lon": 72.71955 }, { "x": 254335.9, "y": -173943.2, "z": -58257.96, "lat": 28.68604, "lon": 81.1648 }, { "x": 286937.7, "y": -168660, "z": -56229.62, "lat": 29.33342, "lon": 85.15963 }, { "x": 176158, "y": -193347.2, "z": -63957.05, "lat": 26.30839, "lon": 71.58535 }, { "x": 178531, "y": -191337.2, "z": -63961.05, "lat": 26.55469, "lon": 71.87612 }, { "x": 184703.2, "y": -45142.39, "z": -48334.33, "lat": 44.46852, "lon": 72.63242 }, { "x": 232501.3, "y": -254186.6, "z": -46318.99, "lat": 18.8535, "lon": 78.48932 }, { "x": 199119.9, "y": -19814.07, "z": -65408.11, "lat": 47.5721, "lon": 74.39896 }, { "x": 182939.6, "y": -11956.95, "z": -65602.27, "lat": 48.53487, "lon": 72.41632 }, { "x": 183926.6, "y": -11740.95, "z": -65602.27, "lat": 48.56134, "lon": 72.53726 }, { "x": 155552.1, "y": -22499.36, "z": -63003.98, "lat": 47.24306, "lon": 69.06042 }, { "x": 139242.2, "y": -70695.93, "z": -62720.8, "lat": 41.33735, "lon": 67.06191 }, { "x": 185564.4, "y": -154431.4, "z": -42817.95, "lat": 31.0769, "lon": 72.73795 }, { "x": 186486.4, "y": -155316.4, "z": -42817.95, "lat": 30.96846, "lon": 72.85093 }, { "x": 183592.3, "y": -149180.9, "z": -42807.54, "lat": 31.72027, "lon": 72.4963 }, { "x": 183253.3, "y": -148785.9, "z": -42807.54, "lat": 31.76867, "lon": 72.45476 }, { "x": 262352.7, "y": -129457.3, "z": -43022.71, "lat": 34.13708, "lon": 82.14713 }], "deinonychus_nests": [{ "x": 301284.1, "y": 333369.3, "z": 15494.07, "lat": 90.84908, "lon": 86.91755 }, { "x": 309103.1, "y": 336811.3, "z": 16277.07, "lat": 91.27084, "lon": 87.87564 }, { "x": 305716.1, "y": 336908.3, "z": 16052.07, "lat": 91.28273, "lon": 87.46062 }, { "x": 305468.1, "y": 333313.3, "z": 16130.07, "lat": 90.84222, "lon": 87.43023 }, { "x": 306482.1, "y": 330825.3, "z": 16104.07, "lat": 90.53735, "lon": 87.55448 }, { "x": 317761.2, "y": 327468.6, "z": 15498.56, "lat": 90.12604, "lon": 88.93655 }, { "x": 320054.2, "y": 327310.6, "z": 15505.56, "lat": 90.10668, "lon": 89.21753 }, { "x": 322142.2, "y": 326428.6, "z": 15461.56, "lat": 89.99861, "lon": 89.47338 }, { "x": 323768.2, "y": 323790.6, "z": 15200.56, "lat": 89.67536, "lon": 89.67262 }, { "x": 235326.7, "y": 372512.3, "z": 30334.61, "lat": 95.64543, "lon": 78.83552 }, { "x": 254887.1, "y": 370605.7, "z": 30405.61, "lat": 95.4118, "lon": 81.23234 }, { "x": 255573.1, "y": 376632.7, "z": 30048.73, "lat": 96.15032, "lon": 81.3164 }, { "x": 317898.1, "y": 363490.7, "z": 23038.73, "lat": 94.53997, "lon": 88.95333 }, { "x": 313165.8, "y": 365479, "z": 23059.73, "lat": 94.78361, "lon": 88.37346 }, { "x": 333434.8, "y": 344362, "z": 16338.73, "lat": 92.19606, "lon": 90.8571 }, { "x": 338833.8, "y": 342381, "z": 16843.73, "lat": 91.95332, "lon": 91.51866 }, { "x": 109405.5, "y": 167033.8, "z": -11376.58, "lat": 70.46732, "lon": 63.4059 }, { "x": 107319.5, "y": 161329.8, "z": -11393.58, "lat": 69.76839, "lon": 63.15029 }, { "x": 112226.5, "y": 166361.8, "z": -11403.58, "lat": 70.38498, "lon": 63.75156 }, { "x": 241254.5, "y": 339243.3, "z": 5628.066, "lat": 91.56884, "lon": 79.56188 }, { "x": 236719.6, "y": 342517.3, "z": 5777.066, "lat": 91.97002, "lon": 79.0062 }, { "x": 233641.3, "y": 341233.7, "z": 5821.066, "lat": 91.81273, "lon": 78.62901 }, { "x": 219511.8, "y": 318075.9, "z": 5839.066, "lat": 88.97512, "lon": 76.89766 }, { "x": 219830.8, "y": 326895.9, "z": 5697.066, "lat": 90.05587, "lon": 76.93675 }, { "x": 216703.5, "y": 321500.2, "z": 5800.066, "lat": 89.39471, "lon": 76.55355 }, { "x": 336769.7, "y": 255788.2, "z": 11930.35, "lat": 81.34275, "lon": 91.26574 }, { "x": 332521.2, "y": 249980.2, "z": 11837.35, "lat": 80.63108, "lon": 90.74516 }, { "x": 332239.2, "y": 255612.2, "z": 11997.35, "lat": 81.32119, "lon": 90.7106 }, { "x": 328031.2, "y": 251902.2, "z": 11897.35, "lat": 80.86659, "lon": 90.19498 }, { "x": 325479.2, "y": 248233.2, "z": 11921.35, "lat": 80.41701, "lon": 89.88227 }, { "x": 371326.4, "y": 262815.8, "z": 10613.24, "lat": 82.20387, "lon": 95.50011 }, { "x": 367811.4, "y": 264015.8, "z": 10596.24, "lat": 82.35092, "lon": 95.06941 }, { "x": 369708.4, "y": 271418.2, "z": 10614.31, "lat": 83.25796, "lon": 95.30185 }, { "x": 368071.4, "y": 271885.2, "z": 10624.31, "lat": 83.31518, "lon": 95.10126 }, { "x": 364609.4, "y": 271161.2, "z": 10599.31, "lat": 83.22647, "lon": 94.67705 }, { "x": 309651.7, "y": 219223.1, "z": -2261.711, "lat": 76.86229, "lon": 87.94287 }, { "x": 315013.2, "y": 220786, "z": -2282.711, "lat": 77.05379, "lon": 88.59983 }, { "x": 305829.2, "y": 227578.8, "z": -1725.711, "lat": 77.88614, "lon": 87.47448 }, { "x": 286024.2, "y": 275022.8, "z": 13120.29, "lat": 83.69965, "lon": 85.04769 }, { "x": 291067.2, "y": 276215.8, "z": 13183.29, "lat": 83.84583, "lon": 85.66563 }, { "x": 299884, "y": 283100.2, "z": 13131.29, "lat": 84.6894, "lon": 86.74599 }, { "x": 291641.2, "y": 284557.1, "z": 13165.4, "lat": 84.86792, "lon": 85.73597 }, { "x": 289699.2, "y": 289423.1, "z": 13141.4, "lat": 85.46417, "lon": 85.49801 }, { "x": 291684.2, "y": 291683.1, "z": 13137.4, "lat": 85.7411, "lon": 85.74124 }, { "x": 300494.2, "y": 287718.1, "z": 13186.4, "lat": 85.25525, "lon": 86.82076 }, { "x": 338174.8, "y": 144198.2, "z": 7961.683, "lat": 67.66918, "lon": 91.43791 }, { "x": 338605.8, "y": 141554.2, "z": 7991.683, "lat": 67.3452, "lon": 91.49073 }, { "x": 341194.8, "y": 145262.2, "z": 8027.683, "lat": 67.79956, "lon": 91.80797 }, { "x": 347893.8, "y": 141994.2, "z": 7920.683, "lat": 67.39912, "lon": 92.62882 }, { "x": 343647.8, "y": 147032.2, "z": 8030.683, "lat": 68.01645, "lon": 92.10854 }, { "x": 347040.8, "y": 147259.2, "z": 7884.683, "lat": 68.04426, "lon": 92.5243 }, { "x": 346278.2, "y": 151620.4, "z": 7911.683, "lat": 68.57866, "lon": 92.43086 }, { "x": 246864.2, "y": 192940.4, "z": -13252.32, "lat": 73.64176, "lon": 80.24926 }, { "x": 176777.2, "y": 207534, "z": 6337.683, "lat": 75.42997, "lon": 71.66122 }, { "x": 184629, "y": 234383.7, "z": 5527.689, "lat": 78.71998, "lon": 72.62333 }, { "x": 241302.2, "y": 195214.4, "z": -13291.32, "lat": 73.9204, "lon": 79.56773 }, { "x": 360075.6, "y": 166609.8, "z": 13358.68, "lat": 70.41537, "lon": 94.12151 }, { "x": 359546.6, "y": 160779.8, "z": 12978.68, "lat": 69.70099, "lon": 94.05669 }, { "x": 364343.6, "y": 166732.8, "z": 13030.68, "lat": 70.43044, "lon": 94.64448 }, { "x": 361893.6, "y": 158186.8, "z": 13023.68, "lat": 69.38326, "lon": 94.34427 }, { "x": 361592.2, "y": 40914.49, "z": 16915.91, "lat": 55.01342, "lon": 94.30734 }, { "x": 360449.2, "y": 38498.49, "z": 16928.91, "lat": 54.71738, "lon": 94.16729 }, { "x": 362918.2, "y": 37787.49, "z": 16902.91, "lat": 54.63025, "lon": 94.46982 }, { "x": 343270.3, "y": 21547.52, "z": 6567.758, "lat": 52.64031, "lon": 92.06229 }, { "x": 343617.8, "y": 24443.18, "z": 6549.758, "lat": 52.99512, "lon": 92.10487 }, { "x": 341147.9, "y": 23969.36, "z": 6563.758, "lat": 52.93706, "lon": 91.80222 }, { "x": 356430.4, "y": 5991.768, "z": 17819.91, "lat": 50.7342, "lon": 93.67485 }, { "x": 357533.4, "y": 3706.768, "z": 17811.91, "lat": 50.45421, "lon": 93.81 }, { "x": 358738.4, "y": 4230.768, "z": 17899.91, "lat": 50.51841, "lon": 93.95766 }, { "x": 116431.4, "y": 216649, "z": -9054.256, "lat": 76.54687, "lon": 64.26681 }, { "x": 110081.7, "y": 220457.3, "z": -11406.27, "lat": 77.01352, "lon": 63.48875 }, { "x": 108697.7, "y": 222862.3, "z": -11438.27, "lat": 77.30821, "lon": 63.31917 }, { "x": 111980.7, "y": 216264.3, "z": -11389.27, "lat": 76.49973, "lon": 63.72145 }, { "x": 141472, "y": 206878.4, "z": -11395.26, "lat": 75.34964, "lon": 67.33513 }, { "x": 106537, "y": 197282.4, "z": -9819.256, "lat": 74.1738, "lon": 63.05441 }, { "x": 146009, "y": 207676.4, "z": -9831.256, "lat": 75.44742, "lon": 67.89107 }, { "x": 140239, "y": 208896.4, "z": -11406.26, "lat": 75.59691, "lon": 67.18405 }, { "x": 113111.7, "y": 183378.4, "z": -10114.27, "lat": 72.47009, "lon": 63.86003 }, { "x": 122621.7, "y": 190778.4, "z": -10804.27, "lat": 73.37684, "lon": 65.02533 }, { "x": 121242.7, "y": 185470.4, "z": -10545.27, "lat": 72.72643, "lon": 64.85636 }, { "x": 112835.7, "y": 189776.4, "z": -10106.27, "lat": 73.25406, "lon": 63.82621 }, { "x": 234679.9, "y": -20621.3, "z": -13026.28, "lat": 47.47319, "lon": 78.75627 }, { "x": 232563.7, "y": -21017.3, "z": -13164.28, "lat": 47.42467, "lon": 78.49696 }, { "x": 234235.2, "y": -22984.51, "z": -12922.28, "lat": 47.18362, "lon": 78.70178 }, { "x": 237493.5, "y": -22919.12, "z": -12844.28, "lat": 47.19163, "lon": 79.10103 }, { "x": 170985.8, "y": 182551.5, "z": -6194.51, "lat": 72.36877, "lon": 70.95158 }, { "x": 170738.8, "y": 180744.5, "z": -6125.51, "lat": 72.14735, "lon": 70.92131 }, { "x": 170385.8, "y": 177717.5, "z": -6194.51, "lat": 71.77644, "lon": 70.87806 }, { "x": 229973.2, "y": 73579.54, "z": -4492.911, "lat": 59.016, "lon": 78.17954 }, { "x": 231776.5, "y": 73001.54, "z": -4500.911, "lat": 58.94517, "lon": 78.4005 }, { "x": 233293.7, "y": 69570.33, "z": -4451.911, "lat": 58.52473, "lon": 78.58641 }, { "x": 85254.39, "y": 187957.6, "z": -3929.564, "lat": 73.0312, "lon": 60.44656 }, { "x": 86705.39, "y": 185331.6, "z": -3929.564, "lat": 72.70943, "lon": 60.62436 }, { "x": 89986.39, "y": 188157.6, "z": -3911.564, "lat": 73.05571, "lon": 61.02639 }], "charge_nodes": null, "plant_z_nodes": null, "drake_nests": null, "glitches": null, "magmasaur_nests": null, "poison_trees": null, "mutagen_bulbs": null, "carniflora": null, "notes": null, "img": "https://static.wikia.nocookie.net/arksurvivalevolved_gamepedia/images/1/19/Valguero_Map.jpg" }
export const Failure = ({ error }: CellFailureProps) => {
  // return <div className="rw-cell-error">{error?.message}</div>;
  return <Map map={map} />;
};

export const Success = ({ map }: CellSuccessProps<FindMapById>) => {
  return <Map map={map} />;
};
