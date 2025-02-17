import React from 'react'
import FormRow from './FormRow'
import { useState } from 'react'
import CheckboxRow from './CheckboxRow'
import ComponentHeader from './ComponentHeader'
import { getFunctions, httpsCallable } from 'firebase/functions'
const ChangeAccess = () => {
  const [formData, setFormData] = useState({
    superAdmin: false,
    admin: false,
    manager: false,
    ceo: false,
    sales: false,
    email: 'fiona@gmail.com',
  })

  // leave for reference
  const allChecked = Object.entries(formData)
    .filter(([key]) => key !== 'email') // Exclude email field
    .every(([_, value]) => value === true)

  // Check if any checkbox is true
  // if any value is true
  const anyChecked = Object.entries(formData)
    .filter(([key]) => key !== 'email')
    .some(([_, value]) => value === true)

  const handleSelectAll = () => {
    // If any checkboxes are true, set all to false
    // If all checkboxes are false, set all to true
    const newValue = !anyChecked
    console.log(anyChecked)

    setFormData((prev) => ({
      ...prev,
      superAdmin: newValue,
      admin: newValue,
      manager: newValue,
      ceo: newValue,
      sales: newValue,
    }))
  }

  const onChange = (e) => {
    const { name, type, checked, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      // Use checked for checkboxes, value for text inputs
      [name]: type === 'checkbox' ? checked : value,
    }))
  }
  const formArr = Object.entries(formData)

  const onPopulate = async (e) => {
    e.preventDefault()
    const functions = getFunctions()
    const getClaims = httpsCallable(functions, 'getClaims')
    const res = await getClaims({ email: formData.email })
    // Added optional chaining (?.) to safely access nested properties
    // Added nullish coalescing operator (??) to provide default values
    // Provides a fallback value if the result is null or undefined
    setFormData((prevState) => ({
      ...prevState,
      superAdmin: res.data.claims?.superAdmin ?? false,
      admin: res.data.claims?.admin ?? false,
      manager: res.data.claims?.manager ?? false,
      ceo: res.data.claims?.ceo ?? false,
      sales: res.data.claims?.sales ?? false,
      email: formData.email,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log(formData)
    const functions = getFunctions()
    const updateAccess = httpsCallable(functions, 'updateAccess')
    const res = await updateAccess({ data: formData })
    console.log(res)
  }

  console.log(formData.email)
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
                value={formData.email}
                // id={key}
                // added to stop duplicate on page
                formId="change-agent"
              />
            )
          })}
        </div>

        {/* Select All checkbox */}
        <div className="admin-checked-wrap">
          <label className="admin-check-label" htmlFor="selectAll">
            {anyChecked ? 'Deselect All' : 'Select All'}
          </label>
          <input
            id="selectAll"
            className="admin-check-box"
            type="checkbox"
            checked={anyChecked}
            onChange={handleSelectAll}
          />
        </div>
        {/* Individual checkboxes */}

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
          <button onClick={onPopulate} type="button" className="admin-add-agent-btn">
            populate
          </button>
          <button className="admin-add-agent-btn">submit</button>
        </div>
      </form>
    </div>
  )
}

export default ChangeAccess
