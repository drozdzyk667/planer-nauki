import { T, type Localized } from "@/domain/models";

export type StudyLevel = "beginner" | "advanced";

export type KnowledgeSection = {
  id: string;
  level: StudyLevel;
  title: Localized;
  lead: Localized;
  paragraphs: Localized[];
  bullets: Localized[];
  code?: { label: Localized; value: string };
  rule: Localized;
  pitfall: Localized;
};

export type Flashcard = {
  id: string;
  level: StudyLevel;
  tag: Localized;
  front: Localized;
  back: Localized;
  code?: string;
  why?: Localized;
};

export type CourseStudyContent = {
  knowledge: KnowledgeSection[];
  flashcards: Flashcard[];
};

const S = (
  id: string,
  level: StudyLevel,
  title: [string, string],
  lead: [string, string],
  paragraphs: [string, string][],
  bullets: [string, string][],
  rule: [string, string],
  pitfall: [string, string],
  code?: [string, string, string],
): KnowledgeSection => ({
  id,
  level,
  title: T(...title),
  lead: T(...lead),
  paragraphs: paragraphs.map((p) => T(...p)),
  bullets: bullets.map((p) => T(...p)),
  rule: T(...rule),
  pitfall: T(...pitfall),
  code: code ? { label: T(code[0], code[1]), value: code[2] } : undefined,
});

const F = (
  id: string,
  level: StudyLevel,
  tag: [string, string],
  front: [string, string],
  back: [string, string],
  code?: string,
  why?: [string, string],
): Flashcard => ({
  id,
  level,
  tag: T(...tag),
  front: T(...front),
  back: T(...back),
  code,
  why: why ? T(...why) : undefined,
});

