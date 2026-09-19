import { T, type Localized } from "@/domain/models";
import { aiStudyContent, itStudyContent } from "./ai-it-study";

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
  paragraphs: [
    ...paragraphs.map((item) => T(...item)),
    T(
      `In practice, connect this topic with these checks: ${bullets
        .slice(0, 3)
        .map((item) => item[0])
        .join(" ")} The core rule is: ${rule[0]}`,
      `W praktyce połącz ten temat z tymi kontrolami: ${bullets
        .slice(0, 3)
        .map((item) => item[1])
        .join(" ")} Najważniejsza reguła brzmi: ${rule[1]}`,
    ),
    T(
      `When you debug or review code using this concept, verify the assumptions at the real boundary instead of trusting the happy path. The failure worth remembering is: ${pitfall[0]}`,
      `Gdy debugujesz albo robisz review kodu używającego tego pojęcia, sprawdzaj założenia na prawdziwej granicy systemu zamiast ufać happy path. Błąd, o którym warto pamiętać: ${pitfall[1]}`,
    ),
  ],
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
    S("js-operators-basics","beginner",["Operators without surprises","Operatory bez niespodzianek"],["Operators combine, compare and choose values.","Operatory łączą, porównują i wybierają wartości."],[["The + operator adds numbers but also joins strings, so values coming from inputs and URLs often need explicit conversion.","Operator + dodaje liczby, ale też łączy stringi, dlatego dane z inputów i URL często wymagają jawnej konwersji."],["Logical operators are also value selectors: || reacts to every falsy value, while ?? reacts only to null and undefined.","Operatory logiczne potrafią też wybierać wartość: || reaguje na każdą wartość falsy, a ?? tylko na null i undefined."]],[["Use === and !== for normal equality checks.","Do zwykłych porównań używaj === i !==."],["Use ?? when 0, false or an empty string are valid values.","Używaj ??, gdy 0, false lub pusty string są poprawnymi wartościami."],["Add parentheses when precedence is not obvious at a glance.","Dodawaj nawiasy, gdy kolejność działań nie jest oczywista na pierwszy rzut oka."]],["Make conversion and fallback rules visible in code.","Niech kod jasno pokazuje regułę konwersji i fallbacku."],["value || fallback also replaces valid falsy values such as 0.","value || fallback zastąpi także poprawne wartości falsy, np. 0."],["Fallbacks","Fallbacki","const count = 0;\nconst visible = count ?? 10; // 0"]),
    S("js-conditions-basics","beginner",["Conditions and branching","Warunki i rozgałęzienia"],["A condition chooses which path the program should take.","Warunek wybiera, którą ścieżkę programu należy wykonać."],[["Use if when the code expresses a real decision. Early returns often keep the main path flatter and easier to scan.","Używaj if, gdy kod wyraża prawdziwą decyzję. Early return często upraszcza główną ścieżkę i ogranicza zagnieżdżenie."],["A ternary is useful for one small expression. If both branches contain several actions, an ordinary if is usually clearer.","Ternary jest dobry dla jednego małego wyrażenia. Jeśli obie gałęzie mają kilka działań, zwykły if jest zwykle czytelniejszy."]],[["Prefer positive names such as hasAccess or isReady.","Preferuj pozytywne nazwy typu hasAccess lub isReady."],["Use switch for a finite set of named cases when it improves clarity.","Używaj switch dla skończonego zestawu nazwanych przypadków, jeśli poprawia czytelność."],["Move complex boolean expressions into well-named variables.","Przenoś złożone wyrażenia boolean do dobrze nazwanych zmiennych."]],["A condition should read like a small business rule.","Warunek powinien czytać się jak mała reguła biznesowa."],["Nested ternaries are short but quickly become hard to maintain.","Zagnieżdżone ternary są krótkie, ale szybko stają się trudne w utrzymaniu."],["Early return","Early return","function label(user) {\n  if (!user) return \"Guest\";\n  return user.name;\n}"]),
    S("js-loops-basics","beginner",["Loops and iteration","Pętle i iteracja"],["Iteration repeats work over a collection. Pick the form that shows intent most clearly.","Iteracja powtarza pracę na kolekcji. Wybieraj formę, która najczytelniej pokazuje intencję."],[["for...of is a clear default when you need several statements for each item.","for...of jest dobrym domyślnym wyborem, gdy dla każdego elementu trzeba wykonać kilka instrukcji."],["map, filter, find, some and every describe common collection questions directly.","map, filter, find, some i every bezpośrednio opisują typowe operacje na kolekcjach."]],[["map transforms each item.","map transformuje każdy element."],["filter keeps matching items; find returns one matching item.","filter zachowuje pasujące elementy, a find zwraca jeden pasujący element."],["some and every answer yes/no questions about a collection.","some i every odpowiadają na pytania tak/nie o kolekcję."]],["Choose the iteration form that describes the result, not only the mechanics.","Wybieraj formę iteracji opisującą wynik, a nie tylko mechanikę."],["Using map only for side effects is misleading.","Używanie map tylko dla efektów ubocznych jest mylące."],["Transform a list","Transformacja listy","const names = users.map((user) => user.name);"]),
    S("js-arrays-basics","beginner",["Arrays as ordered collections","Tablice jako uporządkowane kolekcje"],["Arrays are the basic tool for working with lists in JavaScript.","Tablice są podstawowym narzędziem do pracy z listami w JavaScript."],[["Some methods return a new array, while others mutate the original one. Knowing which is which prevents subtle state bugs.","Część metod zwraca nową tablicę, a część mutuje oryginał. Wiedza, które robią co, zapobiega subtelnym błędom stanu."],["map, filter and slice are non-mutating; push, splice and sort can change the original array.","map, filter i slice nie mutują; push, splice i sort mogą zmienić oryginalną tablicę."]],[["Copy before sorting shared state.","Kopiuj przed sortowaniem współdzielonego stanu."],["Use find for one item, not filter(...)[0].","Używaj find dla jednego elementu zamiast filter(...)[0]."],["Use reduce only when the accumulation stays readable.","Używaj reduce tylko wtedy, gdy akumulacja pozostaje czytelna."]],["Know whether an operation returns a new array or mutates the old one.","Wiedz, czy operacja zwraca nową tablicę, czy mutuje starą."],["sort mutates the original array unless you sort a copy.","sort mutuje oryginalną tablicę, jeśli wcześniej nie zrobisz kopii."],["Safe sorting","Bezpieczne sortowanie","const sorted = [...items].sort((a, b) => a.price - b.price);"]),
    S("js-objects-basics","beginner",["Objects and property access","Obiekty i dostęp do właściwości"],["Objects group related values under named properties.","Obiekty grupują powiązane wartości pod nazwanymi właściwościami."],[["Use dot notation for known property names and bracket notation when the key is dynamic.","Używaj notacji kropkowej dla znanych nazw pól i nawiasów kwadratowych, gdy klucz jest dynamiczny."],["Objects have identity. Two separately created objects with identical fields are still different references.","Obiekty mają tożsamość. Dwa osobne obiekty z identycznymi polami nadal są różnymi referencjami."]],[["Use optional chaining for genuinely optional nested values.","Używaj optional chaining dla rzeczywiście opcjonalnych wartości zagnieżdżonych."],["Prefer domain-shaped objects over bags of unrelated values.","Preferuj obiekty domenowe zamiast worków niepowiązanych wartości."],["Object.entries is useful when you need keys and values together.","Object.entries jest przydatne, gdy potrzebujesz jednocześnie kluczy i wartości."]],["An object is data plus identity.","Obiekt to dane plus tożsamość."],["=== compares object references, not deep equality.","=== porównuje referencje obiektów, a nie głęboką równość."],["Dynamic property","Dynamiczne pole","const field = \"email\";\nconsole.log(user[field]);"]),
    S("js-destructuring-spread","beginner",["Destructuring, rest and spread","Destrukturyzacja, rest i spread"],["These syntaxes make reading and creating objects and arrays more concise.","Te składnie upraszczają odczyt i tworzenie obiektów oraz tablic."],[["Destructuring extracts values, rest gathers the remaining values, and spread copies or combines one level of a structure.","Destrukturyzacja wyciąga wartości, rest zbiera pozostałe, a spread kopiuje lub łączy jeden poziom struktury."],["Spread is shallow. Nested objects stay shared unless you copy those levels too.","Spread jest płytki. Zagnieżdżone obiekty pozostają współdzielone, jeśli ich również nie skopiujesz."]],[["Rename destructured fields when the local name is clearer.","Zmieniaj nazwę destrukturyzowanych pól, gdy lokalna nazwa jest czytelniejsza."],["Use rest for remaining properties or arguments.","Używaj rest dla pozostałych właściwości lub argumentów."],["Do not treat {...obj} as a deep clone.","Nie traktuj {...obj} jak deep clone."]],["Spread copies one level; nested references remain shared.","Spread kopiuje jeden poziom; zagnieżdżone referencje pozostają wspólne."],["Mutating a nested object after a shallow copy can still affect the original.","Mutacja zagnieżdżonego obiektu po płytkiej kopii może nadal zmienić oryginał."],["Update one field","Zmiana jednego pola","const nextUser = { ...user, name: \"Ada\" };"]),
    S("js-references","advanced",["References, mutation and immutable updates","Referencje, mutacja i niemutowalne aktualizacje"],["Reference identity explains many bugs in UI and state management.","Tożsamość referencji wyjaśnia wiele błędów w UI i zarządzaniu stanem."],[["Assigning an object to another variable copies the reference, not the object itself.","Przypisanie obiektu do innej zmiennej kopiuje referencję, a nie sam obiekt."],["Immutable update patterns create new references for changed data and make change detection predictable.","Niemutowalne aktualizacje tworzą nowe referencje dla zmienionych danych i upraszczają wykrywanie zmian."]],[["Clone only levels you actually change.","Kopiuj tylko poziomy, które naprawdę zmieniasz."],["Do not mutate shared snapshot-like data.","Nie mutuj współdzielonych danych traktowanych jak migawki."],["Use structuredClone only when a real deep clone is appropriate.","Używaj structuredClone tylko wtedy, gdy prawdziwy deep clone jest właściwy."]],["If identity signals change, changed data needs a new reference.","Jeśli tożsamość sygnalizuje zmianę, zmienione dane potrzebują nowej referencji."],["A shallow spread is not enough if you then mutate a nested object directly.","Płytki spread nie wystarczy, jeśli potem bezpośrednio mutujesz zagnieżdżony obiekt."],["Nested update","Zmiana zagnieżdżona","const next = {\n  ...user,\n  settings: { ...user.settings, theme: \"dark\" },\n};"]),
    S("js-iterators-generators","advanced",["Iterables, iterators and generators","Iterable, iteratory i generatory"],["The iteration protocol explains why for...of works across many different values.","Protokół iteracji wyjaśnia, dlaczego for...of działa na wielu różnych wartościach."],[["An iterable exposes Symbol.iterator. The iterator returns { value, done } pairs.","Iterable udostępnia Symbol.iterator. Iterator zwraca pary { value, done }."],["Generator functions make lazy custom sequences concise because yield pauses and resumes execution.","Funkcje generatorowe upraszczają leniwe sekwencje, bo yield zatrzymuje i wznawia wykonanie."]],[["Use generators when lazy production of values improves the design.","Używaj generatorów, gdy leniwe generowanie wartości poprawia projekt."],["Prefer a normal array transformation when it is simpler.","Preferuj zwykłą transformację tablicy, gdy jest prostsza."],["Remember an iterator may be consumed only once.","Pamiętaj, że iterator może być jednorazowy."]],["Learn the iteration protocol so advanced iteration stops looking magical.","Poznaj protokół iteracji, aby zaawansowana iteracja przestała wyglądać magicznie."],["Turning a huge lazy sequence into an array removes the memory benefit.","Zamiana ogromnej leniwej sekwencji na tablicę usuwa korzyść pamięciową."],["Generator","Generator","function* ids() {\n  let id = 1;\n  while (true) yield id++;\n}"])
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
    S("ts-primitives-literals","beginner",["Primitive and literal types","Typy proste i literały"],["Start with the smallest type that accurately describes the domain value.","Zaczynaj od najmniejszego typu, który dokładnie opisuje wartość domenową."],[["string, number and boolean describe broad sets. A literal type such as \"open\" describes one exact value.","string, number i boolean opisują szerokie zbiory. Typ literalny, np. \"open\", opisuje jedną konkretną wartość."],["Literal unions are a simple way to model a finite set of states such as request status or UI mode.","Unie literałów są prostym sposobem modelowania skończonego zestawu stanów, np. statusu requestu lub trybu UI."]],[["Use literal unions for statuses and modes.","Używaj unii literałów dla statusów i trybów."],["Let const preserve narrow literal inference when useful.","Pozwól const zachowywać wąską inferencję literałów, gdy jest przydatna."],["Use boolean only when the domain truly has two states.","Używaj boolean tylko wtedy, gdy domena naprawdę ma dwa stany."]],["A domain type should be as narrow as the real domain allows.","Typ domenowy powinien być tak wąski, jak pozwala prawdziwa domena."],["A boolean can hide several real states that deserve names.","Boolean może ukrywać kilka realnych stanów, które zasługują na nazwy."],["Literal union","Unia literałów","type Status = \"idle\" | \"loading\" | \"success\" | \"error\";"]),
    S("ts-arrays-tuples","beginner",["Arrays and tuples","Tablice i tuple"],["Arrays model repeated values; tuples model fixed positions with meaning.","Tablice modelują powtarzające się wartości, a tuple stałe pozycje ze znaczeniem."],[["Use User[] for normal collections. Use a tuple when the number and position of values are part of the contract.","Używaj User[] dla zwykłych kolekcji. Tuple wybieraj, gdy liczba i pozycja wartości są częścią kontraktu."],["Readonly arrays are useful for inputs that should be consumed without mutation.","Readonly arrays są przydatne dla wejść, które mają być używane bez mutacji."]],[["Prefer named object fields when a tuple becomes long.","Preferuj nazwane pola obiektu, gdy tuple staje się długie."],["Remember indexed access can produce undefined at runtime.","Pamiętaj, że dostęp po indeksie może w runtime dać undefined."],["Use readonly when mutation is not part of the contract.","Używaj readonly, gdy mutacja nie jest częścią kontraktu."]],["Tuple means positional meaning; object means named meaning.","Tuple oznacza znaczenie pozycji; obiekt oznacza znaczenie nazw."],["Long tuples become cryptic faster than small objects.","Długie tuple stają się nieczytelne szybciej niż małe obiekty."],["Tuple","Tuple","type Point = readonly [x: number, y: number];"]),
    S("ts-null-undefined","beginner",["null, undefined and optional values","null, undefined i wartości opcjonalne"],["Missing data should be represented honestly in the type.","Brak danych powinien być uczciwie reprezentowany w typie."],[["With strict null checks, values that may be missing must be narrowed or given a fallback before use.","Przy strict null checks wartości, których może brakować, trzeba zawęzić albo dać im fallback przed użyciem."],["Optional properties include the possibility that the property does not exist at all.","Pola opcjonalne uwzględniają możliwość, że właściwość w ogóle nie istnieje."]],[["Use ?? for defaults when 0 or false are valid.","Używaj ?? dla fallbacków, gdy 0 lub false są poprawne."],["Use optional chaining for genuinely optional paths.","Używaj optional chaining dla rzeczywiście opcjonalnych ścieżek."],["Avoid non-null ! unless you have a strong invariant the compiler cannot see.","Unikaj non-null !, chyba że masz silny invariant niewidoczny dla kompilatora."]],["Model absence explicitly, then handle it once at a clear boundary.","Modeluj brak jawnie, a potem obsłuż go raz na jasnej granicy."],["! removes a compiler warning; it does not create a runtime value.","! usuwa ostrzeżenie kompilatora; nie tworzy wartości w runtime."],["Fallback","Fallback","const label = user.nickname ?? user.name;"]),
    S("ts-alias-interface","beginner",["type aliases and interfaces","type alias i interface"],["Both can describe object shapes; the important part is the contract you communicate.","Oba mogą opisywać kształty obiektów; najważniejszy jest kontrakt, który komunikujesz."],[["Interfaces are natural for object contracts and extension. Type aliases can also represent unions, primitives and transformations.","Interface jest naturalny dla kontraktów obiektowych i rozszerzania. Type alias potrafi też opisywać unie, prymitywy i transformacje."],["Consistency and a strong domain model matter more than a universal rule saying one syntax is always better.","Spójność i dobry model domeny są ważniejsze niż uniwersalna zasada, że jedna składnia jest zawsze lepsza."]],[["Use a type alias when you need a union.","Używaj type alias, gdy potrzebujesz unii."],["Use interface when declaration merging or explicit extension is intentional.","Używaj interface, gdy declaration merging lub jawne rozszerzanie jest zamierzone."],["Avoid copying almost identical shapes by hand.","Unikaj ręcznego kopiowania prawie identycznych kształtów."]],["Choose the syntax that makes the model clearer, then stay consistent.","Wybierz składnię, która czyni model czytelniejszym, a potem bądź spójny."],["Debating type vs interface matters less than preventing invalid domain states.","Debata type kontra interface ma mniejsze znaczenie niż zapobieganie niepoprawnym stanom domeny."],["Two valid tools","Dwa poprawne narzędzia","interface User { id: number }\ntype Admin = User & { role: \"admin\" };"]),
    S("ts-readonly","beginner",["readonly and immutable intent","readonly i intencja niemutowalności"],["readonly tells TypeScript users that mutation is not part of this contract.","readonly mówi użytkownikom TypeScriptu, że mutacja nie jest częścią tego kontraktu."],[["readonly blocks mutation through that typed reference at compile time. It does not deep-freeze JavaScript values at runtime.","readonly blokuje mutację przez daną referencję na poziomie compile-time. Nie wykonuje deep freeze wartości JavaScript w runtime."],["Readonly arrays are especially useful for function inputs that should only be inspected.","Readonly arrays są szczególnie przydatne dla wejść funkcji, które mają być tylko odczytywane."]],[["Use readonly to make mutation policy visible.","Używaj readonly, aby polityka mutacji była widoczna."],["Nested values need their own readonly modelling.","Zagnieżdżone wartości wymagają własnego modelowania readonly."],["Do not confuse readonly with runtime security.","Nie myl readonly z bezpieczeństwem runtime."]],["readonly documents and checks intent; it is not a runtime lock.","readonly dokumentuje i sprawdza intencję; nie jest blokadą runtime."],["A cast can remove readonly from the type without changing the runtime object.","Rzutowanie może usunąć readonly z typu bez zmiany obiektu runtime."],["Readonly input","Wejście readonly","function total(items: readonly number[]) {\n  return items.reduce((sum, n) => sum + n, 0);\n}"]),
    S("ts-utility-basics","beginner",["Utility types you will use often","Utility types, których użyjesz często"],["Utility types derive small, useful variations of an existing contract.","Utility types wyprowadzają małe, przydatne warianty istniejącego kontraktu."],[["Partial makes fields optional, Pick selects fields, Omit removes fields and Record describes a mapping.","Partial czyni pola opcjonalnymi, Pick wybiera pola, Omit usuwa pola, a Record opisuje mapowanie."],["Use a utility when the new type truly depends on the source type. Create a separate type when it represents a different domain concept.","Używaj utility type, gdy nowy typ naprawdę zależy od źródłowego. Twórz osobny typ, gdy reprezentuje inne pojęcie domenowe."]],[["Use Pick when selected fields must stay synchronized with the source.","Używaj Pick, gdy wybrane pola muszą pozostać zsynchronizowane ze źródłem."],["Use Record for known key sets.","Używaj Record dla znanych zbiorów kluczy."],["Do not stack utilities until the result becomes unreadable.","Nie składaj utility types do momentu, gdy wynik staje się nieczytelny."]],["Derive a type only when there is a real source-of-truth relationship.","Wyprowadzaj typ tylko wtedy, gdy istnieje prawdziwa relacja źródła prawdy."],["Partial<User> is not automatically a valid User.","Partial<User> nie jest automatycznie poprawnym User."],["Pick","Pick","type UserPreview = Pick<User, \"id\" | \"name\">;"]),
    S("ts-conditional-infer","advanced",["Conditional types and infer","Conditional types i infer"],["Conditional types let the type system choose a result based on another type.","Conditional types pozwalają systemowi typów wybrać wynik na podstawie innego typu."],[["A conditional type has the shape T extends U ? X : Y and can distribute over generic unions.","Conditional type ma postać T extends U ? X : Y i może rozdzielać się na generyczne unie."],["infer captures part of another type inside a conditional, for example an array element or function return type.","infer przechwytuje fragment innego typu wewnątrz conditional type, np. element tablicy lub wynik funkcji."]],[["Use built-in helpers such as ReturnType before creating your own.","Używaj wbudowanych helperów typu ReturnType zanim stworzysz własne."],["Hide complex conditional types behind meaningful aliases.","Ukrywaj złożone conditional types za sensownymi aliasami."],["Test edge cases involving unions, never and any.","Testuj przypadki brzegowe z uniami, never i any."]],["Advanced type logic should make the caller's code simpler.","Zaawansowana logika typów powinna upraszczać kod użytkownika API."],["A clever type with unreadable errors can cost more than it saves.","Sprytny typ z nieczytelnymi błędami może kosztować więcej, niż oszczędza."],["Extract an element","Wyciągnij element","type Element<T> = T extends readonly (infer U)[] ? U : T;"]),
    S("ts-template-literals","advanced",["Template literal types","Template literal types"],["Template literal types build finite string contracts from smaller string unions.","Template literal types budują skończone kontrakty stringowe z mniejszych unii."],[["They are useful when event names, route keys or variants follow a predictable pattern.","Są przydatne, gdy nazwy zdarzeń, klucze tras lub warianty mają przewidywalny wzorzec."],["Combined with keyof, they can derive string APIs from an existing object contract.","Połączone z keyof mogą wyprowadzać stringowe API z istniejącego kontraktu obiektu."]],[["Use them for finite predictable patterns.","Używaj ich dla skończonych przewidywalnych wzorców."],["Keep generated unions small enough for useful autocomplete.","Utrzymuj generowane unie na tyle małe, aby autocomplete nadal było użyteczne."],["Runtime strings still require runtime validation.","Stringi runtime nadal wymagają walidacji runtime."]],["Use a template literal type when the string pattern is part of the API contract.","Używaj template literal type, gdy wzorzec stringa jest częścią kontraktu API."],["Huge combinatorial string unions can hurt editor performance.","Ogromne kombinatoryczne unie stringów mogą pogorszyć wydajność edytora."],["Event names","Nazwy zdarzeń","type Field = \"name\" | \"email\";\ntype EventName = `${Field}Changed`;"])
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
    S("react-mental-model","beginner",["What React actually does","Co React właściwie robi"],["React lets you describe the UI for the current data instead of manually editing DOM nodes.","React pozwala opisać UI dla aktualnych danych zamiast ręcznie edytować elementy DOM."],[["A component function runs and returns a description of UI. When relevant props or state change, React can run it again and compare the next result with the previous tree.","Funkcja komponentu wykonuje się i zwraca opis UI. Gdy zmienią się odpowiednie propsy lub stan, React może uruchomić ją ponownie i porównać nowy wynik z poprzednim drzewem."],["You normally change data, not individual DOM text nodes. React derives the next visible UI from that data.","Zwykle zmieniasz dane, a nie pojedyncze teksty w DOM. React wyprowadza kolejny widoczny UI z danych."]],[["Think data → render → interaction → state update → render.","Myśl: dane → render → interakcja → aktualizacja stanu → render."],["Keep rendering pure.","Utrzymuj renderowanie czyste."],["A rerender is not automatically a full DOM rebuild.","Rerender nie oznacza automatycznie pełnej przebudowy DOM."]],["Change data and let React describe the next UI.","Zmieniaj dane i pozwól Reactowi opisać kolejny UI."],["Treating rerender as full DOM replacement leads to bad performance assumptions.","Traktowanie rerenderu jak pełnej wymiany DOM prowadzi do błędnych założeń o wydajności."],["Data drives UI","Dane napędzają UI","function Greeting({ name }) {\n  return <h1>Hello {name}</h1>;\n}"]),
    S("react-jsx-basics","beginner",["JSX: JavaScript inside markup","JSX: JavaScript wewnątrz markupu"],["JSX describes a component tree while still letting you use JavaScript expressions.","JSX opisuje drzewo komponentów, a jednocześnie pozwala używać wyrażeń JavaScript."],[["Curly braces evaluate an expression and insert its value into the JSX tree.","Nawiasy klamrowe obliczają wyrażenie i wstawiają jego wartość do drzewa JSX."],["Many DOM properties use camelCase in JSX, such as className and onClick.","Wiele właściwości DOM używa camelCase w JSX, np. className i onClick."]],[["Move complex calculations to variables before return.","Przenoś złożone obliczenia do zmiennych przed return."],["Use fragments when grouping should not create an extra DOM element.","Używaj fragmentów, gdy grupowanie nie powinno tworzyć dodatkowego elementu DOM."],["Statements such as if cannot sit directly inside JSX braces.","Instrukcje takie jak if nie mogą znajdować się bezpośrednio w klamrach JSX."]],["JSX is a UI expression tree, not a separate template language.","JSX to drzewo wyrażeń UI, a nie osobny język szablonów."],["A side-effecting function called inside JSX may run on every render.","Funkcja z efektem ubocznym wywołana w JSX może uruchamiać się przy każdym renderze."],["Expression in JSX","Wyrażenie w JSX","const total = price * quantity;\nreturn <strong>{total.toFixed(2)} zł</strong>;"]),
    S("react-conditional-ui","beginner",["Conditional rendering","Renderowanie warunkowe"],["React uses ordinary JavaScript decisions to choose which UI to return.","React używa zwykłych decyzji JavaScript do wyboru UI."],[["Use early returns for whole-screen states such as loading or missing data.","Używaj early return dla stanów całego ekranu, np. loading lub braku danych."],["Use && or a ternary for small inline differences, but keep complicated branches out of deeply nested JSX.","Używaj && lub ternary dla małych różnic inline, ale skomplikowane gałęzie trzymaj poza głęboko zagnieżdżonym JSX."]],[["Model loading, error, empty and success separately when needed.","Modeluj loading, error, empty i success osobno, gdy są potrzebne."],["Name complex conditions before JSX.","Nazywaj złożone warunki przed JSX."],["Return null when rendering nothing is genuinely correct.","Zwracaj null, gdy brak UI jest rzeczywiście poprawny."]],["Give meaningful UI states clear branches.","Dawaj znaczącym stanom UI jasne gałęzie."],["value && <Thing /> can render 0 when value is numeric zero.","value && <Thing /> może wyrenderować 0, gdy value jest liczbowym zerem."],["Early return","Early return","if (status === \"loading\") return <Spinner />;\nreturn <Results items={items} />;"]),
    S("react-forms-basics","beginner",["Forms and controlled inputs","Formularze i kontrolowane inputy"],["A controlled field reads from React state and reports changes through an event handler.","Kontrolowane pole czyta ze stanu Reacta i zgłasza zmiany przez handler zdarzenia."],[["This creates one source of truth when the UI needs to validate or react to the current value.","Daje to jedno źródło prawdy, gdy UI ma walidować lub reagować na aktualną wartość."],["Production forms also need real labels, error association and submit states.","Produkcyjne formularze potrzebują też prawdziwych labeli, powiązania błędów i stanów submit."]],[["Use a real label or equivalent accessible labelling.","Używaj prawdziwego labela lub równoważnego dostępnego etykietowania."],["Prevent duplicate submits while pending.","Blokuj duplikowanie submitu podczas oczekiwania."],["Keep authoritative validation on the trusted server boundary.","Utrzymuj autorytatywną walidację na zaufanej granicy serwera."]],["A form is data flow plus semantics plus submission lifecycle.","Formularz to przepływ danych plus semantyka plus cykl wysyłki."],["A placeholder is not a replacement for a persistent label.","Placeholder nie zastępuje trwałego labela."],["Controlled field","Kontrolowane pole","<input value={email} onChange={(e) => setEmail(e.target.value)} />"]),
    S("react-lifting-state","beginner",["Lifting state without making everything global","Podnoszenie stanu bez robienia wszystkiego globalnym"],["Move state to the nearest common owner only when multiple children need one source of truth.","Przenoś stan do najbliższego wspólnego właściciela tylko wtedy, gdy wiele dzieci potrzebuje jednego źródła prawdy."],[["The owner keeps the value and passes data plus callbacks down to children.","Właściciel przechowuje wartość i przekazuje dzieciom dane oraz callbacki."],["A small interaction should usually keep its state close instead of immediately using context or a global store.","Mała interakcja powinna zwykle trzymać stan blisko siebie zamiast od razu używać contextu lub globalnego store."]],[["Ask who reads the value and who may change it.","Zapytaj, kto czyta wartość i kto może ją zmieniać."],["Lift only as high as necessary.","Podnoś stan tylko tak wysoko, jak trzeba."],["Avoid two copies of the same fact in sibling components.","Unikaj dwóch kopii tego samego faktu w komponentach rodzeństwa."]],["The right owner is the smallest boundary that satisfies sharing needs.","Właściwy właściciel to najmniejsza granica spełniająca potrzebę współdzielenia."],["Making state global too early increases coupling and coordination cost.","Zbyt wczesne robienie stanu globalnym zwiększa sprzężenie i koszt koordynacji."],["Shared owner","Wspólny właściciel","function Parent() {\n  const [query, setQuery] = useState(\"\");\n  return <Search value={query} onChange={setQuery} />;\n}"]),
    S("react-refs-basics","beginner",["Refs: values that do not drive rendering","Refy: wartości, które nie sterują renderowaniem"],["A ref survives renders but changing ref.current does not trigger a new render.","Ref przetrwa rendery, ale zmiana ref.current nie wywołuje nowego renderu."],[["Refs are useful for DOM nodes, timer IDs and imperative integration values.","Refy są przydatne dla elementów DOM, ID timerów i wartości integracji imperatywnych."],["If the UI should change when a value changes, that value usually belongs in state instead.","Jeśli UI ma zmieniać się wraz z wartością, zwykle powinna ona trafić do stanu."]],[["Use refs for imperative escape hatches, not hidden render state.","Używaj refów dla imperatywnych escape hatchy, nie ukrytego stanu renderowania."],["Read DOM refs in events or effects rather than while rendering.","Czytaj refy DOM w eventach lub effectach, a nie podczas renderowania."],["Keep the imperative surface small.","Utrzymuj małą powierzchnię imperatywną."]],["State drives UI; refs hold mutable information outside the render result.","Stan steruje UI; refy przechowują mutowalne informacje poza wynikiem renderu."],["Visible UI data stored only in a ref will not make React rerender.","Dane widoczne w UI zapisane tylko w refie nie spowodują rerenderu."],["Focus an input","Focus inputa","const inputRef = useRef<HTMLInputElement>(null);\ninputRef.current?.focus();"]),
    S("react-reconciliation","advanced",["Reconciliation and component identity","Reconciliation i tożsamość komponentu"],["React preserves or resets state according to position and key identity in the tree.","React zachowuje lub resetuje stan zależnie od pozycji i tożsamości key w drzewie."],[["A component at the same position with the same identity can keep local state across renders.","Komponent w tej samej pozycji i z tą samą tożsamością może zachować lokalny stan między renderami."],["Changing a key deliberately tells React to treat the element as a new identity and reset local state below it.","Zmiana key świadomie mówi Reactowi, aby potraktował element jako nową tożsamość i zresetował lokalny stan pod nim."]],[["Use stable domain IDs for list keys.","Używaj stabilnych ID domenowych dla key list."],["Change key deliberately when a subtree really should reset.","Zmieniaj key świadomie, gdy poddrzewo naprawdę powinno się zresetować."],["Never generate random keys during render.","Nie generuj losowych key podczas renderu."]],["Keys define identity, so they are part of correctness, not only performance.","Key definiują tożsamość, więc są częścią poprawności, a nie tylko wydajności."],["Random keys can destroy form state on every parent rerender.","Losowe key mogą niszczyć stan formularza przy każdym rerenderze rodzica."],["Intentional reset","Świadomy reset","<ProfileEditor key={userId} userId={userId} />"]),
    S("react-transitions","advanced",["Urgent and non-urgent updates","Pilne i niepilne aktualizacje"],["Some UI updates may wait so direct interaction remains responsive.","Niektóre aktualizacje UI mogą poczekać, aby bezpośrednia interakcja pozostała responsywna."],[["Transition APIs mark work that may be lower priority than direct input feedback.","API transition oznaczają pracę, która może mieć niższy priorytet niż bezpośredni feedback inputa."],["They are useful for expensive result lists or navigation-like changes that should not block typing.","Są przydatne dla kosztownych list wyników lub zmian podobnych do nawigacji, które nie powinny blokować pisania."]],[["Keep the input value update urgent.","Utrzymuj aktualizację wartości inputa jako pilną."],["Move only the expensive dependent work into a transition.","Przenoś do transition tylko kosztowną zależną pracę."],["Measure whether the interaction actually needs this complexity.","Zmierz, czy interakcja naprawdę potrzebuje tej złożoności."]],["Transitions communicate update priority; they do not make expensive code free.","Transitions komunikują priorytet aktualizacji; nie czynią kosztownego kodu darmowym."],["Wrapping every state update in a transition can make feedback feel delayed.","Owijanie każdej aktualizacji stanu w transition może opóźnić feedback."],["Transition","Transition","startTransition(() => {\n  setVisibleResults(expensiveFilter(items, query));\n});"])
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

