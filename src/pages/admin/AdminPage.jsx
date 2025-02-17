import NewAgent from './NewAgent'
import DeleteAgent from './DeleteAgent'
import ChangeAccess from './ChangeAccess'
import ReportsTo from './ReportsTo'
import { useState, useEffect } from 'react'
import { useAuthStatusTwo } from '../../hooks/useAuthStatusTwo'
import { getManagers } from '../../crm context/CrmAction'

function AdminPage() {
  const { claims } = useAuthStatusTwo()
  const [managers, setManagers] = useState()
  // console.log(claims?.claims)

  // only get data once we have the claims
  useEffect(() => {
    const getData = async () => {
      // Only run if organizationId exists
      if (claims?.claims?.organizationId) {
        const data = await getManagers(claims.claims.organizationId)
        console.log(data)
        setManagers(data)
      }
    }

    getData()
    return () => {}
  }, [claims?.claims?.organizationId])
  return (
    <div>
      {/* {showAlert && <AdminPageMModal alertData={alertData} setShowAlert={setShowAlert} />} */}
      <div className="admin-grid">
        <div className="agent-sign-up agent-sign-up-left">
          <div className="agent-inner-div-text">
            <div className="sign-in-text-container">
              <h1 className="sign-in-h1-text">Admin Panel</h1>
            </div>
            <div className="sign-in-text-container">
              <ul className="sign-in-info">
                <li className="sign-in-list">Control agents' access privileges</li>
                <li className="sign-in-list">Change Permissions</li>
                <li className="sign-in-list">Add and Delete Users</li>
                <li className="sign-in-list">Keep Track of who is logging in</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="agent-sign-up agent-sign-up-right">
          <div className="admin-controls-text-container">
            <p>Your Admin Controls</p>
          </div>
          {/* ========================================== */}
          {/*  */}
          <NewAgent data={managers} />
          <DeleteAgent data={managers} />
          <ChangeAccess data={managers} />
          <ReportsTo data={managers} />
          {/*  */}
          {/* ========================================== */}
        </div>
        <div className="agent-page-right">
          <div className="agent-page-right-header-container">
            <p>Active Agents</p>
          </div>
          <div className="user-list-container">
            {/* <ul className="user-list-ul">
              {!loading &&
                agentData &&
                agentData.length > 0 &&
                agentData.map((item) => (
                  <li key={item.id} className="user-list-li">
                    <span className="user-list-info">{item.data.name}</span>
                    <span className="user-list-info">{item.data.email}</span>
                  </li>
                ))}
            </ul>
            {loading && <Loader />} */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
