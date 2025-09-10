import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { ThemeToggle } from './common/ThemeToggle';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t border-border text-card-foreground transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MH</span>
                </div>
                <span className="text-xl font-bold text-foreground">Market Hub</span>
              </div>
              <div className="md:hidden">
                <ThemeToggle />
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Leading hub for telecommunications and digital services, 
              powered by TM Forum standards.
            </p>
            <div className="space-y-2">
              <a 
                href="mailto:support@markethub.com" 
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email support"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>support@markethub.com</span>
              </a>
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <ThemeToggle />
                <span>Toggle theme</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Products</h3>
            <ul className="space-y-2">
              <li><Link to="/catalog?category=mobile" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Mobile Plans</Link></li>
              <li><Link to="/catalog?category=broadband" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Broadband</Link></li>
              <li><Link to="/catalog?category=digital" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Digital Services</Link></li>
              <li><Link to="/catalog?category=bundles" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Bundles</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/orders" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Track Order</Link></li>
              <li><Link to="/returns" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Returns</Link></li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Partners</h3>
            <ul className="space-y-2">
              <li><Link to="/partner" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Partner Portal</Link></li>
              <li><Link to="/partner/onboarding" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Become a Partner</Link></li>
              <li><Link to="/developer" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Developer APIs</Link></li>
              <li><Link to="/tm-forum" className="text-muted-foreground hover:text-foreground text-sm transition-colors">TM Forum</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Market Hub. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors" aria-label="Privacy Policy">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors" aria-label="Terms of Service">Terms of Service</Link>
              <Link to="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors" aria-label="Cookie Policy">Cookie Policy</Link>
              <Link to="/accessibility" className="text-sm text-muted-foreground hover:text-foreground transition-colors" aria-label="Accessibility Statement">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};