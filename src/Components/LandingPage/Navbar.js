import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">Smart Eatz</Link>

      <ul className="nav-links center-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/doctors">Doctors</Link></li>
        <li><Link to="/testimonials">Testimonials</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>

      <ul className="nav-links right-links">
        <li><Link to={"/login"} className="btn login-btn">Login</Link></li>
        <li><Link to={"/signup"} className="btn signup-btn">Sign Up</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;