import NewAgent from './NewAgent'
import DeleteAgent from './DeleteAgent'
import ChangeAccess from './ChangeAccess'
import ReportsTo from './ReportsTo'
import { useState, useEffect } from 'react'
import { useAuthStatusTwo } from '../../hooks/useAuthStatusTwo'
import { getManagers } from '../../crm context/CrmAction'
import AgentCard from './AgentCard'
import { getFunctions, httpsCallable } from 'firebase/functions'
function AdminPage() {
  const { claims } = useAuthStatusTwo()
  const [managers, setManagers] = useState(null)
  const [agents, setAgents] = useState(null)
  // console.log(claims)
  // console.log(managers)
  // console.log(claims?.claims?.orgId)

  // only get data once we have the claims
  useEffect(() => {
    const getData = async () => {
      try {
        // Only run if orgId exists
        // get managers
        if (claims?.claims?.orgId) {
          const data = await getManagers(claims.claims.orgId)
          setManagers(data)
        }
        // get org agents
        const functions = getFunctions()
        const getAllAgentsByOrg = httpsCallable(functions, 'getAllAgentsByOrg')
        const data = await getAllAgentsByOrg({ orgId: claims?.claims?.orgId })
        setAgents(data?.data?.agentData)
      } catch (error) {
        console.log(error)
      }
    }

    getData()
    return () => {}
  }, [claims])

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
          <ChangeAccess claims={claims} />
          <ReportsTo data={managers} claims={claims} />
          {/*  */}
          {/* ========================================== */}
        </div>
        <div className="agent-page-right">
          <div className="admin-controls-text-container">
            <p>Active Agents</p>
          </div>
          <div className="user-list-container">
            {agents?.map((item, i) => {
              return <AgentCard key={item.id} item={item} i={i} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
