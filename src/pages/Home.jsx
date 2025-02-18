import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useContext } from 'react'
import CrmContext from '../crm context/CrmContext'
import EmailSignUpModal from '../components/EmailSignUpModal'
import svg from '../svgs/heat.svg'
import svg2 from '../svgs/growth.svg'
function Home() {
  const { dispatch } = useContext(CrmContext)
  const auth = getAuth()

  const data = {}

  return (
    <div className="page-container-home">
      <EmailSignUpModal />
      <section className="home-data-header-div">
        <h1>Easy Data systems</h1>
      </section>
      <div className="grid-wrapper">
        <section className="home-grid-item grid-right-home">
          <div className="svg-container">
            <img className="home-svg" src={svg} alt="" />
          </div>
          <div className="home-data-header-div"></div>
        </section>
        <section className="home-grid-item"></section>
      </div>
    </div>
  )
}

export default Home
