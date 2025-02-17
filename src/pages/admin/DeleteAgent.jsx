import React from 'react'
import FormRow from './FormRow'
import { useState } from 'react'
import ComponentHeader from './ComponentHeader'
import { getFunctions, httpsCallable } from 'firebase/functions'

const DeleteAgent = () => {
  const [formData, setFormData] = useState({
    email: '',
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const formArr = Object.entries(formData)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const functions = getFunctions()
    const deleteAgent = httpsCallable(functions, 'deleteAgent')
    const data = await deleteAgent({ email: formData.email })

    console.log(data)
  }

  return (
    <div>
      <form id="form" onSubmit={handleSubmit} className="admin-form">
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
