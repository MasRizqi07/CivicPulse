import Link from "next/link";
import { Shield, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl text-foreground">
                CivicPulse
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Empowering citizens to report public service issues and enabling government agencies to respond efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/reports" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Browse Reports
                </Link>
              </li>
              <li>
                <Link href="/reports/new" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Submit a Report
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Contact & Support
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@civicpulse.id" className="hover:text-foreground transition-colors">
                  support@civicpulse.id
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href="tel:+622112345678" className="hover:text-foreground transition-colors">
                  +62 21 1234 5678
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CivicPulse. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            A public service platform for Indonesian citizens and government agencies.
          </p>
        </div>
      </div>
    </footer>
  );
}
