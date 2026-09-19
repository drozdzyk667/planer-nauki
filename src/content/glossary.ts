import { T, type Localized } from "@/domain/models";

export type GlossaryTerm = {
  id: string;
  term: string;
  expanded?: Localized;
  definition: Localized;
  details: Localized;
  aliases: string[];
  courses: string[];
  category: "web" | "language" | "framework" | "ai" | "infra";
};


const LONG_DETAILS: Partial<Record<string, [string, string]>> = {
  http: [
    "HTTP defines how a client and server describe requests and responses: method, target, headers, status and optional body. It is an application-layer protocol, so encryption is provided by TLS when HTTP is used as HTTPS. In practice, inspect the real request and response in DevTools, a proxy or server logs. Understanding methods, status codes and caching headers makes frontend/backend debugging much easier.",
    "HTTP definiuje sposób opisu requestów i response'ów pomiędzy klientem a serwerem: metodę, adres, nagłówki, status i opcjonalne body. Jest protokołem warstwy aplikacyjnej, więc szyfrowanie zapewnia TLS, gdy HTTP działa jako HTTPS. W praktyce warto oglądać prawdziwy request i response w DevTools, proxy lub logach serwera. Znajomość metod, statusów i cache headers mocno ułatwia debugowanie frontendu i backendu."
  ],
  http2: [
    "HTTP/2 keeps HTTP semantics but changes transport on the connection. It uses binary framing, header compression and multiplexing so many streams can share one TCP connection. This reduces the need for many parallel connections, although TCP packet loss can still affect multiple streams. Application endpoints usually do not change; the browser, CDN, proxy and server negotiate the protocol.",
    "HTTP/2 zachowuje semantykę HTTP, ale zmienia sposób transportu w ramach połączenia. Używa binarnego framingu, kompresji nagłówków i multiplexingu, dzięki czemu wiele strumieni może współdzielić jedno połączenie TCP. Ogranicza to potrzebę wielu równoległych połączeń, choć utrata pakietu TCP nadal może wpływać na wiele strumieni. Endpointy aplikacji zwykle się nie zmieniają — protokół negocjują przeglądarka, CDN, proxy i serwer."
  ],
  dns: [
    "DNS is the naming system that lets clients find services without hard-coding network addresses. A resolver looks up records such as A, AAAA or CNAME and may cache the answer according to TTL. Because several caches can exist, DNS changes may appear gradually rather than everywhere at once. When a site cannot be reached, DNS is a distinct layer to inspect before blaming HTTP or the application.",
    "DNS to system nazw pozwalający klientom odnajdywać usługi bez wpisywania na sztywno adresów sieciowych. Resolver wyszukuje rekordy, np. A, AAAA lub CNAME, i może cache'ować odpowiedź zgodnie z TTL. Ponieważ po drodze istnieje kilka warstw cache, zmiany DNS mogą pojawiać się stopniowo. Gdy strona jest niedostępna, DNS jest osobną warstwą do sprawdzenia zanim zacznie się obwiniać HTTP albo aplikację."
  ],
  cors: [
    "CORS is enforced by browsers and controls whether frontend JavaScript may read a cross-origin response. For some requests the browser first sends an OPTIONS preflight describing the intended method and headers. The server answers with Access-Control-Allow-* headers. CORS is not authentication or authorization, so the backend must still verify identity and permissions.",
    "CORS jest egzekwowany przez przeglądarkę i kontroluje, czy JavaScript frontendu może odczytać cross-origin response. Dla części requestów przeglądarka najpierw wysyła preflight OPTIONS z planowaną metodą i nagłówkami. Serwer odpowiada nagłówkami Access-Control-Allow-*. CORS nie jest uwierzytelnianiem ani autoryzacją, więc backend nadal musi sprawdzać tożsamość i uprawnienia."
  ],
  dom: [
    "The DOM is the browser's object model for a document. JavaScript can inspect and change nodes, attributes and text through DOM APIs. Those changes may trigger style calculation, layout or paint work, so repeated large mutations can have a performance cost. Frameworks such as React still ultimately update the DOM even when you work through a higher-level abstraction.",
    "DOM to obiektowy model dokumentu udostępniany przez przeglądarkę. JavaScript może odczytywać i zmieniać węzły, atrybuty i tekst przez API DOM. Takie zmiany mogą uruchamiać obliczanie stylów, layout lub paint, dlatego częste duże mutacje mogą kosztować wydajność. Frameworki takie jak React nadal ostatecznie aktualizują DOM, nawet jeśli pracujesz przez wyższą abstrakcję."
  ],
  rag: [
    "RAG supplies external knowledge to a model at request time. A typical flow ingests documents, splits them into useful chunks, indexes them, retrieves candidates for a query, optionally reranks them and places the best evidence in the model context. It is useful for private, domain-specific or changing knowledge because the information stays outside model weights. Quality depends heavily on retrieval, permissions and provenance.",
    "RAG dostarcza modelowi zewnętrzną wiedzę w czasie requestu. Typowy flow pobiera dokumenty, dzieli je na użyteczne chunki, indeksuje, wyszukuje kandydatów dla zapytania, opcjonalnie rerankuje i umieszcza najlepsze dowody w kontekście modelu. Jest przydatny dla prywatnej, domenowej lub zmiennej wiedzy, ponieważ informacje pozostają poza wagami modelu. Jakość mocno zależy od retrievalu, uprawnień i zachowania źródeł."
  ],
  mcp: [
    "MCP standardizes how an AI host connects to external capabilities exposed by MCP servers. A host uses MCP clients to communicate with servers that can expose tools and contextual resources through a common protocol. MCP reduces one-off integration code, but it does not automatically make a server trusted or safe. Authentication, authorization, consent, tool scoping and validation still need explicit design.",
    "MCP standaryzuje sposób, w jaki host AI łączy się z zewnętrznymi możliwościami udostępnianymi przez serwery MCP. Host używa klientów MCP do komunikacji z serwerami, które mogą wystawiać narzędzia i zasoby kontekstowe przez wspólny protokół. MCP ogranicza ilość jednorazowego kodu integracyjnego, ale nie sprawia automatycznie, że serwer jest zaufany lub bezpieczny. Uwierzytelnianie, autoryzacja, zgoda użytkownika, zakres narzędzi i walidacja nadal muszą być jawnie zaprojektowane."
  ],
  kubernetes: [
    "Kubernetes orchestrates containerized workloads across a cluster. You declare desired state, for example a Deployment and replica count, and controllers continuously reconcile actual state toward it. Pods are disposable scheduling units, Services provide stable networking and probes influence traffic or restarts. Kubernetes automates infrastructure behaviour, but it cannot decide whether your business logic or data is correct.",
    "Kubernetes orkiestruje konteneryzowane workloady w klastrze. Deklarujesz desired state, np. Deployment i liczbę replik, a kontrolery stale uzgadniają stan rzeczywisty z zadeklarowanym. Pody są jednorazowymi jednostkami schedulingu, Services zapewniają stabilną sieć, a probe'y wpływają na ruch lub restarty. Kubernetes automatyzuje zachowanie infrastruktury, ale nie ocenia poprawności logiki biznesowej ani danych."
  ],
  terraform: [
    "Terraform is an Infrastructure as Code tool that converts declarative configuration into planned changes against provider APIs. Its state maps configuration to real resources, which makes state operationally important. A normal workflow is configuration, plan, review and apply through a controlled process. Teams still need state locking, secret handling, ownership and drift policies.",
    "Terraform to narzędzie Infrastructure as Code, które zamienia deklaratywną konfigurację na planowane zmiany wykonywane przez API providerów. State mapuje konfigurację na realne zasoby, dlatego jest operacyjnie ważny. Typowy workflow to konfiguracja, plan, review i apply przez kontrolowany proces. Zespół nadal potrzebuje lockingu state, obsługi sekretów, ownershipu i polityki driftu."
  ]
};

