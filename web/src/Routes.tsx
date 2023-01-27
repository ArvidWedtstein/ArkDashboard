// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'
import MainLayout from './layouts/MainLayout/MainLayout'

const Routes = () => {
  return (
    <Router>
      <Route path="/dino-stats" page={DinoStatsPage} name="dinoStats" />
      <Set wrap={MainLayout}> {/*whileLoadingPage*/}
        <Route path="/material-calculator" page={MaterialCalculatorPage} name="materialCalculator" />
        <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
        <Route path="/gtw" page={GTWPage} name="gtw" />
        <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
        <Route path="/admin" page={AdminPage} name="admin" />
        <Route path="/" page={HomePage} name="home" />
        <Route path="/signin" page={SigninPage} name="signin" />
        <Route path="/signup" page={SignupPage} name="signup" />
        <Route notfound page={NotFoundPage} />
      </Set>
      <Set wrap={ScaffoldLayout} title="Profiles" titleTo="profiles" buttonLabel="New Profile" buttonTo="newProfile">
        <Route path="/profiles/new" page={ProfileNewProfilePage} name="newProfile" />
        <Route path="/profiles/{id}/edit" page={ProfileEditProfilePage} name="editProfile" />
        <Route path="/profiles/{id}" page={ProfileProfilePage} name="profile" />
        <Route path="/profiles" page={ProfileProfilesPage} name="profiles" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Tribes" titleTo="tribes" buttonLabel="New Tribe" buttonTo="newTribe">
        <Route path="/tribes/new" page={TribeNewTribePage} name="newTribe" />
        <Route path="/tribes/{id:Int}/edit" page={TribeEditTribePage} name="editTribe" />
        <Route path="/tribes/{id:Int}" page={TribeTribePage} name="tribe" />
        <Route path="/tribes" page={TribeTribesPage} name="tribes" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Timelines" titleTo="timelines" buttonLabel="New Timeline" buttonTo="newTimeline">
        <Route path="/timelines/{id:String}" page={TimelineTimelinePage} name="timeline" />
        <Route path="/timelines/new" page={TimelineNewTimelinePage} name="newTimeline" />
        <Route path="/timelines" page={TimelineTimelinesPage} name="timelines" />
      </Set>
      <Set wrap={ScaffoldLayout} title="TimelineBasespots" titleTo="timelineBasespots" buttonLabel="New TimelineBasespot" buttonTo="newTimelineBasespot">
        <Route path="/timeline-basespots/new" page={TimelineBasespotNewTimelineBasespotPage} name="newTimelineBasespot" />
        {/* <Route path="/timeline-basespots/{id}/edit" page={TimelineBasespotEditTimelineBasespotPage} name="editTimelineBasespot" /> */}
        <Route path="/timeline-basespots/{id}" page={TimelineBasespotTimelineBasespotPage} name="timelineBasespot" />
        <Route path="/timeline-basespots" page={TimelineBasespotTimelineBasespotsPage} name="timelineBasespots" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Basespots" titleTo="basespots" buttonLabel="New Basespot" buttonTo="newBasespot">
        <Route path="/basespots/new" page={BasespotNewBasespotPage} name="newBasespot" />
        <Route path="/basespots/{id}/edit" page={BasespotEditBasespotPage} name="editBasespot" />
        <Route path="/basespots/{id}" page={BasespotBasespotPage} name="basespot" />
        <Route path="/basespots" page={BasespotBasespotsPage} name="basespots" />
      </Set>
    </Router>
  )
}

export default Routes
