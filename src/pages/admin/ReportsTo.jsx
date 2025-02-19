import { useState, useEffect } from 'react'
import ComponentHeader from './ComponentHeader'
import { useAuthStatusTwo } from '../../hooks/useAuthStatusTwo'
import FormRow from './FormRow'
import { getManagers } from '../../crm context/CrmAction'
import { getFunctions, httpsCallable } from 'firebase/functions'
const ReportsTo = ({ data }) => {
  const { claims } = useAuthStatusTwo()
  const [formData, setFormData] = useState({
    email: 'marina@gmail.com',
    reportsTo: {
      name: '',
      id: '',
    },
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const functions = getFunctions()
    const changeReportsTo = httpsCallable(functions, 'changeReportsTo')
    const data = await changeReportsTo({ data: formData })
    console.log(data)
  }

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
  const handleSelect = (e) => {
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

  /**
   * change id and name to
   * name and id sent from f/e
   */
  return (
    <div>
      <form onSubmit={handleSubmit} action="" className="admin-form">
        <ComponentHeader text={`change reports to`} />
        <FormRow
          type="text"
          id="reports-to"
          name="email"
          value={formData.email}
          onChange={onChange}
          formId="reports-to"
          placeholder="Enter Email"
        />

        <div className="reports-to-wrap">
          <label htmlFor={'reportsTo'} className="admin-label">
            reports to
          </label>
          <select
            className="admin-select"
            name="reportsTo"
            id="reportsTo"
            value={formData.reportsTo.name}
            onChange={handleSelect}
          >
            <option value="">Select Manager</option>
            {data?.map((item) => {
              const { data } = item
              // console.log(item)
              const fullName = `${data.firstName} ${data.lastName}`
              return (
                <option
                  value={fullName} // Added this line
                  data-id={item.id}
                  key={item.id}
                >
                  {fullName}
                </option>
              )
            })}
          </select>
        </div>

        <div className="admin-btn-container">
          <button className="admin-add-agent-btn">submit</button>
        </div>
      </form>
    </div>
  )
}

export default ReportsTo