function fallbackDetails(
  definition: [string, string],
  category: GlossaryTerm["category"],
): [string, string] {
  const suffix: Record<GlossaryTerm["category"], [string, string]> = {
    web: [
      "In a production web application, understand which layer owns this concept: browser, network, edge or backend. Knowing that boundary helps you debug the right place and avoids confusing it with security or application logic handled elsewhere. Trace one real request in DevTools or logs and identify where this mechanism appears in the path. Then ask what changes when the request crosses an origin, cache, proxy or authentication boundary.",
      "W aplikacji produkcyjnej warto wiedzieć, która warstwa odpowiada za to pojęcie: przeglądarka, sieć, edge czy backend. Znajomość tej granicy pomaga debugować właściwe miejsce i nie mylić go z bezpieczeństwem albo logiką aplikacji realizowaną gdzie indziej. Prześledź jeden prawdziwy request w DevTools lub logach i znajdź moment, w którym ten mechanizm pojawia się na ścieżce. Potem sprawdź, co zmienia się po przekroczeniu granicy originu, cache, proxy albo uwierzytelniania."
    ],
    language: [
      "In day-to-day code, learn whether this concept affects parsing, type checking, build output or runtime behaviour. A small executable example and common edge cases are more useful than memorising the definition alone. Compare what the source code says with what actually exists at runtime. When possible, change one input at a time and observe which guarantee comes from the language, compiler or runtime.",
      "W codziennym kodzie warto rozumieć, czy to pojęcie wpływa na parsing, typecheck, build czy zachowanie runtime. Mały działający przykład i typowe edge case'y są bardziej użyteczne niż samo zapamiętanie definicji. Porównuj to, co deklaruje kod źródłowy, z tym, co naprawdę istnieje w runtime. Gdy to możliwe, zmieniaj po jednym wejściu i obserwuj, która gwarancja pochodzi z języka, kompilatora albo środowiska wykonawczego."
    ],
    framework: [
      "In React, connect this concept to data ownership, rendering and synchronization. The useful question is not only what the API is called, but when React uses it and what responsibility should stay outside the component. Check whether the value is source state, derived data or synchronization with an external system. That distinction often determines whether the component stays simple or accumulates unnecessary effects and rerenders.",
      "W React połącz to pojęcie z ownershipem danych, renderowaniem i synchronizacją. Ważna jest nie tylko nazwa API, ale też kiedy React z niego korzysta i jaka odpowiedzialność powinna pozostać poza komponentem. Sprawdź, czy dana wartość jest stanem źródłowym, danymi pochodnymi czy synchronizacją z zewnętrznym systemem. To rozróżnienie często decyduje, czy komponent pozostanie prosty, czy zacznie zbierać zbędne effecty i rerendery."
    ],
    ai: [
      "In a production AI system, separate model capability from application guarantees. Ask what data enters the model, what is validated in code, which permissions apply and how quality or failures will be measured. Identify whether the concept belongs to context construction, retrieval, generation, tool execution or evaluation. Then define an observable failure mode so the system can be tested instead of relying on a convincing demo.",
      "W produkcyjnym systemie AI oddziel możliwości modelu od gwarancji aplikacji. Pytaj, jakie dane trafiają do modelu, co jest walidowane w kodzie, jakie obowiązują uprawnienia i jak będzie mierzona jakość lub błędy. Ustal, czy pojęcie należy do budowy kontekstu, retrievalu, generowania, wykonywania narzędzi czy ewaluacji. Następnie zdefiniuj obserwowalny failure mode, żeby system dało się testować zamiast polegać na efektownym demo."
    ],
    infra: [
      "In production infrastructure, focus on responsibility, failure modes and observability. Understand what component controls this layer, what happens when it fails and which logs, metrics or configuration show its real state. Place it on a request or deployment diagram and mark what comes immediately before and after it. Finally, distinguish configuration, runtime state and persistent data because they usually fail and recover in different ways.",
      "W infrastrukturze produkcyjnej skup się na odpowiedzialności, trybach awarii i observability. Zrozum, który komponent kontroluje tę warstwę, co dzieje się przy awarii oraz jakie logi, metryki lub konfiguracja pokazują jej rzeczywisty stan. Umieść ten element na diagramie requestu albo deploymentu i zaznacz, co znajduje się bezpośrednio przed nim i po nim. Na koniec oddziel konfigurację, stan runtime i trwałe dane, bo zwykle psują się i odtwarzają w inny sposób."
    ]
  };
  return [
    definition[0] + " " + suffix[category][0],
    definition[1] + " " + suffix[category][1]
  ];
}

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
  details: T(...(LONG_DETAILS[id] ?? fallbackDetails(definition, category))),
  aliases,
  courses,
  category,
});

