import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './layout/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'
import MyData from './pages/MyData'
import Footer from './layout/Footer'
import Home from './pages/Home'
import Signin from './pages/Signin'
// import Signout from './pages/Signout'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import Signup from './pages/Signup'
import Stats from './pages/Stats'
import PrivateRoute from './components/PrivateRoute'

import NewCustomer from './pages/NewCustomer'
import SingleCustomer from './pages/SingleCustomer'
import { CrmDataContextProvider } from './crm context/CrmContext'
import AdminPage from './pages/admin/AdminPage'
import AgentSignIn from './pages/AgentSignIn'

import ManagersTeamData from './pages/ManagersTeamData'
import NotFound from './pages/NotFound'
import ChartDash from './pages/ChartDash'
import Terms from './pages/Terms'
import SignUpAccPage from './pages/SignUpTierPage'
import PaymentPage from './billing/PaymentPage'
import DarkMode from './DarkMode'
import ReportsToInfo from './pages/admin/ReportsToInfo'
import ViewableAgents from './pages/view data dash/ViewableAgents'
import AgentsData from './pages/view data dash/AgentsData'

// PROTECT THE ROUTES
function App() {
  // move to global state
  const [toggleNav, setToggleNav] = useState(false)
  return (
    <CrmDataContextProvider>
      <div className="main-wrap">
        <Router>
          <Navbar setToggleNav={setToggleNav} toggleNav={toggleNav} />
          <div className="main">
            {/* <DarkMode /> */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sign-in" element={<Signin />} />
              <Route path="/agent-sign-in" element={<AgentSignIn />} />
              <Route path="/sign-up" element={<Signup />} />
              <Route path="/sign-up-acc" element={<SignUpAccPage />} />
              <Route path="/payment-page/:id" element={<PaymentPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/terms" element={<Terms />} />

              {/* protected routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/data/:uid" element={<MyData />} />
                <Route path="/all-data/:uid" element={<ManagersTeamData />} />
                <Route path="/admin/:uid" element={<AdminPage />} />
                <Route path="/stats/:uid" element={<Stats />} />
                <Route path="/new-customer" element={<NewCustomer />} />
                <Route path="/dash/:uid" element={<ChartDash />} />
                <Route path="/rep-to-info/:uid" element={<ReportsToInfo />} />
                <Route path="/view-agents/:uid" element={<ViewableAgents />} />
                <Route path="/agents-data/:uid" element={<AgentsData />} />
                <Route
                  path="/single-customer/:agentUid/:uid/:name"
                  element={<SingleCustomer />}
                />
                <Route path="/profile/:uid" element={<Profile />} />
              </Route>

              {/* <Route path="/sign-out" element={<Signout />} /> */}
              {/* catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer />
          </div>
          <Footer />
        </Router>
      </div>
    </CrmDataContextProvider>
  )
}

export default App
