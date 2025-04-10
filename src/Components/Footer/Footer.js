import './Footer.css';
import Logo from '../../Assets/Logo/logo.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src={Logo} alt="Smart Eatz Logo" className="footer-logo" />
      </div>

      <div className="footer-right">
        <p>&copy; {new Date().getFullYear()} Smart EatZ. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;