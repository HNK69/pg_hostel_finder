import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiTwitter, FiInstagram, FiArrowUpRight } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Quick Links',
      links: [
        { label: 'Browse Hostels', to: '/hostels' },
        { label: 'Search Rooms', to: '/search' },
        { label: 'Sign In', to: '/login' },
        { label: 'List Your Hostel', to: '/register' },
      ],
    },
    {
      title: 'Cities',
      links: [
        { label: 'Bangalore', to: '/search?city=Bangalore' },
        { label: 'Mumbai', to: '/search?city=Mumbai' },
        { label: 'Delhi', to: '/search?city=Delhi' },
        { label: 'Pune', to: '/search?city=Pune' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '#' },
        { label: 'Blog', to: '#' },
        { label: 'Careers', to: '#' },
        { label: 'Contact', to: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '#' },
        { label: 'Terms & Conditions', to: '#' },
        { label: 'Cookie Policy', to: '#' },
        { label: 'Disclaimer', to: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: FiTwitter, href: '#', label: 'Twitter' },
    { icon: FiInstagram, href: '#', label: 'Instagram' },
    { icon: FiGithub, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-300 border-t border-slate-800/50 transition-colors duration-300 relative">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white font-black text-lg shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 group-hover:scale-110 transition-all duration-200">
                H
              </div>
              <div>
                <span className="font-display text-lg font-bold tracking-tight text-white">
                  Hostel<span className="text-primary-400">Finder</span>
                </span>
                <p className="text-xs text-slate-400 font-medium">Find Your Home</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Discover premium PG, hostels, and student accommodations near you with zero brokerages and instant bookings.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2.5 rounded-lg bg-slate-800/50 hover:bg-primary-600/20 text-slate-400 hover:text-primary-400 transition-all duration-200 hover:scale-110"
                  aria-label={social.label}
                  title={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-bold text-white tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="inline-flex items-center text-sm text-slate-400 hover:text-primary-400 transition-colors duration-200 group"
                    >
                      <span>{link.label}</span>
                      <FiArrowUpRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 pb-12 border-b border-slate-800/50">
          <div className="flex items-start space-x-3 group p-4 rounded-lg hover:bg-slate-800/30 transition-colors">
            <div className="p-2.5 bg-primary-600/20 rounded-lg text-primary-400 group-hover:bg-primary-600/30 transition-colors">
              <FiMail size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
              <a href="mailto:support@hostelfinder.com" className="text-sm text-slate-300 hover:text-primary-400 transition-colors truncate">
                support@hostelfinder.com
              </a>
            </div>
          </div>
          <div className="flex items-start space-x-3 group p-4 rounded-lg hover:bg-slate-800/30 transition-colors">
            <div className="p-2.5 bg-primary-600/20 rounded-lg text-primary-400 group-hover:bg-primary-600/30 transition-colors">
              <FiPhone size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Phone</p>
              <a href="tel:+919876543210" className="text-sm text-slate-300 hover:text-primary-400 transition-colors">
                +91 98765 43210
              </a>
            </div>
          </div>
          <div className="flex items-start space-x-3 group p-4 rounded-lg hover:bg-slate-800/30 transition-colors">
            <div className="p-2.5 bg-primary-600/20 rounded-lg text-primary-400 group-hover:bg-primary-600/30 transition-colors">
              <FiMapPin size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Address</p>
              <p className="text-sm text-slate-300">102 Startup Hub, Tech Park, India</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {currentYear} <span className="font-semibold text-slate-400">HostelFinder Technologies</span>. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link to="#" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-700">•</span>
            <Link to="#" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl opacity-20" />
      </div>
    </footer>
  );
}
