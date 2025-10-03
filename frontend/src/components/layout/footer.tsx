import { Github, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  const socialLinks = [
    {
      href: "https://www.linkedin.com/in/ifeelpankaj/",
      icon: Linkedin,
      label: "LinkedIn",
      hoverColor: "hover:text-blue-400",
    },
    {
      href: "https://instagram.com/ifeelpankaj",
      icon: Instagram,
      label: "Instagram",
      hoverColor: "hover:text-pink-400",
    },
    {
      href: "https://github.com/Myself-Pankaj/",
      icon: Github,
      label: "GitHub",
      hoverColor: "hover:text-purple-400",
    },
  ];

  return (
    <footer
      id="contact"
      className="relative bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Name and Title */}
          <div className="text-center sm:text-left">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Pankaj Kholiya
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Full Stack Developer
            </p>
          </div>

          {/* Right: Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`text-slate-600 dark:text-slate-400 ${social.hoverColor} transition-colors duration-300`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} Pankaj Kholiya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
