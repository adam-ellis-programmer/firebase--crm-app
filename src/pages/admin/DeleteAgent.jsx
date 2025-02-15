import React from 'react'
import FormRow from './FormRow'
import { useState } from 'react'
import ComponentHeader from './ComponentHeader'

const DeleteAgent = () => {
  const [formData, setFormData] = useState({
    email: '',
  })

  const onChange = () => {
    console.log('object')
  }
  const formArr = Object.entries(formData)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="admin-form">
        <ComponentHeader text={`delete agent`} />

        {formArr.map((item) => {
          const [key, value] = item
          return (
            <FormRow
              key={key}
              type={'text'}
              name={key}
              value={value}
              placeholder={`Enter ${key}`}
              onChange={onChange}
              // added to stop duplicate on page
              formId="delete-agent"
            />
          )
        })}

        <div className="admin-btn-container">
          <button className="admin-add-agent-btn">submit</button>
        </div>
      </form>
    </div>
  )
}

export default DeleteAgent
