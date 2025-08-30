// src/pages/ContactUs.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './ContactUs.css';

const ContactUs = () => {
  const navigate = useNavigate();

  return (
    <div className="contact-us-page">
      <header className="contact-header">
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Back
        </button>
        <h1>Contact Us</h1>
      </header>

      <main className="contact-content">
        <div className="contact-hero">
          <h2>We're Here to Help You</h2>
          <p className="care-message">We care a lot about you and your recovery journey.</p>
        </div>

        <div className="contact-methods">
          <div className="contact-card">
            <FaPhone className="contact-icon" />
            <h3>Phone Support</h3>
            <p>24/7 Helpline</p>
            <a href="tel:+18005551234" className="contact-link">+91 9900780733</a>
          </div>

          <div className="contact-card">
            <FaEnvelope className="contact-icon" />
            <h3>Email Us</h3>
            <p>Response within 24 hours</p>
            <a href="mailto:support@airehab.com" className="contact-link">support@airehab.com</a>
          </div>

          <div className="contact-card">
            <FaMapMarkerAlt className="contact-icon" />
            <h3>Visit Us</h3>
            <p>Our main facility</p>
            <address className="contact-address">
              No. 23/5, 3rd Floor<br />
                MG Road, Shivaji Nagar<br />
                Bengaluru, Karnataka 560001<br />
                Landmark: Opposite UB City
            </address>
          </div>

          <div className="contact-card">
            <FaClock className="contact-icon" />
            <h3>Hours</h3>
            <p>Monday - Friday</p>
            <time>8:00 AM - 6:00 PM</time>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send Us a Message</h2>
          <form className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Your name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Your email" />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" rows="5" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;