import { Link } from 'react-router-dom'

function Footer() {
  const date = new Date().getFullYear()
  console.log(date)
  return (
    <footer className="footer">
      <div className="footer-div"></div>
      <div className="footer-div">
        <div className="footer-date-div">
          <p>©{date}</p>
          <Link className="footer-link" to="/terms">
            {' '}
            terms and conditions
          </Link>
        </div>
      </div>
      <div className="footer-div"></div>
    </footer>
  )
}

export default Footer
