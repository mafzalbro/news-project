import { prisma } from '../src/lib/prisma';

async function seed() {
  console.log('🌱 Starting database seed...');

  // Clean existing records
  await prisma.articleSource.deleteMany();
  await prisma.article.deleteMany();
  await prisma.techSignal.deleteMany();
  await prisma.trend.deleteMany();
  await prisma.storyTimeline.deleteMany();
  await prisma.category.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.company.deleteMany();
  await prisma.person.deleteMany();
  await prisma.country.deleteMany();

  // 1. Seed Categories
  const catAI = await prisma.category.create({
    data: {
      slug: 'ai-agentic',
      name: 'AI & Agentic Workflows',
      description: 'Autonomous agents, workflow automation, and foundation model orchestration.',
    },
  });

  const catFemTech = await prisma.category.create({
    data: {
      slug: 'femtech-health',
      name: 'FemTech & Digital Health',
      description: 'Wearable diagnostics, female biomedical innovation, and personalized endocrine tracking.',
    },
  });

  const catPrivacy = await prisma.category.create({
    data: {
      slug: 'ethics-privacy',
      name: 'Ethical AI & Data Privacy',
      description: 'Algorithm transparency, data governance, regulatory compliance, and cybersecurity.',
    },
  });

  const catVC = await prisma.category.create({
    data: {
      slug: 'founders-vc',
      name: 'Female Founders & VC',
      description: 'Capital deployment, venture benchmarks, and startup execution metrics.',
    },
  });

  const catGreen = await prisma.category.create({
    data: {
      slug: 'green-tech',
      name: 'Green Tech & Sustainable Computing',
      description: 'Clean energy compute clusters, energy-efficient silicon, and zero-carbon infrastructure.',
    },
  });

  // 2. Seed Topics
  const topicAgentic = await prisma.topic.create({
    data: { slug: 'agentic-ai', name: 'Agentic AI', description: 'Autonomous multi-step task execution systems and tool-use orchestration.' },
  });
  const topicDiagnostics = await prisma.topic.create({
    data: { slug: 'wearable-diagnostics', name: 'Wearable Diagnostics', description: 'Non-invasive continuous monitoring sensors.' },
  });
  const topicDataCenter = await prisma.topic.create({
    data: { slug: 'clean-data-centers', name: 'Clean Energy Data Centers', description: 'Nuclear SMR and geothermal compute facilities.' },
  });
  const topicGovernance = await prisma.topic.create({
    data: { slug: 'ai-governance', name: 'AI Governance & Privacy', description: 'EU AI Act compliance, auditability, and data sovereignty.' },
  });

  // 3. Seed Companies
  const compAnthropic = await prisma.company.create({
    data: { slug: 'anthropic', name: 'Anthropic', industry: 'Artificial Intelligence', websiteUrl: 'https://anthropic.com' },
  });
  const compOura = await prisma.company.create({
    data: { slug: 'oura', name: 'Oura Health', industry: 'FemTech / Wearables', websiteUrl: 'https://ouraring.com' },
  });
  const compOpenAI = await prisma.company.create({
    data: { slug: 'openai', name: 'OpenAI', industry: 'Artificial Intelligence', websiteUrl: 'https://openai.com' },
  });
  const compMicrosoft = await prisma.company.create({
    data: { slug: 'microsoft', name: 'Microsoft', industry: 'Cloud & Infrastructure', websiteUrl: 'https://microsoft.com' },
  });

  // 4. Seed People
  const personDario = await prisma.person.create({
    data: { slug: 'dario-amodei', name: 'Dario Amodei', title: 'CEO', company: 'Anthropic' },
  });
  const personMira = await prisma.person.create({
    data: { slug: 'mira-murati', name: 'Mira Murati', title: 'AI Researcher & Founder', company: 'Thinking Machines' },
  });

  // 5. Seed Countries
  const countryUS = await prisma.country.create({
    data: { code: 'US', name: 'United States', region: 'North America' },
  });
  const countryIN = await prisma.country.create({
    data: { code: 'IN', name: 'India', region: 'Asia-Pacific' },
  });
  const countryUAE = await prisma.country.create({
    data: { code: 'AE', name: 'United Arab Emirates', region: 'Middle East' },
  });
  const countryFR = await prisma.country.create({
    data: { code: 'FR', name: 'France', region: 'Europe' },
  });
  const countryGB = await prisma.country.create({
    data: { code: 'GB', name: 'United Kingdom', region: 'Europe' },
  });
  const countrySG = await prisma.country.create({
    data: { code: 'SG', name: 'Singapore', region: 'Asia-Pacific' },
  });

  // 6. Seed Story Timelines
  const timelineAgenticShift = await prisma.storyTimeline.create({
    data: {
      slug: 'agentic-ai-enterprise-shift',
      title: 'The Enterprise Shift to Autonomous Agentic Workflows',
      summary: 'Chronological progression tracking how enterprise tech stacks are transitioning from conversational chat prompts to multi-agent task orchestration engines.',
      status: 'ACTIVE',
    },
  });

  const timelineFemTechBoom = await prisma.storyTimeline.create({
    data: {
      slug: 'femtech-diagnostic-revolution',
      title: 'FemTech Diagnostic Sensors Reach Clinical Maturity',
      summary: 'Evolution of non-invasive continuous hormone and metabolic monitoring biosensors advancing toward regulatory approval.',
      status: 'ACTIVE',
    },
  });

  const timelineCleanEnergyAI = await prisma.storyTimeline.create({
    data: {
      slug: 'clean-energy-ai-compute',
      title: 'Nuclear & Geothermal Energy for Hyperscale AI',
      summary: 'Tracking utility-scale power purchasing agreements for zero-carbon data center infrastructure.',
      status: 'ACTIVE',
    },
  });

  // 7. Seed Trends
  const trendAgentic = await prisma.trend.create({
    data: {
      slug: 'agentic-workflow-automation',
      title: 'Agentic Workflow Automation',
      description: 'The transition from simple chat prompts to goal-oriented multi-agent software automation.',
      category: 'AI & Agentic Workflows',
      searchVelocity: 185.0,
      status: 'EMERGING',
      score: 91.5,
      countries: { connect: [{ id: countryUS.id }, { id: countryGB.id }, { id: countryIN.id }, { id: countryUAE.id }, { id: countrySG.id }] },
    },
  });

  const trendFemTechSensors = await prisma.trend.create({
    data: {
      slug: 'wearable-hormones-biometrics',
      title: 'Continuous Biometrics & FemTech Sensors',
      description: 'Micro-fluidic endocrine and metabolic monitoring biosensors optimized for female physiology.',
      category: 'FemTech & Digital Health',
      searchVelocity: 142.0,
      status: 'EMERGING',
      score: 88.0,
      countries: { connect: [{ id: countryUS.id }, { id: countryFR.id }, { id: countryGB.id }] },
    },
  });

  const trendCleanCompute = await prisma.trend.create({
    data: {
      slug: 'clean-energy-data-centers',
      title: 'Geothermal & SMR Powered Compute',
      description: 'Next-generation clean energy architecture powering hyperscale LLM training infrastructure.',
      category: 'Green Tech & Sustainable Computing',
      searchVelocity: 92.0,
      status: 'PEAKING',
      score: 86.4,
      countries: { connect: [{ id: countryUS.id }, { id: countryFR.id }, { id: countryUAE.id }] },
    },
  });

  // 8. Seed Articles with Deterministic Signals & 5-Layer Analysis
  // Scenario 1: High Search + High Impact (Agentic AI Main Story)
  const signal1 = await prisma.techSignal.create({
    data: {
      overallScore: 91.5,
      searchVelocity: 94.0,
      newsMomentum: 89.0,
      socialMomentum: 88.0,
      humanImpact: 92.0,
      novelty: 88.0,
      credibility: 96.0,
      longTermRelevance: 91.0,
      explanation: 'High score driven by verified primary source benchmarks (96/100 credibility) and high search velocity (+185%).',
    },
  });

  await prisma.article.create({
    data: {
      slug: 'agentic-ai-reshaping-enterprise-software-workflows',
      title: 'Agentic AI Systems Start Reshaping Enterprise Software Workflows',
      description: 'Evaluations indicate multi-agent architectures with tool-use capabilities are automating complex multi-step software and auditing pipelines.',
      content: `The enterprise software landscape is shifting toward multi-agent orchestration. Rather than relying solely on single-turn conversational chatbots, organizations are deploying goal-oriented AI agent systems capable of coordinating tools, querying database APIs, and validating software outputs.

In benchmark evaluations conducted by leading AI research organizations, multi-agent systems demonstrated noticeable gains in handling complex, multi-stage engineering tasks when compared to standard zero-shot LLM prompts. However, enterprise deployment requires rigorous safety guardrails, audit logging, and human-in-the-loop validation to maintain operational reliability.`,
      authorName: 'TechSignal Editorial Team',
      authorRole: 'Technology Intelligence Division',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Multi-agent orchestration engines executing asynchronous tasks across cloud APIs.',

      whatHappened: 'Major AI lab benchmarks and enterprise software deployments revealed that multi-agent systems with tool-use capability can autonomously coordinate complex software workflows with verified accuracy.',
      whyItMatters: 'Transitions static, rule-based software automation into flexible adaptive workflows, significantly reducing execution latency for multi-system corporate processes.',
      whoIsAffected: 'Software engineering teams, enterprise CTOs, cloud architects, and knowledge workers managing cross-platform software tools.',
      whatsNext: 'Expect increased emphasis on agent evaluation benchmarks, standardized API authorization protocols, and formal security logging requirements over the coming quarters.',

      categoryId: catAI.id,
      signalId: signal1.id,
      timelineId: timelineAgenticShift.id,
      isFeatured: true,
      isTrending: true,

      topics: { connect: [{ id: topicAgentic.id }] },
      companies: { connect: [{ id: compAnthropic.id }, { id: compOpenAI.id }] },
      people: { connect: [{ id: personDario.id }] },
      countries: { connect: [{ id: countryUS.id }, { id: countryIN.id }, { id: countryGB.id }] },
      trends: { connect: [{ id: trendAgentic.id }] },
      sources: {
        create: [
          { title: 'Anthropic Autonomous Agent Evaluation Framework', url: 'https://anthropic.com/research', publisher: 'Anthropic Research' },
          { title: 'MIT Tech Review: Agentic Workflows in Enterprise Architecture', url: 'https://technologyreview.com', publisher: 'MIT Technology Review' },
        ],
      },
    },
  });

  // Scenario 2: Developing Follow-up Story in the Same Agentic Timeline
  const signal1b = await prisma.techSignal.create({
    data: {
      overallScore: 84.2,
      searchVelocity: 82.0,
      newsMomentum: 86.0,
      socialMomentum: 80.0,
      humanImpact: 85.0,
      novelty: 80.0,
      credibility: 92.0,
      longTermRelevance: 81.0,
      explanation: 'Developing story on developer tool integration and open agent protocol adoption across developer ecosystems.',
    },
  });

  await prisma.article.create({
    data: {
      slug: 'open-agent-protocol-standards-emerge',
      title: 'Open Agent Protocols Emerge to Standardize Cross-System AI Communication',
      description: 'Industry consortiums initiate standard protocols to enable interoperable agent authentication, memory sharing, and tool invocation.',
      content: `As agentic AI deployments accelerate, developer teams face fragmentation across custom agent frameworks. To address this, open consortiums are proposing standardized protocols for agent-to-agent communication.

The initiative focuses on defining safe state transfer formats, rate-limiting guidelines, and mutual agent authentication. By standardizing these patterns, engineering leaders aim to prevent vendor lock-in and simplify enterprise integration.`,
      authorName: 'TechSignal Editorial Team',
      authorRole: 'Technology Intelligence Division',
      imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Protocol diagrams illustrating agent authentication and state synchronization standards.',

      whatHappened: 'Cross-industry working groups published draft specifications for open agent interoperability and communication protocols.',
      whyItMatters: 'Ensures that AI agents built on different model providers can securely exchange tasks and data without requiring bespoke middleware adapters.',
      whoIsAffected: 'API developers, open-source maintainers, enterprise architects, and AI security auditors.',
      whatsNext: 'Public draft feedback closes in Q2, with initial reference implementations slated for release in late 2025.',

      categoryId: catAI.id,
      signalId: signal1b.id,
      timelineId: timelineAgenticShift.id,
      isFeatured: false,
      isTrending: true,

      topics: { connect: [{ id: topicAgentic.id }] },
      companies: { connect: [{ id: compOpenAI.id }] },
      countries: { connect: [{ id: countryUS.id }, { id: countryGB.id }] },
      trends: { connect: [{ id: trendAgentic.id }] },
      sources: {
        create: [
          { title: 'Open Agent Communication Standards Draft', url: 'https://w3.org', publisher: 'AI Open Standards Alliance' },
        ],
      },
    },
  });

  // Scenario 3: High Impact + High Credibility (FemTech Biosensors)
  const signal2 = await prisma.techSignal.create({
    data: {
      overallScore: 88.0,
      searchVelocity: 89.0,
      newsMomentum: 86.0,
      socialMomentum: 82.0,
      humanImpact: 96.0,
      novelty: 90.0,
      credibility: 92.0,
      longTermRelevance: 89.0,
      explanation: 'Breakthrough clinical trial results for non-invasive continuous endocrine biosensors designed specifically for female physiology.',
    },
  });

  await prisma.article.create({
    data: {
      slug: 'femtech-breakthrough-continuous-hormone-wearables',
      title: 'FemTech Innovation: Non-Invasive Biosensors Enable Continuous Endocrine Monitoring',
      description: 'Peer-reviewed studies confirm new micro-fluidic wearable sensors provide continuous, non-invasive biomarker tracking optimized for female physiology.',
      content: `Continuous health monitoring has historically relied on standardized metrics that do not fully account for cyclical endocrine variations in women. A new cohort of biomedical researchers and FemTech founders is addressing this gap with non-invasive micro-fluidic sensors.

Published peer-reviewed trials demonstrate that these sub-dermal sensors track hormonal fluctuations and metabolic responses in real time, delivering actionable health insights through privacy-centric mobile applications.`,
      authorName: 'TechSignal Editorial Team',
      authorRole: 'Technology Intelligence Division',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Micro-fluidic biosensor prototype delivering non-invasive physiological monitoring.',

      whatHappened: 'Clinical validation trials confirmed high correlation between continuous micro-fluidic sensor readings and conventional laboratory blood assays.',
      whyItMatters: 'Advances female health technology from episodic clinic visits to continuous, preventative diagnostic insights engineered around female physiology.',
      whoIsAffected: 'Endocrinologists, preventative medicine clinicians, female health founders, and digital health technology teams.',
      whatsNext: 'Pivotal regulatory submissions are anticipated in Q3 2025 following multi-center clinical trials.',

      categoryId: catFemTech.id,
      signalId: signal2.id,
      timelineId: timelineFemTechBoom.id,
      isFeatured: true,
      isTrending: true,

      topics: { connect: [{ id: topicDiagnostics.id }] },
      companies: { connect: [{ id: compOura.id }] },
      people: { connect: [{ id: personMira.id }] },
      countries: { connect: [{ id: countryUS.id }, { id: countryFR.id }] },
      trends: { connect: [{ id: trendFemTechSensors.id }] },
      sources: {
        create: [
          { title: 'Journal of Biomedical Micro-devices Research Study', url: 'https://nature.com', publisher: 'Nature Biomedical Engineering' },
          { title: 'Global FemTech Health Alliance Clinical Report', url: 'https://femtech.org', publisher: 'FemTech Health Alliance' },
        ],
      },
    },
  });

  // Scenario 4: Low Search + High Impact (Clean Compute Geothermal & Nuclear SMR)
  const signal3 = await prisma.techSignal.create({
    data: {
      overallScore: 86.4,
      searchVelocity: 68.0,
      newsMomentum: 82.0,
      socialMomentum: 70.0,
      humanImpact: 98.0,
      novelty: 88.0,
      credibility: 95.0,
      longTermRelevance: 99.0,
      explanation: 'Crucial long-term infrastructure trend: High impact and long-term relevance compensate for lower consumer search volume.',
    },
  });

  await prisma.article.create({
    data: {
      slug: 'geothermal-and-smr-nuclear-power-hyperscale-ai',
      title: 'Hyperscale AI Clusters Contract Geothermal and SMR Nuclear Power Solutions',
      description: 'Energy infrastructure providers sign multi-gigawatt clean power purchase agreements to supply zero-carbon baseload electricity for AI compute hubs.',
      content: `The rapid scaling of frontier AI model training clusters has focused intense industry attention on electrical grid constraints. To meet multi-gigawatt energy requirements while fulfilling corporate carbon neutrality commitments, tech operators are turning to advanced geothermal energy and Small Modular Reactors (SMRs).

Recent utility contracts indicate a pivot toward dedicated baseload power stations built adjacent to rural data center campuses, reducing grid congestion and securing continuous zero-carbon power.`,
      authorName: 'TechSignal Editorial Team',
      authorRole: 'Technology Intelligence Division',
      imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Zero-emission energy infrastructure supporting high-density compute facilities.',

      whatHappened: 'Major cloud and AI infrastructure operators executed long-term power purchase agreements for next-generation geothermal and SMR nuclear facilities.',
      whyItMatters: 'Solves the dual challenge of soaring AI energy consumption and carbon reduction targets by decoupling data center expansion from fossil-fuel power grids.',
      whoIsAffected: 'Grid operators, energy regulators, cloud computing providers, clean tech investors, and regional environmental agencies.',
      whatsNext: 'Regulatory approvals and site permitting reviews will proceed across regional power authorities through late 2025.',

      categoryId: catGreen.id,
      signalId: signal3.id,
      timelineId: timelineCleanEnergyAI.id,
      isFeatured: true,
      isTrending: false,

      topics: { connect: [{ id: topicDataCenter.id }] },
      companies: { connect: [{ id: compMicrosoft.id }] },
      countries: { connect: [{ id: countryUS.id }, { id: countryFR.id }, { id: countryUAE.id }] },
      trends: { connect: [{ id: trendCleanCompute.id }] },
      sources: {
        create: [
          { title: 'US Department of Energy Hyperscale Compute Report', url: 'https://energy.gov', publisher: 'U.S. Department of Energy' },
          { title: 'Clean Energy Grid Integration Analysis', url: 'https://iea.org', publisher: 'International Energy Agency' },
        ],
      },
    },
  });

  // Scenario 5: High Credibility + Moderate Momentum (AI Privacy Governance)
  const signal4 = await prisma.techSignal.create({
    data: {
      overallScore: 78.5,
      searchVelocity: 62.0,
      newsMomentum: 74.0,
      socialMomentum: 65.0,
      humanImpact: 88.0,
      novelty: 65.0,
      credibility: 98.0,
      longTermRelevance: 95.0,
      explanation: 'Regulatory governance benchmark score led by authoritative EU regulatory updates and strict verification benchmarks.',
    },
  });

  await prisma.article.create({
    data: {
      slug: 'global-ai-privacy-governance-auditability-frameworks',
      title: 'Global Regulatory Authorities Publish Technical Guidance on AI Model Auditability',
      description: 'Regulatory agencies release standardized testing benchmarks for model lineage, training data privacy, and algorithmic transparency.',
      content: `Compliance frameworks for artificial intelligence systems are transitioning from high-level ethical guidelines to enforceable technical standards. International regulators have issued detailed testing specifications governing training data provenance, differential privacy, and model lineage disclosure.

Enterprise compliance officers are implementing automated lineage tracking tools to ensure that customer data utilized in fine-tuning runs can be safely audited and audited in according with local data sovereignty laws.`,
      authorName: 'TechSignal Editorial Team',
      authorRole: 'Technology Intelligence Division',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      imageCaption: 'Digital data governance and privacy audit visualization.',

      whatHappened: 'Data protection authorities across Europe and North America released technical guidance governing training data auditability and differential privacy enforcement.',
      whyItMatters: 'Creates standardized legal compliance criteria for enterprise LLM deployments and third-party SaaS vendors handling sensitive user data.',
      whoIsAffected: 'Chief Risk Officers, enterprise legal counsel, data privacy officers, and AI security engineering teams.',
      whatsNext: 'Enforcement mechanisms and mandatory compliance disclosures take effect in phased rollout cycles throughout 2025.',

      categoryId: catPrivacy.id,
      signalId: signal4.id,
      isFeatured: false,
      isTrending: false,

      topics: { connect: [{ id: topicGovernance.id }] },
      countries: { connect: [{ id: countryFR.id }, { id: countryGB.id }, { id: countrySG.id }] },
      sources: {
        create: [
          { title: 'EU AI Office Technical Guidance Guidelines', url: 'https://europa.eu', publisher: 'European AI Office' },
        ],
      },
    },
  });

  console.log('✅ Database successfully seeded with rich mock intelligence data!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
