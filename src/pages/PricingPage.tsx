import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Footer from "@/components/Footer";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["5 prompts per day", "4 programming languages", "Code generation", "Download as .txt", "Basic prompt history"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    features: ["Unlimited prompts", "All languages supported", "AI code explanation", "PDF & file exports", "Priority AI processing", "Admin dashboard access"],
    cta: "Upgrade to Pro",
    popular: true,
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <section className="flex-1 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 max-w-2xl text-center animate-slide-up">
            <h1 className="mb-4 text-4xl font-bold">Simple, transparent pricing</h1>
            <p className="text-lg text-muted-foreground">Start free. Upgrade when you need more power.</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                  plan.popular ? "border-primary bg-gradient-card shadow-glow" : "border-border/50 bg-card"
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
                      <Check className="h-4 w-4 text-success" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="mt-8 block">
                  <Button variant={plan.popular ? "hero" : "outline"} className="w-full">{plan.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
