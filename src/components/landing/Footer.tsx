import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl text-foreground">Verity</span>
            <span className="text-xs text-muted-foreground/50 ml-2">
              © {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link to="/transparency" className="hover:text-foreground transition-colors">
              Transparency
            </Link>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </a>
            <Link to="/auth" className="hover:text-primary transition-colors">
              Join
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
