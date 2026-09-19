import { T, type Localized } from "@/domain/models";

export type GlossaryTerm = {
  id: string;
  term: string;
  expanded?: Localized;
  definition: Localized;
  aliases: string[];
  courses: string[];
  category: "web" | "language" | "framework" | "ai" | "infra";
};

const G = (
  id: string,
  term: string,
  expanded: [string, string] | undefined,
  definition: [string, string],
  aliases: string[],
  courses: string[],
  category: GlossaryTerm["category"],
): GlossaryTerm => ({
  id,
  term,
  expanded: expanded ? T(...expanded) : undefined,
  definition: T(...definition),
  aliases,
  courses,
  category,
});

const ALL = ["javascript", "typescript", "react", "ai", "it-foundations"];

export const glossaryTerms: GlossaryTerm[] = [
  G("api","API",["Application Programming Interface","Application Programming Interface"],["A contract that lets software components communicate through defined operations and data.","Kontrakt pozwalający komponentom oprogramowania komunikować się przez zdefiniowane operacje i dane."],["API"],ALL,"web"),
  G("http","HTTP",["Hypertext Transfer Protocol","Hypertext Transfer Protocol"],["The application protocol used to exchange web requests and responses.","Protokół aplikacyjny używany do wymiany requestów i response'ów w webie."],["HTTP"],ALL,"web"),
  G("https","HTTPS",["Hypertext Transfer Protocol Secure","Hypertext Transfer Protocol Secure"],["HTTP carried over an authenticated encrypted TLS connection.","HTTP przesyłany przez uwierzytelnione i szyfrowane połączenie TLS."],["HTTPS"],ALL,"web"),
  G("http2","HTTP/2",["Hypertext Transfer Protocol version 2","Hypertext Transfer Protocol version 2"],["A binary HTTP version that multiplexes many streams over one connection and compresses headers.","Binarna wersja HTTP, która multipleksuje wiele strumieni przez jedno połączenie i kompresuje nagłówki."],["HTTP/2"],ALL,"web"),
  G("http3","HTTP/3",["Hypertext Transfer Protocol version 3","Hypertext Transfer Protocol version 3"],["HTTP running over QUIC instead of TCP, reducing some connection and head-of-line delays.","HTTP działający nad QUIC zamiast TCP, ograniczający część opóźnień połączenia i head-of-line blocking."],["HTTP/3"],ALL,"web"),
  G("url","URL",["Uniform Resource Locator","Uniform Resource Locator"],["An address that identifies where and how to access a resource.","Adres określający, gdzie i w jaki sposób uzyskać dostęp do zasobu."],["URL","URLs"],ALL,"web"),
  G("dns","DNS",["Domain Name System","Domain Name System"],["The naming system that resolves hostnames into records clients can use to reach services.","System nazw tłumaczący hostname'y na rekordy pozwalające klientom dotrzeć do usług."],["DNS"],ALL,"web"),
  G("tls","TLS",["Transport Layer Security","Transport Layer Security"],["The protocol that authenticates and encrypts network connections such as HTTPS.","Protokół uwierzytelniający i szyfrujący połączenia sieciowe, np. HTTPS."],["TLS"],ALL,"web"),
  G("json","JSON",["JavaScript Object Notation","JavaScript Object Notation"],["A text data format commonly used to exchange structured values between systems.","Tekstowy format danych często używany do wymiany ustrukturyzowanych wartości pomiędzy systemami."],["JSON"],ALL,"web"),
  G("cors","CORS",["Cross-Origin Resource Sharing","Cross-Origin Resource Sharing"],["A browser mechanism controlling whether JavaScript may read a response from another origin.","Mechanizm przeglądarki kontrolujący, czy JavaScript może odczytać odpowiedź z innego originu."],["CORS"],ALL,"web"),
  G("cdn","CDN",["Content Delivery Network","Content Delivery Network"],["A distributed network that serves cacheable content from locations closer to users.","Rozproszona sieć dostarczająca cache'owalne treści z lokalizacji bliższych użytkownikom."],["CDN"],ALL,"web"),
  G("rest","REST",["Representational State Transfer","Representational State Transfer"],["An architectural style commonly used to design resource-oriented HTTP APIs.","Styl architektoniczny często używany do projektowania API HTTP zorientowanych na zasoby."],["REST"],ALL,"web"),
  G("sso","SSO",["Single Sign-On","Single Sign-On"],["A login experience where one identity provider can establish access across multiple applications.","Sposób logowania, w którym jeden identity provider może zapewnić dostęp do wielu aplikacji."],["SSO"],ALL,"web"),
  G("oauth","OAuth",["Open Authorization","Open Authorization"],["An authorization framework used to delegate access without sharing the user's password with every client.","Framework autoryzacji do delegowania dostępu bez udostępniania hasła użytkownika każdemu klientowi."],["OAuth","OAuth 2.0"],ALL,"web"),
  G("oidc","OIDC",["OpenID Connect","OpenID Connect"],["An identity layer built on OAuth 2.0, commonly used for sign-in and identity claims.","Warstwa tożsamości zbudowana na OAuth 2.0, często używana do logowania i przekazywania informacji o tożsamości."],["OIDC","OpenID Connect"],ALL,"web"),
  G("jwt","JWT",["JSON Web Token","JSON Web Token"],["A compact signed token format for carrying claims; it is a format, not a complete auth architecture.","Kompaktowy format podpisanego tokena przenoszącego claims; to format, a nie kompletna architektura auth."],["JWT"],ALL,"web"),
  G("bff","BFF",["Backend for Frontend","Backend for Frontend"],["A backend layer tailored to the needs of a specific frontend or client experience.","Warstwa backendowa dopasowana do potrzeb konkretnego frontendu lub klienta."],["BFF","Backend for Frontend"],ALL,"web"),

  G("js","JavaScript",undefined,["The programming language executed by browsers and many server runtimes.","Język programowania wykonywany przez przeglądarki oraz wiele środowisk serwerowych."],["JavaScript","JS"],["javascript","typescript","react","it-foundations"],"language"),
  G("dom","DOM",["Document Object Model","Document Object Model"],["The browser's object representation of an HTML document that JavaScript can inspect and change.","Obiektowa reprezentacja dokumentu HTML w przeglądarce, którą JavaScript może odczytywać i zmieniać."],["DOM"],["javascript","typescript","react","it-foundations"],"web"),
  G("event-loop","Event loop",undefined,["The runtime mechanism coordinating the call stack, tasks and microtasks so asynchronous callbacks can run.","Mechanizm runtime koordynujący call stack, taski i microtaski, dzięki czemu mogą wykonywać się callbacki asynchroniczne."],["event loop"],["javascript","typescript","react"],"language"),
  G("closure","Closure",undefined,["A function together with access to the lexical environment where it was created.","Funkcja wraz z dostępem do środowiska leksykalnego, w którym została utworzona."],["closure","closures"],["javascript","typescript","react"],"language"),
  G("hoisting","Hoisting",undefined,["JavaScript's declaration-instantiation behaviour that makes some bindings exist before the line where their declaration appears.","Zachowanie JavaScriptu podczas tworzenia deklaracji, przez które część bindingów istnieje przed linią deklaracji w kodzie."],["hoisting"],["javascript"],"language"),
  G("scope","Scope",undefined,["The region of code in which a binding can be referenced.","Obszar kodu, w którym można odwołać się do danego bindingu."],["scope","lexical scope"],["javascript","typescript","react"],"language"),
  G("promise","Promise",undefined,["An object representing the eventual success or failure of an asynchronous operation.","Obiekt reprezentujący przyszły sukces lub błąd operacji asynchronicznej."],["Promise","Promises"],["javascript","typescript","react"],"language"),
  G("microtask","Microtask",undefined,["A high-priority asynchronous job queue used by Promise reactions and related APIs.","Kolejka zadań asynchronicznych o wysokim priorytecie używana m.in. przez reakcje Promise."],["microtask","microtasks"],["javascript"],"language"),
  G("prototype","Prototype",undefined,["The object JavaScript consults when a property is not found directly on another object.","Obiekt, który JavaScript sprawdza, gdy właściwości nie ma bezpośrednio na danym obiekcie."],["prototype","prototype chain"],["javascript"],"language"),
  G("esm","ESM",["ECMAScript Modules","ECMAScript Modules"],["JavaScript's standard import/export module system.","Standardowy system modułów JavaScript oparty na import/export."],["ESM","ES modules"],["javascript","typescript","react"],"language"),
  G("npm","npm",["Node Package Manager","Node Package Manager"],["The package registry and CLI ecosystem commonly used to install and manage JavaScript dependencies.","Ekosystem registry i CLI często używany do instalowania i zarządzania zależnościami JavaScript."],["npm"],["javascript","typescript","react","it-foundations"],"language"),
  G("node","Node.js",undefined,["A JavaScript runtime built for running JavaScript outside the browser, commonly on servers and tooling.","Runtime JavaScript do uruchamiania kodu poza przeglądarką, często na serwerach i w narzędziach developerskich."],["Node.js","Node"],["javascript","typescript","react","it-foundations"],"language"),

  G("ts","TypeScript",undefined,["JavaScript with a static type system that is checked before runtime and compiled to JavaScript.","JavaScript ze statycznym systemem typów sprawdzanym przed runtime i kompilowanym do JavaScriptu."],["TypeScript","TS"],["typescript","react"],"language"),
  G("type-inference","Type inference",undefined,["The compiler deriving a type from code without requiring an explicit annotation.","Wyprowadzanie typu przez kompilator bez konieczności jawnej adnotacji."],["type inference","inference"],["typescript"],"language"),
  G("union","Union type",undefined,["A TypeScript type that allows a value to be one of several possible types.","Typ TypeScript pozwalający wartości należeć do jednego z kilku możliwych typów."],["union type","union"],["typescript"],"language"),
  G("generic","Generic",undefined,["A reusable type or function parameterized by another type while preserving relationships between values.","Wielokrotnego użytku typ lub funkcja parametryzowana innym typem z zachowaniem relacji pomiędzy wartościami."],["generic","generics"],["typescript"],"language"),
  G("narrowing","Narrowing",undefined,["Reducing a broad TypeScript type to a more specific type using runtime evidence.","Zawężanie szerokiego typu TypeScript do bardziej konkretnego na podstawie informacji z runtime."],["narrowing"],["typescript"],"language"),
  G("structural-typing","Structural typing",undefined,["Type compatibility based mainly on the shape of a value rather than explicit nominal identity.","Zgodność typów oparta głównie na kształcie wartości, a nie jawnej nominalnej tożsamości."],["structural typing"],["typescript"],"language"),
  G("tsconfig","tsconfig",undefined,["The configuration file that defines TypeScript compiler behaviour for a project.","Plik konfiguracji definiujący zachowanie kompilatora TypeScript w projekcie."],["tsconfig","tsconfig.json"],["typescript"],"language"),
  G("strict","strict mode",undefined,["A TypeScript compiler setting enabling a family of stronger static checks.","Ustawienie kompilatora TypeScript włączające rodzinę silniejszych kontroli statycznych."],["strict mode","strict"],["typescript"],"language"),
  G("unknown","unknown",undefined,["A safe TypeScript top type: any value can enter it, but it must be narrowed before unsafe use.","Bezpieczny szeroki typ TypeScript: może przyjąć dowolną wartość, ale przed ryzykownym użyciem trzeba go zawęzić."],["unknown"],["typescript"],"language"),
  G("never","never",undefined,["A TypeScript type representing values that should never occur, useful for exhaustive checks.","Typ TypeScript reprezentujący wartości, które nie powinny nigdy wystąpić, przydatny w exhaustive checks."],["never"],["typescript"],"language"),

  G("jsx","JSX",["JavaScript XML","JavaScript XML"],["A syntax extension used by React to describe UI trees inside JavaScript or TypeScript.","Rozszerzenie składni używane przez React do opisywania drzew UI w JavaScript lub TypeScript."],["JSX","TSX"],["react"],"framework"),
  G("component","Component",undefined,["A reusable React unit that describes part of the user interface from inputs and state.","Wielokrotnego użytku jednostka React opisująca fragment UI na podstawie wejść i stanu."],["component","components"],["react"],"framework"),
  G("props","Props",["Properties","Properties"],["Read-only inputs passed from a parent to a React component.","Tylko-do-odczytu dane wejściowe przekazywane z rodzica do komponentu React."],["props"],["react"],"framework"),
  G("state","State",undefined,["Data owned by a component or application that can change over time and trigger UI updates.","Dane należące do komponentu lub aplikacji, które mogą zmieniać się w czasie i powodować aktualizację UI."],["state"],["react"],"framework"),
  G("hook","Hook",undefined,["A React function such as useState or useEffect that lets a component use React capabilities following the Rules of Hooks.","Funkcja React, np. useState lub useEffect, pozwalająca komponentowi korzystać z mechanizmów React zgodnie z Rules of Hooks."],["Hook","Hooks"],["react"],"framework"),
  G("effect","Effect",undefined,["React synchronization logic for keeping a component aligned with an external system.","Logika synchronizacji React służąca do utrzymywania komponentu w zgodzie z systemem zewnętrznym."],["Effect","Effects","useEffect"],["react"],"framework"),
  G("context","Context",undefined,["A React mechanism for distributing a value through a subtree without passing it through every intermediate component.","Mechanizm React do dystrybucji wartości w poddrzewie bez przekazywania jej przez każdy komponent pośredni."],["Context","context"],["react"],"framework"),
  G("ref","Ref",undefined,["A React container for a mutable value that does not itself trigger rerenders, often used for DOM nodes.","Kontener React na mutowalną wartość, która sama nie wywołuje rerenderu, często używany dla elementów DOM."],["ref","refs"],["react"],"framework"),
  G("reconciliation","Reconciliation",undefined,["React's process for comparing UI descriptions and deciding what needs to change in the rendered output.","Proces React porównujący opisy UI i decydujący, co trzeba zmienić w wyrenderowanym wyniku."],["reconciliation"],["react"],"framework"),
  G("hydration","Hydration",undefined,["Attaching React behaviour to HTML that was already rendered on the server.","Dołączanie zachowania React do HTML, który został wcześniej wyrenderowany na serwerze."],["hydration","hydrate"],["react","it-foundations"],"framework"),
  G("memoization","Memoization",undefined,["Reusing a previous computed result when the relevant inputs have not changed.","Ponowne użycie wcześniej obliczonego wyniku, gdy istotne wejścia się nie zmieniły."],["memoization","memo","useMemo","useCallback"],["react"],"framework"),

  G("ai","AI",["Artificial Intelligence","Sztuczna inteligencja"],["The broad field of building systems that perform tasks associated with intelligent behaviour.","Szeroka dziedzina tworzenia systemów wykonujących zadania kojarzone z inteligentnym zachowaniem."],["AI"],["ai","it-foundations"],"ai"),
  G("ml","ML",["Machine Learning","Uczenie maszynowe"],["A branch of AI where systems learn patterns from data instead of relying only on hand-written rules.","Gałąź AI, w której system uczy się wzorców z danych zamiast polegać wyłącznie na ręcznie napisanych regułach."],["ML","machine learning"],["ai"],"ai"),
  G("llm","LLM",["Large Language Model","Duży model językowy"],["A model trained on large amounts of text to predict and generate token sequences from context.","Model trenowany na dużych zbiorach tekstu do przewidywania i generowania sekwencji tokenów na podstawie kontekstu."],["LLM","LLMs","large language model"],["ai","it-foundations"],"ai"),
  G("token","Token",undefined,["A unit of text representation consumed and produced by language models; it is not necessarily a whole word.","Jednostka reprezentacji tekstu przetwarzana i generowana przez modele językowe; nie musi być całym słowem."],["token","tokens"],["ai"],"ai"),
  G("context-window","Context window",undefined,["The amount of input and generated content a model can consider within one request.","Ilość wejścia i generowanej treści, którą model może uwzględnić w jednym zapytaniu."],["context window"],["ai"],"ai"),
  G("embedding","Embedding",undefined,["A numeric vector representing semantic properties of content for similarity and retrieval tasks.","Wektor liczbowy reprezentujący semantyczne właściwości treści do zadań podobieństwa i retrievalu."],["embedding","embeddings"],["ai"],"ai"),
  G("rag","RAG",["Retrieval-Augmented Generation","Retrieval-Augmented Generation"],["A pattern where relevant external information is retrieved and supplied to a model before it generates an answer.","Wzorzec, w którym istotna zewnętrzna wiedza jest pobierana i przekazywana modelowi przed wygenerowaniem odpowiedzi."],["RAG"],["ai","it-foundations"],"ai"),
  G("reranking","Reranking",undefined,["Re-evaluating retrieved candidates with a stronger relevance signal before selecting final context.","Ponowna ocena pobranych kandydatów silniejszym sygnałem trafności przed wyborem końcowego kontekstu."],["reranking","reranker"],["ai"],"ai"),
  G("tool-calling","Tool calling",undefined,["A pattern where a model requests an application-defined action with structured arguments.","Wzorzec, w którym model prosi o wykonanie akcji zdefiniowanej przez aplikację, przekazując ustrukturyzowane argumenty."],["tool calling","function calling"],["ai"],"ai"),
  G("mcp","MCP",["Model Context Protocol","Model Context Protocol"],["A standard protocol for connecting AI applications to external tools and context providers.","Standardowy protokół łączenia aplikacji AI z zewnętrznymi narzędziami i dostawcami kontekstu."],["MCP","Model Context Protocol"],["ai","it-foundations"],"ai"),
  G("eval","Eval",["Evaluation","Ewaluacja"],["A repeatable test used to measure how well an AI system performs a real task or avoids a failure mode.","Powtarzalny test mierzący, jak dobrze system AI wykonuje realne zadanie lub unika określonego błędu."],["eval","evals","evaluation"],["ai"],"ai"),
  G("agent","Agent",undefined,["An AI workflow that can iteratively inspect state, choose actions or tools and continue based on intermediate results.","Workflow AI, który iteracyjnie analizuje stan, wybiera akcje lub narzędzia i kontynuuje na podstawie wyników pośrednich."],["agent","agents"],["ai"],"ai"),
  G("prompt-injection","Prompt injection",undefined,["An attack or failure mode where untrusted text tries to override intended AI instructions or manipulate tool use.","Atak lub tryb błędu, w którym niezaufany tekst próbuje nadpisać instrukcje AI lub zmanipulować użycie narzędzi."],["prompt injection"],["ai"],"ai"),
  G("fine-tuning","Fine-tuning",undefined,["Additional model training on task examples to change learned behaviour, not a replacement for fresh external knowledge.","Dodatkowe trenowanie modelu na przykładach zadania w celu zmiany zachowania; nie zastępuje świeżej wiedzy zewnętrznej."],["fine-tuning","fine tuning"],["ai"],"ai"),

  G("tcp","TCP",["Transmission Control Protocol","Transmission Control Protocol"],["A reliable ordered transport protocol widely used underneath HTTP/1.1 and HTTP/2.","Niezawodny uporządkowany protokół transportowy szeroko używany pod HTTP/1.1 i HTTP/2."],["TCP"],["it-foundations"],"infra"),
  G("quic","QUIC",undefined,["A modern encrypted transport protocol over UDP used by HTTP/3.","Nowoczesny szyfrowany protokół transportowy nad UDP używany przez HTTP/3."],["QUIC"],["it-foundations"],"infra"),
  G("vm","VM",["Virtual Machine","Maszyna wirtualna"],["A virtualized computer with its own guest operating system running on physical hardware.","Zwirtualizowany komputer z własnym systemem operacyjnym działający na fizycznym sprzęcie."],["VM","virtual machine"],["it-foundations"],"infra"),
  G("container","Container",undefined,["A packaged process with an isolated filesystem and resource boundaries that shares the host kernel.","Spakowany proces z izolowanym filesystemem i granicami zasobów współdzielący kernel hosta."],["container","containers"],["it-foundations"],"infra"),
  G("docker","Docker",undefined,["A popular toolchain and container image format used to build and run containers.","Popularny zestaw narzędzi i format obrazów kontenerowych używany do budowania i uruchamiania kontenerów."],["Docker","Dockerfile"],["it-foundations"],"infra"),
  G("kubernetes","Kubernetes",["K8s","K8s"],["A container orchestration platform that continuously reconciles declared workload state with actual cluster state.","Platforma orkiestracji kontenerów, która stale uzgadnia zadeklarowany stan workloadów z rzeczywistym stanem klastra."],["Kubernetes","K8s"],["it-foundations"],"infra"),
  G("pod","Pod",undefined,["The basic Kubernetes scheduling unit containing one or more tightly coupled containers.","Podstawowa jednostka schedulingu Kubernetes zawierająca jeden lub kilka ściśle powiązanych kontenerów."],["Pod","Pods"],["it-foundations"],"infra"),
  G("iac","IaC",["Infrastructure as Code","Infrastructure as Code"],["Managing infrastructure through versioned declarative configuration rather than only manual console changes.","Zarządzanie infrastrukturą przez wersjonowaną deklaratywną konfigurację zamiast wyłącznie ręcznych zmian w konsoli."],["IaC","Infrastructure as Code"],["it-foundations"],"infra"),
  G("terraform","Terraform",undefined,["An Infrastructure as Code tool that plans and applies desired infrastructure through provider APIs and state.","Narzędzie Infrastructure as Code planujące i wdrażające infrastrukturę przez API providerów i state."],["Terraform"],["it-foundations"],"infra"),
  G("cicd","CI/CD",["Continuous Integration / Continuous Delivery","Continuous Integration / Continuous Delivery"],["Automated workflows that verify changes and move versioned artifacts through delivery or deployment stages.","Automatyczne workflow weryfikujące zmiany i przenoszące wersjonowane artefakty przez etapy delivery lub deploymentu."],["CI/CD"],["it-foundations"],"infra"),
  G("vpc","VPC",["Virtual Private Cloud","Virtual Private Cloud"],["A logically isolated cloud network containing address ranges, subnets and routing rules.","Logicznie izolowana sieć cloud zawierająca zakresy adresów, subnety i reguły routingu."],["VPC"],["it-foundations"],"infra"),
  G("nat","NAT",["Network Address Translation","Network Address Translation"],["A networking mechanism that translates addresses, often letting private workloads make outbound internet connections.","Mechanizm sieciowy tłumaczący adresy, często pozwalający prywatnym workloadom inicjować połączenia z internetem."],["NAT"],["it-foundations"],"infra"),
  G("iam","IAM",["Identity and Access Management","Identity and Access Management"],["Policies, identities and permissions controlling who or what may access cloud resources.","Polityki, tożsamości i uprawnienia kontrolujące, kto lub co może uzyskać dostęp do zasobów cloud."],["IAM"],["it-foundations"],"infra"),
  G("kms","KMS",["Key Management Service","Key Management Service"],["A managed system for creating, protecting and using cryptographic keys.","Zarządzany system do tworzenia, ochrony i używania kluczy kryptograficznych."],["KMS"],["it-foundations"],"infra"),
  G("redis","Redis",undefined,["An in-memory data store commonly used for caching, counters, queues and coordination primitives.","In-memory data store często używany do cache, liczników, kolejek i prymitywów koordynacyjnych."],["Redis"],["it-foundations"],"infra"),
  G("sli","SLI",["Service Level Indicator","Service Level Indicator"],["A measured reliability signal such as successful request ratio or latency under a threshold.","Mierzony sygnał niezawodności, np. odsetek udanych requestów lub latency poniżej progu."],["SLI","SLIs"],["it-foundations"],"infra"),
  G("slo","SLO",["Service Level Objective","Service Level Objective"],["A target for an SLI over a defined time window.","Docelowa wartość SLI w określonym przedziale czasu."],["SLO","SLOs"],["it-foundations"],"infra"),
  G("rto","RTO",["Recovery Time Objective","Recovery Time Objective"],["The maximum acceptable time to restore a service after a disaster.","Maksymalny akceptowalny czas odtworzenia usługi po awarii."],["RTO"],["it-foundations"],"infra"),
  G("rpo","RPO",["Recovery Point Objective","Recovery Point Objective"],["The maximum acceptable amount of recent data loss measured in time.","Maksymalna akceptowalna utrata ostatnich danych mierzona czasem."],["RPO"],["it-foundations"],"infra"),
];

export const glossaryFor = (courseSlug: string) =>
  glossaryTerms.filter((term) => term.courses.includes(courseSlug));
