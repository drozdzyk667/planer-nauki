import { T, type Course, type CourseModule } from "@/domain/models";

const courseModule = (
  id: string,
  en: string,
  pl: string,
  descEn: string,
  descPl: string,
  access: "free" | "premium",
): CourseModule => ({
  id,
  title: T(en, pl),
  description: T(descEn, descPl),
  access,
  level: access === "free" ? "beginner" : "advanced",
  lessonIds: [],
  minutes: 0,
});

const aiModules: CourseModule[] = [
  courseModule(
    "ai-foundations",
    "AI & LLM foundations",
    "Podstawy AI i LLM",
    "Models, tokens, context, prompting and structured outputs.",
    "Modele, tokeny, kontekst, prompting i strukturalne odpowiedzi.",
    "free",
  ),
  courseModule(
    "ai-retrieval",
    "Embeddings & RAG",
    "Embeddingi i RAG",
    "Vector search, chunking, retrieval, reranking and grounded answers.",
    "Wyszukiwanie wektorowe, chunking, retrieval, reranking i odpowiedzi oparte na źródłach.",
    "free",
  ),
  courseModule(
    "ai-tools",
    "Tools, function calling & MCP",
    "Narzędzia, function calling i MCP",
    "Connect models to APIs, tools and external context safely.",
    "Łącz modele z API, narzędziami i zewnętrznym kontekstem w bezpieczny sposób.",
    "free",
  ),
  courseModule(
    "ai-quality",
    "Evals, safety & reliability",
    "Ewaluacja, bezpieczeństwo i niezawodność",
    "Measure quality, defend against prompt injection and design reliable flows.",
    "Mierz jakość, broń się przed prompt injection i projektuj niezawodne przepływy.",
    "free",
  ),
  courseModule(
    "ai-agents",
    "Agents & orchestration",
    "Agenci i orkiestracja",
    "Agent loops, memory, planning and deterministic workflow design.",
    "Pętle agentów, pamięć, planowanie i deterministyczne workflow.",
    "premium",
  ),
  courseModule(
    "ai-production",
    "Production AI systems",
    "Produkcyjne systemy AI",
    "Routing, cost, latency, observability, caching and production architecture.",
    "Routing modeli, koszty, latency, observability, cache i architektura produkcyjna.",
    "premium",
  ),
];

const itModules: CourseModule[] = [
  courseModule(
    "it-web-foundations",
    "How the web works",
    "Jak działa web",
    "Browser, DNS, networking, TLS, HTTP, CORS and caching.",
    "Przeglądarka, DNS, sieć, TLS, HTTP, CORS i cache.",
    "free",
  ),
  courseModule(
    "it-app-architecture",
    "Application architecture",
    "Architektura aplikacji",
    "Frontend, backend, APIs, databases, storage, queues and caches.",
    "Frontend, backend, API, bazy danych, storage, kolejki i cache.",
    "free",
  ),
  courseModule(
    "it-identity-security",
    "Identity & web security",
    "Tożsamość i bezpieczeństwo web",
    "Sessions, JWT, OAuth, OIDC, SSO, secrets and browser security.",
    "Sesje, JWT, OAuth, OIDC, SSO, sekrety i bezpieczeństwo przeglądarki.",
    "free",
  ),
  courseModule(
    "it-cloud-delivery",
    "Cloud & delivery",
    "Cloud i dostarczanie",
    "AWS, Azure, containers, Kubernetes, Terraform and CI/CD.",
    "AWS, Azure, kontenery, Kubernetes, Terraform i CI/CD.",
    "free",
  ),
  courseModule(
    "it-distributed-systems",
    "Distributed systems",
    "Systemy rozproszone",
    "Consistency, idempotency, resilience, networking and deployment strategies.",
    "Spójność, idempotencja, odporność, sieci i strategie deploymentu.",
    "premium",
  ),
  courseModule(
    "it-production-ops",
    "Production operations",
    "Utrzymanie produkcji",
    "Observability, SLOs, incidents, disaster recovery and cost awareness.",
    "Observability, SLO, incydenty, disaster recovery i świadomość kosztów.",
    "premium",
  ),
];

export const platformCourses: Course[] = [
  {
    id: "ai",
    slug: "ai",
    title: T("AI Engineering", "AI Engineering"),
    short: "AI",
    description: T(
      "Understand modern AI systems from prompts and embeddings to RAG, MCP, agents, evals and production reliability.",
      "Zrozum nowoczesne systemy AI: od promptów i embeddingów po RAG, MCP, agentów, ewaluację i niezawodność produkcyjną.",
    ),
    category: "ai",
    status: "available",
    color: "purple",
    modules: aiModules,
  },
  {
    id: "it-foundations",
    slug: "it-foundations",
    title: T(
      "IT Fundamentals & Production Applications",
      "IT Fundamentals i aplikacje produkcyjne",
    ),
    short: "IT",
    description: T(
      "See the whole system: browser, network, backend, auth, cloud, containers, Kubernetes, Terraform, CI/CD and operations.",
      "Zobacz cały system: przeglądarkę, sieć, backend, auth, cloud, kontenery, Kubernetes, Terraform, CI/CD i utrzymanie produkcji.",
    ),
    category: "it",
    status: "available",
    color: "green",
    modules: itModules,
  },
];
