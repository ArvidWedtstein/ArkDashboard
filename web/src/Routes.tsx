// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route, Private } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

import MainLayout from 'src/layouts/MainLayout/MainLayout'
const Routes = () => {
  return (
    <Router>
      <Set wrap={MainLayout}>
          <Set wrap={ScaffoldLayout} title="Basespots" titleTo="basespots" buttonLabel="New Basespot" buttonTo="newBasespot">
            <Route path="/basespots/new" page={BasespotNewBasespotPage} name="newBasespot" />
            <Route path="/basespots/{id:Int}/edit" page={BasespotEditBasespotPage} name="editBasespot" />
            <Route path="/basespots/{id:Int}" page={BasespotBasespotPage} name="basespot" />
            <Route path="/basespots" page={BasespotBasespotsPage} name="basespots" />
          </Set>
        <Route path="/login" page={LoginPage} name="login" />
        <Route path="/signup" page={SignupPage} name="signup" />
        <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
        <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
        {/* <Private unauthenticated="login">
          <Route path="/posts" page={PostPostsPage} name="posts" />
        </Private> */}
        <Route path="/" page={HomePage} name="home" />

        <Route notfound page={NotFoundPage} />
      </Set>
    </Router>
  )
}

export default Routes
