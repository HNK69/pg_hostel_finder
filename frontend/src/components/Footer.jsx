import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMail, FiPhone, FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white font-black text-base shadow">
                H
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-white">
                Hostel<span className="text-primary-400">Finder</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs">
              Find premium PG, hostels, and student rooms near you with zero brokerages and instant booking.
            </p>
            <div className="flex space-x-4 text-slate-500">
              <a href="#" className="hover:text-primary-400 transition" aria-label="Twitter"><FiTwitter size={18} /></a>
              <a href="#" className="hover:text-primary-400 transition" aria-label="Instagram"><FiInstagram size={18} /></a>
              <a href="#" className="hover:text-primary-400 transition" aria-label="Github"><FiGithub size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/hostels" className="hover:text-white transition">Browse Hostels</Link></li>
              <li><Link to="/search" className="hover:text-white transition">Search Rooms</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition">List Your Hostel</Link></li>
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Cities</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/search?city=Bangalore" className="hover:text-white transition">Bangalore</Link></li>
              <li><Link to="/search?city=Mumbai" className="hover:text-white transition">Mumbai</Link></li>
              <li><Link to="/search?city=Delhi" className="hover:text-white transition">Delhi</Link></li>
              <li><Link to="/search?city=Pune" className="hover:text-white transition">Pune</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center"><FiMail className="mr-2 text-primary-500" /> support@hostelfinder.com</li>
              <li className="flex items-center"><FiPhone className="mr-2 text-primary-500" /> +91 98765 43210</li>
              <li className="flex items-center"><FiHome className="mr-2 text-primary-500" /> 102 Startup Hub, Tech Park, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} HostelFinder Technologies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
