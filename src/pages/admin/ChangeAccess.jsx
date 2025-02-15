import React from 'react'
import FormRow from './FormRow'
import { useState } from 'react'
import CheckboxRow from './CheckboxRow'
import ComponentHeader from './ComponentHeader'

const ChangeAccess = () => {
  const [formData, setFormData] = useState({
    superAdmin: true,
    admin: false,
    manager: false,
    ceo: false,
    sales: false,
    email: '',
  })

  const onChange = (e) => {
    const { name, checked } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: checked,
    }))
  }
  const formArr = Object.entries(formData)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="admin-form">
        <ComponentHeader text={`change agent access`} />

        <div className="admin-checked-wrap check-text">
          {formArr.slice(5, 6).map((item) => {
            const [key, value] = item
            return (
              <FormRow
                key={key}
                type={'text'}
                name={key}
                placeholder={`Enter ${key}`}
                onChange={onChange}
                checked={value}
                labelext={key}
                // id={key}
                // added to stop duplicate on page
                formId="change-agent"
              />
            )
          })}
        </div>

        <div className="admin-checked-wrap">
          <label className="admin-check-label" htmlFor="">
            Select All
          </label>
          <input className="admin-check-box" type="checkbox" />
        </div>

        <div className="admin-checked-wrap">
          {formArr.slice(0, 5).map((item) => {
            const [key, value] = item
            return (
              <CheckboxRow
                key={key}
                type={'checkbox'}
                name={key}
                placeholder={`Enter ${key}`}
                onChange={onChange}
                checked={value}
                labelext={key}
                id={key}
                // added to stop duplicate on page
                // formId="delete-agent"
              />
            )
          })}
        </div>

        <div className="admin-btn-container">
          <button type="button" className="admin-add-agent-btn">
            populate
          </button>
          <button className="admin-add-agent-btn">submit</button>
        </div>
      </form>
    </div>
  )
}

export default ChangeAccess
