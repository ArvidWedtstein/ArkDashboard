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

import MainLayout from "src/layouts/MainLayout/MainLayout";

const Routes = () => {
  return (
    <Router>
      <Set wrap={MainLayout}>
        <Set
          wrap={ScaffoldLayout}
          title="Basespots"
          titleTo="basespots"
          buttonLabel="New Spot"
          buttonTo="newBasespot"
        >
          <Private unauthenticated="login">
            <Route
              path="/basespots/new"
              page={BasespotNewBasespotPage}
              name="newBasespot"
            />
            <Route
              path="/basespots/{id:Int}/edit"
              page={BasespotEditBasespotPage}
              name="editBasespot"
            />
            <Route
              path="/basespots/{id:Int}"
              page={BasespotBasespotPage}
              name="basespot"
            />
          </Private>
          <Route
            path="/basespots"
            page={BasespotBasespotsPage}
            name="basespots"
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
          title="Tribes"
          titleTo="tribes"
          buttonLabel="New Tribe"
          buttonTo="newTribe"
        >
          <Private unauthenticated="login">
            <Route
              path="/tribes/new"
              page={TribeNewTribePage}
              name="newTribe"
            />
            <Route
              path="/tribes/{id:Int}/edit"
              page={TribeEditTribePage}
              name="editTribe"
            />
            <Route path="/tribes/{id:Int}" page={TribeTribePage} name="tribe" />
          </Private>
          <Route path="/tribes" page={TribeTribesPage} name="tribes" />
        </Set>
        <Private
          unauthenticated="home"
          roles="f0c1b8e9-5f27-4430-ad8f-5349f83339c0"
        >
          <Route path="/admin" page={AdminPage} name="admin" />
        </Private>
        <Route path="/account" page={AccountPage} name="account" />
        <Route path="/login" page={LoginPage} name="login" />
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

        <Route path="/" page={HomePage} name="home" />
        <Route path="/gtw" page={GTWPage} name="gtw" />
        <Route path="/story" page={StoryPage} name="story" />
        <Route
          path="/material-calculator"
          page={MaterialCalculatorPage}
          name="materialCalculator"
        />
        <Route path="/dinostats" page={DinoStatsPage} name="dinoStats" />
        <Route notfound page={NotFoundPage} />
      </Set>
    </Router>
  );
};

export default Routes;
