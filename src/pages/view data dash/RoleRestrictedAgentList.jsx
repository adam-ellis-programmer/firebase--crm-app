import { getAllAgents } from '../../crm context/CrmAction'
import { useAuthStatusTwo } from '../../hooks/useAuthStatusTwo'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import React from 'react'
import useGetAgentDoc from '../../hooks/useGetAgentDoc'
import { canViewpage } from './canView'
import RestricedAccessPage from './RestricedAccessPage'
import Loader from '../../assets/Loader'
const ViewableAgents = () => {
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(null)
  const [agents, setAgents] = useState(null)
  const { claims } = useAuthStatusTwo()
  const orgID = claims?.claims?.orgId
  const { agentDoc } = useGetAgentDoc(claims?.user_id, 'agents')
  // console.log(agentDoc)
  const roleLevel = claims?.claims?.roleLevel
  //   const agentId = claims?.claims?.agentId
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getAllAgents(orgID, roleLevel)
        console.log(data)
        setAgents(data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    if (orgID) {
      getData()
    }
    return () => {}
  }, [orgID])

  useEffect(() => {
    if (claims && agents) {
      const isAuthorized = canViewpage(claims)
      setIsAuthorized(isAuthorized)
    }
    return () => {}
  }, [claims, agents])

  const newData = {
    name: '',
    reportsTo: '',
    role: '',
    roleLevel: '',
    signUpDate: '',
  }

  if (loading) return <Loader />
  // if isAuth ret tru invert it to false so this does not run
  // if isAuth ret false invert this to true so it runs
  if (!isAuthorized) return <RestricedAccessPage />

  // additionally check before render
  const headNames = Array.from(Object.keys(newData))
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
