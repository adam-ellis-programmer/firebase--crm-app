import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './layout/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'
import Data from './pages/Data'
import Footer from './layout/Footer'
import Home from './pages/Home'
import Signin from './pages/Signin'
// import Signout from './pages/Signout'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import Signup from './pages/Signup'
import Stats from './pages/Stats'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './pages/Dashboard'
import NewCustomer from './pages/NewCustomer'
import SingleCustomer from './pages/SingleCustomer'
import { CrmDataContextProvider } from './crm context/CrmContext'
import AdminPage from './pages/admin/AdminPage'
import AgentSignIn from './pages/AgentSignIn'
import { useEffect } from 'react'
import DataAll from './pages/DataAll'
import NotFound from './pages/NotFound'
import ChartDash from './pages/ChartDash'
import Terms from './pages/Terms'
import SignUpAccPage from './pages/SignUpTierPage'
import PaymentPage from './billing/PaymentPage'
import DarkMode from './DarkMode'

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
                <Route path="/data/:uid" element={<Data />} />
                <Route path="/all-data/:uid" element={<DataAll />} />
                <Route path="/admin/:uid" element={<AdminPage />} />
                <Route path="/stats/:uid" element={<Stats />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/new-customer" element={<NewCustomer />} />
                <Route path="/dash/:uid" element={<ChartDash />} />
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
