import { useState, useEffect } from 'react'
import ComponentHeader from './ComponentHeader'
import { useAuthStatusTwo } from '../../hooks/useAuthStatusTwo'
import FormRow from './FormRow'
import { getManagers } from '../../crm context/CrmAction'

const ReportsTo = ({ data }) => {
  const { claims } = useAuthStatusTwo()
  const [formData, setFormData] = useState({
    email: '',
    reportsTo: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('hello')
  }

  return (
    <div>
      <form onSubmit={handleSubmit} action="" className="admin-form">
        <ComponentHeader text={`change agent access`} />

        <FormRow type="text" name="email" formId="reports-to" placeholder="Enter Email" />

        <select
          className="admin-select"
          name="reportsTo"
          //   value={formData.reportsTo}
          //   onChange={handleFormInput}
        >
          <option value="">Select Manager</option>
          {data?.map((item) => {
            const { data } = item
            const fullName = `${data.firstName} ${data.lastName}`
            return <option key={item.id}>{fullName}</option>
          })}
        </select>

        <div className="admin-btn-container">
          <button className="admin-add-agent-btn">submit</button>
        </div>
      </form>
    </div>
  )
}

export default ReportsTo
