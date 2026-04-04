import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, Zap, Shield, History, Sparkles, ArrowRight, Check } from "lucide-react";
import Footer from "@/components/Footer";

const features = [
  { icon: Code2, title: "AI Code Generation", desc: "Generate production-ready code in Python, JavaScript, Java, C++ and more." },
  { icon: Sparkles, title: "Code Explanation", desc: "Get step-by-step explanations with complexity analysis for any generated code." },
  { icon: Zap, title: "Blazing Fast", desc: "Get results in seconds with our optimized AI pipeline and caching." },
  { icon: History, title: "Prompt History", desc: "Access and manage your full generation history with search and filters." },
  { icon: Shield, title: "Secure by Design", desc: "Enterprise-grade security with encrypted data and JWT authentication." },
  { icon: ArrowRight, title: "Export Anywhere", desc: "Download code as PDF, .txt, or language-specific files instantly." },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["5 prompts per day", "4 languages", "Code generation", "Download as .txt", "Basic history"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    features: ["Unlimited prompts", "All languages", "Code explanation", "PDF & file exports", "Priority support", "Admin dashboard"],
    cta: "Upgrade to Pro",
    popular: true,
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero py-24 lg:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" /> Powered by AI
            </div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Generate code with{" "}
              <span className="text-gradient">AI magic</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Enter a prompt, pick your language, and get clean, production-ready code in seconds.
              Understand every line with AI-powered explanations.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button variant="hero" size="lg" className="gap-2 px-8 text-base">
                  Start coding free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="hero-outline" size="lg" className="px-8 text-base">
                  Log in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Everything you need to code faster</h2>
            <p className="text-muted-foreground">A complete AI-powered development toolkit in your browser.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group rounded-xl border border-border/50 bg-gradient-card p-6 transition-all duration-300 hover:shadow-glow hover:border-primary/30">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Start free. Upgrade when you need more.</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-primary bg-gradient-card shadow-glow"
                    : "border-border/50 bg-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="mt-8 block">
                  <Button variant={plan.popular ? "hero" : "outline"} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold">Ready to code smarter?</h2>
            <p className="mb-8 text-muted-foreground">Join thousands of developers using CodeGenie AI to ship faster.</p>
            <Link to="/register">
              <Button variant="hero" size="lg" className="gap-2 px-8">
                Get started for free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
