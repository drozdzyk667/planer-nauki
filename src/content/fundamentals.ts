import type { GlossaryTerm } from "./glossary";

export type FundamentalsDomain =
  | "basics"
  | "web"
  | "browser"
  | "security"
  | "frontend"
  | "backend"
  | "cloud"
  | "devops"
  | "networking"
  | "databases"
  | "git"
  | "architecture"
  | "ai";

export type FundamentalsLevel = "fundamentals" | "junior" | "mid" | "advanced";

export type FundamentalsDomainDefinition = {
  id: FundamentalsDomain;
  title: { en: string; pl: string };
  description: { en: string; pl: string };
  termIds: string[];
};

export const fundamentalsDomains: FundamentalsDomainDefinition[] = [
  {
    id: "basics",
    title: { en: "Computing basics", pl: "Podstawy komputerów" },
    description: {
      en: "The vocabulary underneath everything else: bits, memory, processes, runtime and execution.",
      pl: "Pojęcia leżące pod całą resztą: bity, pamięć, procesy, runtime i wykonywanie kodu.",
    },
    termIds: [
      "bit","byte","binary","cpu","ram","os","process","thread","filesystem",
      "runtime","compiler","interpreter","js","ts","json",
    ],
  },
  {
    id: "web",
    title: { en: "Web & Internet", pl: "Web i Internet" },
    description: {
      en: "Requests, protocols and the pieces that connect a browser to a service.",
      pl: "Requesty, protokoły i elementy łączące przeglądarkę z usługą.",
    },
    termIds: [
      "http","https","http2","http3","url","uri","headers","status-code","cookie","origin",
      "rest","graphql","rpc","websocket","sse","cdn","cache","api","endpoint","webhook","polling",
    ],
  },
  {
    id: "browser",
    title: { en: "Browser", pl: "Przeglądarka" },
    description: {
      en: "Rendering, browser storage, DOM APIs and the security model around origins.",
      pl: "Renderowanie, storage, API DOM i model bezpieczeństwa wokół originów.",
    },
    termIds: [
      "dom","bom","event-loop","microtask","reflow","repaint","localstorage",
      "sessionstorage","indexeddb","origin","same-origin","cors","preflight","cache","hydration",
    ],
  },
  {
    id: "security",
    title: { en: "Security & Auth", pl: "Security i Auth" },
    description: {
      en: "Identity, permissions, browser attacks, encryption and trust boundaries.",
      pl: "Tożsamość, uprawnienia, ataki webowe, szyfrowanie i granice zaufania.",
    },
    termIds: [
      "tls","certificate","sso","oauth","oidc","jwt","session","access-token","refresh-token",
      "pkce","csp","csrf","xss","hashing","encryption","mfa","iam","kms","secret",
    ],
  },
  {
    id: "frontend",
    title: { en: "Frontend", pl: "Frontend" },
    description: {
      en: "Rendering strategies, bundles and browser-side application architecture.",
      pl: "Strategie renderowania, bundle i architektura aplikacji po stronie przeglądarki.",
    },
    termIds: [
      "js","ts","jsx","csr","ssr","ssg","isr","spa","mpa","bundle","tree-shaking",
      "code-splitting","lazy-loading","component","props","state","hook","effect",
      "context","ref","memoization","reconciliation",
    ],
  },
  {
    id: "backend",
    title: { en: "Backend & API", pl: "Backend i API" },
    description: {
      en: "Server-side contracts, application layers and patterns used behind the frontend.",
      pl: "Kontrakty serwerowe, warstwy aplikacji i wzorce działające za frontendem.",
    },
    termIds: [
      "api","rest","graphql","rpc","endpoint","middleware","crud","orm","bff","rate-limit",
      "webhook","polling","node","json",
    ],
  },
  {
    id: "cloud",
    title: { en: "Infrastructure & Cloud", pl: "Infrastruktura i Cloud" },
    description: {
      en: "Compute, containers, orchestration and cloud building blocks.",
      pl: "Compute, kontenery, orkiestracja i podstawowe elementy chmury.",
    },
    termIds: [
      "aws","azure","gcp","vm","container","docker","kubernetes","pod","serverless",
      "load-balancer","reverse-proxy","nginx","autoscaling","vpc","nat","gateway",
    ],
  },
  {
    id: "devops",
    title: { en: "DevOps & Delivery", pl: "DevOps i Delivery" },
    description: {
      en: "How code becomes a versioned artifact and safely reaches production.",
      pl: "Jak kod staje się wersjonowanym artefaktem i bezpiecznie trafia na produkcję.",
    },
    termIds: [
      "cicd","pipeline","artifact","deployment","rollback","blue-green","canary",
      "environment","iac","terraform","secret","sli","slo","rto","rpo",
    ],
  },
  {
    id: "networking",
    title: { en: "Networking", pl: "Sieci" },
    description: {
      en: "Addresses, transport protocols and routing between machines and networks.",
      pl: "Adresy, protokoły transportowe i routing pomiędzy maszynami oraz sieciami.",
    },
    termIds: [
      "tcp-ip","tcp","udp","quic","ipv4","ipv6","dns","dhcp","port","socket","subnet",
      "gateway","proxy","vpn","firewall","nat","vpc",
    ],
  },
  {
    id: "databases",
    title: { en: "Databases & Data", pl: "Bazy danych i dane" },
    description: {
      en: "Storage models, consistency, indexes, caching and data distribution.",
      pl: "Modele storage, spójność, indeksy, cache i dystrybucja danych.",
    },
    termIds: [
      "sql","nosql","acid","transaction","db-index","primary-key","foreign-key","redis",
      "replication","sharding","json",
    ],
  },
  {
    id: "git",
    title: { en: "Git & Collaboration", pl: "Git i współpraca" },
    description: {
      en: "The vocabulary behind version control, reviews and branch-based workflows.",
      pl: "Pojęcia związane z kontrolą wersji, review i pracą na branchach.",
    },
    termIds: [
      "git","commit","branch","merge","rebase","cherry-pick","pull-request","merge-conflict",
    ],
  },
  {
    id: "architecture",
    title: { en: "Architecture", pl: "Architektura" },
    description: {
      en: "System boundaries, communication styles, scale and state ownership.",
      pl: "Granice systemu, style komunikacji, skalowanie i ownership stanu.",
    },
    termIds: [
      "monolith","microservices","event-driven","pub-sub","message-queue","stateless",
      "stateful","availability","scalability","bff","load-balancer",
    ],
  },
  {
    id: "ai",
    title: { en: "AI Engineering", pl: "AI Engineering" },
    description: {
      en: "Models, context, retrieval, tools, agents and production AI vocabulary.",
      pl: "Modele, kontekst, retrieval, narzędzia, agenci i słownictwo produkcyjnego AI.",
    },
    termIds: [
      "ai","ml","model","llm","token","context-window","prompt","embedding","vector-db",
      "rag","reranking","tool-calling","mcp","eval","agent","fine-tuning","inference",
      "prompt-injection",
    ],
  },
];

