// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route, Private } from "@redwoodjs/router";

import ScaffoldLayout from "src/layouts/ScaffoldLayout";

import MainLayout from "./layouts/MainLayout/MainLayout";

import { useAuth } from "./auth";

const Routes = () => {
  return (
    <Router useAuth={useAuth} pageLoadingDelay={0}>
      <Set wrap={MainLayout}>
        {/*whileLoadingPage*/}
        <Route
          path="/material-calculator"
          page={MaterialCalculatorPage}
          name="materialCalculator"
        />

        <Route path="/gtw" page={GTWPage} name="gtw" />

        <Route path="/admin" page={AdminPage} name="admin" />
        <Route path="/" page={HomePage} name="home" />
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
        >
          <Route
            path="/timeline-season-basespots/new"
            page={TimelineSeasonBasespotNewTimelineSeasonBasespotPage}
            name="newTimelineSeasonBasespot"
          />
          <Route
            path="/timeline-season-basespots/{id}/edit"
            page={TimelineSeasonBasespotEditTimelineSeasonBasespotPage}
            name="editTimelineSeasonBasespot"
          />
          <Route
            path="/timeline-season-basespots/{id}"
            page={TimelineSeasonBasespotTimelineSeasonBasespotPage}
            name="timelineSeasonBasespot"
          />
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
          <Route
            path="/user-recipes/new"
            page={UserRecipeNewUserRecipePage}
            name="newUserRecipe"
          />
          <Route
            path="/user-recipes/{id}/edit"
            page={UserRecipeEditUserRecipePage}
            name="editUserRecipe"
          />
          <Route
            path="/user-recipes/{id}"
            page={UserRecipeUserRecipePage}
            name="userRecipe"
          />
          <Route
            path="/user-recipes"
            page={UserRecipeUserRecipesPage}
            name="userRecipes"
          />
        </Set>
        <Set
          wrap={ScaffoldLayout}
          title="ItemRecipes"
          titleTo="itemRecipes"
          buttonLabel="New ItemRecipe"
          buttonTo="newItemRecipe"
        >
          <Route
            path="/item-recipes/new"
            page={ItemRecipeNewItemRecipePage}
            name="newItemRecipe"
          />
          <Route
            path="/item-recipes/{id}/edit"
            page={ItemRecipeEditItemRecipePage}
            name="editItemRecipe"
          />
          <Route
            path="/item-recipes/{id}"
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
          <Route
            path="/lootcrates/new"
            page={LootcrateNewLootcratePage}
            name="newLootcrate"
          />
          <Route
            path="/lootcrates/{id}/edit"
            page={LootcrateEditLootcratePage}
            name="editLootcrate"
          />
          <Route
            path="/lootcrates/{id}"
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
          <Route path="/maps/new" page={MapNewMapPage} name="newMap" />
          <Route path="/maps/{id}/edit" page={MapEditMapPage} name="editMap" />
          <Route path="/maps/{id}" page={MapMapPage} name="map" />
          <Route path="/maps" page={MapMapsPage} name="maps" />
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
              path="/items/{id}/edit"
              page={ItemEditItemPage}
              name="editItem"
            />
          </Private>
          <Route path="/items/{id}" page={ItemItemPage} name="item" />
          <Route path="/items" page={ItemItemsPage} name="items" />
        </Set>
        <Set
          wrap={ScaffoldLayout}
          title="Dinos"
          titleTo="dinos"
          buttonLabel="New Dino"
          buttonTo="newDino"
        >
          <Route path="/dinos/new" page={DinoNewDinoPage} name="newDino" />
          <Route
            path="/dinos/{id}/edit"
            page={DinoEditDinoPage}
            name="editDino"
          />
          <Route path="/dinos/{id}" page={DinoDinoPage} name="dino" />
          <Route path="/dinos" page={DinoDinosPage} name="dinos" />
        </Set>
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
              path="/profiles/new"
              page={ProfileNewProfilePage}
              name="newProfile"
            />
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
          <Route path="/tribes/new" page={TribeNewTribePage} name="newTribe" />
          <Route
            path="/tribes/{id:Int}/edit"
            page={TribeEditTribePage}
            name="editTribe"
          />
          <Route path="/tribes/{id:Int}" page={TribeTribePage} name="tribe" />
          <Route path="/tribes" page={TribeTribesPage} name="tribes" />
        </Set>
        <Set
          wrap={ScaffoldLayout}
          title="TimelineBasespots"
          titleTo="timelineBasespots"
          buttonLabel="New TimelineBasespot"
          buttonTo="newTimelineBasespot"
        >
          <Route
            path="/timeline-basespots/new"
            page={TimelineBasespotNewTimelineBasespotPage}
            name="newTimelineBasespot"
          />
          <Route
            path="/timeline-basespots/{id}/edit"
            page={TimelineBasespotEditTimelineBasespotPage}
            name="editTimelineBasespot"
          />
          <Route
            path="/timeline-basespots/{id}"
            page={TimelineBasespotTimelineBasespotPage}
            name="timelineBasespot"
          />
          <Route
            path="/timeline-basespots"
            page={TimelineBasespotTimelineBasespotsPage}
            name="timelineBasespots"
          />
        </Set>
        <Set
          wrap={ScaffoldLayout}
          title="Basespots"
          titleTo="basespots"
          buttonLabel="New Basespot"
          buttonTo="newBasespot"
        >
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