const ALL = ["javascript", "typescript", "react", "ai", "it-foundations"];

export const glossaryTerms: GlossaryTerm[] = [
  G("bit","Bit",["Binary digit","Binary digit"],["The smallest binary unit of information, represented as 0 or 1.","Najmniejsza binarna jednostka informacji reprezentowana jako 0 albo 1."],["bit","bits"],["it-foundations"],"infra"),
  G("byte","Byte",undefined,["A group of eight bits commonly used as a basic unit of digital storage.","Grupa ośmiu bitów używana powszechnie jako podstawowa jednostka storage."],["byte","bytes"],["it-foundations"],"infra"),
  G("binary","Binary",undefined,["A base-2 representation using only 0 and 1, fundamental to digital computing.","Reprezentacja w systemie dwójkowym używająca tylko 0 i 1, fundamentalna dla komputerów cyfrowych."],["binary"],["it-foundations"],"infra"),
  G("cpu","CPU",["Central Processing Unit","Central Processing Unit"],["The processor that executes machine instructions and coordinates computation.","Procesor wykonujący instrukcje maszynowe i koordynujący obliczenia."],["CPU"],["it-foundations"],"infra"),
  G("ram","RAM",["Random Access Memory","Random Access Memory"],["Fast volatile memory used by running programs for active data and instructions.","Szybka ulotna pamięć używana przez uruchomione programy do aktywnych danych i instrukcji."],["RAM"],["it-foundations"],"infra"),
  G("os","OS",["Operating System","System operacyjny"],["System software that manages hardware resources, processes, files and application interfaces.","Oprogramowanie systemowe zarządzające sprzętem, procesami, plikami i interfejsami dla aplikacji."],["OS","operating system"],["it-foundations"],"infra"),
  G("process","Process",undefined,["A running instance of a program with its own execution state and resources.","Uruchomiona instancja programu posiadająca własny stan wykonania i zasoby."],["process","processes"],["it-foundations"],"infra"),
  G("thread","Thread",undefined,["A schedulable execution path inside a process that may share memory with other threads in that process.","Planowana przez system ścieżka wykonania wewnątrz procesu, która może współdzielić pamięć z innymi threadami procesu."],["thread","threads"],["it-foundations"],"infra"),
  G("filesystem","Filesystem",undefined,["The structure and rules an operating system uses to organize files and directories on storage.","Struktura i reguły używane przez system operacyjny do organizowania plików i katalogów na storage."],["filesystem","file system"],["it-foundations"],"infra"),
  G("runtime","Runtime",undefined,["The environment and supporting software in which a program executes.","Środowisko i oprogramowanie wspierające, w którym wykonuje się program."],["runtime"],["it-foundations","javascript","typescript"],"language"),
  G("compiler","Compiler",undefined,["A tool that transforms source code into another form, often lower-level code or executable output.","Narzędzie transformujące kod źródłowy do innej postaci, często niższego poziomu lub wykonywalnego outputu."],["compiler"],["it-foundations","typescript"],"language"),
  G("interpreter","Interpreter",undefined,["A program that executes source or intermediate instructions without producing a standalone native executable first.","Program wykonujący kod źródłowy lub pośredni bez wcześniejszego tworzenia samodzielnego natywnego executable."],["interpreter"],["it-foundations","javascript"],"language"),

  G("origin","Origin",undefined,["The combination of URL scheme, host and port used by browser same-origin security rules.","Połączenie scheme, hosta i portu używane przez przeglądarkę w regułach same-origin."],["origin","same origin"],["it-foundations","javascript","react"],"web"),
  G("same-origin","Same-origin policy",undefined,["A browser security rule that restricts how content from one origin can access resources from another origin.","Reguła bezpieczeństwa przeglądarki ograniczająca dostęp treści z jednego originu do zasobów innego originu."],["same-origin policy","same origin policy"],["it-foundations","javascript","react"],"web"),
  G("preflight","Preflight request",undefined,["An OPTIONS request a browser may send before a cross-origin request to check which methods and headers are allowed.","Request OPTIONS, który przeglądarka może wysłać przed cross-origin requestem, aby sprawdzić dozwolone metody i nagłówki."],["preflight","preflight request"],["it-foundations","javascript","react"],"web"),
  G("certificate","TLS certificate",undefined,["A signed digital credential binding a public key to an identity such as a hostname.","Podpisany cyfrowy dokument wiążący klucz publiczny z tożsamością, np. hostname."],["certificate","TLS certificate","SSL certificate"],["it-foundations"],"web"),
  G("cache","Cache",undefined,["Stored reusable data or computation kept closer to where it is needed to reduce repeated work or latency.","Przechowywane dane lub wynik obliczeń używany ponownie bliżej miejsca zapotrzebowania, aby ograniczyć powtarzaną pracę lub latency."],["cache","caching"],["it-foundations","javascript","react"],"infra"),
  G("session","Session",undefined,["Server- or client-associated state that represents a user's continuing interaction across multiple requests.","Stan po stronie serwera lub powiązany z klientem reprezentujący ciągłą interakcję użytkownika przez wiele requestów."],["session","sessions"],["it-foundations"],"web"),
  G("access-token","Access token",undefined,["A credential presented to an API to represent delegated access for a limited scope, audience and lifetime.","Credential przekazywany do API reprezentujący delegowany dostęp o ograniczonym scope, audience i czasie życia."],["access token","access tokens"],["it-foundations"],"web"),
  G("refresh-token","Refresh token",undefined,["A longer-lived credential used by an authorized client to obtain new access tokens without asking the user to sign in again.","Dłużej żyjący credential używany przez autoryzowanego klienta do uzyskania nowego access tokena bez ponownego logowania użytkownika."],["refresh token","refresh tokens"],["it-foundations"],"web"),
  G("pkce","PKCE",["Proof Key for Code Exchange","Proof Key for Code Exchange"],["An OAuth extension that binds the authorization request to the client that later exchanges the authorization code.","Rozszerzenie OAuth wiążące request autoryzacyjny z klientem, który później wymienia authorization code."],["PKCE"],["it-foundations"],"web"),
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
  G("tcp-ip","TCP/IP",["Transmission Control Protocol / Internet Protocol","Transmission Control Protocol / Internet Protocol"],["A common shorthand for the internet networking stack built around IP plus transport protocols such as TCP.","Popularne określenie stosu sieciowego internetu opartego na IP i protokołach transportowych takich jak TCP."],["TCP/IP"],["it-foundations"],"infra"),
  G("udp","UDP",["User Datagram Protocol","User Datagram Protocol"],["A connectionless transport protocol that sends datagrams without TCP-style delivery guarantees.","Bezpołączeniowy protokół transportowy wysyłający datagramy bez gwarancji dostarczenia takich jak w TCP."],["UDP"],["it-foundations"],"infra"),
  G("ipv4","IPv4",["Internet Protocol version 4","Internet Protocol version 4"],["The widely used IP addressing protocol using 32-bit addresses.","Powszechnie używana wersja protokołu IP korzystająca z 32-bitowych adresów."],["IPv4"],["it-foundations"],"infra"),
  G("ipv6","IPv6",["Internet Protocol version 6","Internet Protocol version 6"],["The newer IP version using 128-bit addresses and a vastly larger address space.","Nowsza wersja IP używająca 128-bitowych adresów i znacznie większej przestrzeni adresowej."],["IPv6"],["it-foundations"],"infra"),
  G("uri","URI",["Uniform Resource Identifier","Uniform Resource Identifier"],["A general identifier for a resource; a URL is a URI that also describes how to locate it.","Ogólny identyfikator zasobu; URL jest rodzajem URI, który opisuje także sposób lokalizacji zasobu."],["URI"],["it-foundations","javascript","typescript","react"],"web"),
  G("port","Port",undefined,["A numeric endpoint used by transport protocols to route traffic to the right process or service on a host.","Numeryczny endpoint używany przez protokoły transportowe do skierowania ruchu do właściwego procesu lub usługi na hoście."],["port","ports"],["it-foundations"],"infra"),
  G("socket","Socket",undefined,["A software endpoint representing one side of a network communication channel.","Programowy endpoint reprezentujący jedną stronę kanału komunikacji sieciowej."],["socket","sockets"],["it-foundations"],"infra"),
  G("websocket","WebSocket",undefined,["A persistent full-duplex protocol that lets client and server exchange messages over one long-lived connection.","Trwały protokół full-duplex pozwalający klientowi i serwerowi wymieniać wiadomości przez jedno długotrwałe połączenie."],["WebSocket","WebSockets"],["it-foundations","javascript"],"web"),
  G("sse","SSE",["Server-Sent Events","Server-Sent Events"],["A browser API for receiving a one-way stream of text events from a server over HTTP.","API przeglądarki do odbierania jednokierunkowego strumienia zdarzeń tekstowych z serwera przez HTTP."],["SSE","Server-Sent Events"],["it-foundations","javascript"],"web"),
  G("headers","HTTP headers",undefined,["Metadata attached to HTTP requests and responses, such as content type, caching or authorization information.","Metadane dołączane do requestów i response'ów HTTP, np. content type, cache albo informacje autoryzacyjne."],["headers","HTTP headers"],["it-foundations","javascript","typescript","react"],"web"),
  G("status-code","HTTP status code",undefined,["A three-digit HTTP response code describing the outcome class of a request.","Trzycyfrowy kod odpowiedzi HTTP opisujący klasę wyniku requestu."],["status code","status codes","HTTP status"],["it-foundations","javascript","typescript","react"],"web"),
  G("cookie","Cookie",undefined,["Small data stored by the browser and optionally sent automatically with matching HTTP requests.","Mały fragment danych przechowywany przez przeglądarkę i opcjonalnie automatycznie wysyłany z pasującymi requestami HTTP."],["cookie","cookies"],["it-foundations","javascript","react"],"web"),
  G("bom","BOM",["Browser Object Model","Browser Object Model"],["A loose name for browser-provided objects outside the document tree, such as window, location and history.","Umowne określenie obiektów przeglądarki poza drzewem dokumentu, np. window, location i history."],["BOM"],["it-foundations","javascript"],"web"),
  G("reflow","Reflow / layout",undefined,["Browser work that recalculates element geometry when layout-affecting values change.","Praca przeglądarki polegająca na ponownym obliczaniu geometrii elementów po zmianach wpływających na layout."],["reflow","layout"],["it-foundations","javascript","react"],"web"),
  G("repaint","Repaint",undefined,["Browser work that redraws pixels after visual properties change without necessarily recalculating layout.","Praca przeglądarki polegająca na ponownym narysowaniu pikseli po zmianie wyglądu bez konieczności ponownego liczenia layoutu."],["repaint","paint"],["it-foundations","javascript","react"],"web"),
  G("localstorage","localStorage",undefined,["Persistent key-value storage scoped to a browser origin and readable by JavaScript.","Trwały key-value storage przypisany do originu i dostępny z JavaScriptu."],["localStorage"],["it-foundations","javascript","react"],"web"),
  G("sessionstorage","sessionStorage",undefined,["Per-tab key-value storage scoped to an origin and cleared when the tab session ends.","Key-value storage przypisany do originu i sesji karty, czyszczony po zakończeniu tej sesji."],["sessionStorage"],["it-foundations","javascript","react"],"web"),
  G("indexeddb","IndexedDB",undefined,["A browser database for storing larger structured datasets and objects asynchronously.","Baza danych w przeglądarce do asynchronicznego przechowywania większych ustrukturyzowanych danych i obiektów."],["IndexedDB"],["it-foundations","javascript"],"web"),
  G("csp","CSP",["Content Security Policy","Content Security Policy"],["A browser security policy that restricts which sources may load or execute content such as scripts and styles.","Polityka bezpieczeństwa przeglądarki ograniczająca źródła, z których mogą być ładowane lub wykonywane m.in. skrypty i style."],["CSP","Content Security Policy"],["it-foundations","javascript","react"],"web"),
  G("csrf","CSRF",["Cross-Site Request Forgery","Cross-Site Request Forgery"],["An attack that tricks a browser into sending an unwanted authenticated request using automatically attached credentials.","Atak wykorzystujący przeglądarkę do wysłania niechcianego uwierzytelnionego requestu z automatycznie dołączanymi credentialami."],["CSRF"],["it-foundations","javascript","react"],"web"),
  G("xss","XSS",["Cross-Site Scripting","Cross-Site Scripting"],["A class of vulnerabilities where attacker-controlled script executes in a trusted browser origin.","Klasa podatności, w której skrypt kontrolowany przez atakującego wykonuje się w zaufanym originie przeglądarki."],["XSS"],["it-foundations","javascript","react"],"web"),
  G("hashing","Hashing",undefined,["A one-way transformation from arbitrary input to a fixed-size digest used for integrity checks and password derivation schemes.","Jednokierunkowa transformacja danych do skrótu o stałym rozmiarze używana m.in. do integralności i bezpiecznego przetwarzania haseł."],["hashing","hash"],["it-foundations"],"web"),
  G("encryption","Encryption",undefined,["A reversible cryptographic transformation that protects data using a key.","Odwracalna transformacja kryptograficzna chroniąca dane przy użyciu klucza."],["encryption","encrypt"],["it-foundations"],"web"),
  G("mfa","MFA",["Multi-Factor Authentication","Multi-Factor Authentication"],["Authentication requiring evidence from more than one factor category.","Uwierzytelnianie wymagające dowodu z więcej niż jednej kategorii czynnika."],["MFA"],["it-foundations"],"web"),
  G("csr","CSR",["Client-Side Rendering","Client-Side Rendering"],["Rendering UI primarily in the browser after JavaScript loads and runs.","Renderowanie UI głównie w przeglądarce po załadowaniu i uruchomieniu JavaScriptu."],["CSR"],["it-foundations","javascript","react"],"framework"),
  G("ssr","SSR",["Server-Side Rendering","Server-Side Rendering"],["Rendering HTML on the server for a request before sending it to the browser.","Renderowanie HTML na serwerze dla requestu przed wysłaniem go do przeglądarki."],["SSR"],["it-foundations","react"],"framework"),
  G("ssg","SSG",["Static Site Generation","Static Site Generation"],["Generating HTML ahead of requests, usually during a build or content generation step.","Generowanie HTML przed requestami, zwykle podczas buildu lub procesu generowania treści."],["SSG"],["it-foundations","react"],"framework"),
  G("isr","ISR",["Incremental Static Regeneration","Incremental Static Regeneration"],["A pattern where static pages can be regenerated after deployment according to framework caching rules.","Wzorzec, w którym statyczne strony mogą być regenerowane po deploymencie zgodnie z regułami cache frameworka."],["ISR"],["it-foundations","react"],"framework"),
  G("spa","SPA",["Single-Page Application","Single-Page Application"],["A web application that updates views on the client without full-document navigation for most interactions.","Aplikacja webowa aktualizująca widoki po stronie klienta bez pełnego przeładowania dokumentu dla większości interakcji."],["SPA"],["it-foundations","javascript","react"],"framework"),
  G("mpa","MPA",["Multi-Page Application","Multi-Page Application"],["A web architecture where navigation commonly loads a new document for each page or route.","Architektura webowa, w której nawigacja zwykle ładuje nowy dokument dla każdej strony lub trasy."],["MPA"],["it-foundations"],"framework"),
  G("bundle","Bundle",undefined,["An output file or group of files produced by a build tool from application modules and assets.","Plik lub grupa plików wynikowych tworzonych przez build tool z modułów i assetów aplikacji."],["bundle","bundles"],["it-foundations","javascript","typescript","react"],"framework"),
  G("tree-shaking","Tree shaking",undefined,["Build-time removal of unused exports when module structure allows static analysis.","Usuwanie nieużywanych eksportów podczas buildu, gdy struktura modułów pozwala na analizę statyczną."],["tree shaking","tree-shaking"],["it-foundations","javascript","typescript","react"],"framework"),
  G("code-splitting","Code splitting",undefined,["Dividing application code into separately loadable chunks instead of one large bundle.","Dzielenie kodu aplikacji na osobno ładowane chunki zamiast jednego dużego bundle'a."],["code splitting"],["it-foundations","javascript","react"],"framework"),
  G("lazy-loading","Lazy loading",undefined,["Deferring loading or execution of a resource until it is needed.","Odkładanie ładowania lub wykonania zasobu do momentu, gdy jest potrzebny."],["lazy loading","lazy-loading"],["it-foundations","javascript","react"],"framework"),
  G("graphql","GraphQL",undefined,["A schema-based API query language and runtime where clients specify the fields they need.","Język zapytań i runtime API oparty na schemacie, w którym klient określa potrzebne pola."],["GraphQL"],["it-foundations","javascript","typescript","react"],"web"),
  G("rpc","RPC",["Remote Procedure Call","Remote Procedure Call"],["An API style that models remote operations as procedure or method calls.","Styl API modelujący zdalne operacje jako wywołania procedur lub metod."],["RPC"],["it-foundations"],"web"),
  G("endpoint","Endpoint",undefined,["A specific address and operation exposed by an API or network service.","Konkretny adres i operacja udostępniona przez API albo usługę sieciową."],["endpoint","endpoints"],["it-foundations","javascript","typescript","react"],"web"),
  G("middleware","Middleware",undefined,["Code that runs between an incoming request and final handler to add cross-cutting behaviour.","Kod wykonywany pomiędzy przychodzącym requestem a końcowym handlerem, dodający wspólne zachowania."],["middleware"],["it-foundations"],"web"),
  G("crud","CRUD",["Create, Read, Update, Delete","Create, Read, Update, Delete"],["The four common categories of operations performed on persistent application data.","Cztery popularne kategorie operacji wykonywanych na trwałych danych aplikacji."],["CRUD"],["it-foundations"],"web"),
  G("orm","ORM",["Object-Relational Mapping","Object-Relational Mapping"],["A library or pattern that maps application objects and queries to relational database operations.","Biblioteka lub wzorzec mapujący obiekty i zapytania aplikacji na operacje relacyjnej bazy danych."],["ORM"],["it-foundations"],"web"),
  G("webhook","Webhook",undefined,["An HTTP callback sent by one system to notify another system that an event occurred.","Callback HTTP wysyłany przez jeden system do drugiego w celu powiadomienia o zdarzeniu."],["webhook","webhooks"],["it-foundations"],"web"),
  G("polling","Polling",undefined,["Repeatedly asking a service for new state at intervals instead of receiving pushed updates.","Cykliczne odpytywanie usługi o nowy stan zamiast otrzymywania zmian w modelu push."],["polling"],["it-foundations","javascript","react"],"web"),
  G("rate-limit","Rate limiting",undefined,["Restricting how many requests or operations a caller may perform in a time window.","Ograniczanie liczby requestów lub operacji, które caller może wykonać w określonym czasie."],["rate limiting","rate limit"],["it-foundations"],"infra"),
  G("load-balancer","Load balancer",undefined,["A component that distributes incoming traffic across multiple healthy service instances.","Komponent rozdzielający przychodzący ruch pomiędzy wiele zdrowych instancji usługi."],["load balancer","load balancing"],["it-foundations"],"infra"),
  G("reverse-proxy","Reverse proxy",undefined,["A server that accepts client traffic and forwards it to upstream services while hiding those services behind one entry point.","Serwer odbierający ruch klienta i przekazujący go do usług upstream, ukrywając je za jednym punktem wejścia."],["reverse proxy"],["it-foundations"],"infra"),
  G("nginx","Nginx",undefined,["A widely used web server and reverse proxy often used for TLS termination, routing and static files.","Popularny serwer web i reverse proxy często używany do terminacji TLS, routingu i obsługi statycznych plików."],["Nginx"],["it-foundations"],"infra"),
  G("aws","AWS",["Amazon Web Services","Amazon Web Services"],["A major cloud platform providing compute, networking, storage, databases and managed services.","Duża platforma cloud oferująca compute, sieci, storage, bazy danych i managed services."],["AWS"],["it-foundations"],"infra"),
  G("azure","Azure",["Microsoft Azure","Microsoft Azure"],["Microsoft's cloud platform providing compute, networking, storage, databases and managed services.","Platforma cloud Microsoftu oferująca compute, sieci, storage, bazy danych i managed services."],["Azure"],["it-foundations"],"infra"),
  G("gcp","GCP",["Google Cloud Platform","Google Cloud Platform"],["Google's cloud platform providing compute, networking, storage, databases and managed services.","Platforma cloud Google oferująca compute, sieci, storage, bazy danych i managed services."],["GCP","Google Cloud"],["it-foundations"],"infra"),
  G("serverless","Serverless",undefined,["A cloud execution model where the provider manages most server lifecycle and scaling while you deploy functions or services.","Model cloud, w którym provider zarządza większością cyklu życia serwerów i skalowaniem, a Ty wdrażasz funkcje lub usługi."],["serverless"],["it-foundations"],"infra"),
  G("autoscaling","Autoscaling",undefined,["Automatically changing available compute capacity based on configured demand signals.","Automatyczna zmiana dostępnej mocy obliczeniowej na podstawie skonfigurowanych sygnałów obciążenia."],["autoscaling","auto scaling"],["it-foundations"],"infra"),
  G("pipeline","Pipeline",undefined,["An ordered automated workflow of build, test, packaging, deployment or other delivery steps.","Uporządkowany automatyczny workflow obejmujący build, testy, pakowanie, deployment lub inne kroki delivery."],["pipeline","pipelines"],["it-foundations"],"infra"),
  G("artifact","Artifact",undefined,["A versioned build output such as a package, archive, container image or compiled bundle.","Wersjonowany wynik buildu, np. paczka, archiwum, obraz kontenera lub skompilowany bundle."],["artifact","artifacts"],["it-foundations"],"infra"),
  G("deployment","Deployment",undefined,["The process or release unit that makes a new application version available in an environment.","Proces lub jednostka release'u udostępniająca nową wersję aplikacji w danym środowisku."],["deployment","deploy"],["it-foundations"],"infra"),
  G("rollback","Rollback",undefined,["Returning a system to a previous known-good release or configuration after a bad change.","Powrót systemu do wcześniejszego znanego dobrego release'u lub konfiguracji po błędnej zmianie."],["rollback"],["it-foundations"],"infra"),
  G("blue-green","Blue-green deployment",undefined,["A release strategy with two environments where traffic is switched from the old version to the new one.","Strategia release'u z dwoma środowiskami, w której ruch jest przełączany ze starej wersji na nową."],["blue-green","blue green"],["it-foundations"],"infra"),
  G("canary","Canary deployment",undefined,["A release strategy that exposes a new version to a small share of traffic before wider rollout.","Strategia release'u udostępniająca nową wersję niewielkiej części ruchu przed szerszym rolloutem."],["canary deployment","canary"],["it-foundations"],"infra"),
  G("environment","Environment",undefined,["A configured runtime context such as development, test, staging or production.","Skonfigurowany kontekst runtime, np. development, test, staging albo production."],["environment","environments"],["it-foundations"],"infra"),
  G("secret","Secret",undefined,["Sensitive credential material such as passwords, API keys or private keys that requires controlled storage and access.","Wrażliwe dane uwierzytelniające, np. hasła, API keys lub private keys wymagające kontrolowanego przechowywania i dostępu."],["secret","secrets"],["it-foundations"],"infra"),
  G("dhcp","DHCP",["Dynamic Host Configuration Protocol","Dynamic Host Configuration Protocol"],["A network protocol that automatically assigns clients IP configuration such as address and gateway.","Protokół sieciowy automatycznie przydzielający klientom konfigurację IP, np. adres i gateway."],["DHCP"],["it-foundations"],"infra"),
  G("subnet","Subnet",undefined,["A logical subdivision of an IP network defined by an address prefix.","Logiczny podział sieci IP określony przez prefiks adresowy."],["subnet","subnets"],["it-foundations"],"infra"),
  G("gateway","Gateway",undefined,["A network device or service that forwards traffic from one network to another.","Urządzenie lub usługa sieciowa przekazująca ruch z jednej sieci do drugiej."],["gateway"],["it-foundations"],"infra"),
  G("proxy","Proxy",undefined,["An intermediary that forwards requests on behalf of clients or services.","Pośrednik przekazujący requesty w imieniu klientów lub usług."],["proxy"],["it-foundations"],"infra"),
  G("vpn","VPN",["Virtual Private Network","Virtual Private Network"],["An encrypted network tunnel that connects a device or network to another private network.","Szyfrowany tunel sieciowy łączący urządzenie lub sieć z inną prywatną siecią."],["VPN"],["it-foundations"],"infra"),
  G("firewall","Firewall",undefined,["A security control that allows or blocks network traffic according to configured rules.","Kontrola bezpieczeństwa pozwalająca lub blokująca ruch sieciowy zgodnie z regułami."],["firewall"],["it-foundations"],"infra"),
  G("sql","SQL",["Structured Query Language","Structured Query Language"],["The standard language used to define, query and modify data in relational databases.","Standardowy język do definiowania, odpytywania i modyfikowania danych w relacyjnych bazach danych."],["SQL"],["it-foundations"],"infra"),
  G("nosql","NoSQL",["Not only SQL","Not only SQL"],["A broad family of non-relational database models such as document, key-value, graph and wide-column stores.","Szeroka rodzina nierelacyjnych modeli baz danych, np. document, key-value, graph i wide-column."],["NoSQL"],["it-foundations"],"infra"),
  G("acid","ACID",["Atomicity, Consistency, Isolation, Durability","Atomicity, Consistency, Isolation, Durability"],["A set of transaction properties used to reason about reliable database changes.","Zestaw właściwości transakcji używany do opisu niezawodnych zmian w bazie danych."],["ACID"],["it-foundations"],"infra"),
  G("transaction","Transaction",undefined,["A logical group of database operations committed or rolled back as one unit.","Logiczna grupa operacji bazodanowych zatwierdzana lub wycofywana jako jedna jednostka."],["transaction","transactions"],["it-foundations"],"infra"),
  G("db-index","Database index",undefined,["An additional data structure that speeds selected queries at the cost of storage and write work.","Dodatkowa struktura danych przyspieszająca wybrane zapytania kosztem storage i pracy przy zapisie."],["database index","index"],["it-foundations"],"infra"),
  G("primary-key","Primary key",undefined,["A column or set of columns that uniquely identifies a row in a relational table.","Kolumna lub zestaw kolumn jednoznacznie identyfikujący wiersz w tabeli relacyjnej."],["primary key"],["it-foundations"],"infra"),
  G("foreign-key","Foreign key",undefined,["A relational constraint that references a key in another table to preserve relationships between rows.","Relacyjne constraint odwołujące się do klucza innej tabeli w celu zachowania relacji pomiędzy wierszami."],["foreign key"],["it-foundations"],"infra"),
  G("replication","Replication",undefined,["Maintaining additional copies of data across nodes to improve availability or read scalability.","Utrzymywanie dodatkowych kopii danych na różnych nodach w celu poprawy dostępności lub skalowania odczytu."],["replication"],["it-foundations"],"infra"),
  G("sharding","Sharding",undefined,["Partitioning a dataset across multiple database nodes using a shard key or routing strategy.","Dzielenie datasetu pomiędzy wiele nodów bazy przy użyciu shard key lub strategii routingu."],["sharding"],["it-foundations"],"infra"),
  G("git","Git",undefined,["A distributed version control system used to track source-code history and coordinate changes.","Rozproszony system kontroli wersji używany do śledzenia historii kodu i koordynowania zmian."],["Git"],["it-foundations","javascript","typescript","react"],"infra"),
  G("commit","Commit",undefined,["A recorded snapshot of repository changes with a parent history and metadata.","Zapisany snapshot zmian w repozytorium z historią rodziców i metadanymi."],["commit"],["it-foundations"],"infra"),
  G("branch","Branch",undefined,["A movable Git reference pointing to a line of development.","Ruchoma referencja Git wskazująca linię rozwoju kodu."],["branch"],["it-foundations"],"infra"),
  G("merge","Merge",undefined,["Combining histories from different Git branches into one history.","Łączenie historii różnych branchy Git w jedną historię."],["merge"],["it-foundations"],"infra"),
  G("rebase","Rebase",undefined,["Replaying commits onto a new base to create a linearized history.","Ponowne odtwarzanie commitów na nowej bazie w celu utworzenia bardziej liniowej historii."],["rebase"],["it-foundations"],"infra"),
  G("cherry-pick","Cherry-pick",undefined,["Applying the change introduced by a selected Git commit onto the current branch.","Nałożenie zmiany wprowadzonej przez wybrany commit Git na bieżący branch."],["cherry-pick","cherry pick"],["it-foundations"],"infra"),
  G("pull-request","PR / MR",["Pull Request / Merge Request","Pull Request / Merge Request"],["A reviewable proposal to merge a set of repository changes into another branch.","Propozycja zmian do review, które mają zostać zmergowane do innego brancha."],["PR","MR","pull request","merge request"],["it-foundations"],"infra"),
  G("merge-conflict","Merge conflict",undefined,["A situation where Git cannot automatically combine competing changes and needs human resolution.","Sytuacja, w której Git nie potrafi automatycznie połączyć konkurujących zmian i wymaga decyzji człowieka."],["merge conflict","conflict"],["it-foundations"],"infra"),
  G("monolith","Monolith",undefined,["An application architecture where many capabilities are deployed as one main unit.","Architektura aplikacji, w której wiele funkcji jest wdrażanych jako jedna główna jednostka."],["monolith"],["it-foundations"],"infra"),
  G("microservices","Microservices",undefined,["An architecture splitting capabilities into independently deployable networked services.","Architektura dzieląca możliwości systemu na niezależnie wdrażane usługi komunikujące się przez sieć."],["microservices"],["it-foundations"],"infra"),
  G("event-driven","Event-driven architecture",undefined,["An architecture where components react to published events rather than only synchronous direct calls.","Architektura, w której komponenty reagują na publikowane zdarzenia zamiast wyłącznie synchronicznych bezpośrednich wywołań."],["event-driven","event driven"],["it-foundations"],"infra"),
  G("pub-sub","Pub/Sub",["Publish / Subscribe","Publish / Subscribe"],["A messaging pattern where publishers emit messages to topics and subscribers consume them independently.","Wzorzec messagingu, w którym publisherzy wysyłają wiadomości do tematów, a subscriberzy odbierają je niezależnie."],["Pub/Sub","pub sub"],["it-foundations"],"infra"),
  G("message-queue","Message queue",undefined,["A durable or transient queue used to decouple message producers from consumers.","Trwała lub tymczasowa kolejka oddzielająca producentów wiadomości od konsumentów."],["message queue","queue"],["it-foundations"],"infra"),
  G("stateless","Stateless",undefined,["A service design where one request can be handled without relying on process-local state from previous requests.","Projekt usługi, w którym request może być obsłużony bez polegania na lokalnym stanie procesu z poprzednich requestów."],["stateless"],["it-foundations"],"infra"),
  G("stateful","Stateful",undefined,["A service or component whose behaviour depends on retained state across interactions.","Usługa lub komponent, którego zachowanie zależy od zachowanego stanu pomiędzy interakcjami."],["stateful"],["it-foundations"],"infra"),
  G("availability","Availability",undefined,["The degree to which a service is reachable and able to perform useful work when needed.","Stopień, w jakim usługa jest osiągalna i zdolna wykonywać użyteczną pracę wtedy, gdy jest potrzebna."],["availability"],["it-foundations"],"infra"),
  G("scalability","Scalability",undefined,["The ability of a system to handle growing workload by adding or changing resources efficiently.","Zdolność systemu do obsługi rosnącego obciążenia przez efektywne dodawanie lub zmianę zasobów."],["scalability"],["it-foundations"],"infra"),
  G("vector-db","Vector database",undefined,["A database or index optimized for storing vectors and retrieving nearby items by similarity.","Baza lub indeks zoptymalizowany do przechowywania wektorów i wyszukiwania podobnych elementów."],["vector database","vector DB"],["ai","it-foundations"],"ai"),
  G("inference","Inference",undefined,["Running a trained model on input data to produce predictions or generated output.","Uruchomienie wytrenowanego modelu na danych wejściowych w celu uzyskania predykcji lub wygenerowanego wyniku."],["inference"],["ai","it-foundations"],"ai"),
  G("model","Model",undefined,["A learned mathematical system that maps input to predictions, scores or generated outputs.","Wyuczony system matematyczny mapujący wejście na predykcje, wyniki lub generowane odpowiedzi."],["model","models"],["ai","it-foundations"],"ai"),
  G("prompt","Prompt",undefined,["The instructions and context supplied to a generative model for one interaction.","Instrukcje i kontekst przekazane modelowi generatywnemu dla jednej interakcji."],["prompt","prompts"],["ai","it-foundations"],"ai"),
  G("rpo","RPO",["Recovery Point Objective","Recovery Point Objective"],["The maximum acceptable amount of recent data loss measured in time.","Maksymalna akceptowalna utrata ostatnich danych mierzona czasem."],["RPO"],["it-foundations"],"infra"),
];