const javascript: CourseStudyContent = {
  knowledge: [
    S(
      "js-execution",
      "beginner",
      ["Execution, values and expressions", "Wykonywanie kodu, wartości i wyrażenia"],
      ["Start by understanding what JavaScript actually evaluates.", "Zacznij od zrozumienia, co JavaScript naprawdę oblicza."],
      [
        ["JavaScript executes statements and evaluates expressions. An expression produces a value; a statement performs an action or controls execution.", "JavaScript wykonuje instrukcje i oblicza wyrażenia. Wyrażenie produkuje wartość, a instrukcja wykonuje działanie lub steruje przebiegiem programu."],
        ["Read code from the inside out: first evaluate smaller expressions, then use their values in the surrounding expression.", "Czytaj kod od środka: najpierw oblicz mniejsze wyrażenia, potem użyj ich wartości w większym wyrażeniu."],
      ],
      [
        ["2 + 3 is an expression whose value is 5.", "2 + 3 to wyrażenie, którego wartością jest 5."],
        ["console.log(...) is useful for observing values, not for storing them.", "console.log(...) służy do obserwowania wartości, nie do ich przechowywania."],
        ["Parentheses make evaluation order explicit.", "Nawiasy jasno pokazują kolejność obliczeń."],
      ],
      ["Ask: what value does this expression produce?", "Pytaj: jaką wartość produkuje to wyrażenie?"],
      ["Do not confuse what code returns with what it prints.", "Nie myl wartości zwracanej przez kod z tym, co kod wyświetla."],
      ["Tiny example", "Mały przykład", 'const total = (2 + 3) * 4;\nconsole.log(total); // 20'],
    ),
    S(
      "js-bindings",
      "beginner",
      ["Variables: const, let and bindings", "Zmienne: const, let i powiązania"],
      ["A variable name points at a value; the declaration controls whether that binding may change.", "Nazwa zmiennej wskazuje wartość, a deklaracja określa, czy powiązanie może się zmienić."],
      [
        ["Use const by default. Choose let when reassignment is part of the idea you are modelling.", "Domyślnie używaj const. Wybieraj let wtedy, gdy ponowne przypisanie jest częścią modelowanej sytuacji."],
        ["const does not make an object immutable. It prevents the variable from pointing at a different object.", "const nie zamienia obiektu w niemutowalny. Blokuje jedynie przypisanie tej zmiennej do innego obiektu."],
      ],
      [
        ["Prefer names that reveal intent instead of implementation details.", "Wybieraj nazwy pokazujące intencję, a nie szczegóły implementacji."],
        ["Keep the lifetime and scope of a variable as small as practical.", "Utrzymuj czas życia i zakres zmiennej tak mały, jak to praktyczne."],
        ["Avoid var in modern application code unless you deliberately need its old semantics.", "Unikaj var we współczesnym kodzie aplikacji, chyba że świadomie potrzebujesz jego starszej semantyki."],
      ],
      ["Default to const; earn the right to use let.", "Domyślnie const; let tylko wtedy, gdy zmiana wartości ma sens."],
      ["A const array can still be pushed to because the array itself is mutable.", "Do tablicy zapisanej w const nadal można dodać element, bo sama tablica jest mutowalna."],
      ["Binding vs value", "Powiązanie a wartość", 'const user = { name: "Ada" };\nuser.name = "Grace"; // valid\n// user = {} // error'],
    ),
    S(
      "js-types",
      "beginner",
      ["Types, coercion and equality", "Typy, konwersja i porównania"],
      ["JavaScript is dynamically typed, but values still have precise types.", "JavaScript jest dynamicznie typowany, ale wartości nadal mają konkretne typy."],
      [
        ["Primitive values include string, number, boolean, bigint, symbol, undefined and null. Objects form the other broad category.", "Typy proste obejmują string, number, boolean, bigint, symbol, undefined i null. Drugą szeroką kategorią są obiekty."],
        ["Implicit coercion can be convenient, but it can also hide assumptions. Prefer explicit conversion when the boundary matters.", "Niejawna konwersja bywa wygodna, ale może ukrywać założenia. Na ważnych granicach preferuj konwersję jawną."],
      ],
      [
        ["Use === and !== as the normal equality operators.", "Używaj === i !== jako standardowych operatorów porównania."],
        ["Number(value), String(value) and Boolean(value) communicate conversion intent.", "Number(value), String(value) i Boolean(value) jasno komunikują intencję konwersji."],
        ["Remember that typeof null is historically 'object'.", "Pamiętaj, że typeof null historycznie zwraca 'object'."],
      ],
      ["Be explicit at boundaries: input, API, storage and URL values often arrive as strings.", "Bądź jawny na granicach: input, API, storage i URL często dostarczają stringi."],
      ["'0' is truthy even though Number('0') is 0.", "'0' jest truthy, mimo że Number('0') daje 0."],
      ["Coercion", "Konwersja", 'const raw = "42";\nconst value = Number(raw);\nconsole.log(value === 42); // true'],
    ),
    S(
      "js-functions",
      "beginner",
      ["Functions, parameters and scope", "Funkcje, parametry i zakres"],
      ["Functions package behaviour behind a name and create a local scope.", "Funkcje zamykają zachowanie pod nazwą i tworzą lokalny zakres."],
      [
        ["Parameters are local bindings created for each call. A return statement sends a value back to the caller.", "Parametry są lokalnymi powiązaniami tworzonymi dla każdego wywołania. return przekazuje wartość z powrotem do wywołującego."],
        ["Small functions are useful when they represent one clear transformation or decision, not simply because they contain few lines.", "Małe funkcje są przydatne, gdy reprezentują jedną jasną transformację lub decyzję, a nie tylko dlatego, że mają mało linii."],
      ],
      [
        ["Prefer returning values over mutating unrelated outer variables.", "Preferuj zwracanie wartości zamiast mutowania niepowiązanych zmiennych zewnętrznych."],
        ["Arrow functions do not create their own this.", "Funkcje strzałkowe nie tworzą własnego this."],
        ["A function can be passed around like any other value.", "Funkcję można przekazywać tak jak każdą inną wartość."],
      ],
      ["A function is easiest to reuse when its inputs and output are obvious.", "Funkcję najłatwiej używać ponownie, gdy jej wejścia i wynik są oczywiste."],
      ["A missing return gives undefined, even if the function logged something.", "Brak return daje undefined, nawet jeśli funkcja coś wyświetliła."],
      ["Input → output", "Wejście → wynik", 'function discount(price, percent) {\n  return price * (1 - percent / 100);\n}'],
    ),
    S(
      "js-closures",
      "advanced",
      ["Closures and lexical scope", "Domknięcia i zakres leksykalny"],
      ["A function remembers the scope in which it was created.", "Funkcja pamięta zakres, w którym została utworzona."],
      [
        ["A closure is not a special syntax. It is the normal consequence of a function using variables from an outer lexical scope.", "Domknięcie nie jest specjalną składnią. To normalna konsekwencja używania przez funkcję zmiennych z zewnętrznego zakresu leksykalnego."],
        ["Closures power private state, callbacks, factories, memoization and many hooks-style patterns.", "Domknięcia napędzają prywatny stan, callbacki, fabryki, memoizację i wiele wzorców podobnych do hooków."],
      ],
      [
        ["Each factory call can create a separate closed-over state.", "Każde wywołanie fabryki może stworzyć osobny zamknięty stan."],
        ["A closure keeps references to values it still needs.", "Domknięcie przechowuje referencje do wartości, których nadal potrzebuje."],
        ["Stale closures happen when you expect a callback to see newer state than the scope it captured.", "Stale closure pojawia się, gdy oczekujesz, że callback zobaczy nowszy stan niż zakres, który zapamiętał."],
      ],
      ["When debugging a callback, ask which render or scope created it.", "Debugując callback, pytaj, który render lub zakres go utworzył."],
      ["Closures can unintentionally retain large objects longer than expected.", "Domknięcia mogą niechcący utrzymywać duże obiekty w pamięci dłużej, niż oczekujesz."],
      ["Private counter", "Prywatny licznik", 'function createCounter() {\n  let count = 0;\n  return () => ++count;\n}'],
    ),
    S(
      "js-prototypes-this",
      "advanced",
      ["Objects, prototypes and this", "Obiekty, prototypy i this"],
      ["JavaScript objects delegate property lookup through a prototype chain.", "Obiekty JavaScript delegują wyszukiwanie właściwości przez łańcuch prototypów."],
      [
        ["class syntax is convenient, but the underlying object model is still prototype-based delegation.", "Składnia class jest wygodna, ale podstawowy model obiektowy nadal opiera się na delegacji prototypowej."],
        ["For normal functions, this is usually determined by how the function is called, not where it was written.", "Dla zwykłych funkcji this zwykle zależy od sposobu wywołania, a nie od miejsca zapisania funkcji."],
      ],
      [
        ["obj.method() usually binds this to obj for that call.", "obj.method() zwykle ustawia this na obj dla tego wywołania."],
        ["Arrow functions capture this lexically instead of binding a new one.", "Funkcje strzałkowe przechwytują this leksykalnie zamiast tworzyć własne."],
        ["Object.create can create explicit prototype relationships.", "Object.create może tworzyć jawne relacje prototypowe."],
      ],
      ["Prefer plain data and functions unless object identity and behaviour genuinely belong together.", "Preferuj zwykłe dane i funkcje, chyba że tożsamość obiektu i zachowanie rzeczywiście powinny być razem."],
      ["Passing a method as a bare callback can lose its intended this.", "Przekazanie metody jako zwykłego callbacka może zgubić oczekiwane this."],
      ["Call site matters", "Miejsce wywołania ma znaczenie", 'const user = {\n  name: "Ada",\n  say() { return this.name; }\n};'],
    ),
    S(
      "js-event-loop",
      "advanced",
      ["Promises, tasks and the event loop", "Promise, zadania i event loop"],
      ["Asynchronous JavaScript is about scheduling work, not running all work in parallel.", "Asynchroniczny JavaScript dotyczy planowania pracy, a nie równoległego wykonywania wszystkiego."],
      [
        ["The call stack runs synchronous JavaScript. Promise reactions enter the microtask queue and normally run before the next task such as a timer callback.", "Call stack wykonuje kod synchroniczny. Reakcje Promise trafiają do kolejki microtask i zwykle wykonują się przed kolejnym taskiem, np. callbackiem timera."],
        ["async/await is syntax over promises. await pauses that async function, not the whole JavaScript runtime.", "async/await jest składnią nad Promise. await wstrzymuje daną funkcję async, a nie cały runtime JavaScript."],
      ],
      [
        ["Use Promise.all for independent async work that may run concurrently.", "Używaj Promise.all dla niezależnych operacji async, które mogą działać współbieżnie."],
        ["Handle cancellation or stale responses in UI code.", "W kodzie UI obsługuj anulowanie lub nieaktualne odpowiedzi."],
        ["Errors thrown in async functions become rejected promises.", "Błędy rzucone w funkcjach async stają się odrzuconymi Promise."],
      ],
      ["Think in ordering guarantees: sync → microtasks → next task.", "Myśl o gwarancjach kolejności: sync → microtasks → kolejny task."],
      ["setTimeout(fn, 0) does not mean 'run immediately'.", "setTimeout(fn, 0) nie oznacza „uruchom natychmiast”."],
      ["Ordering", "Kolejność", 'console.log("A");\nPromise.resolve().then(() => console.log("B"));\nsetTimeout(() => console.log("C"), 0);\n// A, B, C'],
    ),
    S(
      "js-modules-errors",
      "advanced",
      ["Modules, errors and reliable boundaries", "Moduły, błędy i pewne granice"],
      ["Good JavaScript separates domain logic from unreliable external data.", "Dobry JavaScript oddziela logikę domenową od niepewnych danych zewnętrznych."],
      [
        ["ES modules make dependencies explicit through import and export. Keep public exports small and intentional.", "Moduły ES pokazują zależności jawnie przez import i export. Utrzymuj publiczne eksporty małe i świadome."],
        ["Validate data when it enters your system. A successful fetch only means HTTP transport succeeded, not that the payload matches your assumptions.", "Waliduj dane na wejściu do systemu. Udany fetch oznacza tylko sukces transportu HTTP, nie zgodność payloadu z założeniami."],
      ],
      [
        ["Throw errors with useful context, but avoid leaking sensitive data.", "Rzucaj błędy z przydatnym kontekstem, ale nie ujawniaj danych wrażliwych."],
        ["Catch errors where you can recover, add context or present a user-facing state.", "Łap błędy tam, gdzie możesz odzyskać działanie, dodać kontekst lub pokazać stan użytkownikowi."],
        ["Keep pure domain functions easy to test without network or DOM.", "Utrzymuj czyste funkcje domenowe tak, aby dało się je testować bez sieci i DOM."],
      ],
      ["Validate at the boundary, trust inside the boundary.", "Waliduj na granicy, ufaj wewnątrz granicy."],
      ["A broad catch that silently ignores errors makes debugging much harder.", "Szeroki catch, który po cichu ignoruje błędy, bardzo utrudnia debugowanie."],
      ["Boundary", "Granica", 'export async function loadUser(id) {\n  const response = await fetch("/api/users/" + id);\n  if (!response.ok) throw new Error("User request failed");\n  return response.json();\n}'],
    ),
  ],
  flashcards: [
    F("js-f1","beginner",["Expression","Wyrażenie"],["What is an expression?","Czym jest wyrażenie?"],["Code that evaluates to a value.","Kod, który oblicza się do wartości."],"2 + 3"),
    F("js-f2","beginner",["Binding","Powiązanie"],["When should you choose let over const?","Kiedy wybrać let zamiast const?"],["When reassignment is intentionally part of the model.","Gdy ponowne przypisanie jest świadomą częścią modelu."]),
    F("js-f3","beginner",["Equality","Porównanie"],["Why prefer === to ==?","Dlaczego preferować === zamiast ==?"],["It compares without implicit type coercion.","Porównuje bez niejawnej konwersji typów."]),
    F("js-f4","beginner",["Types","Typy"],["What does typeof null return?","Co zwraca typeof null?"],['"object" — a historical quirk.','"object" — historyczna osobliwość.'],"typeof null"),
    F("js-f5","beginner",["Functions","Funkcje"],["What does a function return when there is no return statement?","Co zwraca funkcja bez instrukcji return?"],["undefined.","undefined."]),
    F("js-f6","beginner",["Scope","Zakres"],["What is lexical scope?","Czym jest zakres leksykalny?"],["Visibility determined by where code is written in the source structure.","Widoczność wynikająca z miejsca zapisania kodu w strukturze źródła."]),
    F("js-f7","beginner",["Arrays","Tablice"],["What does map return?","Co zwraca map?"],["A new array containing the transformed values.","Nową tablicę zawierającą przekształcone wartości."],"items.map(item => item.id)"),
    F("js-f8","beginner",["Objects","Obiekty"],["Does const make an object immutable?","Czy const czyni obiekt niemutowalnym?"],["No. It prevents reassignment of the binding, not mutation of the object.","Nie. Blokuje ponowne przypisanie zmiennej, nie mutację obiektu."]),
    F("js-f9","advanced",["Closure","Domknięcie"],["What does a closure remember?","Co pamięta domknięcie?"],["The lexical environment in which the function was created.","Środowisko leksykalne, w którym utworzono funkcję."]),
    F("js-f10","advanced",["this","this"],["For a normal function, what often determines this?","Co zwykle określa this w zwykłej funkcji?"],["The call site — how the function is invoked.","Miejsce wywołania — sposób uruchomienia funkcji."]),
    F("js-f11","advanced",["Event loop","Event loop"],["What normally runs before a setTimeout callback: a resolved Promise reaction or the timer?","Co zwykle wykona się wcześniej: reakcja resolved Promise czy callback setTimeout?"],["The Promise microtask.","Microtask Promise."]),
    F("js-f12","advanced",["Async","Async"],["What does await pause?","Co wstrzymuje await?"],["The current async function, not the whole JavaScript runtime.","Bieżącą funkcję async, nie cały runtime JavaScript."]),
    F("js-f13","advanced",["Prototype","Prototyp"],["Where does property lookup continue when an object lacks a property?","Gdzie trwa wyszukiwanie właściwości, gdy obiekt jej nie ma?"],["Along its prototype chain.","Wzdłuż łańcucha prototypów."]),
    F("js-f14","advanced",["Modules","Moduły"],["What is a useful property of ES modules?","Jaka jest ważna cecha modułów ES?"],["Dependencies and public exports are explicit.","Zależności i publiczne eksporty są jawne."]),
    F("js-f15","advanced",["Errors","Błędy"],["Where is validation most valuable?","Gdzie walidacja jest najbardziej wartościowa?"],["At boundaries where untrusted data enters the system.","Na granicach, gdzie niepewne dane wchodzą do systemu."]),
    F("js-f16","advanced",["Concurrency","Współbieżność"],["When is Promise.all useful?","Kiedy Promise.all jest przydatne?"],["When independent async operations can be started together.","Gdy niezależne operacje async można rozpocząć razem."]),
  ],
};

