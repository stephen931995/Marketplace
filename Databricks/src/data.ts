export interface AppDetail {
  id: string;
  name: string;
  category: string;
  tags: string[];
  shortDescription: string;
  overview: string;
  features: string[];
  metrics: { metric: string; value: string }[];
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
    appUrl: "https://aerointel.systechusa.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=7808812d-3615-42d4-9cfb-6d107a0ad547",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgCEsxmAqVMWS6vG5VYZZ4h5AZDli-jcSkRPf9m9muKDZUY?e=B8ZugM"
  },
  {
    id: "13",
    name: "VisionIQ™",
    category: "Retail",
    tags: ["Databricks Apps", "Unity Catalog", "Delta Lake", "Databricks SDK"],
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
    appUrl: "https://vision-iq-7405613850690869.9.azure.databricksapps.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=107cd610-947f-4a4f-9118-b782d22c0cca",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgCxtNrn4cTXRJimBu7QxFYlAZ2jpoTmyAUrCfjSNqkGwCY?e=Nc4IXb"
  },
  {
    id: "14",
    name: "aiDE",
    category: "Data Engineering",
    tags: ["AI Tooling", "MCP", "Semantic Data Layer", "Data Mesh"],
    shortDescription: "Unified AI Data Engineering Toolkit Across Microsoft Fabric, Snowflake, and Databricks",
    overview: "aiDE is Systech's AI-powered toolkit built primarily for the Data Analytics and Data Engineering team. It accelerates code generation, data migration, and developer productivity — turning work that would typically take weeks into something that can be completed in hours. By implementing a semantic data layer across Microsoft Fabric, Snowflake, and Databricks, aiDE empowers engineers and analysts to move faster with less manual effort.",
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
    tags: ["Databricks Apps", "Delta Lake", "SQL Warehouse", "Model Serving", "Foundation Models", "Unity Catalog", "Databricks SDK"],
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
    appUrl: "https://carboncast-7405613850690869.9.azure.databricksapps.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=7c40fbd1-4369-49bb-ae9d-01943f4900d0",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgDueBD_dA8_SJl3296-oK-QAeISvw58vawzfrhmVVf55wQ?e=RCKEsK"
  },
  {
    id: "15",
    name: "Digital Twin(AI Chef)",
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
    appUrl: "https://aichef.systechusa.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=352a7608-c96d-489f-ae54-f4dd029249b8",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgC7OdkQ63sASronm9FcM7kwAcJO-jelf9J-C5tWRYzYLIE?e=4SlkTh"
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
    appUrl: "https://ecovision-7405613850690869.9.azure.databricksapps.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=fcc5f51e-e6e4-45b6-a036-f670a6c6dffb",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgCjjQ2-IzD4Q4YAHcXjRrxgAWSRxd5gn7fdVUbcbhvzw7c?e=8egedN"
  },
  {
    id: "05",
    name: "Hotel Concierge",
    category: "Gaming & Hospitality",
    tags: ["Conversational AI", "Agentic Automation", "Omnichannel"],
    shortDescription: "AI Avatar Booking and Guest Services Agent for Hotels and Amenities",
    overview: "Hotel Concierge is an enterprise-grade conversational AI agent that manages end-to-end hotel booking workflows and guest service orchestration through a lifelike, low-latency AI avatar interface.",
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
    tags: ["Databricks Apps", "Model Serving", "Foundation Models", "Unity Catalog", "Databricks SDK"],
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
    appUrl: "https://intelliframe-7405613850690869.9.azure.databricksapps.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=0d81ed05-7ee8-46c7-964b-4bf180897778",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgBYBBAGDIHuT5BYCHBU_mAiAUMb1ONDRijRCRoph45OZVo?e=iCTgLM"
  },
  {
    id: "01",
    name: "PromoIQ™",
    category: "Gaming & Hospitality",
    tags: ["Delta Lake", "Databricks SQL Warehouse", "Model Serving", "Generative AI", "Streamlit"],
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
    appUrl: "https://casinoaiagent-7405613850690869.9.azure.databricksapps.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=eddac2ff-cce0-4bb8-8bcb-af4603da9747",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgCvxxgP5MBQQLaoxLG4xwJGATtaCUO90QAdrRxPE6TXOBE?e=29YcLI",
    note: "Power BI access is required to view the dashboards in this application."
  },
  {
    id: "16",
    name: "Ops Reporting Portal",
    category: "Reporting",
    tags: ["Self-Service BI", "Report Builder", "Operational Analytics"],
    shortDescription: "Self-Service Operational Reporting and Analytics Portal for Exchange Operations",
    overview: "Ops Reporting Portal is a self-service business intelligence and operational reporting platform purpose-built for foreign exchange and remittance operations. It provides branch managers, compliance officers, and operations teams with an intuitive, no-code interface to access, explore, and export live operational reports — eliminating dependency on IT for routine data requests.\n\nThe platform centralises reporting across teller transactions, currency stock, customer analytics, queue SLA performance, wire transfer inquiries, and branch compliance checklists into a unified, permission-controlled dashboard. Users can collaborate directly on reports via inline comments, raise IT incidents from within the portal, and export any dataset to PDF or Excel in a single click.",
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
    demoVideo: "https://systechus.sharepoint.com/sites/MarketingDigitalStrategy/_layouts/15/embed.aspx?UniqueId=1346ea72-9836-4cda-b55c-20b45ea66170&embed=%7B%22ust%22%3Afalse%2C%22hv%22%3A%22CopyEmbedCode%22%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=190aa01e-2bce-49ab-bfdc-c3c4a6aee492",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgAqAHhB7YFLQIaXJg9XCWe7AXOvDTOQr6h83C8GIQ70td4?e=EvYMWM"
  },
  {
    id: "08",
    name: "Orbit",
    category: "Project Management",
    tags: ["Project Management", "Delivery Intelligence", "Operational Visibility"],
    shortDescription: "Systech's Internal Project and Ticket Tracking System",
    overview: "Orbit is Systech's purpose-built internal ticket and project tracking platform. It is focused on creating tickets within a project, assigning them to the right people, and managing escalations — not sprint or backlog management. Orbit is also integrated with Microsoft Teams, making it easy to raise a ticket or escalate directly from a Teams conversation without switching context.",
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
    name: "Quote Generator",
    category: "Tech",
    tags: ["AI Quoting", "Hardware Intelligence", "Procurement Automation"],
    shortDescription: "AI-Powered Hardware Appliance Quote Engine with Smart Product Recommendations",
    overview: "Quote Generator is an AI-driven procurement intelligence platform that transforms hardware quoting from a time-consuming manual process into an instant, intelligent experience. Built for distributors, procurement officers, and field sales teams, it connects directly to live product databases to retrieve real-time stock levels, pricing, and compatibility matrices — generating accurate, professionally formatted quotes in seconds.\n\nUsers can describe their requirements in plain language — such as '25 bathroom fittings for a hotel fit-out' — and the AI engine interprets the request, retrieves the matching SKUs, identifies complementary and required accessories, validates stock availability, and computes a line-item quote complete with quantities, unit pricing, discounts, and lead times. The platform also supports image-based input: users can photograph or upload a hardware appliance, and the vision AI layer identifies the product, retrieves specifications, and prepares an instant procurement recommendation — accelerating field-to-quote workflows by an order of magnitude.",
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
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgB-JGbZDA5zR4U2Rls6PRCQASsWt27jdSqPRIDAMvxaO-8?e=VnClee"
  },
  {
    id: "07",
    name: "Resonance",
    category: "Learning",
    tags: ["Communication AI", "Speech Analytics", "Behavioural Coaching"],
    shortDescription: "AI Communication Coaching Platform for Professional Upskilling",
    overview: "Resonance is an AI-powered communication coaching and behavioural development platform built to help professionals build confident, high-impact communication skills at scale.",
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
    name: "SafeWatch",
    category: "Sustainability",
    tags: ["PPE Detection", "Safety Compliance", "Computer Vision"],
    shortDescription: "AI-Powered Worker Safety and PPE Compliance Monitoring for Manufacturing Environments",
    overview: "SafeWatch is an industrial-grade AI video surveillance platform purpose-built for manufacturing, construction, and heavy-industry environments where worker safety compliance is mission-critical. Powered by real-time computer vision and edge AI inference, SafeWatch continuously monitors CCTV feeds across factory floors, assembly lines, loading docks, and hazardous zones — automatically detecting PPE compliance violations, safety hat absence, high-visibility vest non-adherence, and restricted area breaches as they happen.\n\nThe platform goes beyond passive recording: it generates instant alerts when violations occur, logs every event with timestamped video clips, and produces daily safety compliance dashboards for HSE officers and plant managers. With support for multi-camera deployments and integration with existing CCTV infrastructure, SafeWatch delivers enterprise-grade occupational safety enforcement without requiring manual monitoring — helping manufacturers meet ISO 45001, OSHA, and local HSE regulatory requirements with full digital evidence trails.",
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
    businessImpact: "Transforms reactive safety management into proactive, AI-driven compliance enforcement. Manufacturers deploying SafeWatch report a 62% reduction in recordable safety incidents within the first six months, alongside measurable improvements in OSHA and ISO 45001 audit scores — reducing both human risk and regulatory liability.",
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
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=66216921-1888-4a55-8d1c-c00e51807d09",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgB7LmIYY4cgQoFNoKqtccY6AXQ9h632O1vx7yQqLvh6ufk?e=Fha3fo"
  },
  {
    id: "09",
    name: "SkillIQ™",
    category: "Learning",
    tags: ["Databricks Apps", "Unity Catalog", "Databricks Model Serving", "Databricks SDK", "Databricks SQL Connector"],
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
    appUrl: "https://sysrank-7405613850690869.9.azure.databricksapps.com",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=af345ca8-5bed-413b-8257-195995e88890",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgD9pP_IHc7XQa6Z111K5TvxAdQP72TwGGPxJClu7eRCxxg?e=D0mvcd"
  },
  {
    id: "06",
    name: "VetAI",
    category: "HR Tech",
    tags: ["AI Screening", "Multimodal Assessment", "Talent Intelligence"],
    shortDescription: "End-to-End AI-Powered Candidate Screening and Interview Intelligence Platform",
    overview: "VetAI is an end-to-end AI-powered recruitment platform that covers the entire hiring pipeline — from ATS profile matching, to AI-moderated video interview recording, through to intelligent evaluation and scoring. It automates every stage of candidate screening so recruiters can focus on final decisions rather than manual assessment.",
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
    id: "18",
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
    id: "19",
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
    appUrl: "https://adb-7405613850690869.9.azuredatabricks.net/dashboardsv3/01f1711abd201916b67fd91a359574c9/published?o=7405613850690869",
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=9386f032-57a9-49fd-b1ce-d1933bb411e1",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgDXiANMigZ2RKHMRQvld6TaAWYTrhXlJKgbndynqnHKByo?e=uwslin"
  },
  {
    id: "20",
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
    manualUrl: "https://systechus.sharepoint.com/sites/SystechMarketplace/_layouts/15/embed.aspx?UniqueId=97ae114d-5699-4cb2-a9df-9b99fec7eec4",
    sampleDocsUrl: "https://systechus.sharepoint.com/:f:/s/SystechMarketplace/IgC8hv1NCSezSbKucKjIOjt5Aao8dSKi7j4Z41HDC72ZJN0?e=1sigty"
  },
];