const knowledgeFlashcards = (
  coursePrefix: string,
  sections: KnowledgeSection[],
): Flashcard[] =>
  sections.flatMap((section) => [
    {
      id: `${coursePrefix}-knowledge-${section.id}-rule`,
      level: section.level,
      tag: section.title,
      front: T(
        `What is the main rule for: ${section.title.en}?`,
        `Jaka jest najważniejsza zasada dla: ${section.title.pl}?`,
      ),
      back: section.rule,
      code: section.code?.value,
      why: section.paragraphs[0],
    },
    {
      id: `${coursePrefix}-knowledge-${section.id}-trap`,
      level: section.level,
      tag: section.title,
      front: T(
        `What should you watch out for with: ${section.title.en}?`,
        `Na co uważać przy temacie: ${section.title.pl}?`,
      ),
      back: section.pitfall,
      code: section.code?.value,
      why: section.paragraphs[1] ?? section.paragraphs[0],
    },
    {
      id: `${coursePrefix}-knowledge-${section.id}-explain`,
      level: section.level,
      tag: section.title,
      front: T(
        `Explain simply: ${section.title.en}`,
        `Wyjaśnij prosto: ${section.title.pl}`,
      ),
      back: section.lead,
      code: section.code?.value,
      why: section.bullets[0],
    },
  ]);

export const courseStudyContent: Record<string, CourseStudyContent> = {
  javascript: {
    knowledge: javascript.knowledge,
    flashcards: [
      ...javascript.flashcards,
      ...knowledgeFlashcards("js", javascript.knowledge),
    ],
  },
  typescript: {
    knowledge: typescript.knowledge,
    flashcards: [
      ...typescript.flashcards,
      ...knowledgeFlashcards("ts", typescript.knowledge),
    ],
  },
  react: {
    knowledge: react.knowledge,
    flashcards: [
      ...react.flashcards,
      ...knowledgeFlashcards("react", react.knowledge),
    ],
  },
  ai: {
    knowledge: aiStudyContent.knowledge,
    flashcards: [
      ...aiStudyContent.flashcards,
      ...knowledgeFlashcards("ai", aiStudyContent.knowledge),
    ],
  },
  "it-foundations": {
    knowledge: itStudyContent.knowledge,
    flashcards: [
      ...itStudyContent.flashcards,
      ...knowledgeFlashcards("it", itStudyContent.knowledge),
    ],
  },
};

export const studyContentFor = (courseSlug: string) =>
  courseStudyContent[courseSlug];
