// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route, Private } from '@redwoodjs/router'

import MainLayout from 'src/layouts/MainLayout/MainLayout'
import ScaffoldLayout from 'src/layouts/ScaffoldLayout/ScaffoldLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={MainLayout}>
        <Set wrap={ScaffoldLayout} title="Basespots" titleTo="basespots" buttonLabel="New Basespot" buttonTo="newBasespot">
          <Private unauthenticated="login">
            <Route path="/basespots/new" page={BasespotNewBasespotPage} name="newBasespot" />
            <Route path="/basespots/{id:Int}/edit" page={BasespotEditBasespotPage} name="editBasespot" />
            <Route path="/basespots/{id:Int}" page={BasespotBasespotPage} name="basespot" />
          </Private>

          <Route path="/basespots" page={BasespotBasespotsPage} name="basespots" />
        </Set>
        <Route path="/login" page={LoginPage} name="login" />
        <Route path="/signup" page={SignupPage} name="signup" />
        <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
        <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />

        <Route path="/" page={HomePage} name="home" />

        <Route notfound page={NotFoundPage} />
      </Set>
    </Router>
  )
}

export default Routes
