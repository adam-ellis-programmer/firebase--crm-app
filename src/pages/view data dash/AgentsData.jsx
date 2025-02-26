import { getAgentsCustomers } from '../../crm context/CrmAction'
import { useAuthStatusTwo } from '../../hooks/useAuthStatusTwo'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import React from 'react'
const ViewableAgents = () => {
  const [customers, setCustomers] = useState(null)
  const { claims } = useAuthStatusTwo()
  const orgID = claims?.claims?.orgId
  const roleLevel = claims?.claims?.roleLevel
  const agentId = claims?.claims?.agentId
  // console.log(claims)
  useEffect(() => {
    const getData = async () => {
      // // cannot view record if repto level is higher
      const data = await getAgentsCustomers(orgID, roleLevel)
      console.log(data)
      setCustomers(data)
    }

    if (orgID) {
      getData()
    }
    return () => {}
  }, [orgID])

  const newData = {
    name: '',
    company: '',
    phone: '',
    progress: '',
    signUpDate: '',
  }

  const headNames = Array.from(Object.keys(newData))

  // additionally check before render
  const filtered = customers?.filter(
    (item) => item.data.reportsTo.repToLevel === roleLevel
  )

  return (
    <div className="page-container">
      <section>
        <h1 className="viewable-agents-h1">list of all agent's viewable records </h1>
        <p className="viewable-agents-p">agent: Marina Hyde</p>
        <p className="viewable-agents-p">Role Level: 4</p>
        <p className="viewable-agents-">Role Type: CEO</p>
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
            const { data, id } = item
            const { name, company, dateOfSignUp, phone, custId, progress } = data
            const date = dateOfSignUp.split(',')[0]
            console.log(date)
            return (
              <Link
                key={i}
                to={`/single-customer/${agentId}/${id}/${data.name}/?email=${data.email}/from=managers-page`}
              >
                <li className="agent-table-li">
                  <div>{name}</div>
                  <div>{company}</div>
                  <div>{phone}</div>
                  <div>{progress}%</div>
                  <div>{date.split('/').join('-')}</div>
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
