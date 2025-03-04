import { useEffect, useState } from 'react'

const Docs = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    })
    return () => {}
  }, [])
  return (
    <div className="page-contaimer docs-page-grid">
      <div className="docs-page-grid-item "></div>
      <div className="docs-page-grid-item "></div>
    </div>
  )
}

export default Docs
