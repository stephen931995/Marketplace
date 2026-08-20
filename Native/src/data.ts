export interface AppDetail {
  id: string;
  name: string;
  category: string;
  tags: string[];
  shortDescription: string;
  overview: string;
  features: string[];
  /** Not rendered by any view — optional so externally-sourced apps don't need
      invented figures. */
  metrics?: { metric: string; value: string }[];
  businessImpact: string;
  logo: string;
  coverImage: string;
  /** Live app URL — opens in new tab via "Try Now" */
  appUrl: string;
  /** Optional YouTube embed URL for the Demo section */
  demoVideo?: string;
  /** Optional SharePoint URL for the User Manual PDF */
  manualUrl?: string;
  /** Optional SharePoint folder URL for Sample Documents */
  sampleDocsUrl?: string;
  /** Optional note shown in the sidebar card */
  note?: string;
}

export const apps: AppDetail[] = [
  {
    id: "10",
    name: "AeroIntel",
    category: "Aviation",
    tags: ["RAG", "Conversational AI", "Agentic Orchestration"],
    shortDescription: "RAG-Powered AI Assistant for Airport CCR Technicians",
    overview: "AeroIntel is a retrieval-augmented generation (RAG) AI assistant purpose-engineered for airport Constant Current regulators (CCR) technicians operating under time-critical fault resolution pressures.",
    features: [
      "Hybrid RAG pipeline: dense vector search + structured retrieval",
      "Natural language interface with context-aware multi-turn conversation",
      "Fault history lookup with semantic similar-incident matching",
      "Step-by-step maintenance procedure retrieval with guided support"
    ],
    metrics: [
      { metric: "Mean Time to Resolution (MTTR)", value: "60% reduction" },
      { metric: "Query Answer Accuracy (RAG)", value: "93%" },
      { metric: "Retrieval Latency", value: "< 2.5 seconds" }
    ],
    businessImpact: "Dramatically reduces time-to-resolution for technical faults in live airport operations.",
    logo: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://aerointel.systechusa.com/",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=7808812d-3615-42d4-9cfb-6d107a0ad547",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgCEsxmAqVMWS6vG5VYZZ4h5AZDli-jcSkRPf9m9muKDZUY?e=B8ZugM",
    demoVideo: "https://www.youtube.com/embed/HjUVpHIqNDM"
  },
  {
    id: "13",
    name: "VisionIQ™",
    category: "Retail",
    tags: ["Vision Analytics", "Real-Time Anomaly Detection", "Forensic AI"],
    shortDescription: "AI-Powered Intelligent Surveillance and Vision Analytics Platform",
    overview: "VisionIQ™ is an enterprise-grade intelligent video surveillance solution that transforms passive CCTV infrastructure into an active security intelligence layer.",
    features: [
      "Real-time multi-model inference: object detection, pose estimation",
      "Zone-based access control alerting with restricted area polygons",
      "Safety hazard detection: fall, unattended object, smoke/fire",
      "Sub-2-second automated alert dispatch with video clip evidence",
      "Historical incident analytics and spatial heatmap visualisations"
    ],
    metrics: [
      { metric: "Object Detection mAP", value: "96.4%" },
      { metric: "Alert Generation Latency", value: "< 1.8 seconds" },
      { metric: "Incident Response Time Improvement", value: "55%" }
    ],
    businessImpact: "Enables proactive, evidence-driven security operations at scale — reducing incident response times by 55%.",
    logo: "/visioniq.png",
    coverImage: "/visioniq.png",
    appUrl: "https://aicctv.systechusa.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=86fe6446-f567-4e75-a6cb-f67532014845",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgCxtNrn4cTXRJimBu7QxFYlAZ2jpoTmyAUrCfjSNqkGwCY?e=Nc4IXb"
  },
  {
    id: "14",
    name: "aiDE™",
    category: "Data Engineering",
    tags: ["AI Tooling", "MCP", "Semantic Data Layer", "Data Mesh"],
    shortDescription: "Unified AI Data Engineering Toolkit Across Microsoft Fabric, Snowflake, and Databricks",
    overview: "aiDE™ is Systech's AI-powered toolkit built primarily for the Data Analytics and Data Engineering team. It accelerates code generation, data migration, and developer productivity — turning work that would typically take weeks into something that can be completed in hours. By implementing a semantic data layer across Microsoft Fabric, Snowflake, and Databricks, aiDE™ empowers engineers and analysts to move faster with less manual effort.",
    features: [
      "MCP servers purpose-built for Microsoft Fabric and Snowflake",
      "Natural language pipeline creation and Dataflow Gen2 orchestration",
      "Federated cross-platform schema exploration with semantic search",
      "AI agent integration for automated data quality rule generation",
      "Data mesh-aligned domain ownership model with discoverability"
    ],
    metrics: [
      { metric: "Data Platforms Unified", value: "3 platforms" },
      { metric: "Pipeline Automation Coverage", value: "10+ workflows" },
      { metric: "Data Engineering Overhead Reduction", value: "60%" }
    ],
    businessImpact: "Reduces data engineering toil by giving AI agents and analysts a unified, language-driven semantic interface.",
    logo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://aide.systechusa.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=05610c0c-3dd3-4497-9ce7-6919949fb8d4",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgDwG5i_Gw_CS7V87058x4MaAe4kCUR8Dv_qF4oxIoZwXbc?e=iM7VIu"
  },
  {
    id: "03",
    name: "SustainIQ™",
    category: "Sustainability",
    tags: ["Emission Analytics", "GHG Accounting", "Regulatory Reporting"],
    shortDescription: "Full-Cycle ESG Intelligence and Carbon Emission Calculation Platform",
    overview: "The Sustainability platform is an end-to-end ESG intelligence and carbon accounting solution for organisations managing their environmental, social, and governance obligations. It calculates GHG emissions across Scope 1, 2, and 3 in full alignment with the GHG Protocol and GRI Standards.",
    features: [
      "Automated utility bill parsing with AI-driven emission factor mapping",
      "Full Scope 1, 2, and 3 GHG accounting with PCAF-aligned methodology",
      "AI-generated ESG narrative reporting compliant with TCFD and CSRD",
      "Industry peer benchmarking and target-gap analysis dashboards",
      "Net-zero scenario modelling with abatement cost curves"
    ],
    metrics: [
      { metric: "Reporting Cycle Reduction", value: "6 weeks → < 3 hrs" },
      { metric: "Emission Factor Coverage", value: "2,500+" },
      { metric: "Data Accuracy", value: "< 2% variance" }
    ],
    businessImpact: "Compresses multi-week manual ESG reporting cycles into automated, audit-ready output generated in under three hours.",
    logo: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://sustainability.systechusa.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=f9f31578-a878-45ff-ba67-88469521906d",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgDueBD_dA8_SJl3296-oK-QAeISvw58vawzfrhmVVf55wQ?e=RCKEsK",
    demoVideo: "https://www.youtube.com/embed/crAPGo8gTlE"
  },
  {
    id: "15",
    name: "Digital Twin AI Chef™",
    category: "Gaming & Hospitality",
    tags: ["AI Avatar", "Conversational Commerce", "Multimodal AI"],
    shortDescription: "AI-Powered Video Avatar for Food and Beverage Guest Experiences",
    overview: "Chef is a multimodal AI avatar application purpose-built for the food and beverage industry, combining a lifelike AI video presenter with a conversational AI engine.",
    features: [
      "Real-time AI video avatar with lip-sync and affective tone",
      "Personalised dish and menu recommendation engine",
      "Step-by-step guided cooking walkthroughs with real-time Q&A",
      "Allergen matrix and nutritional breakdown display"
    ],
    metrics: [
      { metric: "In-Conversation Order Conversion Rate", value: "40%" },
      { metric: "Average Session Duration", value: "6.2 minutes" },
      { metric: "Allergen Query Accuracy", value: "99.1%" }
    ],
    businessImpact: "Creates a differentiated, always-on digital engagement channel for F&B brands.",
    logo: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://aichef.systechusa.com/login",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=352a7608-c96d-489f-ae54-f4dd029249b8",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgC7OdkQ63sASronm9FcM7kwAcJO-jelf9J-C5tWRYzYLIE?e=4SlkTh",
    demoVideo: "https://www.youtube.com/embed/Od0YaMkkIi4"
  },
  {
    id: "04",
    name: "EcoLensAI™",
    category: "Sustainability",
    tags: ["Vision AI", "Computer Vision", "Compliance Monitoring"],
    shortDescription: "AI-Powered Camera Scanning for Appliance Detection and Sustainability Auditing",
    overview: "EcoLensAI™ is an AI vision application that turns any camera-enabled device — mobile, laptop, or Meta VR headset — into an intelligent sustainability auditing tool. Auditors and facility managers simply open the app, point their camera at appliances, equipment, or infrastructure across data centres, factories, or any facility, and EcoLensAI™ automatically identifies and classifies the objects in real time. Without any manual input, the platform detects appliance types, assesses energy consumption profiles, flags non-compliant or inefficient equipment, and logs findings against the facility's sustainability targets.",
    features: [
      "Real-time multi-class appliance and equipment detection across energy and safety categories",
      "Works across devices — mobile, laptop, and Meta VR headset for immersive facility walkthroughs",
      "Automatic object recognition across data centre equipment, factory machinery, and facility appliances",
      "Automated incident logging with timestamped evidence and location metadata",
      "LLM-generated corrective action recommendations",
      "Compliance scoring dashboard with facility-level trend analytics",
      "Meta VR integration — wear a VR headset, step into any data centre or facility virtually, and monitor and measure sustainability metrics in an immersive, real-world environment"
    ],
    metrics: [
      { metric: "Detection Model Accuracy", value: "94.3% mAP" },
      { metric: "Incident Alert Latency", value: "< 3 seconds" },
      { metric: "Manual Audit Reduction", value: "4–6 walkthroughs/mo" }
    ],
    businessImpact: "Transforms sustainability auditing from periodic manual walkthroughs into a continuous, AI-driven compliance function — accessible from any device, anywhere in the facility.",
    logo: "https://images.unsplash.com/photo-1543965170-e69c8e580e31?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://ecovision.systechusa.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=dacd6b26-1d7b-4f7c-92ec-75c7f4866dd9",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgCjjQ2-IzD4Q4YAHcXjRrxgAWSRxd5gn7fdVUbcbhvzw7c?e=8egedN"
  },
  {
    id: "05",
    name: "ConciergeAI™",
    category: "Gaming & Hospitality",
    tags: ["Conversational AI", "Agentic Automation", "Omnichannel"],
    shortDescription: "AI Avatar Booking and Guest Services Agent for Hotels and Amenities",
    overview: "ConciergeAI™ is an enterprise-grade conversational AI agent that manages end-to-end hotel booking workflows and guest service orchestration through a lifelike, low-latency AI avatar interface.",
    features: [
      "Multi-turn NLU/NLG conversational pipeline with session context",
      "Full booking lifecycle management: search, availability, reservation",
      "Amenity reservation orchestration across dining, spa, and pool",
      "Lifelike AI avatar interface with lip-sync and affective tone"
    ],
    metrics: [
      { metric: "Front-Desk Call Deflection Rate", value: "30–38%" },
      { metric: "Booking Completion Rate", value: "72%" },
      { metric: "Service Availability", value: "24/7" }
    ],
    businessImpact: "Reduces front-desk workload and call centre operating costs while meaningfully increasing ancillary revenue.",
    logo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://ai-avatar.dopplr.ai/",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=dd0be3a6-7507-4ee8-becc-896375be4866",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgB3ARczmOoESIPQKeK4uI3cAVnYZu2ocPNg2aPoH6bdXQI?e=IZ9GRB"
  },
  {
    id: "12",
    name: "IntelliFrame™",
    category: "Design",
    tags: ["Generative AI", "Prompt-to-Prototype", "UX Automation"],
    shortDescription: "AI Wireframe Generator for Dashboards and Data Products",
    overview: "IntelliFrame™ accelerates the design-to-development pipeline by generating annotated dashboard and application wireframes directly from natural language briefs.",
    features: [
      "Prompt-to-wireframe generative pipeline for dashboards and apps",
      "Schema-aware layout intelligence for information hierarchy",
      "Component annotations with UX rationale and breakpoint guidance",
      "Design system compliance checking against style guides",
      "Export to annotated image, PDF, and structured JSON formats - It can be exported as  PDF/HTML",
      "Company website theming — provide a URL and IntelliFrame™ extracts the brand's colour palette, typography, and layout style to generate wireframes that match the company's own design language"
    ],
    metrics: [
      { metric: "Wireframing Cycle Reduction", value: "80%" },
      { metric: "Design-to-Dev Alignment Time", value: "3x faster" },
      { metric: "Specification Completeness", value: "95%+" }
    ],
    businessImpact: "Compresses multi-week wireframing and design iteration cycles into hours.",
    logo: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://intelliframe.systechusa.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=4914f963-f136-41fe-9e4c-4003e83e2130",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgBYBBAGDIHuT5BYCHBU_mAiAUMb1ONDRijRCRoph45OZVo?e=iCTgLM"
  },
  {
    id: "01",
    name: "PromoIQ™",
    category: "Gaming & Hospitality",
    tags: ["AI Generation", "Personalisation Engine"],
    shortDescription: "AI-Powered Personalised Promotional Coupon Engine for Casino Players",
    overview: "PromoIQ™ is an enterprise-grade AI personalisation and incentive generation platform purpose-built for the gaming and casino industry. Leveraging propensity modelling, CLV segmentation, and real-time behavioural analytics, PromoIQ™ analyses each player's game preferences, visit frequency, win/loss ratios, and spend velocity to craft hyper-targeted promotional offers.",
    features: [
      "Propensity-model-driven player segmentation across CLV tiers",
      "LLM-powered promotional copy generation with configurable reward logic",
      "Real-time multi-channel offer delivery via Mail",
      "A/B testing framework with statistical significance tracking",
      "Campaign performance analytics with attribution modelling"
    ],
    metrics: [
      { metric: "Offer Personalisation Accuracy", value: "92%+" },
      { metric: "Promotional ROI Uplift", value: "2.8x–3.5x" },
      { metric: "Player Retention Improvement", value: "35%" }
    ],
    businessImpact: "Replaces guesswork-driven promotional spend with a closed-loop AI decisioning engine — increasing promotional ROI and reducing churn.",
    logo: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://maverickwizard.powerappsportals.com/",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=ef486899-f0df-4413-9b68-f17b1e019526",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgCvxxgP5MBQQLaoxLG4xwJGATtaCUO90QAdrRxPE6TXOBE?e=29YcLI",
    note: "Power BI access is required to view the dashboards in this application."
  },
  {
    id: "16",
    name: "Ops Reporting Portal™",
    category: "Reporting",
    tags: ["Self-Service BI", "Report Builder", "Operational Analytics"],
    shortDescription: "Self-Service Operational Reporting and Analytics Portal for Exchange Operations",
    overview: "Ops Reporting Portal™ is a self-service business intelligence and operational reporting platform purpose-built for foreign exchange and remittance operations. It provides branch managers, compliance officers, and operations teams with an intuitive, no-code interface to access, explore, and export live operational reports — eliminating dependency on IT for routine data requests.\n\nThe platform centralises reporting across teller transactions, currency stock, customer analytics, queue SLA performance, wire transfer inquiries, and branch compliance checklists into a unified, permission-controlled dashboard. Users can collaborate directly on reports via inline comments, raise IT incidents from within the portal, and export any dataset to PDF or Excel in a single click.",
    features: [
      "Self-service report builder with configurable field selection and chart types",
      "Live synthetic data generation across teller, FX stock, and compliance report types",
      "One-click PDF and Excel export with branded formatting via jsPDF and SheetJS",
      "Inline report collaboration — comment threads and @mentions per report",
      "IT incident raising directly from report context with automated ticket logging"
    ],
    metrics: [
      { metric: "Report Types Available", value: "8 operational domains" },
      { metric: "IT Data Request Reduction", value: "75%" },
      { metric: "Export Generation Time", value: "< 3 seconds" }
    ],
    businessImpact: "Empowers operations teams with on-demand access to critical reporting — reducing IT data request queues and accelerating branch-level decision-making.",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://finex.systechusa.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=190aa01e-2bce-49ab-bfdc-c3c4a6aee492",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgAqAHhB7YFLQIaXJg9XCWe7AXOvDTOQr6h83C8GIQ70td4?e=EvYMWM",
    demoVideo: "https://www.youtube.com/embed/eAq8HerPL28"
  },
  {
    id: "08",
    name: "Orbit™",
    category: "Project Management",
    tags: ["Project Management", "Delivery Intelligence", "Operational Visibility"],
    shortDescription: "Systech's Internal Project and Ticket Tracking System",
    overview: "Orbit™ is Systech's purpose-built internal ticket and project tracking platform. It is focused on creating tickets within a project, assigning them to the right people, and managing escalations — not sprint or backlog management. Orbit™ is also integrated with Microsoft Teams, making it easy to raise a ticket or escalate directly from a Teams conversation without switching context.",
    features: [
      "Ticket creation and assignment within projects",
      "Escalation management with direct Microsoft Teams integration",
      "Full ticket lifecycle management with configurable workflow states",
      "Team member assignment with clear ownership tracking",
      "Real-time SLA and delivery breach alerting with escalation routing"
    ],
    metrics: [
      { metric: "Projects Under Active Management", value: "12+" },
      { metric: "On-Time Delivery Improvement", value: "30%" },
      { metric: "Ticket Visibility", value: "100%" }
    ],
    businessImpact: "Gives Systech leadership a single source of operational truth — replacing fragmented communication with a structured hub.",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://orbit.systechusa.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=f260a37f-81f9-40e7-9396-faa29c15c2e8",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgC_rQW8VlGYRpM_so4QUCInAbTBfggQKrgUWXXtpUcrmX8?e=QLhQ2H"
  },
  {
    id: "17",
    name: "Quote Generator™",
    category: "Tech",
    tags: ["AI Quoting", "Hardware Intelligence", "Procurement Automation"],
    shortDescription: "AI-Powered Hardware Appliance Quote Engine with Smart Product Recommendations",
    overview: "Quote Generator™ is an AI-driven procurement intelligence platform that transforms hardware quoting from a time-consuming manual process into an instant, intelligent experience. Built for distributors, procurement officers, and field sales teams, it connects directly to live product databases to retrieve real-time stock levels, pricing, and compatibility matrices — generating accurate, professionally formatted quotes in seconds.\n\nUsers can describe their requirements in plain language — such as '25 bathroom fittings for a hotel fit-out' — and the AI engine interprets the request, retrieves the matching SKUs, identifies complementary and required accessories, validates stock availability, and computes a line-item quote complete with quantities, unit pricing, discounts, and lead times. The platform also supports image-based input: users can photograph or upload a hardware appliance, and the vision AI layer identifies the product, retrieves specifications, and prepares an instant procurement recommendation — accelerating field-to-quote workflows by an order of magnitude.",
    features: [
      "Natural language to structured quote — describe any hardware requirement in plain English",
      "Vision AI product identification — upload an image of any appliance to trigger instant quote generation",
      "Live database integration — real-time stock levels, pricing tiers, and supplier lead times",
      "Smart accessory bundling — AI recommends compatible, required, and frequently co-purchased items",
      "Professional quote output — branded PDF with line items, quantities, pricing, discounts, and totals",
      "Quote history and revision tracking — full audit trail with version comparison"
    ],
    metrics: [
      { metric: "Quote Generation Time", value: "< 30 seconds" },
      { metric: "Product Match Accuracy", value: "97.2%" },
      { metric: "Procurement Cycle Reduction", value: "70%" }
    ],
    businessImpact: "Eliminates days of manual catalogue searching and quote preparation. Sales and procurement teams close faster, reduce errors, and serve customers with instant, accurate hardware quotes — directly from a natural language request or a product photo.",
    logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://wizard-auto-quote.dopplr.ai/",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=15c8fc96-d45d-4edf-95c1-42f799da280b",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgB-JGbZDA5zR4U2Rls6PRCQASsWt27jdSqPRIDAMvxaO-8?e=VnClee",
    demoVideo: "https://www.youtube.com/embed/-167bvJr9xg"
  },
  {
    id: "07",
    name: "Resonance™",
    category: "L&D",
    tags: ["Communication AI", "Speech Analytics", "Behavioural Coaching"],
    shortDescription: "AI Communication Coaching Platform for Professional Upskilling",
    overview: "Resonance™ is an AI-powered communication coaching and behavioural development platform built to help professionals build confident, high-impact communication skills at scale.",
    features: [
      "Multi-layer speech analytics: prosody, filler word, pacing, sentiment",
      "LLM-based coherence, persuasion, and executive presence evaluation",
      "Adaptive scenario library for presentations and negotiations",
      "Individual competency mapping with skill growth trajectories",
      "Team-level L&D analytics dashboard with cohort benchmarking"
    ],
    metrics: [
      { metric: "Avg Communication Score Improvement", value: "28%" },
      { metric: "Filler Word Reduction", value: "40%" },
      { metric: "Session Completion Rate", value: "83%" }
    ],
    businessImpact: "Builds measurable, lasting communication competency at scale — replacing subjective coaching with a data-driven engine.",
    logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://resonance.systechusa.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=92525381-74f9-433e-ba54-150cf0441542",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgCXUdd5-bcIRrNUDSoBUAmIAeC4KAAPVs9SfaP9wqkP1Ns?e=nosag1"
  },
  {
    id: "18",
    name: "SafeWatch™",
    category: "Sustainability",
    tags: ["PPE Detection", "Safety Compliance", "Computer Vision"],
    shortDescription: "AI-Powered Worker Safety and PPE Compliance Monitoring for Manufacturing Environments",
    overview: "SafeWatch™ is an industrial-grade AI video surveillance platform purpose-built for manufacturing, construction, and heavy-industry environments where worker safety compliance is mission-critical. Powered by real-time computer vision and edge AI inference, SafeWatch™ continuously monitors CCTV feeds across factory floors, assembly lines, loading docks, and hazardous zones — automatically detecting PPE compliance violations, safety hat absence, high-visibility vest non-adherence, and restricted area breaches as they happen.\n\nThe platform goes beyond passive recording: it generates instant alerts when violations occur, logs every event with timestamped video clips, and produces daily safety compliance dashboards for HSE officers and plant managers. With support for multi-camera deployments and integration with existing CCTV infrastructure, SafeWatch™ delivers enterprise-grade occupational safety enforcement without requiring manual monitoring — helping manufacturers meet ISO 45001, OSHA, and local HSE regulatory requirements with full digital evidence trails.",
    features: [
      "Real-time PPE detection — hard hats, safety vests, goggles, gloves, steel-toe boots, and ear protection",
      "Safety hat absence alerting with individual worker tracking across camera zones",
      "Restricted zone intrusion detection with configurable polygon boundaries",
      "Multi-camera orchestration — supports 100+ concurrent CCTV streams per deployment",
      "Instant violation alerts via email, SMS, or integration with plant safety systems",
      "Compliance scoring dashboards — zone-level, shift-level, and individual worker reporting",
      "Timestamped video clip evidence for HSE audits and incident investigations",
      "Edge AI inference — operates on-premise with low-latency processing, no cloud dependency required"
    ],
    metrics: [
      { metric: "PPE Detection Accuracy", value: "98.1%" },
      { metric: "Violation Alert Latency", value: "< 2 seconds" },
      { metric: "Safety Incident Reduction", value: "62%" }
    ],
    businessImpact: "Transforms reactive safety management into proactive, AI-driven compliance enforcement. Manufacturers deploying SafeWatch™ report a 62% reduction in recordable safety incidents within the first six months, alongside measurable improvements in OSHA and ISO 45001 audit scores — reducing both human risk and regulatory liability.",
    logo: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://wizard-visionpro-safetyanalytics.dopplr.ai/",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=8f60a6b9-e149-400f-a72e-392f2703c7a9",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgA5S7VS3bPqTYY-1gVssnbIAUG2DIqdq8I34RVHUL_ft0s?e=QyBclu"
  },
  {
    id: "11",
    name: "RetailIQ™",
    category: "Retail",
    tags: ["Conversational AI", "Text-to-SQL", "RAG"],
    shortDescription: "Databricks-Powered AI Chatbot for Retail Operations",
    overview: "RetailIQ™ is a conversational AI platform for retail operations, combining live Text-to-SQL query execution over transactional databases with RAG over a product catalogue.",
    features: [
      "Text-to-SQL engine for natural language queries against inventory",
      "RAG over product catalogues and return/refund policies",
      "Freshchat and FreshDesk integration with intelligent AI-to-human handoff",
      "Replies instantly within 3 sec",
      "Intent classification pipeline for query routing"
    ],
    metrics: [
      { metric: "Self-Service Resolution Rate", value: "85%" },
      { metric: "Support Ticket Volume Reduction", value: "40%" },
      { metric: "Avg Query Resolution Time", value: "< 8 seconds" }
    ],
    businessImpact: "Reduces support agent workload and operational costs by resolving 85% of routine queries automatically.",
    logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://sysmart.systechusa.com",
    demoVideo: "https://www.youtube.com/embed/WQ8dxn5BQT0",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=0c67b7aa-c2d0-46aa-9063-5694334de0fe",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgB7LmIYY4cgQoFNoKqtccY6AXQ9h632O1vx7yQqLvh6ufk?e=Fha3fo"
  },
  {
    id: "09",
    name: "SkillIQ™",
    category: "L&D",
    tags: ["Technical Assessment", "Talent Benchmarking", "Adaptive Testing"],
    shortDescription: "Systech's Proprietary Technical Assessment and Skills Benchmarking Platform",
    overview: "SkillIQ™ is Systech's internally-built technical assessment platform — the equivalent of HackerRank designed for Systech's specific hiring and capability benchmarking requirements.",
    features: [
      "Timed coding challenge engine across Python, SQL, and DE tracks",
      "Auto-graded multi-case test runner with partial credit scoring",
      "Candidate-facing secure assessment portal with proctoring",
      "Domain-tagged question bank with difficulty classification",
      "Percentile ranking and skill heatmap visualisations"
    ],
    metrics: [
      { metric: "Question Bank Depth", value: "500+" },
      { metric: "Scoring Objectivity", value: "100% auto-graded" },
      { metric: "Candidate Funnel Improvement", value: "60%" }
    ],
    businessImpact: "Standardises technical talent evaluation at Systech — providing a statistically-objective assessment baseline.",
    logo: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://sysrank.systechusa.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=a39a0e07-3823-41ae-b370-f352059541d1",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgD9pP_IHc7XQa6Z111K5TvxAdQP72TwGGPxJClu7eRCxxg?e=D0mvcd"
  },
  {
    id: "20",
    name: "PR Vision360",
    category: "FMCG",
    tags: ["PR Risk Analysis", "Procurement Intelligence", "AI Agents", "ERP Integration", "Risk Classification"],
    shortDescription: "AI-Powered Procurement Risk Intelligence Platform for Purchase Requisition Analysis",
    overview: "PR Vision360 is an AI-powered Procurement Risk Intelligence application designed to help procurement teams analyse Purchase Requisitions (PRs), identify procurement risks, and reduce manual review effort before ERP approvals. Using AI-driven analysis across PR transaction history, budget data, contracts, policies, NDA documents, vendor data, and procurement documents, the platform recommends whether a PR can be auto-approved or bucketed into risk categories — escalated, hold, rejected, or pending review — with full AI-generated explainability for every decision.",
    features: [
      "AI-powered PR risk analysis with automated recommendation engine — classifies each PR as auto-approve, escalate, hold, reject, or pending review",
      "Specialist AI agents for budget validation, duplicate procurement detection, pricing variance analysis, contract validation, NDA compliance, and vendor risk scoring",
      "Historical PR transaction analysis for budget utilisation tracking and procurement trend comparison across cost centres and categories",
      "Interactive AI Procurement Copilot chatbot — provides real-time procurement guidance, policy lookups, and PR status explanations in natural language",
      "Procurement Risk Intelligence Heatmap and AI insights dashboard — visualises risk concentration across vendors, categories, and business units",
      "ERP and source system connectivity with intelligent procurement document processing for POs, contracts, and policy files",
      "Outlook/Office 365 integration for automated procurement notifications, approval routing, and report sharing",
      "AI-generated procurement evidence and explainability reports — every recommendation is accompanied by traceable reasoning, policy references, and supporting data"
    ],
    metrics: [
      { metric: "Manual PR Review Effort Reduction", value: "70%" },
      { metric: "PR Risk Classification Accuracy", value: "94.5%" },
      { metric: "Auto-Approval Rate (Low-Risk PRs)", value: "60%" }
    ],
    businessImpact: "Transforms procurement from reactive manual reviews into proactive AI-driven risk intelligence — reducing approval cycle times, preventing policy violations, and equipping procurement teams with full explainability and audit trails for every PR recommendation.",
    logo: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://prvision360.systechusa.com/",
  },
  {
    id: "19",
    name: "ProcureMatch 360°",
    category: "FMCG",
    tags: ["3-Way Match", "Invoice Auditing", "AI OCR", "Fraud Detection", "Accounts Payable"],
    shortDescription: "AI-Powered Automated 3-Way Match and Invoice Auditing Platform",
    overview: "ProcureMatch 360° is an automated, AI-powered 3-Way Match and Invoice Auditing application designed to eliminate billing errors, fraud, and duplicate payments. By intelligently connecting invoice data with Purchase Orders (POs) and Goods Received Notes (GRNs), ProcureMatch 360° calculates dynamic match scores, flags discrepancies, and streamlines the entire payment clearance workflow — all within a single unified platform enhanced by an interactive AI Chat Copilot that references live financial data.",
    features: [
      "AI Mailbox Polling — connects directly to Outlook/Office 365 Exchange to auto-download, parse, and ingest incoming invoice documents without manual intervention",
      "Manual and batch document uploads with advanced AI OCR to extract supplier details, line items, quantities, and values from invoices, POs, and GRNs",
      "Automated 3-way reconciliation — cross-references invoice data with corresponding Purchase Orders and Goods Received Notes with configurable tolerance thresholds",
      "Dynamic match scoring (0–100%) calculated across price, quantity, and value dimensions to flag partial or full mismatches",
      "Duplicate detection engine — flags matching supplier and invoice value occurrences to prevent double payments before they occur",
      "Discrepancy inspection workflows — routes price variances, split-invoice overbilling, and supplier mismatches to 'Send to Procurement' or 'Clarification Email' action queues",
      "Payment clearance module — authorised users can pay now, schedule payments, select funding bank profiles, and maintain a full settled payments ledger",
      "Interactive AI Chat Copilot — context-aware assistant that generates SQL queries, explains discrepancies, drafts supplier clarification emails, and links directly to filtered dashboards"
    ],
    metrics: [
      { metric: "Duplicate Payment Prevention Rate", value: "99.2%" },
      { metric: "Invoice Processing Time Reduction", value: "85%" },
      { metric: "3-Way Match Accuracy", value: "96.8%" }
    ],
    businessImpact: "Eliminates manual 3-way matching and compresses invoice-to-payment cycles — enabling AP teams to process significantly higher invoice volumes with zero additional headcount while dramatically reducing fraud exposure and billing error risk.",
    logo: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://procurematch360.systechusa.com",
  },
  {
    id: "06",
    name: "InterviewIQ™",
    category: "HR Tech",
    tags: ["AI Screening", "Multimodal Assessment", "Talent Intelligence"],
    shortDescription: "End-to-End AI-Powered Candidate Screening and Interview Intelligence Platform",
    overview: "InterviewIQ™ is an end-to-end AI-powered recruitment platform that covers the entire hiring pipeline — from ATS profile matching, to AI-moderated video interview recording, through to intelligent evaluation and scoring. It automates every stage of candidate screening so recruiters can focus on final decisions rather than manual assessment.",
    features: [
      "End-to-end AI pipeline — ATS profile matching, video recording, and AI-powered evaluation in one system",
      "ATS integration with intelligent profile matching against job requirements",
      "AI-moderated video interviews with native audio and visual understanding",
      "Video proctoring with fullscreen enforcement and tab-switch detection",
      "Multi-dimensional candidate evaluation rubric with automated scoring",
      "Automated structured hiring reports with competency gap analysis"
    ],
    metrics: [
      { metric: "Time-to-Screen Reduction", value: "70%" },
      { metric: "Evaluation Consistency", value: "94%" },
      { metric: "Recruiter Satisfaction Score", value: "4.6 / 5.0" }
    ],
    businessImpact: "Eliminates screening bottlenecks and reduces time-to-hire by 70% while maintaining evaluation rigour.",
    logo: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://vetailabs.systechusa.com/api",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=9338667a-5a69-4f41-bc36-d0b7861df03a",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgD5HB-lRMIwQJw7mg3beIacAcors4zaf7ETqJZ20O3SylA?e=y4olXO"
  },
  {
    id: "21",
    name: "Fraud Investigation Command Center™",
    category: "Insurance",
    tags: ["Fraud Detection", "AI Investigation", "Insurance Analytics", "Databricks"],
    shortDescription: "AI-Augmented Fraud Investigation and Operations Analytics Platform for Insurance Enterprises",
    overview: "The Fraud Investigation Command Center™ is an AI-augmented fraud detection and investigation platform built on the Databricks Lakehouse. It unifies machine learning, generative AI, and investigative workflows into a single governed environment — enabling insurance teams to detect, prioritize, and resolve fraudulent claims faster and with greater accuracy.",
    features: [
      "AI-ranked investigation pipeline with automated case prioritization, status tracking, and full audit trail",
      "Trend analysis with time-series fraud pattern detection, geographic heat maps, and ML-powered forecasting",
      "Investigator performance KPIs covering resolution rate, accuracy, and quality scoring against AI risk signals",
      "ROI analysis quantifying fraud recovery, AI lift versus manual workflows, and projected savings",
      "GenAI Insights with Genie natural language queries, Supervisor Agent orchestration, and document intelligence"
    ],
    metrics: [
      { metric: "Fraud Detection Throughput", value: "3× faster" },
      { metric: "Investigator Productivity Uplift", value: "60%" },
      { metric: "AI-Assisted Recovery Rate", value: "85%" }
    ],
    businessImpact: "Transforms reactive fraud investigation into a proactive, AI-driven operation — accelerating case throughput, elevating investigator effectiveness, and delivering measurable financial ROI through governed, explainable AI built natively on the Databricks Lakehouse Platform.",
    logo: "/fraud-investigation.png",
    coverImage: "/fraud-investigation.png",
    appUrl: "https://insurancefraudinvestigation-7405613850690869.9.azure.databricksapps.com",
    demoVideo: "https://www.youtube.com/embed/it9TymbQEhU",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=708bba9e-8480-432d-8a4d-bbf25f0135d7",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgDd0rUXTmtbTJVypIem2aMnAYy2x8ezDAxJHdqSAzTBlGk?e=s7OqCE"
  },
  {
    id: "22",
    name: "CFO Lens™",
    category: "Finance",
    tags: ["Unity Catalog", "Databricks SQL", "AI/BI Dashboard"],
    shortDescription: "Centralized Financial Reporting and Analytics Platform for Finance Leaders",
    overview: "CFO Lens™ is a centralized financial reporting and analytics solution designed for finance teams and business leaders. It brings together key financial information into a single, easy-to-use platform, enabling users to track performance, monitor trends, and access actionable insights through interactive dashboards. The solution helps organizations improve financial visibility, streamline reporting, and support faster, more informed decision-making.",
    features: [
      "Interactive dashboards to explore revenue, expenses, profitability, cash flow, and overall financial health",
      "Unified, governed view of financial performance across the organization",
      "Automated reporting, alerts, and monitoring to stay informed and respond proactively to changing conditions",
      "Forecast vs. actual analysis and budget tracking for accurate financial planning",
      "Cost optimization and margin monitoring with detailed business unit and cost center insights",
      "Built on Databricks AI/BI Dashboards (Lakeview) over Unity Catalog and Delta Lake, with Ask Genie for natural-language insights"
    ],
    metrics: [
      { metric: "Financial KPI Visibility", value: "Real-time" },
      { metric: "Reporting Effort", value: "Automated" },
      { metric: "Forecast vs. Actual Analysis", value: "Built-in" }
    ],
    businessImpact: "Enables finance teams, executives, and business stakeholders to make faster, more confident decisions — improving financial visibility, consistency, and efficiency while reducing the effort required to compile and analyze financial reports.",
    logo: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://adb-538514348099943.3.azuredatabricks.net/dashboardsv3/01f1529c328d155489c6b599ad0ed2f9/published?o=538514348099943",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=9386f032-57a9-49fd-b1ce-d1933bb411e1",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgDXiANMigZ2RKHMRQvld6TaAWYTrhXlJKgbndynqnHKByo?e=uwslin"
  },
  {
    id: "23",
    name: "GovernIQ™",
    category: "Data Engineering",
    tags: ["Unity Catalog", "Data Governance", "FinOps", "Streamlit"],
    shortDescription: "Automated Unity Catalog Governance Readiness Assessment and Remediation",
    overview: "GovernIQ™ evaluates your Databricks Unity Catalog environment and delivers an executive-ready readiness score with actionable recommendations. It identifies governance gaps, undocumented assets, and cost optimization opportunities across catalogs, and separately surfaces DBU consumption and expensive query patterns for FinOps accountability — purpose-built for data leaders and platform teams driving catalog adoption and Genie enablement.",
    features: [
      "Automated assessment across five governance dimensions: metadata completeness, access governance, data quality, query performance, and Genie readiness",
      "Executive-ready RAG-scored dashboard with interactive gauge charts and drill-down into individual table health",
      "Filterable recommendations prioritized by severity for faster mean-time-to-resolution",
      "FinOps cost analysis of DBU consumption by SKU and product, plus expensive-query detection",
      "One-click bulk remediation — add descriptions, apply tags, run OPTIMIZE, and generate SQL scripts directly against Unity Catalog",
      "Professional Excel scorecard export matching enterprise governance frameworks"
    ],
    metrics: [
      { metric: "Governance Dimensions Assessed", value: "5" },
      { metric: "Catalog Audit Time", value: "Minutes vs. weeks" },
      { metric: "Remediation", value: "One-click" }
    ],
    businessImpact: "Turns scattered catalog metadata into a single executive-ready score — making governance posture measurable and reportable, accelerating remediation with one-click fixes, and connecting governance quality to cost through DBU-level FinOps accountability.",
    logo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://governiq-7405613850690869.9.azure.databricksapps.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=3cdd646b-c4c3-46f0-b17e-eac523cb9cd5",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgC8hv1NCSezSbKucKjIOjt5Aao8dSKi7j4Z41HDC72ZJN0?e=1sigty"
  },
  {
    id: "24",
    name: "Parsify",
    category: "Data Engineering",
    tags: ["Document Intelligence", "Schema Generation", "Microsoft Fabric", "API Automation"],
    shortDescription: "AI Document-to-Warehouse Pipeline — PDF to Structured JSON, API, Schema and Fabric Tables",
    overview: "Parsify turns unstructured documents into governed, queryable warehouse data without writing ingestion code. Upload a PDF and Parsify extracts its contents into clean, structured JSON and immediately publishes a live API endpoint that serves that data — so downstream applications can consume it straight away.\n\nFrom there, Parsify carries the data all the way into the warehouse. The AI layer inspects the extracted JSON and proposes a data model — entities, columns, data types, keys and relationships — then generates the corresponding DDL. The proposed schema is fully editable: users can rename columns, change types, add or drop fields, and adjust keys before anything is committed. Once approved, Parsify creates the tables directly in a Microsoft Fabric warehouse and loads the parsed data into them, closing the loop from raw document to analytics-ready table in a single guided workflow.",
    features: [
      "AI extraction of unstructured PDF content into clean, structured JSON",
      "Automatic API endpoint generation — every parsed document is instantly served as a JSON REST endpoint",
      "AI-assisted data modelling — infers entities, columns, data types, keys and relationships from the extracted data",
      "AI-generated DDL with a fully editable schema — alter columns, types and keys before anything is committed",
      "Direct table creation in Microsoft Fabric warehouse from the approved schema",
      "Automated data load from parsed JSON into the newly created Fabric tables",
      "End-to-end lineage from source document through JSON payload to warehouse table"
    ],
    metrics: [
      { metric: "Document to Live API", value: "Minutes, not sprints" },
      { metric: "Schema and DDL Authoring", value: "AI-generated, fully editable" },
      { metric: "Manual Ingestion Effort Reduction", value: "80%" }
    ],
    businessImpact: "Removes the custom parser-and-pipeline work that normally sits between a document and the warehouse. Data teams go from a stack of PDFs to a modelled, loaded Microsoft Fabric table — with a consumable API along the way — in a single AI-guided workflow instead of days of bespoke engineering.",
    logo: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://parsify.systechusa.com",
  },
  {
    id: "25",
    name: "Scout",
    category: "Bid Management",
    tags: ["Tender Intelligence", "Agentic AI", "Go/No-Go Scoring", "Proposal Automation", "Human-in-the-Loop"],
    shortDescription: "Agentic Tender and Bid Management Platform — Discovery to Draft Proposal",
    overview: "Scout is an end-to-end tender and bid management platform driven by a team of specialised AI agents. It continuously monitors publicly available tender sources — government procurement portals and agency feeds — and matches new opportunities against the firm's own bid history, capability profile and past submissions, surfacing only what is genuinely relevant.\n\nFor each opportunity, Scout runs a structured bid workspace across four stages: Analyse, Go/No-Go Decision, Team, and Draft. It reads the tender documents and produces a cited analysis, compares the opportunity against similar bids the firm has already delivered, scores a Go/No-Go recommendation across strategic fit, capacity and resourcing, competitive position and margin potential, allocates a multi-disciplinary team from live staff availability, and drafts the proposal itself.\n\nEvery AI output is advisory, evidence-linked and reversible. Recommendations cite the exact clause and page they came from, humans can override any score or decision with a written justification that triggers a re-assessment, and the full decision version history is retained. Separate Approve, Insights, Knowledge and Govern workspaces handle management sign-off, win/loss analytics, the firm's reference document library, and oversight of what each agent did.",
    features: [
      "Automated tender discovery — monitors public government and agency procurement feeds and scores each opportunity for relevance",
      "Past-bid matching — compares every live tender against the firm's own submission history to surface directly comparable work",
      "AI tender analysis — extracts agency, estimated value, closing date, required disciplines and eligibility conditions, cited to the source document",
      "Go/No-Go scoring agent — composite recommendation across strategic fit, capacity and resourcing, competitive position and margin potential, with clause-level evidence",
      "Human override with re-assessment — reject any AI score, state what it got wrong, and the agent re-scores and rewrites its rationale; full decision version history is retained",
      "AI team allocation — recommends a multi-disciplinary team from live staff availability, flagging capacity conflicts, capability coverage gaps and recommended subconsultants",
      "Proposal drafting agent with a conversational editor for refinement, plus PDF and Word (.docx) export",
      "Approvals workspace for higher-management sign-off before submission",
      "Insights workspace — win/loss analytics by sector, resource utilisation, financial performance, competitive benchmarking and forecast utilisation, with a natural language chatbot over the firm's bid data",
      "Knowledge workspace — indexed artefact library across live tenders, past bids, resourcing, templates, market feeds, methodologies, rate cards and design principles",
      "Govern workspace — agent oversight showing what each agent did, decisions humans corrected, citation traceability and per-agent run cost"
    ],
    metrics: [
      { metric: "Bid Lifecycle Covered", value: "Discovery → Draft → Approval" },
      { metric: "AI Decisions Linked to Source Evidence", value: "100%" },
      { metric: "Bid Qualification Effort Reduction", value: "65%" }
    ],
    businessImpact: "Replaces the fragmented, manual scramble of tender monitoring, qualification, resourcing and proposal writing with a single governed pipeline. Bid teams pursue better-qualified opportunities, resource them against real availability, and produce a first-draft submission in a fraction of the time — while leadership retains full override authority and an auditable record of every AI recommendation.",
    logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://scout.systechusa.com",
  },
  {
    id: "26",
    name: "MedScribe",
    category: "Life Sciences",
    tags: ["MLR Review", "RAG", "Content Generation", "Regulatory Compliance", "Human-in-the-Loop"],
    shortDescription: "AI-Assisted Medical, Legal and Regulatory (MLR) Content Studio",
    overview: "MedScribe is an AI-assisted studio that helps medical, legal and regulatory (MLR) teams create channel-ready content that is grounded in approved source documents, checked against a curated guideline library, and routed to a human reviewer for approval. Nothing is ever auto-approved — every AI output is evidence-backed and a qualified person makes the final call.\n\nThe Validator checks any uploaded document for accuracy and compliance, with every finding cited to the exact page and, for compliance findings, to the specific guideline document and page the rule came from. The Campaign module turns an approved source document into on-brand social content against an objective you set. The Studio produces channel-ready post variants and images, runs the full three-pillar MLR Check, and routes selected assets for human approval. The Knowledge Base holds the guideline corpus — advertising codes, clinical practice, AI ethics and treatment guidelines — that all compliance checks read from.\n\nEvery MLR Check evaluates content across three pillars: Accuracy (language quality, grammar, punctuation, consistency and scientific traceability), Compliance (alignment with approved guidelines), and Adaptation (platform and audience fit — disclaimers, visual restrictions, prescription vs OTC, cross-channel consistency). Each item is marked Pass, Needs attention, or Not applicable with a short explanation and supporting evidence.",
    features: [
      "Validator — checks any PDF for accuracy (grammar, spelling, punctuation, spacing, consistency) and compliance, with page-level citations and an in-app PDF viewer that jumps to the exact page",
      "US and British English variant selection — spelling and grammar findings judged against the chosen variant",
      "Guideline-grounded compliance — findings cite the specific guideline document and page the rule came from",
      "Three-pillar MLR Check across Accuracy, Compliance and Adaptation, with per-item explanation and evidence",
      "Campaign generation — turns an approved source document into on-brand content by market, audience and therapy area, with every claim mapped to a document and page",
      "Studio — generates LinkedIn and Instagram post variants and accompanying images or reels, each individually grounded in the source",
      "Reviewer instructions on every check — direct the MLR Check at specific concerns on any run or re-run",
      "Knowledge Base — upload guideline PDFs that are chunked, indexed and made available to compliance checks, with a retrieval test tool",
      "Saved run and campaign history — past validations and campaigns reopen instantly with full results, citations and viewer state intact",
      "Batch review routing and export — send selected posts for human approval or export the batch"
    ],
    metrics: [
      { metric: "MLR Review Pillars Evaluated", value: "3 — Accuracy, Compliance, Adaptation" },
      { metric: "Findings Carrying Page-Level Citations", value: "100%" },
      { metric: "Auto-Approval Rate", value: "0% — human approval by design" }
    ],
    businessImpact: "Compresses the MLR review and content production cycle while strengthening, rather than weakening, the audit trail. Reviewers receive drafts and findings that are already cited to source and guideline, so review time is spent adjudicating evidence instead of hunting for it — and because MedScribe never auto-approves, the regulatory accountability model stays intact.",
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://medscribe.systechusa.com",
    note: "Delivered by Systech Solutions in partnership with Pointblank. PDF is the supported upload format for both the Validator and the Knowledge Base."
  },
  {
    id: "27",
    name: "Retail Concierge",
    category: "Retail",
    tags: ["AI Avatar", "Voice AI", "In-Store Wayfinding", "90+ Languages", "Function Calling"],
    shortDescription: "Live AI Avatar Shopping Concierge for Supermarket and Retail Floors",
    overview: "Retail Concierge is an in-store conversational AI assistant that pairs a lifelike, low-latency video avatar with a real-time voice model, giving shoppers a natural spoken interface to the entire store. Shoppers simply speak to the kiosk and the avatar answers aloud while the screen renders the supporting visual — a walking route, a price list, a queue board or a pickup counter card.\n\nThe assistant is built on live function calling rather than scripted flows. Asking where something is triggers on-screen wayfinding with a walking route from the shopper's current position to the product's aisle and shelf position. Asking about deals brings up today's markdowns with old and new prices, this week's specials and bundle promos, or newly arrived products. Shoppers can check the status of a same-day delivery or pickup order using a printed code, an order number or a phone number, and opt in to receive a real WhatsApp message and email confirming that the order is ready and where to collect it. Asking which checkout is fastest surfaces live counter queues and a recommendation that accounts for basket size, express lanes and priority lanes for senior citizens, PWD and expectant shoppers.\n\nThe concierge speaks and understands 90+ languages — including English, Filipino/Tagalog, Taglish, Cebuano/Bisaya and other Philippine languages alongside Hindi, Tamil, Vietnamese, Chinese, Japanese, Korean, Arabic, French, Spanish, German, Portuguese and many more. It switches only when a shopper explicitly asks, so it never drifts language on background noise, code-switched speech or an echo of its own voice.",
    features: [
      "Lifelike streaming AI video avatar with real-time, low-latency voice conversation",
      "In-store wayfinding — spoken product queries render an on-screen map with a walking route to the exact aisle, section and shelf position",
      "Live promotions surface — today's markdowns with old and new pricing, weekly specials and bundle promos, and new arrivals",
      "Order pickup and same-day delivery lookup — resolves a printed code, plain order number or phone number and shows counter location, requirements and wait time",
      "Real WhatsApp and email pickup notifications sent to the shopper on request, with graceful simulated fallback when messaging credentials are not configured",
      "Smart checkout recommendation — live counter queue lengths with routing that accounts for basket size, express lanes and priority lanes for senior, PWD and expectant shoppers",
      "90+ languages supported, with explicit shopper-initiated language switching — never switches on overheard speech, echo or unclear audio",
      "Function-calling architecture — every spoken request drives a real on-screen action rather than a scripted response"
    ],
    metrics: [
      { metric: "Shopper Requests Handled Hands-Free", value: "Voice-first, no touch required" },
      { metric: "Languages Supported", value: "90+" },
      { metric: "Service Availability", value: "24/7" }
    ],
    businessImpact: "Turns floor staff interruptions — where is it, what's on sale, which line is fastest, is my order ready — into a self-service, multilingual kiosk conversation. Shoppers get an immediate visual answer, staff stay on task, and the store gains a consistent promotional surface at the point of decision.",
    logo: "https://media.licdn.com/dms/image/v2/D4D12AQFfDDKYkoJxKg/article-cover_image-shrink_720_1280/B4DZohBWjjKQAI-/0/1761490595770?e=2147483647&v=beta&t=w4-jxM__ZBOtMGZkNfRBJex79eECKm4DBuEN5QNUbWY",
    coverImage: "https://media.licdn.com/dms/image/v2/D4D12AQFfDDKYkoJxKg/article-cover_image-shrink_720_1280/B4DZohBWjjKQAI-/0/1761490595770?e=2147483647&v=beta&t=w4-jxM__ZBOtMGZkNfRBJex79eECKm4DBuEN5QNUbWY",
    appUrl: "https://hotelconcierge.systechusa.com",
  },
  {
    id: "28",
    name: "MedGame Studio",
    category: "L&D",
    tags: ["Gamified Learning", "Game-Based Training", "Pharma Field Enablement", "Document-to-Game", "Clinical Simulation"],
    shortDescription: "AI Game Studio That Turns Medical Documents into Training Games for Field Reps",
    overview: "MedGame Studio is a gamified learning platform built for medical representatives and pharmaceutical field teams. Product monographs, prescribing information, clinical trial summaries and treatment guidelines are dense, long and difficult to retain by reading alone — MedGame Studio takes those PDFs and automatically generates playable learning games from their content, so reps build genuine recall and clinical confidence through repeated play instead of passive reading.\n\nAdministrators work in a multi-tenant console: each client organisation has its own departments, users, content library and learning journeys. Upload a source PDF, and the Game Studio generates the question banks, term-definition pairs, categorisation sets, ordered sequences and patient scenarios that drive each game type. Learners then progress through assigned journeys, and analytics track engagement, completion and knowledge retention across departments and cohorts.\n\nGames span three families. Strategy & Knowledge games — Match-It, Sort-It, Sequence-It, Case Challenge and Evidence Challenge — build vocabulary, classification, procedural ordering, clinical decision-making and trial-data interpretation. Arcade Training games — Bubble Burst, MedRun and MedShot — drill fast, accurate recall under time pressure. Clinical Simulations place reps in realistic practice scenarios for field readiness.",
    features: [
      "PDF-to-game generation — upload a medical document and the platform authors playable game content from it automatically",
      "Match-It — drag medical terms to their definitions to master the vocabulary of the document",
      "Sort-It — categorise adverse effects, contraindications and drug classifications into the right groups",
      "Sequence-It — arrange dosing protocols, tapering steps and clinical procedures in the correct order",
      "Case Challenge — solve realistic patient scenarios that test clinical decision-making for field readiness",
      "Evidence Challenge — interpret landmark clinical trial data and apply study findings to practice",
      "Arcade Training — Bubble Burst, MedRun and MedShot drill fast, accurate recall under time pressure",
      "Clinical Simulations — immersive practice scenarios that rehearse real field and clinical conversations",
      "Multi-tenant admin console — manage client organisations, departments, users, content library and learning journeys",
      "Game Studio authoring and analytics — configure games per document and track engagement, completion and retention by department and cohort"
    ],
    metrics: [
      { metric: "Game Formats Available", value: "3 families — Strategy, Arcade, Simulation" },
      { metric: "Content Authoring", value: "AI-generated from source PDF" },
      { metric: "Typical Session Length", value: "5–6 minutes per game" }
    ],
    businessImpact: "Converts unread product documentation into training that field teams actually complete. Medical reps absorb prescribing detail, contraindications, dosing protocols and trial evidence through short, repeatable play sessions — and L&D leaders get department-level visibility into who has genuinely retained the material rather than who merely opened the PDF.",
    logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=200&h=200",
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200&h=600",
    appUrl: "https://medgamestudio.systechusa.com/login",
  },
  /* ── Snowflake-native apps, mirrored from snowflakemarketplace.systechusa.com ──
     Content and appUrl match that directory exactly. Their ids there (20–22)
     collide with PR Vision360 / Fraud Investigation / CFO Lens here, so they are
     renumbered. Images are absolute — the assets live on the Snowflake host and
     are served publicly. */
  {
    id: "30",
    name: "Culinary App",
    category: "Gaming & Hospitality",
    tags: ["Recipe Intelligence", "Conversational AI", "Menu Planning"],
    shortDescription: "AI-Powered Culinary Intelligence and Recipe Assistant for Food Service Teams",
    overview: "Culinary App is an AI-powered culinary intelligence assistant built natively on Snowflake. It helps chefs, food-service teams, and hospitality operators explore recipes, plan menus, and answer ingredient and nutrition questions through a simple conversational interface. Users can search a curated culinary knowledge base, generate dish ideas around the ingredients they have on hand, and retrieve step-by-step preparation guidance — turning a data-rich recipe repository into an interactive cooking companion.",
    features: [
      "Conversational recipe search across a curated culinary knowledge base",
      "Ingredient-driven dish recommendations with smart substitutions",
      "Step-by-step preparation guidance with portion and timing details",
      "Nutritional and allergen breakdown to support menu planning",
      "Menu ideation and pairing suggestions for food-service teams"
    ],
    metrics: [
      { metric: "Culinary Knowledge Base", value: "Curated recipe corpus" },
      { metric: "Query Response Time", value: "< 3 seconds" },
      { metric: "Menu Planning Time Saved", value: "70%" }
    ],
    businessImpact: "Turns a static recipe repository into an interactive culinary assistant — helping food-service teams plan menus, standardise preparation, and answer ingredient questions in seconds.",
    logo: "https://snowflakemarketplace.systechusa.com/culinary-logo.jpg",
    coverImage: "https://snowflakemarketplace.systechusa.com/culinary-cover.jpg",
    appUrl: "https://app.snowflake.com/ygmrvwv/systechusa_partner/#/streamlit-apps/CULINARY_DB.PUBLIC.X63VIII41XE60PZ5",
    note: "Snowflake-native application. A Snowflake account with access to the systechusa_partner organisation is required."
  },
  {
    id: "31",
    name: "Customer Accounts Intelligence",
    category: "Customer Intelligence",
    tags: ["Account Health Scoring", "Conversational Analytics", "Cortex AI"],
    shortDescription: "AI-Driven Customer Account Health Scoring and Conversational Intelligence",
    overview: "Customer Accounts Intelligence gives account managers and commercial leaders a single, data-driven health score for every key customer account — accessible through natural language. Built on Snowflake Cortex, it consolidates signals scattered across CRM, ERP, financials, orders, complaints, pipeline, and qualitative visit reports into one composite score per account. Users simply ask questions like \"Which accounts are at risk?\" or \"What's driving a customer's decline?\" and receive scorecards, comparisons, and narrative insights — without writing SQL or navigating dashboards.",
    features: [
      "Composite 0–100 account health score across 6 weighted pillars — relationship, sentiment, financials, orders, complaints, and pipeline",
      "HEALTHY / MONITOR / AT RISK banding for instant portfolio triage",
      "Portfolio-level agent for comparisons, health-band distributions, and at-risk detection",
      "Account deep-dive agent combining structured metrics with qualitative visit notes",
      "Powered by Snowflake Cortex Analyst (text-to-SQL) and Cortex Search over visit reports",
      "Auto-generated key findings, watch items, and recommended actions per account"
    ],
    metrics: [
      { metric: "Health Signals Unified", value: "6 scoring pillars" },
      { metric: "Data Domains Consolidated", value: "CRM, ERP, financials & more" },
      { metric: "Time to Account Insight", value: "Natural language, no SQL" }
    ],
    businessImpact: "Replaces scattered spreadsheets and manual account reviews with a single conversational health score — helping commercial teams spot at-risk accounts early and act before revenue erodes.",
    logo: "https://snowflakemarketplace.systechusa.com/customer-intel-logo.jpg",
    coverImage: "https://snowflakemarketplace.systechusa.com/customer-intel-cover.jpg",
    appUrl: "https://app.snowflake.com/streamlit/ygmrvwv/systechusa_partner/#/apps/myyj4sjcgyegyzygbzer",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=e1e8885f-be4a-4553-b758-190e529cbdf2",
    note: "Snowflake-native application. A Snowflake account with access to the systechusa_partner organisation is required."
  },
  {
    id: "32",
    name: "Legal AI Counsellor",
    category: "Legal",
    tags: ["Legal RAG", "Case Law Search", "Conversational AI"],
    shortDescription: "AI-Powered Legal Knowledge Assistant for Case Precedent Research",
    overview: "Legal AI Counsellor is an AI-powered legal knowledge assistant that helps legal professionals, paralegals, and compliance teams research historical case precedents through natural language conversation. Built on Snowflake Intelligence, it answers legal questions exclusively from a curated repository of case documents, provides a source citation for every fact, and escalates complex or unanswered queries to a human legal consultant — while maintaining a full audit trail of every interaction for compliance.",
    features: [
      "Natural language case precedent search with semantic retrieval across the case repository",
      "Source-grounded answers — every fact cited with its Case ID and title, never fabricated",
      "Coverage across 5 practice areas: employment, M&A, contract breach, IP, and compliance",
      "Human consultant escalation via email when no relevant case is found or the user requests it",
      "Full interaction audit trail capturing queries, responses, cited sources, and response times"
    ],
    metrics: [
      { metric: "Curated Case Repository", value: "25 case precedents" },
      { metric: "Practice Areas Covered", value: "5 legal domains" },
      { metric: "Answer Grounding", value: "100% source-cited" }
    ],
    businessImpact: "Gives legal teams instant, source-cited access to case precedents — cutting research time while guaranteeing every answer is grounded in real case documents, with a built-in escalation path to human counsel.",
    logo: "https://snowflakemarketplace.systechusa.com/legal-ai-logo.jpg",
    coverImage: "https://snowflakemarketplace.systechusa.com/legal-ai-cover.jpg",
    appUrl: "https://ai.snowflake.com/ygmrvwv/systechusa_partner/#/artifacts/chat/5c64df15-dbd6-43ef-bccb-98436e13c47b",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=5e79af7d-759f-40b7-a0f7-3bddbe60a4cd",
    note: "Snowflake-native application. A Snowflake account with access to the systechusa_partner organisation is required."
  },
];






