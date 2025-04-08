import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <a href="#home" className="logo">Smart EatZ</a>

      <ul className="nav-links center-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#doctors">Doctors</a></li>
        <li><a href="#pharmacists">Pharmacists</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
        <li><a href="#about">About</a></li>
      </ul>

      <ul className="nav-links right-links">
        <li><a href="/login" className="btn login-btn">Login</a></li>
        <li><a href="/signup" className="btn signup-btn">Sign Up</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;