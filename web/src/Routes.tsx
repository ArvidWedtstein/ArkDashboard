// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from "@redwoodjs/router";

import ScaffoldLayout from "src/layouts/ScaffoldLayout";

import MainLayout from "./layouts/MainLayout/MainLayout";

import { useAuth } from './auth'

const Routes = () => {
  return (
    <Router useAuth={useAuth} pageLoadingDelay={500}>
      <Set wrap={MainLayout}>
        {/*whileLoadingPage*/}

        <Route path="/dino-stats" page={DinoStatsPage} name="dinoStats" />
        <Route
          path="/material-calculator"
          page={MaterialCalculatorPage}
          name="materialCalculator"
        />
        <Route
          path="/reset-password"
          page={ResetPasswordPage}
          name="resetPassword"
        />
        <Route path="/gtw" page={GTWPage} name="gtw" />
        <Route
          path="/forgot-password"
          page={ForgotPasswordPage}
          name="forgotPassword"
        />
        <Route path="/admin" page={AdminPage} name="admin" />
        <Route path="/" page={HomePage} name="home" />
        <Route path="/signin" page={SigninPage} name="signin" />
        <Route path="/signup" page={SignupPage} name="signup" />
        <Route notfound page={NotFoundPage} />
        <Set
          wrap={ScaffoldLayout}
          title="TimelineBasespotDinos"
          titleTo="timelineBasespotDinos"
          buttonLabel="New TimelineBasespotDino"
          buttonTo="newTimelineBasespotDino"
        >
          <Route
            path="/timeline-basespot-dinos/new"
            page={TimelineBasespotDinoNewTimelineBasespotDinoPage}
            name="newTimelineBasespotDino"
          />
          <Route
            path="/timeline-basespot-dinos/{id}/edit"
            page={TimelineBasespotDinoEditTimelineBasespotDinoPage}
            name="editTimelineBasespotDino"
          />
          {/* <Route
            path="/timeline-basespot-dinos/{id}"
            page={TimelineBasespotDinoTimelineBasespotDinoPage}
            name="timelineBasespotDino"
          />
          <Route
            path="/timeline-basespot-dinos"
            page={TimelineBasespotDinoTimelineBasespotDinosPage}
            name="timelineBasespotDinos"
          /> */}
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
          <Route path="/items/new" page={ItemNewItemPage} name="newItem" />
          <Route
            path="/items/{id}/edit"
            page={ItemEditItemPage}
            name="editItem"
          />
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
          <Route
            path="/profiles/new"
            page={ProfileNewProfilePage}
            name="newProfile"
          />
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
          <Route path="/profiles" page={ProfileProfilesPage} name="profiles" />
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
          title="Timelines"
          titleTo="timelines"
          buttonLabel="New Timeline"
          buttonTo="newTimeline"
        >
          <Route
            path="/timelines/new"
            page={TimelineNewTimelinePage}
            name="newTimeline"
          />
          {/* <Route
            path="/timelines/{id:String}"
            page={TimelineTimelinePage}
            name="timeline"
          /> */}
          <Route
            path="/timelines"
            page={TimelineTimelinesPage}
            name="timelines"
          />
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
