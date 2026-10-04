const Copyright = () => {
  const year = new Date().getFullYear()

  return (
    <div className="footer-copyright">
      <div className="container">
        <div className="row align-items-center gy-2">
          {/* Copyright & Author */}
          <div className="col-12 col-md-6 text-center text-md-start">
            <p className="footer-copyright-text">
              &copy; {year} <strong>AliStore</strong>. All rights reserved. Created by <strong>Muhammad Ali</strong>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="col-12 col-md-6 text-center text-md-end">
            <div className="d-inline-flex flex-wrap justify-content-center justify-content-md-end gap-2">
              <span className="footer-badge-tag">
                <span>🚚</span> Cash on Delivery
              </span>
              <span className="footer-badge-tag">
                <span>🔒</span> 100% Secured
              </span>
              <span className="footer-badge-tag">
                <span>🛡️</span> 100% Genuine
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Copyright