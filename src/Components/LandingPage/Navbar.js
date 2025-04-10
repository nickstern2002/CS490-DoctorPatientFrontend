import './Navbar.css';
import { Link } from 'react-router-dom';

import Logo from '../../Assets/Logo/logo.png';

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo on the left */}
      <a href="#home" className="logo">
        <img src={Logo} alt="Smart Eatz Logo" className="logo-image" />
      </a>

      {/* Center scroll links */}
      <ul className="nav-links center-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#doctors">Doctors</a></li>
        <li><a href="#pharmacists">Pharmacists</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
        <li><a href="#about">About</a></li>
      </ul>

      {/* Right-side buttons */}
      <ul className="nav-links right-links">
        <li><Link to="/login" className="btn login-btn">Login</Link></li>
        <li><Link to="/signup" className="btn signup-btn">Sign Up</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;