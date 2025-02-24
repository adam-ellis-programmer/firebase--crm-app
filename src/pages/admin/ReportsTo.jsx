import { useState, useEffect } from 'react'
import ComponentHeader from './ComponentHeader'
import { useAuthStatusTwo } from '../../hooks/useAuthStatusTwo'
import FormRow from './FormRow'

import { getFunctions, httpsCallable } from 'firebase/functions'
import { getAllAgents } from '../../crm context/CrmAction'
import SelectRow from './SelectRow'
const ReportsTo = ({ data }) => {
  const [agentsData, setAgentsData] = useState(null)
  const { claims } = useAuthStatusTwo()
  const orgId = claims?.claims?.orgId

  // ...

  // only make subordinate if
  // access > roleLevel

  useEffect(() => {
    const getData = async () => {
      const functions = getFunctions()
      const getAllAgents = httpsCallable(functions, 'getAllAgents')
      const data = await getAllAgents({ orgId })
      // console.log(data.data.agents)
      setAgentsData(data.data.agents)
    }
    if (orgId) {
      getData()
    }
    return () => {}
  }, [orgId])
  const [formData, setFormData] = useState({
    email: 'marina@gmail.com',
    reportsTo: {
      name: '',
      id: '',
    },
  })
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    console.log('object')
  }

  // const index = e.target.selectedIndex
  // const test = e.target.options[index].dataset.id
  const handleManagersSelect = (e) => {
    const select = document.getElementById('reportsTo')
    let id = e.target.selectedOptions[0].dataset.id

    setFormData((prev) => ({
      ...prev,
      reportsTo: {
        name: e.target.value,
        id,
      },
    }))
  }

  console.log(agentsData)

  const handleAgentsSelect = (e) => {
    const agentId = e.target.selectedOptions[0].dataset.id
    console.log(agentId)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const functions = getFunctions()
    const changeReportsTo = httpsCallable(functions, 'changeReportsTo')
    const data = await changeReportsTo({ data: formData })
    console.log(data)
  }
  return (
    <div>
      <form onSubmit={handleSubmit} action="" className="admin-form">
        <ComponentHeader text={`change reports to`} />

        <SelectRow
          data={agentsData}
          text="select agent"
          labelText={'agent'}
          onChange={handleAgentsSelect}
        />
        <SelectRow
          data={data}
          text="select manager"
          labelText={'reports to'}
          onChange={handleManagersSelect}
        />

        <div className="admin-btn-container">
          <button className="admin-add-agent-btn">submit</button>
        </div>
      </form>
    </div>
  )
}

export default ReportsTo
