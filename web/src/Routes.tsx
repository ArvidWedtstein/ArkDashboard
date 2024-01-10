// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route, Private } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout';

import MainLayout from "src/layouts/MainLayout/MainLayout";

import { useAuth } from "./auth";

const Routes = () => {
  return (
    <Router useAuth={useAuth} pageLoadingDelay={0}>
      <Set wrap={MainLayout}>
        {/*whileLoadingPage*/}
        <Route path="/terms" page={TermsPage} name="terms" />
        <Route
          path="/material-calculator"
          page={MaterialCalculatorPage}
          name="materialCalculator"
        />
        <Route path="/" page={HomePage} name="home" />

        <Route path="/gtw" page={GTWPage} name="gtw" />

        <Private unauthenticated="home">
          <Route path="/admin" page={AdminPage} name="admin" />
        </Private>
        <Route path="/signin" page={SigninPage} name="signin" />
        <Route path="/signup" page={SignupPage} name="signup" />
        <Route
          path="/forgot-password"
          page={ForgotPasswordPage}
          name="forgotPassword"
        />
        <Route
          path="/reset-password"
          page={ResetPasswordPage}
          name="resetPassword"
        />
        <Route notfound page={NotFoundPage} />
        <Set
          wrap={ScaffoldLayout}
          title="TimelineSeasons"
          titleTo="timelineSeasons"
          buttonLabel="New TimelineSeason"
          buttonTo="newTimelineSeason"
        >
          <Route
            path="/timeline-seasons/new"
            page={TimelineSeasonNewTimelineSeasonPage}
            name="newTimelineSeason"
          />
          <Route
            path="/timeline-seasons/{id}/edit"
            page={TimelineSeasonEditTimelineSeasonPage}
            name="editTimelineSeason"
          />
          <Route
            path="/timeline-seasons/{id}"
            page={TimelineSeasonTimelineSeasonPage}
            name="timelineSeason"
          />
          <Route
            path="/timeline-seasons"
            page={TimelineSeasonTimelineSeasonsPage}
            name="timelineSeasons"
          />
        </Set>
        <Set
          wrap={ScaffoldLayout}
          title="TimelineSeasonBasespots"
          titleTo="timelineSeasonBasespots"
          buttonLabel="New TimelineSeasonBasespot"
          buttonTo="newTimelineSeasonBasespot"
          unauthenticated="home"
        >
          <Private unauthenticated="home">
            <Route
              path="/timeline-season-basespots/new"
              page={TimelineSeasonBasespotNewTimelineSeasonBasespotPage}
              name="newTimelineSeasonBasespot"
            />
            <Route
              path="/timeline-season-basespots/{id:Int}/edit"
              page={TimelineSeasonBasespotEditTimelineSeasonBasespotPage}
              name="editTimelineSeasonBasespot"
            />

            <Route
              path="/timeline-season-basespots/{id:Int}"
              page={TimelineSeasonBasespotTimelineSeasonBasespotPage}
              name="timelineSeasonBasespot"
            />
          </Private>
          <Route
            path="/timeline-season-basespots"
            page={TimelineSeasonBasespotTimelineSeasonBasespotsPage}
            name="timelineSeasonBasespots"
          />
        </Set>

        <Set
          wrap={ScaffoldLayout}
          title="UserRecipes"
          titleTo="userRecipes"
          buttonLabel="New UserRecipe"
          buttonTo="newUserRecipe"
        >
          <Private unauthenticated="home">
            <Route
              path="/user-recipes/new"
              page={UserRecipeNewUserRecipePage}
              name="newUserRecipe"
            />
            <Route
              path="/user-recipes/{id:Int}/edit"
              page={UserRecipeEditUserRecipePage}
              name="editUserRecipe"
            />

            <Route
              path="/user-recipes/{id:Int}"
              page={UserRecipeUserRecipePage}
              name="userRecipe"
            />
          </Private>
        </Set>
        <Set
          wrap={ScaffoldLayout}
          title="Items"
          titleTo="items"
          buttonLabel="New Item"
          buttonTo="newItem"
        >
          <Private
            unauthenticated="home"
            roles="f0c1b8e9-5f27-4430-ad8f-5349f83339c0"
          >
            <Route path="/items/new" page={ItemNewItemPage} name="newItem" />
            <Route
              path="/items/{id:Int}/edit"
              page={ItemEditItemPage}
              name="editItem"
            />
          </Private>
          <Route path="/items/{id:Int}" page={ItemItemPage} name="item" />
          <Route path="/items" page={ItemItemsPage} name="items" />
        </Set>
        <Set
          wrap={ScaffoldLayout}
          title="ItemRecipes"
          titleTo="itemRecipes"
          buttonLabel="New ItemRecipe"
          buttonTo="newItemRecipe"
        >
          <Private
            unauthenticated="home"
            roles="f0c1b8e9-5f27-4430-ad8f-5349f83339c0"
          >
            <Route
              path="/item-recipes/new"
              page={ItemRecipeNewItemRecipePage}
              name="newItemRecipe"
            />
            <Route
              path="/item-recipes/{id:Int}/edit"
              page={ItemRecipeEditItemRecipePage}
              name="editItemRecipe"
            />
          </Private>
          <Route
            path="/item-recipes/{id:Int}"
            page={ItemRecipeItemRecipePage}
            name="itemRecipe"
          />
          <Route
            path="/item-recipes"
            page={ItemRecipeItemRecipesPage}
            name="itemRecipes"
          />
        </Set>
        <Set
          wrap={ScaffoldLayout}
          title="Lootcrates"
          titleTo="lootcrates"
          buttonLabel="New Lootcrate"
          buttonTo="newLootcrate"
        >
          <Private
            unauthenticated="home"
            roles="f0c1b8e9-5f27-4430-ad8f-5349f83339c0"
          >
            <Route
              path="/lootcrates/new"
              page={LootcrateNewLootcratePage}
              name="newLootcrate"
            />
            <Route
              path="/lootcrates/{id:Int}/edit"
              page={LootcrateEditLootcratePage}
              name="editLootcrate"
            />
          </Private>
          <Route
            path="/lootcrates/{id:Int}"
            page={LootcrateLootcratePage}
            name="lootcrate"
          />
          <Route
            path="/lootcrates"
            page={LootcrateLootcratesPage}
            name="lootcrates"
          />
        </Set>
        <Set
          wrap={ScaffoldLayout}
          title="Maps"
          titleTo="maps"
          buttonLabel="New Map"
          buttonTo="newMap"
        >
          <Private
            unauthenticated="home"
            roles="f0c1b8e9-5f27-4430-ad8f-5349f83339c0"
          >
            <Route path="/maps/new" page={MapNewMapPage} name="newMap" />
            <Route
              path="/maps/{id:Int}/edit"
              page={MapEditMapPage}
              name="editMap"
            />
          </Private>
          <Route path="/maps/{id:Int}" page={MapMapPage} name="map" />
          <Route path="/maps" page={MapMapsPage} name="maps" />
        </Set>
        <Set
          wrap={ScaffoldLayout}
          title="MapRegions"
          titleTo="mapRegions"
          buttonLabel="New MapRegion"
          buttonTo="newMapRegion"
        >
          <Private
            unauthenticated="home"
            roles="f0c1b8e9-5f27-4430-ad8f-5349f83339c0"
          >
            <Route
              path="/map-regions/new"
              page={MapRegionNewMapRegionPage}
              name="newMapRegion"
            />
            <Route
              path="/map-regions/{id:Int}/edit"
              page={MapRegionEditMapRegionPage}
              name="editMapRegion"
            />
          </Private>
          <Route
            path="/map-regions/{id:Int}"
            page={MapRegionMapRegionPage}
            name="mapRegion"
          />
          <Route
            path="/map-regions"
            page={MapRegionMapRegionsPage}
            name="mapRegions"
          />
        </Set>
        <Set
          wrap={ScaffoldLayout}
          title="MapResources"
          titleTo="mapResources"
          buttonLabel="New MapResource"
          buttonTo="newMapResource"
        >
          <Private
            unauthenticated="home"
            roles="f0c1b8e9-5f27-4430-ad8f-5349f83339c0"
          >
            <Route
              path="/map-resources/new"
              page={MapResourceNewMapResourcePage}
              name="newMapResource"
            />
            <Route
              path="/map-resources/{id:Int}/edit"
              page={MapResourceEditMapResourcePage}
              name="editMapResource"
            />
          </Private>
          <Route
            path="/map-resources/{id:Int}"
            page={MapResourceMapResourcePage}
            name="mapResource"
          />
          <Route
            path="/map-resources"
            page={MapResourceMapResourcesPage}
            name="mapResources"
          />
        </Set>
        <Set
          wrap={ScaffoldLayout}
          title="Dinos"
          titleTo="dinos"
          buttonLabel="New Dino"
          buttonTo="newDino"
        >
          <Private
            unauthenticated="home"
            roles="f0c1b8e9-5f27-4430-ad8f-5349f83339c0"
          >
            <Route path="/dinos/new" page={DinoNewDinoPage} name="newDino" />
            <Route
              path="/dinos/{id}/edit"
              page={DinoEditDinoPage}
              name="editDino"
            />
          </Private>
          <Route path="/dinos/{id}" page={DinoDinoPage} name="dino" />
          <Route path="/dinos" page={DinoDinosPage} name="dinos" />
        </Set>
        {/* <Set
          wrap={ScaffoldLayout}
          title="DinoStats"
          titleTo="dinoStats"
          buttonLabel="New DinoStat"
          buttonTo="newDinoStat"
        >
          <Route
            path="/dino-stats/new"
            page={DinoStatNewDinoStatPage}
            name="newDinoStat"
          />
          <Route
            path="/dino-stats/{id}/edit"
            page={DinoStatEditDinoStatPage}
            name="editDinoStat"
          />
          <Route
            path="/dino-stats/{id}"
            page={DinoStatDinoStatPage}
            name="dinoStat"
          />
          <Route
            path="/dino-stats"
            page={DinoStatDinoStatsPage}
            name="dinoStats"
          />
        </Set> */}
        <Set
          wrap={ScaffoldLayout}
          title="Profiles"
          titleTo="profiles"
          buttonLabel="New Profile"
          buttonTo="newProfile"
        >
          <Private
            unauthenticated="home"
            roles="f0c1b8e9-5f27-4430-ad8f-5349f83339c0"
          >
            <Route
              path="/profiles"
              page={ProfileProfilesPage}
              name="profiles"
            />
          </Private>
          <Route
            path="/profiles/{id}/edit"
            page={ProfileEditProfilePage}
            name="editProfile"
          />

          <Route
            path="/profiles/{id}"
            page={ProfileProfilePage}
            name="profile"
          />
        </Set>
        <Set
          wrap={ScaffoldLayout}
          title="Tribes"
          titleTo="tribes"
          buttonLabel="New Tribe"
          buttonTo="newTribe"
        >
          <Route path="/tribes" page={TribeTribesPage} name="tribes" />
        </Set>

        <Set
          wrap={ScaffoldLayout}
          title="Basespots"
          titleTo="basespots"
          buttonLabel="New Basespot"
          buttonTo="newBasespot"
        >
          <Private unauthenticated="home">
            <Route
              path="/basespots/new"
              page={BasespotNewBasespotPage}
              name="newBasespot"
            />
            <Route
              path="/basespots/{id}/edit"
              page={BasespotEditBasespotPage}
              name="editBasespot"
            />
          </Private>
          <Route
            path="/basespots/{id}"
            page={BasespotBasespotPage}
            name="basespot"
          />
          <Route
            path="/basespots"
            page={BasespotBasespotsPage}
            name="basespots"
          />
        </Set>
      </Set>
    </Router>
  );
};

export default Routes;