const typescript: CourseStudyContent = {
  knowledge: [
    S(
      "ts-mental-model",
      "beginner",
      ["The TypeScript mental model", "Model myślowy TypeScriptu"],
      ["TypeScript checks JavaScript before runtime; it does not replace the JavaScript runtime.", "TypeScript sprawdza JavaScript przed runtime; nie zastępuje środowiska JavaScript."],
      [
        ["Types describe sets of possible values. A string type says which values a variable or parameter may accept.", "Typy opisują zbiory możliwych wartości. Typ string określa, jakie wartości może przyjąć zmienna lub parametr."],
        ["The compiler erases type annotations. Runtime behaviour still comes from the emitted JavaScript.", "Kompilator usuwa adnotacje typów. Zachowanie w runtime nadal wynika z wygenerowanego JavaScriptu."],
      ],
      [
        ["Let inference handle obvious local values.", "Pozwól inferencji obsługiwać oczywiste wartości lokalne."],
        ["Be explicit at public boundaries.", "Bądź jawny na publicznych granicach."],
        ["Avoid any when unknown better represents uncertainty.", "Unikaj any, gdy unknown lepiej opisuje niepewność."],
      ],
      ["Types are constraints for developers and tools, not runtime guards.", "Typy są ograniczeniami dla developerów i narzędzi, nie guardami runtime."],
      ["A typed API response can still be wrong at runtime unless you validate it.", "Otypowana odpowiedź API nadal może być błędna w runtime, jeśli jej nie zwalidujesz."],
      ["Compile-time only", "Tylko compile-time", 'const age: number = 33;\n// emitted JS: const age = 33;'],
    ),
    S(
      "ts-functions",
      "beginner",
      ["Function contracts and inference", "Kontrakty funkcji i inferencja"],
      ["Function types make inputs and outputs visible at the call site.", "Typy funkcji pokazują wejścia i wyniki już w miejscu wywołania."],
      [
        ["Parameter annotations protect the function body and callers. Return annotations are especially useful for exported functions and intentional APIs.", "Adnotacje parametrów chronią ciało funkcji i wywołujących. Typy zwracane są szczególnie przydatne dla eksportowanych funkcji i świadomych API."],
        ["Optional parameters and undefined should be modelled explicitly instead of handled as surprise cases.", "Parametry opcjonalne i undefined powinny być modelowane jawnie zamiast pojawiać się jako niespodzianki."],
      ],
      [
        ["Use void for callbacks whose returned value is intentionally ignored.", "Używaj void dla callbacków, których wynik jest świadomie ignorowany."],
        ["Prefer narrow parameter types over broad object or any types.", "Preferuj wąskie typy parametrów zamiast szerokich object lub any."],
        ["Overloads are useful when input shapes genuinely produce different call signatures.", "Overloady są przydatne, gdy różne kształty wejść naprawdę tworzą różne sygnatury wywołania."],
      ],
      ["A good function type explains how to call the function without reading its implementation.", "Dobry typ funkcji wyjaśnia sposób użycia bez czytania implementacji."],
      ["Do not add generics when a simple concrete type expresses the contract better.", "Nie dodawaj generyków, gdy prosty konkretny typ lepiej opisuje kontrakt."],
      ["Contract", "Kontrakt", 'function parseCount(value: string): number {\n  return Number(value);\n}'],
    ),
    S(
      "ts-objects-unions",
      "beginner",
      ["Object shapes and unions", "Kształty obiektów i unie"],
      ["Model domain states precisely instead of making every property optional.", "Modeluj stany domenowe precyzyjnie zamiast robić każdą właściwość opcjonalną."],
      [
        ["Interfaces and type aliases can both describe object shapes. The important decision is the shape and its semantics, not a universal preference between the two syntaxes.", "Interfejsy i type alias mogą opisywać kształty obiektów. Ważniejszy jest model i semantyka niż uniwersalna preferencja składni."],
        ["Discriminated unions give each state its own required data, which reduces impossible combinations.", "Unie dyskryminowane nadają każdemu stanowi własne wymagane dane, ograniczając niemożliwe kombinacje."],
      ],
      [
        ["Use literal unions for finite statuses and modes.", "Używaj unii literałów dla skończonych statusów i trybów."],
        ["Use a shared discriminator such as status or type.", "Używaj wspólnego discriminatora, np. status lub type."],
        ["Narrow before reading fields that only exist in one union member.", "Wykonaj narrowing przed odczytem pól istniejących tylko w jednym wariancie unii."],
      ],
      ["Prefer a union of valid states to one object full of optional fields.", "Preferuj unię poprawnych stanów zamiast jednego obiektu pełnego opcjonalnych pól."],
      ["Optional everywhere often moves bugs from compile time back to runtime.", "Opcjonalność wszędzie często przenosi błędy z compile-time z powrotem do runtime."],
      ["State model", "Model stanu", 'type Request =\n  | { status: "loading" }\n  | { status: "success"; data: User[] }\n  | { status: "error"; message: string };'],
    ),
    S(
      "ts-generics",
      "beginner",
      ["Generics preserve relationships", "Generyki zachowują relacje"],
      ["A generic is useful when the output type depends on the input type.", "Generyk jest przydatny, gdy typ wyniku zależy od typu wejścia."],
      [
        ["T is a placeholder for a type chosen by the caller or inferred from arguments.", "T jest symbolem typu wybranego przez wywołującego lub wywnioskowanego z argumentów."],
        ["Good generics preserve information. A generic that only appears once may not express a useful relationship.", "Dobre generyki zachowują informację. Generyk występujący tylko raz może nie opisywać użytecznej relacji."],
      ],
      [
        ["Use constraints when a generic needs specific capabilities.", "Używaj constraints, gdy generyk potrzebuje konkretnych możliwości."],
        ["Prefer inference over forcing callers to write type arguments.", "Preferuj inferencję zamiast zmuszać wywołujących do podawania argumentów typów."],
        ["Do not use generic T as a fancy spelling of unknown.", "Nie używaj generycznego T jako ozdobnego odpowiednika unknown."],
      ],
      ["Ask which type relationship the generic preserves.", "Pytaj, jaką relację typów zachowuje generyk."],
      ["Too many generic parameters can make an API harder to understand than the problem it solves.", "Zbyt wiele parametrów generycznych może uczynić API trudniejszym od problemu, który rozwiązuje."],
      ["Identity", "Identity", 'function first<T>(items: T[]): T | undefined {\n  return items[0];\n}'],
    ),
    S(
      "ts-narrowing",
      "advanced",
      ["Narrowing, guards and never", "Narrowing, guardy i never"],
      ["TypeScript follows control flow to refine broad types into safer specific types.", "TypeScript śledzi przepływ sterowania, aby zawężać szerokie typy do bezpieczniejszych konkretnych typów."],
      [
        ["typeof, in, instanceof, equality checks and custom type predicates can all narrow types.", "typeof, in, instanceof, porównania i własne type predicates mogą zawężać typy."],
        ["never represents an impossible value. Exhaustive checks use never to make missing union cases visible during development.", "never reprezentuje niemożliwą wartość. Exhaustive checks używają never, aby brakujące przypadki unii były widoczne podczas tworzenia."],
      ],
      [
        ["Prefer narrowing to type assertions.", "Preferuj narrowing zamiast type assertions."],
        ["A custom predicate is a promise to the compiler; implement it carefully.", "Własny predicate jest obietnicą złożoną kompilatorowi; implementuj go ostrożnie."],
        ["Use exhaustive switches for important discriminated unions.", "Używaj exhaustive switch dla ważnych unii dyskryminowanych."],
      ],
      ["Prove the type; do not simply assert it.", "Udowodnij typ; nie deklaruj go bez dowodu."],
      ["as can silence a useful compiler warning without making the runtime value safer.", "as może wyciszyć cenne ostrzeżenie kompilatora bez zwiększenia bezpieczeństwa wartości w runtime."],
      ["Exhaustiveness", "Pełne pokrycie", 'function assertNever(value: never): never {\n  throw new Error("Unexpected value");\n}'],
    ),
    S(
      "ts-type-transformations",
      "advanced",
      ["keyof, mapped and conditional types", "keyof, mapped i conditional types"],
      ["Advanced type operators transform existing contracts instead of duplicating them.", "Zaawansowane operatory typów przekształcają istniejące kontrakty zamiast je duplikować."],
      [
        ["keyof creates a union of property keys. Indexed access retrieves the type of a property. Mapped types iterate over keys.", "keyof tworzy unię kluczy właściwości. Indexed access pobiera typ właściwości. Mapped types iterują po kluczach."],
        ["Conditional types can choose one type or another based on assignability, and infer can extract pieces from another type.", "Conditional types mogą wybierać typ w zależności od assignability, a infer może wydobywać fragmenty innego typu."],
      ],
      [
        ["Start from a real source type instead of recreating parallel definitions.", "Zaczynaj od prawdziwego typu źródłowego zamiast tworzyć równoległe definicje."],
        ["Use built-in utilities before inventing custom utilities.", "Użyj wbudowanych utility types zanim stworzysz własne."],
        ["Keep sophisticated types behind simple public names.", "Ukrywaj złożone typy za prostymi publicznymi nazwami."],
      ],
      ["Complex types should reduce complexity for callers, not move complexity into error messages.", "Złożone typy powinny redukować złożoność dla użytkownika API, a nie przenosić ją do komunikatów błędów."],
      ["A clever one-line conditional type can be less maintainable than two explicit domain types.", "Sprytny conditional type w jednej linii może być mniej utrzymywalny niż dwa jawne typy domenowe."],
      ["Mapped type", "Mapped type", 'type Nullable<T> = {\n  [K in keyof T]: T[K] | null;\n};'],
    ),
    S(
      "ts-boundaries",
      "advanced",
      ["unknown, satisfies and runtime boundaries", "unknown, satisfies i granice runtime"],
      ["The type system is strongest when uncertainty is represented honestly.", "System typów jest najsilniejszy, gdy niepewność jest reprezentowana uczciwie."],
      [
        ["unknown says: a value exists, but you must prove what it is before using it. This is ideal for parsed JSON, caught errors and external messages.", "unknown mówi: wartość istnieje, ale musisz udowodnić jej typ przed użyciem. To idealne dla parsed JSON, złapanych błędów i zewnętrznych komunikatów."],
        ["satisfies checks that a value conforms to a target type while preserving useful inference from the original expression.", "satisfies sprawdza zgodność wartości z typem docelowym, zachowując przydatną inferencję z oryginalnego wyrażenia."],
      ],
      [
        ["Parse and validate unknown data once at the boundary.", "Parsuj i waliduj unknown raz na granicy."],
        ["Use satisfies for configuration objects where you want checking plus narrow inferred values.", "Używaj satisfies dla obiektów konfiguracji, gdy chcesz kontroli i zachowania wąskiej inferencji."],
        ["Avoid double assertions such as value as unknown as Target.", "Unikaj podwójnych asercji typu value as unknown as Target."],
      ],
      ["Unknown outside, validated domain type inside.", "Unknown na zewnątrz, zwalidowany typ domenowy wewnątrz."],
      ["Typing JSON.parse as User does not validate the JSON.", "Otypowanie JSON.parse jako User nie waliduje JSON-a."],
      ["satisfies", "satisfies", 'const routes = {\n  home: "/",\n  account: "/account"\n} satisfies Record<string, string>;'],
    ),
    S(
      "ts-compiler",
      "advanced",
      ["tsconfig and scalable compiler strategy", "tsconfig i skalowalna strategia kompilatora"],
      ["Compiler settings are part of your type-safety architecture.", "Ustawienia kompilatora są częścią architektury bezpieczeństwa typów."],
      [
        ["strict enables a family of checks that make nullability, function variance and implicit any problems visible.", "strict włącza rodzinę kontroli ujawniających problemy nullowalności, wariancji funkcji i implicit any."],
        ["Target and module settings describe emitted JavaScript and module behaviour; they should match your runtime and build tool rather than copied folklore.", "Ustawienia target i module opisują generowany JavaScript i zachowanie modułów; powinny pasować do runtime i build toola, a nie do przypadkowych porad."],
      ],
      [
        ["Keep strict on for new applications.", "Utrzymuj strict włączony w nowych aplikacjach."],
        ["Treat skipLibCheck as a trade-off, not a type-safety feature.", "Traktuj skipLibCheck jako kompromis, nie funkcję zwiększającą bezpieczeństwo."],
        ["Prefer gradual explicit fixes over broad compiler-option disabling.", "Preferuj stopniowe jawne poprawki zamiast szerokiego wyłączania kontroli kompilatora."],
      ],
      ["A compiler rule should reflect the guarantees your codebase wants to maintain.", "Reguła kompilatora powinna odzwierciedlać gwarancje, które codebase chce utrzymywać."],
      ["Disabling strictNullChecks can hide a large class of real application bugs.", "Wyłączenie strictNullChecks może ukryć dużą klasę prawdziwych błędów aplikacji."],
      ["Strict baseline", "Ścisła baza", '{\n  "compilerOptions": {\n    "strict": true,\n    "noUncheckedIndexedAccess": true\n  }\n}'],
    ),
  ],
  flashcards: [
    F("ts-f1","beginner",["Mental model","Model"],["Do TypeScript types exist at runtime?","Czy typy TypeScript istnieją w runtime?"],["No. Type annotations are erased when TypeScript emits JavaScript.","Nie. Adnotacje typów są usuwane przy generowaniu JavaScriptu."]),
    F("ts-f2","beginner",["Inference","Inferencja"],["When can you usually skip an explicit local annotation?","Kiedy zwykle można pominąć jawną lokalną adnotację?"],["When the assigned value makes the intended type obvious.","Gdy przypisana wartość jasno wskazuje zamierzony typ."]),
    F("ts-f3","beginner",["unknown","unknown"],["How is unknown safer than any?","Dlaczego unknown jest bezpieczniejsze niż any?"],["You must narrow unknown before using it.","Musisz zawęzić unknown przed użyciem."]),
    F("ts-f4","beginner",["Functions","Funkcje"],["What does ?: mean on a parameter?","Co oznacza ?: przy parametrze?"],["The argument may be omitted, so the value may be undefined.","Argument może zostać pominięty, więc wartość może być undefined."]),
    F("ts-f5","beginner",["Unions","Unie"],["Why use a literal union for status?","Po co używać unii literałów dla statusu?"],["It restricts the value to known valid states.","Ogranicza wartość do znanych poprawnych stanów."],'type Status = "idle" | "loading" | "done";'),
    F("ts-f6","beginner",["Objects","Obiekty"],["What does structural typing mean?","Co oznacza typowanie strukturalne?"],["Compatibility is based mainly on a value's shape.","Zgodność opiera się głównie na kształcie wartości."]),
    F("ts-f7","beginner",["Generics","Generyki"],["When is a generic useful?","Kiedy generyk jest przydatny?"],["When types need to preserve a relationship between input and output.","Gdy typy muszą zachować relację między wejściem i wyjściem."]),
    F("ts-f8","beginner",["Return type","Typ wyniku"],["Where is an explicit return type especially valuable?","Gdzie jawny typ zwracany jest szczególnie wartościowy?"],["On exported or public functions whose contract should stay stable.","W eksportowanych lub publicznych funkcjach, których kontrakt powinien być stabilny."]),
    F("ts-f9","advanced",["Narrowing","Narrowing"],["What is narrowing?","Czym jest narrowing?"],["Using runtime checks and control flow to refine a broad static type.","Używanie kontroli runtime i przepływu sterowania do zawężenia szerokiego typu statycznego."]),
    F("ts-f10","advanced",["never","never"],["What does never represent?","Co reprezentuje never?"],["A value that should be impossible.","Wartość, która nie powinna być możliwa."]),
    F("ts-f11","advanced",["keyof","keyof"],["What does keyof T produce?","Co produkuje keyof T?"],["A union of the known property keys of T.","Unię znanych kluczy właściwości T."]),
    F("ts-f12","advanced",["Mapped type","Mapped type"],["What does a mapped type iterate over?","Po czym iteruje mapped type?"],["A union of property keys.","Po unii kluczy właściwości."]),
    F("ts-f13","advanced",["satisfies","satisfies"],["Why use satisfies instead of a broad annotation?","Po co używać satisfies zamiast szerokiej adnotacji?"],["It checks compatibility while preserving useful inference of the value.","Sprawdza zgodność, zachowując przydatną inferencję wartości."]),
    F("ts-f14","advanced",["Boundary","Granica"],["Does typing response.json() as User validate the payload?","Czy otypowanie response.json() jako User waliduje payload?"],["No. Runtime data still needs validation.","Nie. Dane runtime nadal wymagają walidacji."]),
    F("ts-f15","advanced",["Strict","Strict"],["Why keep strict mode enabled?","Dlaczego utrzymywać strict mode?"],["It exposes unsafe assumptions earlier and improves the guarantees of the codebase.","Ujawnia niebezpieczne założenia wcześniej i wzmacnia gwarancje codebase."]),
    F("ts-f16","advanced",["Assertion","Asercja"],["What is the risk of as Target?","Jakie jest ryzyko as Target?"],["It can silence the compiler without proving the runtime value is actually Target.","Może wyciszyć kompilator bez udowodnienia, że wartość runtime naprawdę jest Target."]),
  ],
};