const MID = new Set([
  "http2","http3","websocket","cors","csp","csrf","xss","oidc","bff","ssr","ssg","isr",
  "tree-shaking","code-splitting","graphql","orm","rate-limit","kubernetes","terraform",
  "vpc","replication","sharding","rebase","event-driven","pub-sub","message-queue",
  "embedding","vector-db","rag","tool-calling","mcp",
]);

const ADVANCED = new Set([
  "quic","kms","sli","slo","rto","rpo","blue-green","canary","acid","reranking",
  "agent","fine-tuning","prompt-injection",
]);

const JUNIOR = new Set([
  "api","json","rest","dom","event-loop","promise","git","commit","branch","merge","docker",
  "container","sql","redis","jwt","oauth","cicd","pipeline","artifact","deployment","aws",
  "azure","gcp","npm","node","ts","jsx",
]);

export function fundamentalsLevel(term: GlossaryTerm): FundamentalsLevel {
  if (ADVANCED.has(term.id)) return "advanced";
  if (MID.has(term.id)) return "mid";
  if (JUNIOR.has(term.id)) return "junior";
  return "fundamentals";
}

export function fundamentalsDomainsFor(termId: string): FundamentalsDomainDefinition[] {
  return fundamentalsDomains.filter((domain) => domain.termIds.includes(termId));
}

export function fundamentalsDomainFor(termId: string): FundamentalsDomainDefinition | undefined {
  return fundamentalsDomainsFor(termId)[0];
}

