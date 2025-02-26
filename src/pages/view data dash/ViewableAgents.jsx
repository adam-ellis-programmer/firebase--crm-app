import { getAllAgents } from '../../crm context/CrmAction'
import { useAuthStatusTwo } from '../../hooks/useAuthStatusTwo'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import React from 'react'
const ViewableAgents = () => {
  const [agents, setAgents] = useState(null)
  const { claims } = useAuthStatusTwo()
  const orgID = claims?.claims?.orgId
  const roleLevel = claims?.claims?.roleLevel
  //   const agentId = claims?.claims?.agentId

  useEffect(() => {
    const getData = async () => {
      const data = await getAllAgents(orgID, roleLevel)
      console.log(data)
      setAgents(data)
    }

    if (orgID) {
      getData()
    }
    return () => {}
  }, [orgID])

  const newData = {
    name: '',
    reportsTo: '',
    role: '',
    roleLevel: '',
    signUpDate: '',
  }

  const headNames = Array.from(Object.keys(newData))

  // additionally check before render
  const filtered = agents?.filter((item) => item.data.roleLevel === roleLevel)
  return (
    <div className="page-container">
      <section>
        <h1 className="viewable-agents-h1">list of all my viewable agents allowed </h1>
        <p className="viewable-agents-p">my role level: 4</p>
        <p className="viewable-agents-">my role type: CEO</p>
      </section>
      <section>
        <div className="agent-table-row-header">
          {headNames.map((item, i) => {
            return (
              <div key={i} className="agent-table-row">
                <span>{item}</span>
              </div>
            )
          })}
        </div>
        <ul className="agent-table-ul">
          {filtered?.map((item, i) => {
            const { data } = item
            const {
              firstName,
              lastName,
              role,
              roleLevel,
              reportsTo,
              signUpDate,
              docId: agentId,
            } = data
            const date = new Date(signUpDate)
            return (
              <Link key={i} to={`/agents-data/${agentId}`}>
                <li className="agent-table-li">
                  <div>{firstName + ' ' + lastName}</div>
                  <div>{reportsTo.name}</div>
                  <div>{role}</div>
                  <div>{roleLevel}</div>
                  <div>24/5/25</div>
                </li>
              </Link>
            )
          })}
        </ul>
      </section>
    </div>
  )
}


export default ViewableAgents