const react: CourseStudyContent = {
  knowledge: [
    S(
      "react-components",
      "beginner",
      ["Components, JSX and composition", "Komponenty, JSX i kompozycja"],
      ["Think of a component as a function from inputs and state to a UI description.", "Myśl o komponencie jak o funkcji od danych wejściowych i stanu do opisu UI."],
      [
        ["JSX is syntax that describes a tree of elements. Components let you give meaningful names to repeated or conceptually separate pieces of that tree.", "JSX to składnia opisująca drzewo elementów. Komponenty pozwalają nadawać znaczące nazwy powtarzalnym lub logicznie osobnym fragmentom tego drzewa."],
        ["Composition is React's default reuse mechanism: larger interfaces are built from smaller focused components rather than inheritance hierarchies.", "Kompozycja to podstawowy mechanizm reużywalności w React: większe interfejsy powstają z mniejszych wyspecjalizowanych komponentów zamiast hierarchii dziedziczenia."],
      ],
      [
        ["Component names start with a capital letter.", "Nazwy komponentów zaczynają się wielką literą."],
        ["Keep rendering pure: same inputs should describe the same UI.", "Utrzymuj renderowanie czyste: te same wejścia powinny opisywać ten sam UI."],
        ["Extract a component when it gains a clear responsibility, not merely because the file is long.", "Wydziel komponent, gdy pojawia się jasna odpowiedzialność, nie tylko dlatego, że plik jest długi."],
      ],
      ["Render describes UI; events and effects handle interaction with the outside world.", "Render opisuje UI; zdarzenia i effecty obsługują interakcję ze światem zewnętrznym."],
      ["Calling a component like a normal function can break React's component and Hooks model.", "Wywoływanie komponentu jak zwykłej funkcji może złamać model komponentów i Hooków Reacta."],
      ["Composition", "Kompozycja", 'function Page() {\n  return <Layout><ProfileCard /></Layout>;\n}'],
    ),
    S(
      "react-props-state",
      "beginner",
      ["Props, state and ownership", "Propsy, stan i własność danych"],
      ["The most important question is often not 'where can I store this?' but 'who owns this value?'.", "Najważniejsze pytanie często nie brzmi „gdzie mogę to przechować?”, tylko „kto jest właścicielem tej wartości?”."],
      [
        ["Props are read-only inputs from a parent. State belongs to the component position that owns the changing value.", "Propsy to dane wejściowe tylko do odczytu od rodzica. Stan należy do pozycji komponentu, która jest właścicielem zmieniającej się wartości."],
        ["Lift state only when multiple children genuinely need one shared source of truth. Keeping state local reduces coordination cost.", "Podnoś stan tylko wtedy, gdy wiele dzieci naprawdę potrzebuje jednego źródła prawdy. Lokalny stan zmniejsza koszt koordynacji."],
      ],
      [
        ["Derive values during render when they can be computed from props and state.", "Wyliczaj wartości podczas renderu, gdy można je uzyskać z propsów i stanu."],
        ["Do not duplicate the same fact in multiple pieces of state.", "Nie duplikuj tego samego faktu w wielu stanach."],
        ["Use functional state updates when the next value depends on the previous one.", "Używaj funkcyjnych aktualizacji stanu, gdy kolejna wartość zależy od poprzedniej."],
      ],
      ["Keep one source of truth for each piece of information.", "Utrzymuj jedno źródło prawdy dla każdej informacji."],
      ["Copying props into state usually creates synchronization problems unless you intentionally want an initial snapshot.", "Kopiowanie propsów do stanu zwykle tworzy problemy synchronizacji, chyba że świadomie chcesz zachować początkową migawkę."],
      ["Updater", "Updater", 'setCount((current) => current + 1);'],
    ),
    S(
      "react-events-lists",
      "beginner",
      ["Events, lists and identity", "Zdarzenia, listy i tożsamość"],
      ["Events change state; keys preserve identity across renders.", "Zdarzenia zmieniają stan; key zachowują tożsamość między renderami."],
      [
        ["Event handlers are functions passed to props such as onClick. Pass the function instead of calling it while rendering.", "Handlery zdarzeń to funkcje przekazywane do propsów takich jak onClick. Przekaż funkcję zamiast wywoływać ją podczas renderowania."],
        ["Keys tell React which list item corresponds to which previous item. Stable domain IDs are usually better than array indexes for mutable lists.", "Key mówią Reactowi, który element listy odpowiada któremu poprzedniemu elementowi. Stabilne ID domenowe są zwykle lepsze niż indeksy dla zmiennych list."],
      ],
      [
        ["Use semantic elements such as button for click actions.", "Używaj semantycznych elementów takich jak button dla akcji kliknięcia."],
        ["Keys only need to be unique among siblings in the same list.", "Key muszą być unikalne tylko wśród rodzeństwa na tej samej liście."],
        ["Random keys force remounts and throw away local state.", "Losowe key wymuszają remount i tracą lokalny stan."],
      ],
      ["Stable identity is part of state correctness, not just performance.", "Stabilna tożsamość jest częścią poprawności stanu, nie tylko wydajności."],
      ["Using index as key in a reorderable form can move input state to the wrong row.", "Użycie indeksu jako key w sortowalnym formularzu może przenieść stan inputa do złego wiersza."],
      ["Stable key", "Stabilny key", 'items.map((item) => (\n  <Row key={item.id} item={item} />\n))'],
    ),
    S(
      "react-effects",
      "beginner",
      ["Effects are for synchronization", "Effecty służą do synchronizacji"],
      ["An effect is not a generic 'run code after render' tool. It synchronizes React state with an external system.", "Effect nie jest ogólnym narzędziem „uruchom kod po renderze”. Synchronizuje stan Reacta z systemem zewnętrznym."],
      [
        ["If a value can be calculated during render, you usually do not need an effect to calculate and store it.", "Jeśli wartość można policzyć podczas renderu, zwykle nie potrzebujesz effectu do jej obliczenia i zapisania."],
        ["Dependencies describe which reactive values the synchronization uses. Cleanup undoes the previous synchronization before the next one or unmount.", "Dependencies opisują, jakich reaktywnych wartości używa synchronizacja. Cleanup cofa poprzednią synchronizację przed kolejną lub przed unmount."],
      ],
      [
        ["Use effects for subscriptions, timers, imperative widgets and external connections.", "Używaj effectów dla subskrypcji, timerów, imperatywnych widgetów i zewnętrznych połączeń."],
        ["Move user-triggered logic to event handlers when possible.", "Logikę wywoływaną przez użytkownika przenoś do handlerów zdarzeń, gdy to możliwe."],
        ["Do not suppress dependency warnings without understanding the data flow.", "Nie wyciszaj ostrzeżeń o zależnościach bez zrozumienia przepływu danych."],
      ],
      ["Before adding useEffect, ask: what external system am I synchronizing with?", "Przed dodaniem useEffect zapytaj: z jakim zewnętrznym systemem się synchronizuję?"],
      ["An effect that copies derived props into state often creates extra renders and stale data.", "Effect kopiujący wyliczalne propsy do stanu często tworzy dodatkowe rendery i nieaktualne dane."],
      ["Subscription", "Subskrypcja", 'useEffect(() => {\n  const stop = chat.subscribe(roomId, onMessage);\n  return stop;\n}, [roomId]);'],
    ),
    S(
      "react-render-model",
      "advanced",
      ["Rendering, snapshots and stale closures", "Renderowanie, migawki i stale closures"],
      ["Every render is a new call of your component with a snapshot of props and state.", "Każdy render to nowe wywołanie komponentu z migawką propsów i stanu."],
      [
        ["Event handlers created during a render close over that render's values. This explains many stale-state bugs without treating React as magic.", "Handlery utworzone podczas renderu zamykają wartości z tego renderu. To wyjaśnia wiele błędów stale state bez traktowania Reacta jak magii."],
        ["State setters schedule updates. React may batch updates, so multiple setters do not imply an immediate render between every line.", "Settery stanu planują aktualizacje. React może je batchować, więc kilka setterów nie oznacza natychmiastowego renderu między każdą linią."],
      ],
      [
        ["Use functional updates when calculating from previous state.", "Używaj funkcyjnych aktualizacji, gdy liczysz na podstawie poprzedniego stanu."],
        ["Refs hold mutable values without causing a render.", "Refy przechowują mutowalne wartości bez powodowania renderu."],
        ["Do not read a setter call as if it mutates the current render's variable.", "Nie czytaj wywołania settera tak, jakby mutowało zmienną bieżącego renderu."],
      ],
      ["A render is a snapshot, not a continuously mutating object.", "Render to migawka, nie stale mutujący obiekt."],
      ["Logging state immediately after setState often logs the current render's old value.", "Logowanie stanu natychmiast po setState często pokazuje starą wartość z bieżącego renderu."],
      ["Functional update", "Aktualizacja funkcyjna", 'setItems((current) => [...current, nextItem]);'],
    ),
    S(
      "react-state-architecture",
      "advanced",
      ["Reducers, context and state architecture", "Redukcery, context i architektura stanu"],
      ["State tools solve different problems: local state stores values, reducers organize transitions, context distributes dependencies.", "Narzędzia stanu rozwiązują różne problemy: lokalny stan przechowuje wartości, reducery organizują przejścia, context dystrybuuje zależności."],
      [
        ["A reducer is useful when many events update related state according to explicit transition rules.", "Reducer jest przydatny, gdy wiele zdarzeń aktualizuje powiązany stan według jawnych reguł przejścia."],
        ["Context removes prop passing for broadly shared values, but every context value still needs a sensible owner and update strategy.", "Context usuwa przekazywanie propsów dla szeroko współdzielonych wartości, ale każda wartość contextu nadal potrzebuje sensownego właściciela i strategii aktualizacji."],
      ],
      [
        ["Keep server data separate from local UI state concepts.", "Oddzielaj dane serwerowe od lokalnego stanu UI."],
        ["Split contexts by change frequency and responsibility when that improves boundaries.", "Dziel contexty według częstotliwości zmian i odpowiedzialności, gdy poprawia to granice."],
        ["Do not move state global simply because two components use it.", "Nie przenoś stanu globalnie tylko dlatego, że używają go dwa komponenty."],
      ],
      ["Choose the smallest state scope that satisfies the real sharing requirement.", "Wybieraj najmniejszy zakres stanu spełniający rzeczywistą potrzebę współdzielenia."],
      ["A giant context containing unrelated frequently-changing values can create broad rerender pressure and poor ownership.", "Ogromny context z niepowiązanymi często zmieniającymi się wartościami może powodować szerokie rerendery i słabą własność danych."],
      ["Reducer", "Reducer", 'function reducer(state, action) {\n  switch (action.type) {\n    case "added": return { ...state, items: [...state.items, action.item] };\n    default: return state;\n  }\n}'],
    ),
    S(
      "react-performance",
      "advanced",
      ["Performance: measure before memoizing", "Wydajność: mierz przed memoizacją"],
      ["React performance work starts with user-visible latency and profiling, not adding memo everywhere.", "Praca nad wydajnością Reacta zaczyna się od odczuwalnych opóźnień i profilowania, nie od dodawania memo wszędzie."],
      [
        ["A rerender is not automatically a performance problem. Rendering must be both frequent and expensive enough to matter.", "Rerender nie jest automatycznie problemem wydajnościowym. Renderowanie musi być wystarczająco częste i kosztowne, aby miało znaczenie."],
        ["memo, useMemo and useCallback can avoid work in specific dependency chains, but they also add bookkeeping and cognitive cost.", "memo, useMemo i useCallback mogą ograniczać pracę w konkretnych łańcuchach zależności, ale dodają bookkeeping i koszt poznawczy."],
      ],
      [
        ["Profile before and after an optimization.", "Profiluj przed i po optymalizacji."],
        ["Keep state local to avoid invalidating large subtrees unnecessarily.", "Utrzymuj stan lokalnie, aby nie unieważniać niepotrzebnie dużych poddrzew."],
        ["Code splitting and data strategy often matter more than micro-memoization.", "Code splitting i strategia danych często znaczą więcej niż mikro-memoizacja."],
      ],
      ["Optimize a measured bottleneck, not a theoretical rerender.", "Optymalizuj zmierzone wąskie gardło, nie teoretyczny rerender."],
      ["An unstable object prop can defeat memo because its identity changes every render.", "Niestabilny obiekt przekazywany jako prop może zniweczyć memo, bo jego referencja zmienia się w każdym renderze."],
      ["Memo boundary", "Granica memo", 'const Chart = memo(function Chart({ data }) {\n  return <HeavyChart data={data} />;\n});'],
    ),
    S(
      "react-async-testing-a11y",
      "advanced",
      ["Async UI, testing and accessibility", "Async UI, testowanie i dostępność"],
      ["Production React is not just rendering components; it is handling waiting, failure, accessibility and confidence in behaviour.", "Produkcyjny React to nie tylko renderowanie komponentów; to także oczekiwanie, błędy, dostępność i pewność zachowania."],
      [
        ["Model loading, success, empty and error states deliberately. Avoid one boolean trying to represent an entire request lifecycle.", "Modeluj loading, success, empty i error świadomie. Unikaj jednego booleana próbującego reprezentować cały cykl requestu."],
        ["Tests should observe behaviour a user can perceive: roles, labels, text, navigation and outcomes. Implementation-detail tests become brittle quickly.", "Testy powinny obserwować zachowanie widoczne dla użytkownika: role, labelki, tekst, nawigację i wyniki. Testy szczegółów implementacji szybko stają się kruche."],
      ],
      [
        ["Start with semantic HTML before adding ARIA.", "Zaczynaj od semantycznego HTML zanim dodasz ARIA."],
        ["Keep focus visible and manage it intentionally after dialogs or route-like transitions.", "Utrzymuj widoczny focus i zarządzaj nim świadomie po dialogach lub przejściach podobnych do routingu."],
        ["Test keyboard flows, not only pointer clicks.", "Testuj przepływy klawiaturą, nie tylko kliknięcia myszą."],
      ],
      ["Accessible semantics make both the product and automated tests more robust.", "Dostępna semantyka czyni produkt i testy automatyczne bardziej solidnymi."],
      ["A div with onClick is not automatically an accessible button.", "div z onClick nie staje się automatycznie dostępnym przyciskiem."],
      ["User-focused test", "Test z perspektywy użytkownika", 'await user.click(screen.getByRole("button", { name: /save/i }));\nexpect(await screen.findByText(/saved/i)).toBeVisible();'],
    ),
  ],
  flashcards: [
    F("react-f1","beginner",["Component","Komponent"],["What is a React component?","Czym jest komponent React?"],["A reusable unit that describes a piece of UI from inputs and state.","Reużywalną jednostką opisującą fragment UI na podstawie wejść i stanu."]),
    F("react-f2","beginner",["JSX","JSX"],["Does the browser execute JSX directly?","Czy przeglądarka wykonuje JSX bezpośrednio?"],["Normally no. Build tooling transforms JSX into JavaScript.","Zwykle nie. Narzędzia build przekształcają JSX w JavaScript."]),
    F("react-f3","beginner",["Props","Propsy"],["Who owns a prop value?","Kto jest właścicielem wartości prop?"],["The parent that passes it; the child treats props as read-only inputs.","Rodzic, który ją przekazuje; dziecko traktuje propsy jako dane tylko do odczytu."]),
    F("react-f4","beginner",["State","Stan"],["When is state appropriate?","Kiedy stan jest odpowiedni?"],["When a component owns data that changes over time and affects rendering.","Gdy komponent jest właścicielem danych zmieniających się w czasie i wpływających na render."]),
    F("react-f5","beginner",["Derived data","Dane wyliczane"],["Should a value derived entirely from props and state usually be separate state?","Czy wartość w całości wyliczalna z propsów i stanu zwykle powinna być osobnym stanem?"],["No. Calculate it during render unless there is a specific reason not to.","Nie. Wylicz ją podczas renderu, chyba że istnieje konkretny powód, by zrobić inaczej."]),
    F("react-f6","beginner",["Event","Zdarzenie"],["What should onClick receive?","Co powinien otrzymać onClick?"],["A function to call when the interaction occurs.","Funkcję do wywołania, gdy nastąpi interakcja."]),
    F("react-f7","beginner",["Keys","Key"],["What makes a good list key?","Co jest dobrym key listy?"],["A stable identity from the data, such as an item ID.","Stabilna tożsamość z danych, np. ID elementu."]),
    F("react-f8","beginner",["Effect","Effect"],["What is useEffect primarily for?","Do czego przede wszystkim służy useEffect?"],["Synchronizing React with an external system.","Do synchronizacji Reacta z systemem zewnętrznym."]),
    F("react-f9","advanced",["Snapshot","Migawka"],["What does a render see?","Co widzi render?"],["A snapshot of props and state for that render.","Migawkę propsów i stanu dla danego renderu."]),
    F("react-f10","advanced",["Updater","Updater"],["When should you use a functional state update?","Kiedy użyć funkcyjnej aktualizacji stanu?"],["When the next value depends on the previous value.","Gdy kolejna wartość zależy od poprzedniej."] ,'setCount(c => c + 1)'),
    F("react-f11","advanced",["Ref","Ref"],["What can a ref store without causing a rerender?","Co ref może przechowywać bez powodowania rerenderu?"],["A mutable value such as a DOM node, timer ID or latest imperative value.","Mutowalną wartość, np. element DOM, ID timera lub najnowszą wartość imperatywną."]),
    F("react-f12","advanced",["Reducer","Reducer"],["When is a reducer useful?","Kiedy reducer jest przydatny?"],["When related state has multiple explicit event-driven transitions.","Gdy powiązany stan ma wiele jawnych przejść wywoływanych zdarzeniami."]),
    F("react-f13","advanced",["Context","Context"],["What problem does context primarily solve?","Jaki problem przede wszystkim rozwiązuje context?"],["Distributing a value through a subtree without passing it through every intermediate component.","Dystrybucję wartości w poddrzewie bez przekazywania jej przez każdy komponent pośredni."]),
    F("react-f14","advanced",["memo","memo"],["Is every rerender a performance problem?","Czy każdy rerender jest problemem wydajności?"],["No. Optimize when measured rendering work is actually costly.","Nie. Optymalizuj, gdy zmierzone renderowanie jest faktycznie kosztowne."]),
    F("react-f15","advanced",["Testing","Testowanie"],["What should React tests prefer to query?","Co powinny preferować testy Reacta?"],["User-facing semantics such as roles, labels and visible text.","Semantykę widoczną dla użytkownika, np. role, labelki i widoczny tekst."]),
    F("react-f16","advanced",["Accessibility","Dostępność"],["What comes before ARIA when a native element exists?","Co jest przed ARIA, gdy istnieje natywny element?"],["Use the semantic native HTML element first.","Najpierw użyj semantycznego natywnego elementu HTML."]),
  ],
};

export const courseStudyContent: Record<string, CourseStudyContent> = {
  javascript,
  typescript,
  react,
};

export const studyContentFor = (courseSlug: string) =>
  courseStudyContent[courseSlug];