export const fundamentalsExamples: Record<string, { en: string; pl: string }> = {
  http: {
    en: "GET /api/users HTTP/1.1\nHost: example.com\nAccept: application/json",
    pl: "GET /api/users HTTP/1.1\nHost: example.com\nAccept: application/json",
  },
  cors: {
    en: "OPTIONS /api/orders\nOrigin: https://app.example\nAccess-Control-Request-Method: POST",
    pl: "OPTIONS /api/orders\nOrigin: https://app.example\nAccess-Control-Request-Method: POST",
  },
  jwt: {
    en: "Authorization: Bearer <access-token>",
    pl: "Authorization: Bearer <access-token>",
  },
  dns: {
    en: "app.example.com → DNS → 203.0.113.10",
    pl: "app.example.com → DNS → 203.0.113.10",
  },
  kubernetes: {
    en: "Deployment → ReplicaSet → Pods\nService → Pods",
    pl: "Deployment → ReplicaSet → Pody\nService → Pody",
  },
  terraform: {
    en: "configuration → terraform plan → review → terraform apply",
    pl: "konfiguracja → terraform plan → review → terraform apply",
  },
  rag: {
    en: "question → retrieve → rerank → context → model → answer + sources",
    pl: "pytanie → retrieve → rerank → kontekst → model → odpowiedź + źródła",
  },
  mcp: {
    en: "AI host → MCP client → MCP server → tool/resource → result",
    pl: "host AI → klient MCP → serwer MCP → tool/resource → wynik",
  },
  cicd: {
    en: "commit → lint/test/build → artifact → deploy → verify",
    pl: "commit → lint/test/build → artefakt → deploy → verify",
  },
  git: {
    en: "working tree → git add → commit → branch → pull request",
    pl: "working tree → git add → commit → branch → pull request",
  },
};

const RELATED: Record<string, string[]> = {
  http: ["https","http2","http3","tcp","tls","rest","cors"],
  https: ["http","tls","certificate","dns"],
  http2: ["http","tcp","http3","quic"],
  http3: ["http","quic","udp","tls"],
  dns: ["url","ipv4","ipv6","cdn","gateway"],
  cors: ["http","preflight","api","csrf","browser"],
  oauth: ["oidc","sso","jwt","mfa"],
  oidc: ["oauth","sso","jwt"],
  jwt: ["oauth","oidc","sso"],
  dom: ["js","bom","reflow","repaint","event-loop"],
  ssr: ["csr","ssg","isr","hydration","cdn"],
  docker: ["container","vm","kubernetes","artifact"],
  kubernetes: ["container","pod","load-balancer","autoscaling","vpc"],
  terraform: ["iac","aws","azure","gcp","environment"],
  cicd: ["pipeline","artifact","deployment","rollback","environment"],
  sql: ["acid","transaction","db-index","primary-key","foreign-key"],
  redis: ["cache","sql","nosql"],
  git: ["commit","branch","merge","rebase","pull-request"],
  rag: ["embedding","vector-db","reranking","llm","eval"],
  mcp: ["tool-calling","agent","llm","api"],
  agent: ["tool-calling","mcp","eval","prompt-injection"],
};

export function relatedTermIds(term: GlossaryTerm): string[] {
  const explicit = RELATED[term.id]?.filter(Boolean);
  if (explicit?.length) return explicit.slice(0, 6);
  const domain = fundamentalsDomainFor(term.id);
  if (!domain) return [];
  return domain.termIds.filter((id) => id !== term.id).slice(0, 6);
}

export function conceptualFlow(term: GlossaryTerm): string {
  const domain = fundamentalsDomainFor(term.id)?.id;
  switch (domain) {
    case "basics":
      return `Source/instructions → ${term.term} → Running program/data`;
    case "web":
      return `Client → ${term.term} → Server → Response`;
    case "browser":
      return `Input → Browser → ${term.term} → UI`;
    case "security":
      return `Request → Identity/Policy → ${term.term} → Protected resource`;
    case "frontend":
      return `Source code → ${term.term} → Browser UI`;
    case "backend":
      return `Frontend → API → ${term.term} → Data/service`;
    case "cloud":
      return `Traffic → Cloud edge → ${term.term} → Workload`;
    case "devops":
      return `Commit → Pipeline → ${term.term} → Production`;
    case "networking":
      return `Host A → Network → ${term.term} → Host B`;
    case "databases":
      return `Application → Query → ${term.term} → Stored data`;
    case "git":
      return `Working tree → ${term.term} → Repository history`;
    case "architecture":
      return `Client → Components → ${term.term} → System behaviour`;
    case "ai":
      return `Input → Context/tools → ${term.term} → Model/system output`;
    default:
      return term.term;
  }
}
