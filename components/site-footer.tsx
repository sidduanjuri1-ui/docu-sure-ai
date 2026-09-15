export function SiteFooter() {
  const links = ["Home", "About", "Privacy", "Disclaimer"]
  return (
    <footer className="mt-20 border-t border-white/10 bg-background/40 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link}
            </a>
          ))}
        </nav>
        <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-relaxed text-muted-foreground">
          DocuSure AI provides an AI-assisted assessment and does not guarantee document authenticity.
        </p>
      </div>
    </footer>
  )
}
