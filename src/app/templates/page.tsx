"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVentureStore } from "@/stores/ventureStore";
import { toast } from "sonner";
import {
  Layers,
  HeartPulse,
  Wallet,
  ShoppingBag,
  Leaf,
  Users,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface Template {
  id: string;
  title: string;
  description: string;
  icon: any;
  tags: string[];
  answers: {
    idea: string;
    targetCustomer: string;
    problemSolved: string;
    existingAlternatives: string;
    geography: string;
    revenueModel: string;
    businessStage: string;
    competitors: string;
    differentiation: string;
    currentValidation: string;
    teamBackground: string;
    pricingStrategy: string;
    distributionChannel: string;
    tamEstimate: string;
  };
}

const TEMPLATES: Template[] = [
  {
    id: "saas-b2b",
    title: "SaaS B2B Productivity",
    description: "Ideal for business workflows, collaboration platforms, and AI-enabled office productivity tools.",
    icon: Layers,
    tags: ["SaaS", "B2B", "Productivity"],
    answers: {
      idea: "We are building an AI-powered project orchestration platform that automates task breakdowns and resource scheduling for mid-market engineering teams.",
      targetCustomer: "Engineering managers and CTOs at software companies with 50-500 employees.",
      problemSolved: "Inefficient manual sprint planning leads to missed release deadlines and engineer burnout.",
      existingAlternatives: "Jira (too complex), Trello (too simple), manual spreadsheets, standing standup meetings.",
      geography: "Global, targeting North American and European remote-first companies initially.",
      revenueModel: "SaaS",
      businessStage: "Idea",
      competitors: "Linear, Monday.com, ClickUp, Asana",
      differentiation: "Proprietary agentic pipeline that creates daily sub-task dependencies directly from Slack threads in 20 seconds.",
      currentValidation: "12 letters of intent from local software agencies; 200 developers signed up on our waitlist.",
      teamBackground: "CTO: ex-Atlassian Senior Engineer; CEO: product lead at Slack for 4 years.",
      pricingStrategy: "$24 per user per month billed annually.",
      distributionChannel: "Product-led growth, organic search engine optimization, and direct outbound to engineering directors.",
      tamEstimate: "$12B global project management software market by 2027.",
    }
  },
  {
    id: "healthcare-ai",
    title: "Healthcare AI Workflow",
    description: "Designed for clinical workflows, medical records processing, and diagnostics assistant platforms.",
    icon: HeartPulse,
    tags: ["Healthcare", "AI", "Enterprise"],
    answers: {
      idea: "We are developing an AI diagnostics assistant that parses medical images to flag early micro-fractures in osteopathic clinical workflows.",
      targetCustomer: "Radiologists and clinic administrators at private orthopedic imaging centers in the United States.",
      problemSolved: "Missed diagnoses of hairline micro-fractures in busy emergency clinics lead to malpractice lawsuits and delayed recovery.",
      existingAlternatives: "Manual second opinions, legacy PACS viewers without computer vision plugins.",
      geography: "United States, Southeast region first.",
      revenueModel: "SaaS",
      businessStage: "Validation",
      competitors: "Viz.ai, Aidoc, Philips Intellispace",
      differentiation: "Dual-model validation trained on 500k osteopathic radiographs with 99.4% accuracy.",
      currentValidation: "Completed a 60-day testing cohort with Atlanta Orthopedics showing a 22% reduction in diagnostic lag times.",
      teamBackground: "Chief Medical Officer: Orthopedic Radiologist (15 yrs); CTO: PhD in Computer Vision from Stanford.",
      pricingStrategy: "$450 per scanner connection per month.",
      distributionChannel: "Direct enterprise sales to clinic owners; integrations with regional EHR distributors.",
      tamEstimate: "$4.5B North American hospital software niche.",
    }
  },
  {
    id: "fintech-consumer",
    title: "Fintech Consumer Finance",
    description: "Perfect for personal wealth management, automated budgeting micro-apps, and mobile investment solutions.",
    icon: Wallet,
    tags: ["Fintech", "Consumer", "Mobile"],
    answers: {
      idea: "We are launching an automated budgeting card and micro-investment app designed specifically to help gig-economy workers hedge irregular income streams.",
      targetCustomer: "Gig-economy workers, delivery couriers, and freelance designers aged 18-35 in Metro areas.",
      problemSolved: "Variable paychecks cause cash flow instability, leading to overdraft fees and lack of long-term retirement savings.",
      existingAlternatives: "Payday loans, high-interest credit lines, manual envelope budgeting, standard checking accounts.",
      geography: "United States, initial rollout in California and New York.",
      revenueModel: "Subscription",
      businessStage: "MVP",
      competitors: "Chime, Albert, Dave, Acorns",
      differentiation: "Dynamic auto-withholding engine that saves higher percentages during high-earning weeks and unlocks interest-free reserves during low weeks.",
      currentValidation: "Finished beta pilot with 450 Uber/DoorDash drivers; total saved reserves reached $120k in 3 months.",
      teamBackground: "CEO: ex-product manager at Robinhood; Lead Dev: early mobile engineer at Cash App.",
      pricingStrategy: "$4.99 per month premium flat subscription.",
      distributionChannel: "Partnerships with courier groups, gig influencer campaigns, and social media referral loops.",
      tamEstimate: "$20B US challenger bank potential market segment.",
    }
  },
  {
    id: "marketplace",
    title: "Local Services Marketplace",
    description: "Tailored for two-sided platforms matching local service providers with end-consumers.",
    icon: Users,
    tags: ["Marketplace", "Local Services", "Gig Economy"],
    answers: {
      idea: "We are creating a trusted marketplace matching commercial kitchen spaces with freelance bakers and catering startups.",
      targetCustomer: "Catering businesses and freelance chefs looking for prep spaces; restaurants with underutilized kitchen off-hours.",
      problemSolved: "Renting commercial kitchen space requires long leases and high security deposits, while local restaurants run empty 60% of the day.",
      existingAlternatives: "Classified ads, cold-calling local restaurant owners, expensive industrial kitchen co-ops.",
      geography: "United Kingdom, London first.",
      revenueModel: "Marketplace",
      businessStage: "Idea",
      competitors: "Peerspace, Kitchen United, local co-working spaces",
      differentiation: "On-demand hourly booking engine with fully integrated health inspector compliance check templates.",
      currentValidation: "Letters of intent from 14 London restaurants ready to list their space; 32 caterers waiting to rent.",
      teamBackground: "CEO: former general manager at Deliveroo; CTO: lead full-stack developer at OpenTable.",
      pricingStrategy: "15% platform take-rate on hourly booking volume.",
      distributionChannel: "Direct outreach to restaurant networks; local chef communities; digital acquisition advertising.",
      tamEstimate: "$1.8B commercial kitchen rental submarket.",
    }
  },
  {
    id: "d2c-ecommerce",
    title: "D2C E-Commerce Brand",
    description: "Optimized for sustainable direct-to-consumer physical products and subscription boxes.",
    icon: ShoppingBag,
    tags: ["D2C", "E-Commerce", "CPG"],
    answers: {
      idea: "We are launching a sustainable direct-to-consumer CPG brand selling compostable household hygiene packages.",
      targetCustomer: "Eco-conscious urban households and families seeking plastic-free alternatives.",
      problemSolved: "Standard household cleaning packages use single-use plastics and contain harsh chemical additives.",
      existingAlternatives: "Method, Grove Collaborative, standard supermarket brands.",
      geography: "Germany, Austria, and Switzerland.",
      revenueModel: "Subscription",
      businessStage: "Idea",
      competitors: "Everdrop, Grove Collaborative, Frosch",
      differentiation: "100% zero-plastic dry concentrates shipped in compostable cardboard envelopes, saving 90% shipping emissions.",
      currentValidation: "Completed product formulary validation; 1,200 newsletter subscribers signed up from organic landing page.",
      teamBackground: "COO: ex-operations head at HelloFresh; CEO: sustainability lead at Unilever.",
      pricingStrategy: "€18 per monthly subscription refill package.",
      distributionChannel: "Social media content marketing, influencer collaborations, and eco-advocacy blogs.",
      tamEstimate: "€8B European eco-cleaning products market segment.",
    }
  },
  {
    id: "climate-tech",
    title: "Climate Tech Accounting",
    description: "Designed for carbon accounting, supply-chain monitoring, and sustainability compliance tools.",
    icon: Leaf,
    tags: ["ClimateTech", "SaaS", "ESG"],
    answers: {
      idea: "We are building an automated carbon accounting SaaS platform that hooks directly into ERP databases to track Scope 3 manufacturing emissions.",
      targetCustomer: "Head of Sustainability and Chief Compliance Officers at European industrial manufacturing firms.",
      problemSolved: "Scope 3 emissions are difficult to track manually, leaving firms open to high regulatory penalties under the new CSRD laws.",
      existingAlternatives: "Manual sustainability consultants, basic spreadsheet estimators, high-end custom enterprise audits.",
      geography: "European Union.",
      revenueModel: "SaaS",
      businessStage: "Idea",
      competitors: "Watershed, Sweep, Persefoni",
      differentiation: "Direct ERP connector API integrating in 15 minutes instead of 6 months of manual database exports.",
      currentValidation: "Signed pilot agreements with 2 major German automotive component suppliers.",
      teamBackground: "CEO: ex-EU Environmental Agency adviser; CTO: database engineer at SAP.",
      pricingStrategy: "€1,200/month basic SaaS flat fee.",
      distributionChannel: "Direct enterprise sales, partnership channels with corporate accounting advisors.",
      tamEstimate: "€5B European environmental compliance software market.",
    }
  }
];

export default function TemplatesPage() {
  const router = useRouter();
  const setAnswers = useVentureStore((state) => state.setAnswers);

  const handleUseTemplate = (template: Template) => {
    // Populate store answers
    setAnswers(template.answers);
    toast.success(`${template.title} Loaded!`, {
      description: "Pre-filled answers loaded successfully. Redirecting to wizard...",
      duration: 3000,
    });
    router.push("/wizard");
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Navigation Header */}
      <header className="docked full-width top-0 sticky z-50 glass-header border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center px-8 h-16 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-headline-md text-xl font-bold tracking-tight text-on-surface">
              VentureLens AI
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/dashboard" className="text-on-surface-variant hover:text-on-surface transition-colors">
                Dashboard
              </Link>
              <Link href="/templates" className="text-secondary border-b-2 border-secondary pb-1">
                Templates
              </Link>
              <Link href="/settings" className="text-on-surface-variant hover:text-on-surface transition-colors">
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/wizard"
              className="bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shadow-sm"
            >
              Start From Scratch
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-accent/10 border border-emerald-accent/20 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-accent" />
              <span className="font-mono text-[10px] text-emerald-accent font-bold uppercase tracking-wider">
                Venture Blueprints
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface">
              Startup Analysis Templates
            </h1>
            <p className="text-on-surface-variant text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              Accelerate your validation. Pick a template matching your vertical to pre-fill the co-pilot form with pre-structured heuristics.
            </p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEMPLATES.map((tpl) => {
            const IconComponent = tpl.icon;
            return (
              <div
                key={tpl.id}
                className="bg-white rounded-xl border border-outline-variant/30 p-6 flex flex-col justify-between micro-shadow hover:macro-shadow transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary group-hover:scale-105 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {tpl.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[10px] font-mono font-bold rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface mb-2">{tpl.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                    {tpl.description}
                  </p>
                </div>
                <button
                  onClick={() => handleUseTemplate(tpl)}
                  className="w-full mt-4 py-3 bg-surface hover:bg-secondary hover:text-white border border-outline-variant text-on-surface text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Custom Templates Section */}
        <div className="mt-16 bg-white p-8 rounded-xl border border-outline-variant/30 text-center max-w-3xl mx-auto shadow-sm">
          <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4 border border-outline-variant/30">
            <Users className="w-5 h-5 text-on-surface-variant" />
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Custom Blueprints</h2>
          <p className="text-on-surface-variant text-xs max-w-md mx-auto mb-6 leading-relaxed">
            Create your own templates from saved analyses. Once you run an audit on a startup, you can save its baseline configurations directly to your profile.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 bg-surface border border-outline-variant text-on-surface px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-surface-container-low transition-colors"
          >
            Go to Portfolio Dashboard
          </Link>
        </div>
      </main>

      <footer className="bg-surface border-t border-outline-variant/30 py-8 text-center text-xs text-on-surface-variant">
        <p>© 2026 VentureLens AI. All rights reserved. <Link href="/" className="underline hover:text-secondary ml-2">Home</Link></p>
      </footer>
    </div>
  );
}
