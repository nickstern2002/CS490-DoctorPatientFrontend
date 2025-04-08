import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h3 className="footer-logo">Smart Eatz</h3>
      </div>
      <div className="footer-right">
        <p>&copy; {new Date().getFullYear()} Smart Eatz. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;