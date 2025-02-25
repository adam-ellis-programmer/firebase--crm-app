import { useState, useEffect } from 'react'
import ComponentHeader from './ComponentHeader'
import { useAuthStatusTwo } from '../../hooks/useAuthStatusTwo'

import { getFunctions, httpsCallable } from 'firebase/functions'
import SelectRow from './SelectRow'

const ReportsTo = ({ data }) => {
  const [agentsData, setAgentsData] = useState(null)
  const { claims } = useAuthStatusTwo()
  const orgId = claims?.claims?.orgId

  // ...
  const role = 'CEO'
  const roles = ['CEO', 'ADMIN', 'MANAGER', 'SALES']

  if (roles.includes(role)) {
    console.log('access granted')
  }
  // only make subordinate if
  // access > roleLevel
  // access.inclues(role)
  //...
  // get all users access level > 2
  // list all the users and the submordinates

  useEffect(() => {
    const getData = async () => {
      const functions = getFunctions()
      const getAllAgents = httpsCallable(functions, 'getAllAgents')
      const data = await getAllAgents({ orgId })
      setAgentsData(data.data.agents)
    }
    if (orgId) {
      getData()
    }
    return () => {}
  }, [orgId])
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  // checkout select-one
  // const select = document.getElementById('reportsTo')
  const onChange = (e) => {
    const { name, value } = e.target
    let id = e.target.selectedOptions[0].dataset.id
    let nameValue = e.target.selectedOptions[0].value

    if (name === 'agent') {
      setFormData((prevState) => ({
        ...prevState,
        agent: {
          name: nameValue,
          id,
        },
      }))
      return
    }
    setFormData((prevState) => ({
      ...prevState,
      reportsTo: {
        name: nameValue,
        id,
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // const functions = getFunctions()
    // const changeReportsTo = httpsCallable(functions, 'changeReportsTo')
    // const data = await changeReportsTo( formData })
    // console.log(data)
    console.log(formData)
  }
  return (
    <div>
      <form onSubmit={handleSubmit} action="" className="admin-form">
        <ComponentHeader text={`change reports to`} />

        <SelectRow
          data={agentsData}
          text="select agent"
          labelText={'agent'}
          onChange={onChange}
          name="agent"
        />
        <SelectRow
          data={data}
          text="select manager"
          labelText={'reports to'}
          onChange={onChange}
          name="manager"
        />

        <div className="admin-btn-container">
          <button className="admin-add-agent-btn">change</button>
        </div>
      </form>
    </div>
  )
}

export default ReportsTo
