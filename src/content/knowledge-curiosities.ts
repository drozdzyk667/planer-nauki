import { T, type Localized } from "@/domain/models";

const CURIOSITIES: Record<string, Localized> = {
  "js-types": T(
    'JavaScript has a famous oddity: typeof NaN is "number". NaN means an invalid numeric result, not a separate runtime type.',
    'JavaScript ma słynną dziwność: typeof NaN zwraca "number". NaN oznacza niepoprawny wynik liczbowy, a nie osobny typ runtime.',
  ),
  "js-arrays-basics": T(
    "Array.prototype.sort mutates the original array. That is easy to miss when the same array is shared by UI state or another function.",
    "Array.prototype.sort mutuje oryginalną tablicę. Łatwo to przeoczyć, gdy ta sama tablica jest współdzielona przez stan UI albo inną funkcję.",
  ),
  "js-event-loop": T(
    "Promise callbacks run as microtasks. A long chain of microtasks can delay timers and even postpone the browser's chance to render.",
    "Callbacki Promise działają jako microtaski. Długi łańcuch microtasków może opóźniać timery, a nawet moment, w którym przeglądarka dostanie szansę na render.",
  ),
  "ts-mental-model": T(
    "TypeScript types disappear after compilation. If data comes from an API, localStorage or user input, runtime validation is still needed.",
    "Typy TypeScript znikają po kompilacji. Jeśli dane przychodzą z API, localStorage albo inputu użytkownika, nadal potrzebujesz walidacji runtime.",
  ),
  "ts-narrowing": T(
    "unknown accepts any input like any, but forces you to prove what the value is before unsafe operations. That small friction is a useful boundary.",
    "unknown może przyjąć dowolną wartość jak any, ale przed ryzykowną operacją zmusza Cię do udowodnienia, czym ta wartość jest. To celowe i przydatne tarcie na granicy danych.",
  ),
  "react-effects": T(
    "A surprising amount of React code does not need an Effect. If a value can be derived during render, storing and synchronizing a second copy often creates bugs.",
    "Zaskakująco dużo kodu React nie potrzebuje Effectu. Jeśli wartość można wyliczyć podczas renderu, przechowywanie i synchronizowanie drugiej kopii często tworzy błędy.",
  ),
  "react-reconciliation": T(
    "React uses key to identify list items during reconciliation, but key is not passed to the component as a normal prop.",
    "React używa key do identyfikowania elementów listy podczas reconciliation, ale key nie trafia do komponentu jako zwykły prop.",
  ),
  "react-state-architecture": T(
    "Changing a component's key can intentionally reset its state because React treats it as a different component identity.",
    "Zmiana key komponentu może celowo wyzerować jego stan, ponieważ React traktuje go wtedy jako inną tożsamość komponentu.",
  ),
  "ai-tokens-context": T(
    "A token is not the same thing as a word. One word can be split into several tokens, while punctuation and spaces may also influence tokenization.",
    "Token nie jest tym samym co słowo. Jedno słowo może zostać podzielone na kilka tokenów, a interpunkcja i spacje również mogą wpływać na tokenizację.",
  ),
  "ai-rag": T(
    "RAG does not retrain the model. It changes the information supplied at request time, which is why documents can be updated without training new weights.",
    "RAG nie dotrenowuje modelu. Zmienia informacje dostarczane w czasie requestu, dlatego dokumenty można aktualizować bez trenowania nowych wag.",
  ),
  "ai-mcp": T(
    "MCP is a protocol, not an agent and not a model. It standardizes the connection to capabilities; your application still owns permissions and execution.",
    "MCP to protokół, a nie agent ani model. Standaryzuje połączenie z możliwościami, ale uprawnienia i wykonanie nadal należą do aplikacji.",
  ),
  "it-dns": T(
    "A DNS lookup does not necessarily travel through the whole hierarchy every time. Browser, OS and resolver caches can answer before an authoritative server is contacted.",
    "Zapytanie DNS nie musi za każdym razem przechodzić przez całą hierarchię. Cache przeglądarki, systemu i resolvera może odpowiedzieć zanim zapytany zostanie serwer autorytatywny.",
  ),
  "it-cors": T(
    "CORS is mainly a browser enforcement mechanism. A backend call made by another server or a CLI client is not blocked by the browser's CORS policy.",
    "CORS jest przede wszystkim mechanizmem egzekwowanym przez przeglądarkę. Request wykonywany przez inny backend albo klient CLI nie jest blokowany przez politykę CORS przeglądarki.",
  ),
  "it-browser-state": T(
    "localStorage survives closing the tab, while sessionStorage is scoped to the tab session. Cookies are much smaller — individual cookies are typically only a few kilobytes — and matching cookies can be sent with HTTP requests.",
    "localStorage przeżywa zamknięcie karty, a sessionStorage jest związany z sesją konkretnej karty. Cookies są znacznie mniejsze — pojedynczy cookie ma zwykle limit rzędu kilku KB — i pasujące cookies mogą być wysyłane razem z requestami HTTP.",
  ),
  "it-auth": T(
    "HttpOnly prevents JavaScript from reading a cookie, but it does not by itself prevent CSRF. Cookie flags solve different parts of the browser security model.",
    "HttpOnly blokuje JavaScriptowi odczyt cookie, ale sam nie rozwiązuje CSRF. Poszczególne flagi cookie rozwiązują różne problemy modelu bezpieczeństwa przeglądarki.",
  ),
  "it-http": T(
    "HTTP/2 changes how messages share a connection, but familiar methods and status codes still mean the same thing at the application level.",
    "HTTP/2 zmienia sposób współdzielenia połączenia przez wiadomości, ale znane metody i statusy HTTP zachowują to samo znaczenie na poziomie aplikacji.",
  ),
  "it-docker": T(
    "A container is not a tiny virtual machine. Containers normally share the host kernel, which is one reason they can start much faster than full VMs.",
    "Kontener nie jest małą maszyną wirtualną. Kontenery zwykle współdzielą kernel hosta i właśnie dlatego mogą startować znacznie szybciej niż pełne VM.",
  ),
  "it-kubernetes": T(
    "A Pod can contain more than one container. Sidecar patterns use that intentionally, even though one main application container per Pod is common.",
    "Pod może zawierać więcej niż jeden kontener. Wzorce sidecar wykorzystują to celowo, mimo że jeden główny kontener aplikacji na Pod jest bardzo częsty.",
  ),
  "it-terraform": T(
    "terraform plan is a preview based on the state known at that moment. Infrastructure may still change before apply, so production workflows usually plan and apply in a controlled window.",
    "terraform plan jest podglądem opartym na stanie znanym w danym momencie. Infrastruktura może zmienić się przed apply, dlatego produkcyjne workflow zwykle wykonują plan i apply w kontrolowanym procesie.",
  ),
  "it-cicd": T(
    "A green pipeline only proves the checks that actually exist. If security, migrations or smoke tests are missing, green does not magically cover them.",
    "Zielony pipeline dowodzi tylko tych kontroli, które naprawdę istnieją. Jeśli brakuje testów security, migracji albo smoke testów, zielony status ich magicznie nie zastępuje.",
  ),
};

export function knowledgeCuriosityFor(sectionId: string): Localized | undefined {
  return CURIOSITIES[sectionId];
}
