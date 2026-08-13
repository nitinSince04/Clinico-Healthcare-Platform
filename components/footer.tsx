import Link from "next/link";
import { Activity, Shield, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-slate-900 text-slate-300">
      <div className="container px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl medical-gradient text-white">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Clinico</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise-grade digital healthcare and telehealth platform delivering frictionless online doctor consultations, instant digital prescriptions, and secure medical record management.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400">
              <Shield className="h-4 w-4" />
              <span>HIPAA Compliant & ISO 27001 Certified</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/doctors" className="hover:text-teal-400 transition-colors">
                  Find Specialists
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-teal-400 transition-colors">
                  Telehealth Services
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-teal-400 transition-colors">
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-teal-400 transition-colors">
                  Doctor Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Medical Specialties</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>Cardiology & Heart Care</li>
              <li>Dermatology & Skin Therapy</li>
              <li>Pediatrics & Child Wellness</li>
              <li>Neurology & Brain Health</li>
              <li>Orthopedics & Joint Surgery</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact & Support</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-400" />
                <span>+1 (800) 555-CLINICO</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-400" />
                <span>support@clinico-health.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal-400" />
                <span>500 Health Tech Plaza, San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Clinico Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Security Compliance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
