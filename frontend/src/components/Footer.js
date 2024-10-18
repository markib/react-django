import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
                    <a href="/terms-of-service" className="footer-link">Terms of Service</a>
                    <a href="/contact-us" className="footer-link">Contact Us</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
