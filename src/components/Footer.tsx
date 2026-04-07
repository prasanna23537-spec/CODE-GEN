import { Code2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Code2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">CodeGenie AI</span>
            </Link>
            <p className="text-sm text-muted-foreground">AI-powered code generation for modern developers.</p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Product</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/generate" className="hover:text-foreground transition-colors">Code Generator</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Company</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>About</span>
              <span>Blog</span>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CodeGenie AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