export const glossaryFor = (courseSlug: string) =>
  glossaryTerms.filter((term) => term.courses.includes(courseSlug));


const normalizeGlossary = (value: string) => value.toLocaleLowerCase();

const escapeGlossary = (value: string) =>
  value.replace(/[.*+?^$\{\}()|[\]\\]/g, "\\$&");

export type GlossaryMatch = {
  start: number;
  end: number;
  text: string;
  term: GlossaryTerm;
};

export function glossaryMatches(courseSlug: string, text: string): GlossaryMatch[] {
  const matches: GlossaryMatch[] = [];

  for (const term of glossaryFor(courseSlug)) {
    for (const alias of term.aliases) {
      const caseSensitive = /[A-Z]/.test(alias);
      const pattern = new RegExp(
        "(?<![\\p{L}\\p{N}_])(" +
          escapeGlossary(alias) +
          ")(?![\\p{L}\\p{N}_])",
        caseSensitive ? "gu" : "giu",
      );

      for (const match of text.matchAll(pattern)) {
        if (match.index === undefined) continue;
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          term,
        });
      }
    }
  }

  return matches
    .sort((a, b) => a.start - b.start || b.text.length - a.text.length)
    .filter(
      (match, index, all) =>
        !all.some(
          (other, otherIndex) =>
            otherIndex < index &&
            other.start <= match.start &&
            other.end >= match.end,
        ),
    );
}

export type GlossaryHighlightEntry = {
  key: string;
  text: string;
};

export function glossaryHighlightPlan(
  courseSlug: string,
  entries: GlossaryHighlightEntry[],
  excludedTermIds: Iterable<string> = [],
  maxTerms = 8,
): Record<string, string[]> {
  const seen = new Set(excludedTermIds);
  const plan: Record<string, string[]> = {};
  let count = 0;

  for (const entry of entries) {
    plan[entry.key] = [];
    for (const match of glossaryMatches(courseSlug, entry.text)) {
      if (seen.has(match.term.id) || count >= maxTerms) continue;
      seen.add(match.term.id);
      plan[entry.key].push(match.term.id);
      count += 1;
    }
  }

  return plan;
}
