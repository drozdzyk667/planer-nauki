import {
  T,
  type Course,
  type CourseModule,
  type Lesson,
  type Quiz,
  type Question,
} from "@/domain/models";

const q = (
  id: string,
  concept: string,
  prompt: [string, string],
  options: [string, string][],
  answer: number,
  explanation: [string, string],
  code?: string,
): Question => {
  const complete = [...options];
  const fillers: [string, string][] = [
    ["A different result", "Inny wynik"],
    ["The opposite behaviour", "Odwrotne zachowanie"],
    ["It cannot be determined", "Nie da się tego określić"],
  ];
  for (const filler of fillers) {
    if (complete.length >= 4) break;
    complete.push(filler);
  }
  return {
    id,
    concept,
    type: code ? "predictOutput" : "singleChoice",
    prompt: T(...prompt),
    options: complete.slice(0, 4).map((text, index) => ({
      id: String(index),
      text: T(...text),
    })),
    answer: String(answer),
    explanation: T(...explanation),
    code,
  };
};

type Seed = {
  id: string;
  courseId: "typescript" | "react";
  moduleId: string;
  title: [string, string];
  subtitle: [string, string];
  concept: string;
  body: [string, string];
  code: string;
  fact: [string, string];
  riddle: [string, string, string, string];
  prediction: Question;
  recall: Question;
  task: [string, string];
  starter: string;
  hint: [string, string];
  tests: { label: [string, string]; expression: string }[];
  language: "typescript" | "tsx";
  fileName: string;
};

const makeLesson = (s: Seed): Lesson => ({
  id: s.id,
  courseId: s.courseId,
  moduleId: s.moduleId,
  title: T(...s.title),
  subtitle: T(...s.subtitle),
  minutes: 12,
  concept: s.concept,
  blocks: [
    {
      type: "text",
      heading: T("Build the mental model first.", "Najpierw zbuduj model w głowie."),
      body: T(...s.body),
    },
    {
      type: "code",
      code: s.code,
      caption: T(
        "Read the contract, then the implementation. Ask what guarantee this line gives the rest of the program.",
        "Najpierw przeczytaj kontrakt, potem implementację. Zapytaj, jaką gwarancję ta linia daje reszcie programu.",
      ),
    },
    {
      type: "text",
      heading: T("What to notice in real code", "Na co zwrócić uwagę w prawdziwym kodzie"),
      body: T(
        "Do not memorise the syntax in isolation. Trace where the data comes from, which component or function owns it, and what assumption this pattern makes explicit.",
        "Nie zapamiętuj samej składni. Prześledź, skąd pochodzą dane, który komponent lub funkcja jest ich właścicielem i jakie założenie ten wzorzec pokazuje wprost.",
      ),
    },
    {
      type: "tip",
      body: T(
        "Code-review lens: if the same rule needs repeated comments, consider whether the type, component boundary or function API can express it directly.",
        "Perspektywa code review: jeśli tę samą regułę trzeba stale wyjaśniać komentarzem, sprawdź, czy typ, granica komponentu albo API funkcji nie może pokazać jej wprost.",
      ),
    },
    { type: "fact", title: T("Worth knowing", "Ciekawostka"), body: T(...s.fact) },
    {
      type: "riddle",
      title: T("Quick riddle", "Szybka zagadka"),
      prompt: T(s.riddle[0], s.riddle[1]),
      answer: T(s.riddle[2], s.riddle[3]),
    },
  ],
  prediction: s.prediction,
  exercise: {
    mode: "source",
    language: s.language,
    fileName: s.fileName,
    task: T(...s.task),
    starter: s.starter,
    hint: T(...s.hint),
    tests: s.tests.map((test) => ({ label: T(...test.label), expression: test.expression })),
  },
  recall: s.recall,
  drills: [
    {
      prompt: T(
        "Explain the core rule in one sentence without copying the example.",
        "Wyjaśnij główną regułę jednym zdaniem bez kopiowania przykładu.",
      ),
      hint: T(
        "Focus on the guarantee this pattern gives to the caller or component.",
        "Skup się na gwarancji, którą ten wzorzec daje wywołującemu lub komponentowi.",
      ),
      answer: T(...s.fact),
    },
    {
      prompt: T(s.riddle[0], s.riddle[1]),
      hint: T(
        "Read the code from the data boundary toward the place where the value is used.",
        "Przeczytaj kod od granicy danych do miejsca, w którym wartość jest używana.",
      ),
      answer: T(s.riddle[2], s.riddle[3]),
      code: s.code,
    },
    {
      prompt: T(
        "How would you verify this rule in a tiny experiment?",
        "Jak sprawdziłbyś tę regułę w małym eksperymencie?",
      ),
      hint: T(...s.hint),
      answer: T(
        "Change one relevant input, run the smallest possible example, and compare the result with the contract you expected.",
        "Zmień jedno istotne wejście, uruchom najmniejszy możliwy przykład i porównaj wynik z oczekiwanym kontraktem.",
      ),
    },
  ],
});

const foundationLessons: Lesson[] = [
  makeLesson({
    id:"ts-why-types",courseId:"typescript",moduleId:"ts-foundations",
    title:["Why TypeScript catches mistakes early","Dlaczego TypeScript łapie błędy wcześniej"],
    subtitle:["Types are executable documentation for your editor.","Typy to dokumentacja, którą rozumie edytor."],
    concept:"ts-types",
    body:["TypeScript adds static type checking on top of JavaScript. It verifies assumptions during development and still produces ordinary JavaScript.","TypeScript dodaje statyczne sprawdzanie typów do JavaScriptu. Weryfikuje założenia podczas tworzenia i nadal generuje zwykły JavaScript."],
    code:'const username: string = "Ada";\nconst score: number = 42;',
    fact:["TypeScript was created at Microsoft and its compiler is itself largely written in TypeScript.","TypeScript powstał w Microsoft, a jego kompilator jest w dużej mierze napisany w TypeScript."],
    riddle:['Why does const age: number = "33" fail?','Dlaczego const age: number = "33" jest błędem?',"The declared number contract conflicts with a string value.","Kontrakt number nie zgadza się z wartością string."],
    prediction:q("ts-why-predict","ts-types",["Which assignment matches the annotation?","Które przypisanie pasuje do adnotacji?"],[["const age: number = 33","const age: number = 33"],['const age: number = "33"','const age: number = "33"'],["const age: number = true","const age: number = true"]],0,["33 is a number, so it satisfies the contract.","33 jest liczbą, więc spełnia kontrakt."]),
    recall:q("ts-why-recall","ts-types",["What does TypeScript add?","Co dodaje TypeScript?"],[["Static type checking","Statyczne sprawdzanie typów"],["A browser runtime","Nowy runtime"],["A database","Bazę danych"]],0,["It checks types during development and emits JavaScript.","Sprawdza typy podczas tworzenia i generuje JavaScript."]),
    task:["Declare name as string and age as number.","Zadeklaruj name jako string i age jako number."],
    starter:'const name = "Ada";\nconst age = 33;',hint:["Add : string and : number annotations.","Dodaj adnotacje : string i : number."],
    tests:[{label:["name is string","name jest stringiem"],expression:'__source.includes("name: string")'},{label:["age is number","age jest number"],expression:'__source.includes("age: number")'}],
    language:"typescript",fileName:"types.ts",
  }),
  makeLesson({
    id:"ts-inference",courseId:"typescript",moduleId:"ts-foundations",
    title:["Let inference do useful work","Pozwól inferencji działać"],subtitle:["Not every value needs an explicit annotation.","Nie każda wartość potrzebuje jawnej adnotacji."],concept:"ts-inference",
    body:["TypeScript often infers a type from the assigned value. Good code uses explicit contracts at boundaries and inference for obvious local values.","TypeScript często wnioskuje typ z przypisanej wartości. Dobry kod stosuje jawne kontrakty na granicach i inferencję dla oczywistych wartości lokalnych."],
    code:'const framework = "React"; // inferred string\nconst lessons = 12; // inferred number',
    fact:["Inference keeps code concise without throwing away type safety.","Inferencja utrzymuje kod zwięzły bez utraty bezpieczeństwa typów."],
    riddle:['Does const city = "Warsaw" need : string?','Czy const city = "Warsaw" potrzebuje : string?',"Usually not. The compiler already knows it is a string.","Zwykle nie. Kompilator już wie, że to string."],
    prediction:q("ts-inference-predict","ts-inference",["What type is inferred for const ready = true?","Jaki typ ma const ready = true?"],[["boolean","boolean"],["string","string"],["number","number"]],0,["true is a boolean literal.","true jest literałem boolean."]),
    recall:q("ts-inference-recall","ts-inference",["Where are explicit annotations especially useful?","Gdzie jawne adnotacje są szczególnie przydatne?"],[["Public boundaries and contracts","Publiczne granice i kontrakty"],["Every local const","Każdy lokalny const"],["Nowhere","Nigdzie"]],0,["Public contracts benefit from being explicit.","Publiczne kontrakty warto opisywać jawnie."]),
    task:["Keep title inferred and explicitly type count as number.","Zostaw title z inferencją i jawnie otypuj count jako number."],starter:'const title = "Nuvecto";\nconst count = 3;',hint:["Only count needs : number.","Tylko count potrzebuje : number."],
    tests:[{label:["count is number","count jest number"],expression:'__source.includes("count: number")'},{label:["title stays inferred","title pozostaje z inferencją"],expression:'!__source.includes("title: string")'}],language:"typescript",fileName:"inference.ts",
  }),
  makeLesson({
    id:"ts-functions",courseId:"typescript",moduleId:"ts-functions",title:["Functions as contracts","Funkcje jako kontrakty"],subtitle:["Type inputs and outputs, not just variables.","Typuj wejścia i wyjścia, nie tylko zmienne."],concept:"ts-functions",
    body:["A typed function says what callers must provide and what they can expect back. That turns many runtime surprises into editor feedback.","Otypowana funkcja mówi, co wywołujący musi przekazać i czego może oczekiwać. Wiele błędów runtime staje się wtedy informacją z edytora."],
    code:'function double(value: number): number {\n  return value * 2;\n}',fact:["Return types are particularly useful on exported functions because they stabilize public contracts.","Typy zwracane są szczególnie cenne w eksportowanych funkcjach, bo stabilizują publiczne kontrakty."],
    riddle:['Can double("4") satisfy this signature?','Czy double("4") pasuje do tej sygnatury?',"No. The parameter requires a number.","Nie. Parametr wymaga number."],
    prediction:q("ts-fn-predict","ts-functions",["Which call is valid?","Które wywołanie jest poprawne?"],[["double(4)","double(4)"],['double("4")','double("4")'],["double(true)","double(true)"]],0,["The parameter requires a number.","Parametr wymaga liczby."]),
    recall:q("ts-fn-recall","ts-functions",["Why type a return value?","Po co typować wartość zwracaną?"],[["To make the contract explicit","Aby jawnie opisać kontrakt"],["To make CSS faster","Aby przyspieszyć CSS"],["To create HTML","Aby tworzyć HTML"]],0,["It documents and verifies the function boundary.","Dokumentuje i sprawdza granicę funkcji."]),
    task:["Type greet's parameter and return value as string.","Otypuj parametr i wartość zwracaną greet jako string."],starter:'function greet(name) {\n  return "Hello " + name;\n}',hint:["Use name: string and ): string.","Użyj name: string i ): string."],
    tests:[{label:["parameter is string","parametr jest string"],expression:'__source.includes("name: string")'},{label:["return is string","zwraca string"],expression:'__source.includes("): string")'}],language:"typescript",fileName:"functions.ts",
  }),
  makeLesson({
    id:"ts-optional",courseId:"typescript",moduleId:"ts-functions",title:["Optional values are real branches","Opcjonalne wartości to realne gałęzie"],subtitle:["Use ? when absence is part of the contract.","Używaj ?, gdy brak wartości jest częścią kontraktu."],concept:"ts-optional",
    body:["An optional parameter may be missing, so implementation code must handle undefined. Absence becomes visible instead of accidental.","Opcjonalnego parametru może nie być, więc kod musi uwzględnić undefined. Brak wartości staje się jawny, a nie przypadkowy."],
    code:'function label(name: string, suffix?: string) {\n  return suffix ? name + suffix : name;\n}',fact:["suffix?: string is effectively string | undefined where you read it.","suffix?: string to w praktyce string | undefined w miejscu odczytu."],
    riddle:["What must code consider before using suffix?","Co kod musi uwzględnić przed użyciem suffix?","It may be undefined.","Może mieć wartość undefined."],
    prediction:q("ts-opt-predict","ts-optional",["What does ? on a parameter mean?","Co oznacza ? przy parametrze?"],[["The argument may be omitted","Argument może zostać pominięty"],["The function is async","Funkcja jest async"],["The value is any","Wartość jest any"]],0,["The argument can be omitted.","Argument może zostać pominięty."]),
    recall:q("ts-opt-recall","ts-optional",["What should implementation code do?","Co powinien zrobić kod implementacji?"],[["Handle absence","Obsłużyć brak"],["Ignore the type","Ignorować typ"],["Always cast to any","Zawsze rzutować na any"]],0,["Optional data is a real program branch.","Opcjonalne dane to realna gałąź programu."]),
    task:["Make subtitle optional.","Ustaw subtitle jako opcjonalny."],starter:'function title(name: string, subtitle: string) { return name; }',hint:["Add ? after subtitle.","Dodaj ? po subtitle."],
    tests:[{label:["subtitle is optional","subtitle jest opcjonalny"],expression:'__source.includes("subtitle?: string")'}],language:"typescript",fileName:"optional.ts",
  }),
  makeLesson({
    id:"ts-objects",courseId:"typescript",moduleId:"ts-objects",title:["Describe object shapes","Opisuj kształt obiektów"],subtitle:["Turn loose data into reliable contracts.","Zamień luźne dane w pewne kontrakty."],concept:"ts-objects",
    body:["Object types describe properties consumers may rely on. This gives autocomplete and catches missing or incompatible fields before runtime.","Typy obiektowe opisują właściwości, na których kod może polegać. Dają podpowiedzi i łapią brakujące lub niezgodne pola przed runtime."],
    code:'type User = {\n  id: number;\n  name: string;\n};',fact:["TypeScript is structurally typed: shape matters more than where an object was created.","TypeScript ma typowanie strukturalne: ważniejszy jest kształt obiektu niż miejsce jego utworzenia."],
    riddle:["What is missing from { id: 1 } for User?","Czego brakuje w { id: 1 } dla User?","The required name property.","Wymaganej właściwości name."],
    prediction:q("ts-obj-predict","ts-objects",["Which field does User require?","Którego pola wymaga User?"],[["name: string","name: string"],["role?: string","role?: string"],["none","żadnego"]],0,["name is part of the declared shape.","name jest częścią zadeklarowanego kształtu."]),
    recall:q("ts-obj-recall","ts-objects",["What does an object type buy you?","Co daje typ obiektowy?"],[["Reliable property contracts","Pewny kontrakt właściwości"],["Faster HTTP","Szybszy HTTP"],["A database","Bazę danych"]],0,["It documents and checks object shape.","Dokumentuje i sprawdza kształt obiektu."]),
    task:["Create User with numeric id and string name.","Utwórz User z id:number i name:string."],starter:'type User = { id: unknown };',hint:["Replace unknown and add name.","Zastąp unknown i dodaj name."],
    tests:[{label:["numeric id","numeryczne id"],expression:'__source.includes("id: number")'},{label:["string name","tekstowe name"],expression:'__source.includes("name: string")'}],language:"typescript",fileName:"user.ts",
  }),
  makeLesson({
    id:"ts-unions",courseId:"typescript",moduleId:"ts-objects",title:["Model valid states with unions","Modeluj poprawne stany uniami"],subtitle:["Make alternatives explicit.","Pokaż alternatywy wprost."],concept:"ts-unions",
    body:["A union says that a value may be one of several allowed alternatives. Literal unions are excellent for finite application states.","Unia mówi, że wartość może być jedną z kilku dozwolonych alternatyw. Unie literałów świetnie opisują skończone stany aplikacji."],
    code:'type Status = "idle" | "loading" | "success" | "error";',fact:["A strong union can make impossible states unrepresentable and remove whole classes of bugs.","Dobra unia może uniemożliwić reprezentowanie błędnych stanów i usunąć całe klasy bugów."],
    riddle:["Why is string weaker than four status literals?","Dlaczego string jest słabszy od czterech literałów statusu?","string accepts every text value; the union accepts only known states.","string przyjmuje dowolny tekst, unia tylko znane stany."],
    prediction:q("ts-union-predict","ts-unions",["Which value fits Status?","Która wartość pasuje do Status?"],[["loading","loading"],["waiting-room","waiting-room"],["42","42"]],0,["loading is one of the allowed literals.","loading jest jednym z dozwolonych literałów."]),
    recall:q("ts-union-recall","ts-unions",["What does a union express?","Co wyraża unia?"],[["One of several valid alternatives","Jedną z kilku poprawnych alternatyw"],["A loop","Pętlę"],["A selector","Selektor"]],0,["A union defines controlled alternatives.","Unia definiuje kontrolowane alternatywy."]),
    task:["Create Status from idle, loading and done.","Utwórz Status z idle, loading i done."],starter:'type Status = string;',hint:["Use string literals separated by |.","Użyj literałów rozdzielonych przez |."],
    tests:[{label:["uses idle","używa idle"],expression:'__source.includes("\\\"idle\\\"")'},{label:["uses loading and done","używa loading i done"],expression:'__source.includes("\\\"loading\\\"") && __source.includes("\\\"done\\\"")'},{label:["uses union","używa unii"],expression:'__source.includes("|")'}],language:"typescript",fileName:"status.ts",
  }),

  makeLesson({
    id:"react-components",courseId:"react",moduleId:"react-components",title:["A component is a UI function","Komponent to funkcja interfejsu"],subtitle:["Inputs in, interface out.","Dane wchodzą, interfejs wychodzi."],concept:"react-components",
    body:["React components are functions that describe UI. JSX keeps a tree-shaped UI description close to the JavaScript logic that produces it.","Komponenty Reacta to funkcje opisujące UI. JSX trzyma drzewiastą strukturę interfejsu blisko logiki JavaScript, która ją tworzy."],
    code:'function Welcome() {\n  return <h1>Hello!</h1>;\n}',fact:["Browsers do not execute JSX directly; tooling transforms it into JavaScript.","Przeglądarki nie wykonują JSX bezpośrednio; narzędzia zamieniają go na JavaScript."],
    riddle:["Why does <Welcome /> start with a capital letter?","Dlaczego <Welcome /> zaczyna się wielką literą?","React treats capitalized names as components and lowercase tags as platform elements.","React traktuje nazwy z wielkiej litery jako komponenty, a małe litery jako elementy platformy."],
    prediction:q("react-comp-predict","react-components",["Which name follows component convention?","Która nazwa pasuje do konwencji komponentu?"],[["ProfileCard","ProfileCard"],["profileCard","profileCard"],["profile-card","profile-card"]],0,["Components use capitalized identifiers.","Komponenty zaczynają się wielką literą."]),
    recall:q("react-comp-recall","react-components",["What does a component describe?","Co opisuje komponent?"],[["A piece of UI","Fragment UI"],["A DNS record","Rekord DNS"],["A table schema","Schemat tabeli"]],0,["Components describe reusable UI pieces.","Komponenty opisują reużywalne fragmenty UI."]),
    task:["Create Welcome returning an h1.","Utwórz Welcome zwracający h1."],starter:'function Welcome() { return null; }',hint:["Return <h1>Hello!</h1>.","Zwróć <h1>Hello!</h1>."],
    tests:[{label:["Welcome exists","Welcome istnieje"],expression:'__source.includes("function Welcome")'},{label:["returns h1","zwraca h1"],expression:'__source.includes("<h1") && __source.includes("</h1>")'}],language:"tsx",fileName:"Welcome.tsx",
  }),
  makeLesson({
    id:"react-composition",courseId:"react",moduleId:"react-components",title:["Compose UI from focused pieces","Składaj UI z wyspecjalizowanych części"],subtitle:["Small components become a system together.","Małe komponenty razem tworzą system."],concept:"react-composition",
    body:["Composition builds larger interfaces by combining focused components. It keeps responsibilities small and makes design changes easier to reason about.","Kompozycja buduje większe interfejsy z małych komponentów. Odpowiedzialności pozostają wąskie, a zmiany łatwiejsze do zrozumienia."],
    code:'function Page() {\n  return <Layout><ProfileCard /></Layout>;\n}',fact:["React strongly favors composition over inheritance for sharing UI behavior.","React mocno preferuje kompozycję zamiast dziedziczenia przy współdzieleniu zachowania UI."],
    riddle:["A component has five unrelated jobs. What should you ask first?","Komponent ma pięć niezwiązanych zadań. O co zapytać najpierw?","Whether some responsibilities can become smaller components or hooks.","Czy część odpowiedzialności można wydzielić do mniejszych komponentów lub hooków."],
    prediction:q("react-compose-predict","react-composition",["What is composition?","Czym jest kompozycja?"],[["Combining components into larger UI","Łączeniem komponentów w większy UI"],["Copying CSS","Kopiowaniem CSS"],["Using inheritance","Używaniem dziedziczenia"]],0,["Composition combines focused parts.","Kompozycja łączy wyspecjalizowane części."]),
    recall:q("react-compose-recall","react-composition",["Why keep components focused?","Po co utrzymywać komponenty wąsko wyspecjalizowane?"],[["Clarity and reuse","Czytelność i reużywalność"],["To remove HTML","Aby usunąć HTML"],["To avoid state forever","Aby zawsze unikać stanu"]],0,["Focused responsibilities improve clarity and reuse.","Wąskie odpowiedzialności poprawiają czytelność i reużywalność."]),
    task:["Render Header and MainContent from Page.","Wyrenderuj Header i MainContent w Page."],starter:'function Page() { return <div />; }',hint:["Put both components inside the returned wrapper.","Umieść oba komponenty w zwracanym wrapperze."],
    tests:[{label:["renders Header","renderuje Header"],expression:'__source.includes("<Header />")'},{label:["renders MainContent","renderuje MainContent"],expression:'__source.includes("<MainContent />")'}],language:"tsx",fileName:"Page.tsx",
  }),
  makeLesson({
    id:"react-props",courseId:"react",moduleId:"react-props-state",title:["Props make components reusable","Propsy czynią komponenty reużywalnymi"],subtitle:["Same component, different data.","Ten sam komponent, różne dane."],concept:"react-props",
    body:["Props are read-only inputs from a parent. They let one implementation render many values while keeping data ownership explicit.","Propsy to dane wejściowe tylko do odczytu od rodzica. Jedna implementacja może renderować różne wartości, a właściciel danych pozostaje jasny."],
    code:'type GreetingProps = { name: string };\nfunction Greeting({ name }: GreetingProps) {\n  return <p>Hello {name}</p>;\n}',fact:["Props follow one-way data flow from parent to child, making ownership easier to trace.","Propsy płyną jednokierunkowo od rodzica do dziecka, co ułatwia śledzenie właściciela danych."],
    riddle:["Should Greeting assign directly to its name prop?","Czy Greeting powinien bezpośrednio zmieniać prop name?","No. Props are inputs owned by the parent.","Nie. Propsy są danymi wejściowymi należącymi do rodzica."],
    prediction:q("react-props-predict","react-props",["What are props?","Czym są propsy?"],[["Inputs from a parent","Danymi wejściowymi od rodzica"],["A database","Bazą danych"],["Only CSS variables","Tylko zmiennymi CSS"]],0,["Props carry input data into a component.","Propsy przekazują dane do komponentu."]),
    recall:q("react-props-recall","react-props",["How should props be treated?","Jak traktować propsy?"],[["Read-only inputs","Jako dane tylko do odczytu"],["Mutable globals","Jako mutowalne globale"],["HTML files","Jako pliki HTML"]],0,["Props are owned by their parent.","Propsy należą do rodzica."]),
    task:["Type Card's title prop as string.","Otypuj prop title w Card jako string."],starter:'function Card({ title }) { return <article>{title}</article>; }',hint:["Add a props type with title: string.","Dodaj typ propsów z title: string."],
    tests:[{label:["title is string","title jest string"],expression:'__source.includes("title: string")'},{label:["renders title","renderuje title"],expression:'__source.includes("{title}")'}],language:"tsx",fileName:"Card.tsx",
  }),
  makeLesson({
    id:"react-state",courseId:"react",moduleId:"react-props-state",title:["State remembers changing UI data","Stan pamięta zmieniające się dane UI"],subtitle:["When a value changes over time, state may own it.","Gdy wartość zmienia się w czasie, może należeć do stanu."],concept:"react-state",
    body:["State stores component-owned data that changes across interactions. Calling a setter schedules a new render with the next value.","Stan przechowuje dane komponentu zmieniające się w interakcjach. Wywołanie settera planuje nowy render z kolejną wartością."],
    code:'const [count, setCount] = useState(0);\n<button onClick={() => setCount(count + 1)}>{count}</button>',fact:["Each render sees a snapshot of state. Event handlers close over the snapshot that created them.","Każdy render widzi migawkę stanu. Handlery zdarzeń korzystają z migawki renderu, w którym powstały."],
    riddle:["Why is count++ not the normal React update?","Dlaczego count++ nie jest normalną aktualizacją Reacta?","It bypasses the state setter that tells React to render again.","Pomija setter stanu, który informuje Reacta o potrzebie nowego renderu."],
    prediction:q("react-state-predict","react-state",["What schedules a state update?","Co planuje aktualizację stanu?"],[["Calling the setter","Wywołanie settera"],["Changing a local let only","Zmiana lokalnego let"],["Renaming CSS","Zmiana CSS"]],0,["The setter asks React for a new render.","Setter prosi Reacta o nowy render."]),
    recall:q("react-state-recall","react-state",["When is state useful?","Kiedy stan jest przydatny?"],[["For UI data changing over time","Dla danych UI zmieniających się w czasie"],["For every const","Dla każdego const"],["Only for headings","Tylko dla nagłówków"]],0,["State models changing component-owned data.","Stan modeluje zmienne dane komponentu."]),
    task:["Add count state initialized to 0.","Dodaj stan count z wartością 0."],starter:'function Counter() { return <button>0</button>; }',hint:["Use const [count, setCount] = useState(0).","Użyj const [count, setCount] = useState(0)."],
    tests:[{label:["declares count state","deklaruje stan count"],expression:'__source.includes("[count, setCount]")'},{label:["uses useState(0)","używa useState(0)"],expression:'__source.includes("useState(0)")'}],language:"tsx",fileName:"Counter.tsx",
  }),
  makeLesson({
    id:"react-events",courseId:"react",moduleId:"react-events",title:["Events connect people to state","Zdarzenia łączą użytkownika ze stanem"],subtitle:["A click is a message your component can handle.","Kliknięcie to wiadomość dla komponentu."],concept:"react-events",
    body:["Event props such as onClick receive functions. Pass the function; do not call it during render unless that is intentional.","Propsy zdarzeń takie jak onClick otrzymują funkcje. Przekaż funkcję, nie wywołuj jej podczas renderowania, jeśli nie jest to celowe."],
    code:'const save = () => console.log("saved");\n<button onClick={save}>Save</button>',fact:["React gives events a consistent interface while using the browser event system underneath.","React daje zdarzeniom spójny interfejs, korzystając pod spodem z systemu zdarzeń przeglądarki."],
    riddle:["Which waits for a click: onClick={save} or onClick={save()}?","Które czeka na klik: onClick={save} czy onClick={save()}?","onClick={save}; it passes the function instead of calling it now.","onClick={save}; przekazuje funkcję zamiast wywoływać ją od razu."],
    prediction:q("react-event-predict","react-events",["Which form passes a handler?","Która forma przekazuje handler?"],[["onClick={save}","onClick={save}"],["onClick={save()}","onClick={save()}"],["click=save","click=save"]],0,["Pass the function reference.","Przekaż referencję do funkcji."]),
    recall:q("react-event-recall","react-events",["What does an event prop receive?","Co otrzymuje prop zdarzenia?"],[["A function","Funkcję"],["A CSS color","Kolor CSS"],["A DB row","Wiersz DB"]],0,["Event props are callbacks.","Propsy zdarzeń to callbacki."]),
    task:["Wire handleClick to the button.","Podepnij handleClick do przycisku."],starter:'const handleClick = () => {};\nconst button = <button>Go</button>;',hint:["Add onClick={handleClick}.","Dodaj onClick={handleClick}."],
    tests:[{label:["uses onClick handler","używa handlera onClick"],expression:'__source.includes("onClick={handleClick}")'}],language:"tsx",fileName:"Action.tsx",
  }),
  makeLesson({
    id:"react-lists",courseId:"react",moduleId:"react-events",title:["Lists need stable identity","Listy potrzebują stabilnej tożsamości"],subtitle:["Keys help React match items between renders.","Key pomagają Reactowi dopasować elementy między renderami."],concept:"react-lists",
    body:["Use map to turn data into elements. A stable key tells React which item stayed, moved, appeared or disappeared.","Używaj map do zamiany danych w elementy. Stabilny key mówi Reactowi, który element pozostał, przesunął się, pojawił lub zniknął."],
    code:'users.map((user) => <li key={user.id}>{user.name}</li>)',fact:["A key only needs to be unique among siblings in the same list, not across the entire app.","Key musi być unikalny tylko wśród rodzeństwa na tej samej liście, nie w całej aplikacji."],
    riddle:["Why can array indexes be risky keys?","Dlaczego indeksy tablicy bywają ryzykownymi key?","After reordering, the same index may refer to a different item and retained state can follow the wrong row.","Po zmianie kolejności ten sam indeks może wskazywać inny element i zachowany stan może trafić do złego wiersza."],
    prediction:q("react-list-predict","react-lists",["What is a strong key?","Co jest dobrym key?"],[["user.id","user.id"],["Math.random() each render","Math.random() w każdym renderze"],["Always the index","Zawsze indeks"]],0,["A stable domain id preserves identity.","Stabilne id domenowe zachowuje tożsamość."]),
    recall:q("react-list-recall","react-lists",["Why are keys used?","Po co używa się key?"],[["To match items across renders","Aby dopasować elementy między renderami"],["To style CSS","Aby stylować CSS"],["To fetch APIs","Aby pobierać API"]],0,["Keys provide stable list identity.","Key zapewniają stabilną tożsamość listy."]),
    task:["Use item.id as the key.","Użyj item.id jako key."],starter:'items.map((item) => <li>{item.name}</li>)',hint:["Add key={item.id} to li.","Dodaj key={item.id} do li."],
    tests:[{label:["uses map","używa map"],expression:'__source.includes(".map")'},{label:["uses stable id","używa stabilnego id"],expression:'__source.includes("key={item.id}")'}],language:"tsx",fileName:"List.tsx",
  }),
];

type PremiumSeed = {
  id: string;
  courseId: "typescript" | "react";
  moduleId: string;
  concept: string;
  title: [string, string];
  subtitle: [string, string];
  body: [string, string];
  code: string;
  fact: [string, string];
  riddle: [string, string, string, string];
  check: [string, string, string, string, string, string, string, string];
  recall: [string, string, string, string, string, string, string, string];
  task: [string, string];
  starter: string;
  hint: [string, string];
  tests: { label: [string, string]; expression: string }[];
  language: "typescript" | "tsx";
  fileName: string;
};

const makePremiumLesson = (s: PremiumSeed): Lesson =>
  makeLesson({
    id: s.id,
    courseId: s.courseId,
    moduleId: s.moduleId,
    title: s.title,
    subtitle: s.subtitle,
    concept: s.concept,
    body: s.body,
    code: s.code,
    fact: s.fact,
    riddle: s.riddle,
    prediction: q(
      s.id + "-predict",
      s.concept,
      [s.check[0], s.check[1]],
      [
        [s.check[2], s.check[3]],
        [s.check[4], s.check[5]],
        [s.check[6], s.check[7]],
      ],
      0,
      s.fact,
    ),
    recall: q(
      s.id + "-recall",
      s.concept,
      [s.recall[0], s.recall[1]],
      [
        [s.recall[2], s.recall[3]],
        [s.recall[4], s.recall[5]],
        [s.recall[6], s.recall[7]],
      ],
      0,
      s.fact,
    ),
    task: s.task,
    starter: s.starter,
    hint: s.hint,
    tests: s.tests,
    language: s.language,
    fileName: s.fileName,
  });

const premiumLessons: Lesson[] = [
  makePremiumLesson({
    id:"ts-generics-core",courseId:"typescript",moduleId:"ts-generics",concept:"ts-generics",
    title:["Generics preserve relationships","Generyki zachowują relacje"],
    subtitle:["Use them when the output depends on the input type.","Używaj ich, gdy typ wyniku zależy od typu wejścia."],
    body:["A generic type parameter preserves information that any would throw away. The useful question is always: what relationship between types are you modelling?","Generyczny parametr typu zachowuje informację, którą any by utraciło. Najważniejsze pytanie brzmi: jaką relację pomiędzy typami modelujesz?"],
    code:'function first<T>(items: T[]): T | undefined {\n  return items[0];\n}',
    fact:["Type arguments are often inferred, so callers rarely need to write them explicitly.","Argumenty typów są często wnioskowane, więc wywołujący rzadko muszą podawać je jawnie."],
    riddle:["Is T useful if it appears only once?","Czy T ma sens, jeśli występuje tylko raz?","Often no. A concrete type or unknown may express the contract better.","Często nie. Konkretny typ albo unknown może lepiej opisać kontrakt."],
    check:["What is the best reason to add a generic?","Jaki jest najlepszy powód dodania generyka?","Preserve a type relationship","Zachować relację typów","Make code longer","Wydłużyć kod","Replace runtime validation","Zastąpić walidację runtime"],
    recall:["What should a generic preserve?","Co powinien zachować generyk?","Useful type information","Przydatną informację o typie","CSS state","Stan CSS","Network timing","Czas sieci"],
    task:["Make identity generic so it returns the type it receives.","Zmień identity na generyczną, aby zwracała typ, który otrzymuje."],
    starter:'function identity(value: unknown) { return value; }',
    hint:["Add <T>, then use T for the parameter and return type.","Dodaj <T>, a potem użyj T dla parametru i typu zwracanego."],
    tests:[{label:["uses T","używa T"],expression:'__source.includes("<T>")'},{label:["types value","typował value"],expression:'__source.includes("value: T")'}],
    language:"typescript",fileName:"generics.ts",
  }),
  makePremiumLesson({
    id:"ts-narrowing-guards",courseId:"typescript",moduleId:"ts-narrowing",concept:"ts-narrowing",
    title:["Narrow with evidence","Zawężaj na podstawie dowodów"],
    subtitle:["Prove what a value is instead of asserting it.","Udowodnij, czym jest wartość, zamiast deklarować to przez as."],
    body:["Narrowing connects runtime checks with static types. typeof, in, discriminators and custom predicates can refine broad unions while keeping runtime behaviour honest.","Narrowing łączy kontrole runtime z typami statycznymi. typeof, in, discriminators i własne predicates mogą zawężać szerokie unie, zachowując uczciwe zachowanie runtime."],
    code:'function format(value: string | number) {\n  if (typeof value === "number") return value.toFixed(2);\n  return value.trim();\n}',
    fact:["Control-flow analysis follows branches and early returns, so good runtime checks often create very readable type narrowing.","Analiza przepływu śledzi gałęzie i early return, więc dobre kontrole runtime często tworzą bardzo czytelny narrowing."],
    riddle:["Why is as string weaker than typeof value === 'string'?","Dlaczego as string jest słabsze niż typeof value === 'string'?","The assertion is only a promise; typeof also checks reality at runtime.","Asercja jest tylko obietnicą; typeof sprawdza też rzeczywistość w runtime."],
    check:["Which technique gives runtime evidence?","Która technika daje dowód runtime?","typeof check","Sprawdzenie typeof","Type assertion","Asercja typu","Disabling strict","Wyłączenie strict"],
    recall:["What should you prefer before using as?","Co preferować przed użyciem as?","Real narrowing","Prawdziwy narrowing","More any","Więcej any","Ignoring the branch","Ignorowanie gałęzi"],
    task:["Narrow input before calling toUpperCase.","Zawęź input przed wywołaniem toUpperCase."],
    starter:'function upper(input: string | number) { return input; }',
    hint:['Check typeof input === "string".','Sprawdź typeof input === "string".'],
    tests:[{label:["checks typeof","sprawdza typeof"],expression:'__source.includes("typeof input")'},{label:["uses toUpperCase","używa toUpperCase"],expression:'__source.includes("toUpperCase")'}],
    language:"typescript",fileName:"narrowing.ts",
  }),
  makePremiumLesson({
    id:"ts-utility-mapped",courseId:"typescript",moduleId:"ts-utility",concept:"ts-utility",
    title:["Derive types instead of copying them","Wyprowadzaj typy zamiast je kopiować"],
    subtitle:["keyof and mapped types keep one source of truth.","keyof i mapped types pomagają utrzymać jedno źródło prawdy."],
    body:["Type transformations are most valuable when they derive a new contract from a real source type. That prevents duplicate interfaces from drifting apart.","Transformacje typów są najbardziej wartościowe, gdy wyprowadzają nowy kontrakt z prawdziwego typu źródłowego. Zapobiega to rozjeżdżaniu się zduplikowanych interfejsów."],
    code:'type Nullable<T> = {\n  [K in keyof T]: T[K] | null;\n};',
    fact:["Pick, Omit, Partial and Required are reusable type transformations built from the same ideas.","Pick, Omit, Partial i Required to reużywalne transformacje zbudowane z tych samych idei."],
    riddle:["Why is manually copying User into EditableUser risky?","Dlaczego ręczne kopiowanie User do EditableUser jest ryzykowne?","The definitions can drift when User changes.","Definicje mogą się rozjechać, gdy User się zmieni."],
    check:["What does keyof User produce?","Co produkuje keyof User?","A union of User keys","Unię kluczy User","A runtime array","Tablicę runtime","A User object","Obiekt User"],
    recall:["Why derive a type from another type?","Po co wyprowadzać typ z innego typu?","Keep one source of truth","Utrzymać jedno źródło prawdy","Make runtime faster","Przyspieszyć runtime","Avoid exports","Unikać eksportów"],
    task:["Create EditableUser with Partial<User>.","Utwórz EditableUser przez Partial<User>."],
    starter:'type User = { id: number; name: string };\ntype EditableUser = User;',
    hint:["Wrap User in Partial<...>.","Owiń User przez Partial<...>."],
    tests:[{label:["uses Partial","używa Partial"],expression:'__source.includes("Partial<User>")'}],
    language:"typescript",fileName:"utility.ts",
  }),
  makePremiumLesson({
    id:"ts-async-boundary",courseId:"typescript",moduleId:"ts-async",concept:"ts-async",
    title:["Treat external async data as unknown","Traktuj zewnętrzne dane async jako unknown"],
    subtitle:["A Promise type is not runtime validation.","Typ Promise nie jest walidacją runtime."],
    body:["Network payloads arrive from outside the type system. Validate them at the boundary and only then expose a trusted domain type to the rest of the application.","Payloady sieciowe przychodzą spoza systemu typów. Waliduj je na granicy i dopiero potem udostępniaj reszcie aplikacji jako zaufany typ domenowy."],
    code:'const raw: unknown = await response.json();\nconst user = parseUser(raw);',
    fact:["Casting response.json() changes the compiler's belief, not the payload sent by the server.","Rzutowanie response.json() zmienia przekonanie kompilatora, nie payload wysłany przez serwer."],
    riddle:["Does as User validate JSON?","Czy as User waliduje JSON?","No. A runtime parser or validator must prove the shape.","Nie. Kształt musi udowodnić parser lub walidator runtime."],
    check:["What type best represents unvalidated input?","Jaki typ najlepiej reprezentuje niezwalidowane wejście?","unknown","unknown","any","any","never","never"],
    recall:["Where should external data become trusted?","Gdzie dane zewnętrzne powinny stać się zaufane?","At a validation boundary","Na granicy walidacji","Inside every component","W każdym komponencie","In CSS","W CSS"],
    task:["Change raw from any to unknown.","Zmień raw z any na unknown."],
    starter:'const raw: any = await response.json();',
    hint:["Replace any with unknown.","Zastąp any przez unknown."],
    tests:[{label:["uses unknown","używa unknown"],expression:'__source.includes("raw: unknown")'}],
    language:"typescript",fileName:"api.ts",
  }),
  makePremiumLesson({
    id:"ts-dom-safe",courseId:"typescript",moduleId:"ts-dom",concept:"ts-dom",
    title:["Model DOM uncertainty","Modeluj niepewność DOM"],
    subtitle:["Elements can be missing and event targets can be broad.","Elementów może brakować, a target zdarzenia może być szeroki."],
    body:["Browser APIs are real runtime boundaries. querySelector can return null, and different elements expose different properties, so narrow or select the correct element type before use.","API przeglądarki to prawdziwe granice runtime. querySelector może zwrócić null, a różne elementy mają różne właściwości, więc zawężaj lub wybieraj właściwy typ elementu przed użyciem."],
    code:'const input = document.querySelector<HTMLInputElement>("#email");\nconst value = input?.value ?? "";',
    fact:["A generic on querySelector improves static typing, but the selector is still a runtime string and may match nothing.","Generyk w querySelector poprawia typowanie statyczne, ale selektor nadal jest stringiem runtime i może niczego nie znaleźć."],
    riddle:["Why is querySelector nullable?","Dlaczego querySelector jest nullowalny?","The selector may not match an element at runtime.","Selektor może nie dopasować elementu w runtime."],
    check:["What must code handle after querySelector?","Co kod musi obsłużyć po querySelector?","Possible null","Możliwe null","A Promise","Promise","Only a number","Tylko number"],
    recall:["Why type the exact DOM element?","Po co typować konkretny element DOM?","To access its API safely","Aby bezpiecznie korzystać z jego API","To compile CSS","Aby kompilować CSS","To skip null checks","Aby pominąć null checks"],
    task:["Type querySelector as HTMLInputElement.","Otypuj querySelector jako HTMLInputElement."],
    starter:'const input = document.querySelector("#email");',
    hint:["Use querySelector<HTMLInputElement>(...).","Użyj querySelector<HTMLInputElement>(...)."],
    tests:[{label:["uses HTMLInputElement","używa HTMLInputElement"],expression:'__source.includes("HTMLInputElement")'}],
    language:"typescript",fileName:"dom.ts",
  }),
  makePremiumLesson({
    id:"ts-react-contracts",courseId:"typescript",moduleId:"ts-react",concept:"ts-react",
    title:["Treat React props as public contracts","Traktuj propsy Reacta jak publiczne kontrakty"],
    subtitle:["Pass the smallest domain data the component actually needs.","Przekazuj najmniejszy zestaw danych domenowych, którego komponent naprawdę potrzebuje."],
    body:["A component is easier to reuse when its prop type expresses intent instead of mirroring a huge API response. Narrow prop contracts reduce coupling and improve refactoring.","Komponent jest łatwiejszy do reużycia, gdy typ propsów opisuje intencję zamiast kopiować wielką odpowiedź API. Wąskie kontrakty zmniejszają sprzężenie i ułatwiają refaktoryzację."],
    code:'type UserCardProps = {\n  name: string;\n  role?: "admin" | "user";\n};',
    fact:["Smaller prop surfaces usually make components easier to test because each test has fewer irrelevant dependencies.","Mniejsza powierzchnia propsów zwykle ułatwia testowanie, bo test ma mniej nieistotnych zależności."],
    riddle:["Should a card receive a full API User when it only renders name?","Czy karta powinna otrzymywać pełny User z API, jeśli renderuje tylko name?","Usually no. Prefer a narrow UI contract.","Zwykle nie. Preferuj wąski kontrakt UI."],
    check:["What are props from TypeScript's perspective?","Czym są propsy z perspektywy TypeScriptu?","A component input contract","Kontraktem wejścia komponentu","A CSS file","Plikiem CSS","A socket","Socketem"],
    recall:["Why keep prop types narrow?","Po co utrzymywać wąskie typy propsów?","Lower coupling","Mniejsze sprzężenie","More rerenders","Więcej rerenderów","Less accessibility","Mniejsza dostępność"],
    task:["Add a CardProps type with title:string.","Dodaj CardProps z title:string."],
    starter:'function Card({ title }) { return <h2>{title}</h2>; }',
    hint:["Create CardProps and annotate the parameter.","Utwórz CardProps i opisz parametr."],
    tests:[{label:["title is string","title jest string"],expression:'__source.includes("title: string")'},{label:["has Props type","ma typ Props"],expression:'__source.includes("Props")'}],
    language:"tsx",fileName:"Card.tsx",
  }),
  makePremiumLesson({
    id:"ts-config-strict",courseId:"typescript",moduleId:"ts-config",concept:"ts-config",
    title:["Compiler settings are architecture","Ustawienia kompilatora są częścią architektury"],
    subtitle:["Use strictness to make unsafe assumptions visible early.","Używaj strictness, aby niebezpieczne założenia były widoczne wcześnie."],
    body:["tsconfig is engineering policy. strict and related options define which unsafe assumptions the codebase refuses to accept during development.","tsconfig to polityka inżynierska. strict i powiązane opcje definiują, których niebezpiecznych założeń codebase nie akceptuje podczas tworzenia."],
    code:'{\n  "compilerOptions": {\n    "strict": true,\n    "noUncheckedIndexedAccess": true\n  }\n}',
    fact:["Compiler options should match your runtime and build tooling, not be copied blindly from another repository.","Opcje kompilatora powinny pasować do runtime i narzędzi build, a nie być bezmyślnie kopiowane z innego repo."],
    riddle:["What can disabling strictNullChecks hide?","Co może ukryć wyłączenie strictNullChecks?","A large class of real null and undefined bugs.","Dużą klasę realnych błędów z null i undefined."],
    check:["What does strict primarily strengthen?","Co przede wszystkim wzmacnia strict?","Static guarantees","Gwarancje statyczne","Network speed","Szybkość sieci","CSS specificity","Specyficzność CSS"],
    recall:["How should compiler options be treated?","Jak traktować opcje kompilatora?","As explicit trade-offs and guarantees","Jako jawne kompromisy i gwarancje","As random defaults","Jako losowe defaulty","As runtime validators","Jako walidatory runtime"],
    task:["Enable strict and noUncheckedIndexedAccess.","Włącz strict i noUncheckedIndexedAccess."],
    starter:'{ "compilerOptions": { "strict": false } }',
    hint:["Set both options to true.","Ustaw obie opcje na true."],
    tests:[{label:["strict true","strict true"],expression:'__source.includes("\\"strict\\": true")'},{label:["checks index access","sprawdza index access"],expression:'__source.includes("noUncheckedIndexedAccess")'}],
    language:"typescript",fileName:"tsconfig.json",
  }),
  makePremiumLesson({
    id:"ts-architecture-domain",courseId:"typescript",moduleId:"ts-architecture",concept:"ts-architecture",
    title:["Protect domain boundaries with types","Chroń granice domeny typami"],
    subtitle:["Not every string should be interchangeable with every other string.","Nie każdy string powinien być wymienny z każdym innym stringiem."],
    body:["Large codebases benefit from domain-specific contracts at important boundaries. Branded values, parsers and intentional public exports can prevent accidental mixing of values that share a primitive representation.","Duże codebase korzystają z domenowych kontraktów na ważnych granicach. Branded values, parsery i świadome eksporty mogą zapobiegać mieszaniu wartości o tej samej reprezentacji prymitywnej."],
    code:'type UserId = string & { readonly __brand: "UserId" };\ntype OrderId = string & { readonly __brand: "OrderId" };',
    fact:["Branding improves compile-time modelling but does not replace runtime parsing when values come from outside the application.","Branding poprawia modelowanie compile-time, ale nie zastępuje parsowania runtime dla wartości z zewnątrz aplikacji."],
    riddle:["Why can plain string IDs be risky?","Dlaczego zwykłe stringowe ID bywają ryzykowne?","Different domain IDs can be accidentally swapped because both are strings.","Różne ID domenowe mogą zostać przypadkowo zamienione, bo oba są stringami."],
    check:["What does branding protect against?","Przed czym chroni branding?","Mixing semantically different primitive values","Mieszaniem semantycznie różnych wartości prostych","Network failure","Awarią sieci","Slow CSS","Wolnym CSS"],
    recall:["Does a branded type validate input?","Czy branded type waliduje wejście?","No, runtime validation is still needed","Nie, nadal potrzebna jest walidacja runtime","Always yes","Zawsze tak","Only in React","Tylko w React"],
    task:["Create distinct UserId and OrderId branded strings.","Utwórz osobne branded stringi UserId i OrderId."],
    starter:'type UserId = string;\ntype OrderId = string;',
    hint:["Intersect string with different readonly brand properties.","Przetnij string z różnymi readonly brand properties."],
    tests:[{label:["brands UserId","branduje UserId"],expression:'__source.includes("UserId") && __source.includes("__brand")'},{label:["brands OrderId","branduje OrderId"],expression:'__source.includes("OrderId") && __source.includes("__brand")'}],
    language:"typescript",fileName:"ids.ts",
  }),
  makePremiumLesson({
    id:"ts-project-boundary",courseId:"typescript",moduleId:"ts-project",concept:"ts-project",
    title:["Build a typed feature from boundary to UI","Zbuduj otypowaną funkcję od granicy do UI"],
    subtitle:["Unknown input becomes trusted domain data once, at a clear boundary.","Unknown staje się zaufanymi danymi domenowymi raz, na jasnej granicy."],
    body:["A production feature combines unknown external input, validation, trusted domain models, transformations and narrow UI contracts. The goal is reliable boundaries, not the cleverest possible type expression.","Produkcyjna funkcja łączy unknown na wejściu, walidację, zaufane modele domenowe, transformacje i wąskie kontrakty UI. Celem są pewne granice, nie najbardziej sprytne możliwe typy."],
    code:'unknown API → parser → DomainUser → selector → UserCardProps',
    fact:["Maintainable TypeScript is often intentionally boring: explicit boundaries, small public contracts and very little any.","Utrzymywalny TypeScript jest często celowo nudny: jawne granice, małe publiczne kontrakty i bardzo mało any."],
    riddle:["Where should API uncertainty disappear?","Gdzie powinna zniknąć niepewność API?","At the parser or validation boundary.","Na granicy parsera lub walidacji."],
    check:["Which flow is strongest?","Który przepływ jest najmocniejszy?","unknown → validate → domain","unknown → validate → domain","any → cast everywhere","any → cast wszędzie","JSON → UI directly","JSON → UI bezpośrednio"],
    recall:["What is the goal of type architecture?","Jaki jest cel architektury typów?","Reliable, understandable contracts","Pewne i zrozumiałe kontrakty","Maximum generic complexity","Maksymalna złożoność generyków","No runtime checks","Brak kontroli runtime"],
    task:["Type parseUser as unknown → User.","Otypuj parseUser jako unknown → User."],
    starter:'function parseUser(value) { return value; }',
    hint:["Use value: unknown and ): User.","Użyj value: unknown i ): User."],
    tests:[{label:["accepts unknown","przyjmuje unknown"],expression:'__source.includes("value: unknown")'},{label:["returns User","zwraca User"],expression:'__source.includes("): User")'}],
    language:"typescript",fileName:"domain.ts",
  }),

  makePremiumLesson({
    id:"react-hooks-order",courseId:"react",moduleId:"react-hooks",concept:"react-hooks",
    title:["Hooks depend on stable call order","Hooki zależą od stabilnej kolejności wywołań"],
    subtitle:["Rules of Hooks are about state identity.","Reguły Hooków dotyczą tożsamości stanu."],
    body:["React matches Hook state to call order inside a component. A conditional Hook could shift the order between renders, so Hook calls belong at the top level of components and custom Hooks.","React dopasowuje stan Hooków do kolejności wywołań w komponencie. Warunkowy Hook mógłby przesunąć tę kolejność między renderami, dlatego Hooki wywołujemy na top level komponentów i custom Hooków."],
    code:'function Panel({ ready }) {\n  const [open, setOpen] = useState(false);\n  if (!ready) return null;\n  return <div>{String(open)}</div>;\n}',
    fact:["Custom Hooks share logic, not one shared local state instance. Each call receives its own Hook state unless it uses an external store.","Custom Hooki współdzielą logikę, nie jedną instancję lokalnego stanu. Każde wywołanie ma własny stan, chyba że korzysta z zewnętrznego store."],
    riddle:["Why must useState be above a conditional return?","Dlaczego useState musi być nad warunkowym return?","React needs the Hook call order to remain stable on every render.","React potrzebuje stałej kolejności Hooków w każdym renderze."],
    check:["Where should Hooks be called?","Gdzie należy wywoływać Hooki?","At the top level","Na top level","Inside arbitrary loops","W dowolnych pętlach","Only in click handlers","Tylko w handlerach kliknięcia"],
    recall:["What do custom Hooks primarily share?","Co przede wszystkim współdzielą custom Hooki?","Logic","Logikę","One state instance","Jedną instancję stanu","DOM nodes","Elementy DOM"],
    task:["Move useState before the early return.","Przenieś useState przed early return."],
    starter:'function Panel({ ready }) {\n  if (!ready) return null;\n  const [open, setOpen] = useState(false);\n  return <div />;\n}',
    hint:["Hook calls must happen before conditional returns.","Hooki muszą zostać wywołane przed warunkowymi return."],
    tests:[{label:["Hook before if","Hook przed if"],expression:'__source.indexOf("useState") < __source.indexOf("if")'}],
    language:"tsx",fileName:"Hooks.tsx",
  }),
  makePremiumLesson({
    id:"react-effects-sync",courseId:"react",moduleId:"react-effects",concept:"react-effects",
    title:["Effects synchronize external systems","Effecty synchronizują systemy zewnętrzne"],
    subtitle:["If there is no external system, question the effect.","Jeśli nie ma systemu zewnętrznego, zakwestionuj effect."],
    body:["Effects are for subscriptions, timers, imperative browser APIs and other synchronization outside React's render calculation. Derived values usually belong directly in render.","Effecty służą do subskrypcji, timerów, imperatywnych API przeglądarki i innej synchronizacji poza obliczaniem renderu Reacta. Wartości wyliczane zwykle należą bezpośrednio do renderu."],
    code:'useEffect(() => {\n  const stop = chat.subscribe(roomId, onMessage);\n  return stop;\n}, [roomId]);',
    fact:["Cleanup runs before the synchronization is established again for changed dependencies and on unmount.","Cleanup wykonuje się przed ponownym ustanowieniem synchronizacji po zmianie zależności oraz przy unmount."],
    riddle:["Should fullName from firstName and lastName use an effect?","Czy fullName z firstName i lastName powinno używać effectu?","Usually no. Compute it during render.","Zwykle nie. Wylicz je podczas renderu."],
    check:["What is a strong effect use case?","Co jest dobrym przypadkiem dla effectu?","External subscription","Zewnętrzna subskrypcja","Adding two props","Dodawanie dwóch propsów","Formatting text","Formatowanie tekstu"],
    recall:["What should cleanup do?","Co powinien robić cleanup?","Undo the previous synchronization","Cofnąć poprzednią synchronizację","Reset every state","Resetować każdy stan","Change CSS","Zmienić CSS"],
    task:["Return a cleanup that calls unsubscribe().","Zwróć cleanup wywołujący unsubscribe()."],
    starter:'useEffect(() => {\n  const unsubscribe = subscribe();\n}, []);',
    hint:["Return () => unsubscribe().","Zwróć () => unsubscribe()."],
    tests:[{label:["returns cleanup","zwraca cleanup"],expression:'__source.includes("return") && __source.includes("unsubscribe")'}],
    language:"tsx",fileName:"Effects.tsx",
  }),
  makePremiumLesson({
    id:"react-forms-controlled",courseId:"react",moduleId:"react-forms",concept:"react-forms",
    title:["Forms need data flow and semantics","Formularze potrzebują przepływu danych i semantyki"],
    subtitle:["Controlled values are only one part of a production form.","Kontrolowane wartości to tylko jedna część produkcyjnego formularza."],
    body:["A controlled field reads from React state and reports edits through onChange. Real forms also need labels, error association, submission states and trusted server validation.","Kontrolowane pole czyta ze stanu Reacta i zgłasza zmiany przez onChange. Prawdziwe formularze potrzebują też labeli, powiązania błędów, stanów wysyłki i zaufanej walidacji serwerowej."],
    code:'<label>\n  Email\n  <input value={email} onChange={e => setEmail(e.target.value)} />\n</label>',
    fact:["Client-side validation improves UX, but the server remains the security and integrity boundary.","Walidacja po stronie klienta poprawia UX, ale serwer pozostaje granicą bezpieczeństwa i integralności."],
    riddle:["Why is placeholder not a replacement for label?","Dlaczego placeholder nie zastępuje label?","It can disappear and does not provide the same accessible-name semantics.","Może zniknąć i nie zapewnia tej samej semantyki dostępnej nazwy."],
    check:["What makes an input controlled?","Co czyni input kontrolowanym?","React owns its value","React jest właścicielem value","It has a placeholder","Ma placeholder","It uses CSS","Używa CSS"],
    recall:["Where must authoritative validation still happen?","Gdzie nadal musi odbywać się autorytatywna walidacja?","Trusted server boundary","Na zaufanej granicy serwera","Only in the browser","Tylko w przeglądarce","In CSS","W CSS"],
    task:["Connect value to email and onChange to setEmail.","Podepnij value do email i onChange do setEmail."],
    starter:'<input />',
    hint:["Add value={email} and onChange.","Dodaj value={email} i onChange."],
    tests:[{label:["uses value","używa value"],expression:'__source.includes("value={email}")'},{label:["uses change handler","używa handlera zmiany"],expression:'__source.includes("onChange") && __source.includes("setEmail")'}],
    language:"tsx",fileName:"Form.tsx",
  }),
  makePremiumLesson({
    id:"react-context-ownership",courseId:"react",moduleId:"react-context",concept:"react-context",
    title:["Context distributes values; ownership comes first","Context dystrybuuje wartości; własność jest pierwsza"],
    subtitle:["Do not make state global just because two components need it.","Nie rób stanu globalnego tylko dlatego, że potrzebują go dwa komponenty."],
    body:["Context removes intermediate prop passing, but it does not decide where state should live or how transitions should work. Choose the owner first, then use context if distribution is the actual problem.","Context usuwa pośrednie przekazywanie propsów, ale nie decyduje, gdzie stan powinien żyć ani jak mają działać przejścia. Najpierw wybierz właściciela, potem użyj contextu, jeśli problemem jest dystrybucja."],
    code:'const ThemeContext = createContext<Theme>("dark");',
    fact:["Splitting unrelated contexts can improve ownership and reduce broad updates when values change at different rates.","Rozdzielenie niepowiązanych contextów może poprawić własność i ograniczyć szerokie aktualizacje, gdy wartości zmieniają się z różną częstotliwością."],
    riddle:["Should every shared value become global context?","Czy każda współdzielona wartość powinna zostać globalnym contextem?","No. Use the smallest scope that satisfies the real sharing requirement.","Nie. Użyj najmniejszego zakresu spełniającego realną potrzebę współdzielenia."],
    check:["What does context primarily solve?","Co przede wszystkim rozwiązuje context?","Value distribution","Dystrybucję wartości","Database persistence","Trwałość bazy","CSS compilation","Kompilację CSS"],
    recall:["What question comes before context?","Jakie pytanie jest przed contextem?","Who owns the state?","Kto jest właścicielem stanu?","Which icon to use?","Jakiej ikony użyć?","How many divs?","Ile divów?"],
    task:["Create ThemeContext with dark as the default.","Utwórz ThemeContext z dark jako default."],
    starter:'const ThemeContext = null;',
    hint:['Use createContext<Theme>("dark").','Użyj createContext<Theme>("dark").'],
    tests:[{label:["uses createContext","używa createContext"],expression:'__source.includes("createContext")'},{label:["dark default","dark jako default"],expression:'__source.includes("dark")'}],
    language:"tsx",fileName:"ThemeContext.tsx",
  }),
  makePremiumLesson({
    id:"react-data-lifecycle",courseId:"react",moduleId:"react-data",concept:"react-data",
    title:["Server data has a lifecycle","Dane serwerowe mają cykl życia"],
    subtitle:["Loading, success, empty and error are distinct states.","Loading, success, empty i error to różne stany."],
    body:["Remote data has caching, freshness and synchronization concerns. Treating it exactly like local UI state often causes duplicated requests, stale values and missing transition states.","Dane zdalne mają problemy cache, świeżości i synchronizacji. Traktowanie ich dokładnie jak lokalnego stanu UI często prowadzi do zduplikowanych requestów, nieaktualnych danych i brakujących stanów przejściowych."],
    code:'type QueryState<T> =\n  | { status: "loading" }\n  | { status: "success"; data: T }\n  | { status: "error"; error: Error };',
    fact:["A server-state library is mainly a cache and synchronization tool, not merely a shorter fetch wrapper.","Biblioteka server-state to przede wszystkim narzędzie cache i synchronizacji, nie tylko krótszy wrapper na fetch."],
    riddle:["Why is one isLoading boolean often insufficient?","Dlaczego jeden boolean isLoading często nie wystarcza?","It cannot precisely model cached data, refetching, empty results and errors.","Nie potrafi precyzyjnie opisać cache, refetchingu, pustych wyników i błędów."],
    check:["Which is server state?","Co jest server state?","Fetched product data","Pobrane dane produktów","Modal open flag","Flaga otwartego modala","Input hover","Hover inputa"],
    recall:["What does a query library manage beyond fetching?","Czym biblioteka query zarządza poza fetchem?","Caching and synchronization","Cache i synchronizacją","Only CSS","Tylko CSS","DOM layout","Layoutem DOM"],
    task:["Model loading, success and error as a union.","Zamodeluj loading, success i error jako unię."],
    starter:'type State<T> = { status: string };',
    hint:["Use three literal union members.","Użyj trzech członów unii z literalami."],
    tests:[{label:["loading state","stan loading"],expression:'__source.includes("\\"loading\\")'},{label:["success and error","success i error"],expression:'__source.includes("\\"success\\") && __source.includes("\\"error\\")'},{label:["uses union","używa unii"],expression:'__source.includes("|")'}],
    language:"tsx",fileName:"QueryState.ts",
  }),
  makePremiumLesson({
    id:"react-routing-url",courseId:"react",moduleId:"react-routing",concept:"react-routing",
    title:["Use the URL for shareable navigation state","Używaj URL dla współdzielonego stanu nawigacji"],
    subtitle:["Refresh, sharing and Back should preserve meaningful navigation.","Odświeżenie, udostępnienie i Back powinny zachować ważny stan nawigacji."],
    body:["Filters, pagination, selected resources and tabs often belong in the URL when the current view should be bookmarkable or shareable. This reduces hidden state and makes browser navigation useful.","Filtry, paginacja, wybrane zasoby i zakładki często należą do URL, jeśli bieżący widok powinien dać się zapisać lub udostępnić. To zmniejsza ukryty stan i wykorzystuje nawigację przeglądarki."],
    code:'const params = new URLSearchParams(location.search);\nconst page = Number(params.get("page") ?? 1);',
    fact:["URL state is application state with built-in persistence, history and sharing semantics.","Stan w URL to stan aplikacji z wbudowaną trwałością, historią i możliwością udostępnienia."],
    riddle:["Should a product ID live only in local state if the detail screen has a route?","Czy ID produktu powinno żyć tylko w lokalnym stanie, jeśli ekran szczegółu ma trasę?","Usually no. The route should own navigational identity.","Zwykle nie. Trasa powinna być właścicielem tożsamości nawigacyjnej."],
    check:["Which state is a strong URL candidate?","Który stan jest dobrym kandydatem do URL?","Current page and filter","Bieżąca strona i filtr","Hover state","Stan hover","Animation frame","Klatka animacji"],
    recall:["What does URL state improve?","Co poprawia stan w URL?","Sharing and refresh persistence","Udostępnianie i trwałość przy odświeżeniu","CSS speed","Szybkość CSS","Hook order","Kolejność Hooków"],
    task:["Read page from search params with fallback 1.","Odczytaj page z search params z fallbackiem 1."],
    starter:'const page = 1;',
    hint:['Use params.get("page") ?? "1".','Użyj params.get("page") ?? "1".'],
    tests:[{label:["reads page","czyta page"],expression:'__source.includes("params.get") && __source.includes("\\"page\\")'},{label:["has fallback","ma fallback"],expression:'__source.includes("??")'}],
    language:"tsx",fileName:"Routing.ts",
  }),
  makePremiumLesson({
    id:"react-performance-measure",courseId:"react",moduleId:"react-performance",concept:"react-performance",
    title:["Measure before memoizing","Mierz przed memoizacją"],
    subtitle:["A rerender is not automatically a bottleneck.","Rerender nie jest automatycznie wąskim gardłem."],
    body:["Performance work starts from user-visible latency and profiling. memo, useMemo and useCallback solve specific identity or computation problems; they are not baseline decorations for every component.","Praca nad wydajnością zaczyna się od odczuwalnych opóźnień i profilowania. memo, useMemo i useCallback rozwiązują konkretne problemy tożsamości lub obliczeń; nie są obowiązkową dekoracją każdego komponentu."],
    code:'const visible = useMemo(() => expensiveFilter(items, query), [items, query]);',
    fact:["Memoization has a cost: dependency comparisons, retained values and cognitive complexity. It pays off when avoided work is more expensive.","Memoizacja ma koszt: porównywanie zależności, przechowywanie wartości i złożoność poznawczą. Opłaca się, gdy uniknięta praca jest droższa."],
    riddle:["Does useCallback make the function itself faster?","Czy useCallback przyspiesza samą funkcję?","No. It can preserve function identity while dependencies stay unchanged.","Nie. Może zachować tożsamość funkcji, gdy zależności się nie zmieniają."],
    check:["What comes before memoization?","Co powinno być przed memoizacją?","Measurement","Pomiar","memo everywhere","memo wszędzie","Disabling state","Wyłączenie stanu"],
    recall:["What does useMemo preserve?","Co zachowuje useMemo?","A calculation result","Wynik obliczenia","A DOM node forever","Element DOM na zawsze","Network cache automatically","Automatycznie cache sieci"],
    task:["Memoize expensiveFilter using items and query.","Zmemoizuj expensiveFilter względem items i query."],
    starter:'const visible = expensiveFilter(items, query);',
    hint:["Use useMemo with [items, query].","Użyj useMemo z [items, query]."],
    tests:[{label:["uses useMemo","używa useMemo"],expression:'__source.includes("useMemo")'},{label:["correct dependencies","poprawne zależności"],expression:'__source.includes("[items, query]")'}],
    language:"tsx",fileName:"Performance.tsx",
  }),
  makePremiumLesson({
    id:"react-testing-behavior",courseId:"react",moduleId:"react-testing",concept:"react-testing",
    title:["Test observable behaviour","Testuj obserwowalne zachowanie"],
    subtitle:["Roles, labels and outcomes survive refactors better.","Role, labelki i wyniki lepiej przetrwają refaktory."],
    body:["A robust React test interacts through user-facing semantics and verifies a visible result. Tests coupled to private state or generated class names are usually brittle.","Solidny test Reacta korzysta z semantyki widocznej dla użytkownika i weryfikuje obserwowalny rezultat. Testy sprzężone z prywatnym stanem lub generowanymi klasami są zwykle kruche."],
    code:'await user.click(screen.getByRole("button", { name: /save/i }));\nexpect(await screen.findByText(/saved/i)).toBeVisible();',
    fact:["Accessibility often makes testing easier because semantic controls provide stable user-facing queries.","Dostępność często ułatwia testowanie, bo semantyczne kontrolki zapewniają stabilne zapytania z perspektywy użytkownika."],
    riddle:["Which survives a refactor better: role=button or .blue-button?","Co lepiej przetrwa refaktor: role=button czy .blue-button?","The role-based query because it represents user-visible semantics.","Zapytanie po roli, bo reprezentuje semantykę widoczną dla użytkownika."],
    check:["Which query is closest to a user's interaction?","Które zapytanie jest najbliższe interakcji użytkownika?","getByRole","getByRole","querySelector('.x123')","querySelector('.x123')","component.state","component.state"],
    recall:["What should an integration test verify?","Co powinien weryfikować test integracyjny?","Observable behaviour","Obserwowalne zachowanie","Every private variable","Każdą prywatną zmienną","Exact implementation order","Dokładną kolejność implementacji"],
    task:["Query Save by role and accessible name.","Znajdź Save po roli i dostępnej nazwie."],
    starter:'const button = document.querySelector(".save");',
    hint:['Use screen.getByRole("button", { name: /save/i }).','Użyj screen.getByRole("button", { name: /save/i }).'],
    tests:[{label:["uses getByRole","używa getByRole"],expression:'__source.includes("getByRole")'},{label:["queries button","wyszukuje button"],expression:'__source.includes("\\"button\\")'}],
    language:"tsx",fileName:"Save.test.tsx",
  }),
  makePremiumLesson({
    id:"react-project-ownership",courseId:"react",moduleId:"react-project",concept:"react-project",
    title:["Build around explicit state ownership","Buduj wokół jawnej własności stanu"],
    subtitle:["URL state, server state and local UI state have different jobs.","Stan URL, dane serwerowe i lokalny stan UI mają różne zadania."],
    body:["A maintainable feature separates navigation state, remote cached data, domain transformations and local interaction state. Clear ownership prevents two layers from fighting over the same fact.","Utrzymywalna funkcja oddziela stan nawigacji, zdalne dane cache, transformacje domenowe i lokalny stan interakcji. Jasna własność zapobiega walce dwóch warstw o ten sam fakt."],
    code:'URL state → query key → API data → selector → view props → components',
    fact:["Many scaling problems begin as ownership problems: too many places can update the same fact or no layer clearly owns it.","Wiele problemów skalowania zaczyna się jako problem własności: zbyt wiele miejsc może aktualizować ten sam fakt albo żadna warstwa nie jest jego jasnym właścicielem."],
    riddle:["Where should one dropdown's temporary open state usually live?","Gdzie zwykle powinien żyć tymczasowy stan otwarcia jednego dropdownu?","Near the dropdown or its nearest meaningful owner.","Przy dropdownie lub jego najbliższym sensownym właścicielu."],
    check:["Where should shareable filter state often live?","Gdzie często powinien żyć współdzielony stan filtra?","In the URL","W URL","In CSS","W CSS","In a random child","W losowym dziecku"],
    recall:["What is a strong architecture question?","Jakie jest dobre pytanie architektoniczne?","Who owns this state?","Kto jest właścicielem tego stanu?","How many hooks can I add?","Ile Hooków mogę dodać?","Can everything be global?","Czy wszystko może być globalne?"],
    task:["Sketch url, server and local state owners.","Naszkicuj właścicieli stanu url, server i local."],
    starter:'const architecture = { };',
    hint:["Add url, server and local keys.","Dodaj klucze url, server i local."],
    tests:[{label:["has url","ma url"],expression:'__source.includes("url")'},{label:["has server","ma server"],expression:'__source.includes("server")'},{label:["has local","ma local"],expression:'__source.includes("local")'}],
    language:"tsx",fileName:"architecture.ts",
  }),
];

export const modernLessons: Lesson[] = [...foundationLessons, ...premiumLessons];

const m = (
  id:string,en:string,pl:string,descEn:string,descPl:string,
  access:"free"|"premium",lessonIds:string[]=[],minutes=40,
): CourseModule => ({
  id,
  title:T(en,pl),
  description:T(descEn,descPl),
  access,
  level: access === "free" ? "beginner" : "advanced",
  lessonIds,
  minutes,
});

const tsModules: CourseModule[] = [
  m("ts-foundations","Type system foundations","Podstawy systemu typów","Inference, primitive types, and the TypeScript mental model.","Inferencja, typy proste i model myślowy TypeScriptu.","free",["ts-why-types","ts-inference"],18),
  m("ts-functions","Functions as contracts","Funkcje jako kontrakty","Parameters, return types and optional inputs.","Parametry, typy zwracane i opcjonalne dane.","free",["ts-functions","ts-optional"],18),
  m("ts-objects","Objects, unions & narrowing","Obiekty, unie i narrowing","Model real domain data and valid states precisely.","Precyzyjnie modeluj dane domenowe i poprawne stany.","free",["ts-objects","ts-unions"],18),
  m("ts-generics","Generics","Generyki","Reusable types that preserve information without any. Learn constraints, inference and relationships between inputs and outputs.","Reużywalne typy zachowujące informację bez any. Poznaj constraints, inferencję i relacje między wejściem a wynikiem.","premium",["ts-generics-core"],42),
  m("ts-narrowing","Advanced narrowing","Zaawansowany narrowing","Type guards, discriminated unions, never and exhaustive checks. Prove types with runtime evidence instead of assertions.","Type guardy, unie dyskryminowane, never i pełne sprawdzanie. Udowadniaj typy kontrolą runtime zamiast asercją.","premium",["ts-narrowing-guards"],46),
  m("ts-utility","Utility & mapped types","Utility i mapped types","keyof, indexed access, Pick, Omit and mapped types. Derive contracts instead of duplicating them.","keyof, indexed access, Pick, Omit i mapped types. Wyprowadzaj kontrakty zamiast je duplikować.","premium",["ts-utility-mapped"],48),
  m("ts-async","Typed async data","Typowane dane async","Promises, API responses, unknown data and safe parsing. Keep unreliable payloads outside the trusted domain.","Promise, odpowiedzi API, unknown i bezpieczne parsowanie. Trzymaj niepewne payloady poza zaufaną domeną.","premium",["ts-async-boundary"],44),
  m("ts-dom","Browser & DOM typing","Typowanie DOM","Events, elements, nullability and browser APIs without falling back to any.","Zdarzenia, elementy, nullowalność i API przeglądarki bez uciekania do any.","premium",["ts-dom-safe"],38),
  m("ts-react","TypeScript with React","TypeScript z Reactem","Props, events, refs, children, hooks and component contracts.","Propsy, zdarzenia, refy, children, hooki i kontrakty komponentów.","premium",["ts-react-contracts"],55),
  m("ts-config","tsconfig strategy","Strategia tsconfig","Strictness, modules, targets, aliases and compiler policy for scalable projects.","Strict mode, moduły, targety, aliasy i polityka kompilatora dla skalowalnych projektów.","premium",["ts-config-strict"],40),
  m("ts-architecture","Large-scale TypeScript","TypeScript w dużej aplikacji","Domain boundaries, branded values, public types and maintainable contracts.","Granice domeny, branded values, publiczne typy i utrzymywalne kontrakty.","premium",["ts-architecture-domain"],52),
  m("ts-project","Final TypeScript project","Projekt końcowy TypeScript","Build a typed feature from API boundary to UI with validation and narrow contracts.","Zbuduj otypowaną funkcję od granicy API po UI z walidacją i wąskimi kontraktami.","premium",["ts-project-boundary"],90),
];

const reactModules: CourseModule[] = [
  m("react-components","Components & JSX","Komponenty i JSX","Component model, JSX and composition.","Model komponentowy, JSX i kompozycja.","free",["react-components","react-composition"],18),
  m("react-props-state","Props & state","Propsy i stan","One-way data flow, state and data ownership.","Jednokierunkowy przepływ, stan i własność danych.","free",["react-props","react-state"],18),
  m("react-events","Events, lists & identity","Zdarzenia, listy i tożsamość","Handlers, list rendering, keys and predictable updates.","Handlery, listy, key i przewidywalne aktualizacje.","free",["react-events","react-lists"],18),
  m("react-hooks","Hooks deeply understood","Hooki bez magii","Rules of Hooks, call order, render snapshots, refs, reducers and custom hooks.","Reguły Hooków, kolejność wywołań, migawki renderu, refy, reducery i custom hooki.","premium",["react-hooks-order"],52),
  m("react-effects","Effects & synchronization","Effecty i synchronizacja","Dependencies, cleanup, external systems and knowing when an effect is unnecessary.","Zależności, cleanup, systemy zewnętrzne i rozpoznawanie, kiedy effect jest zbędny.","premium",["react-effects-sync"],50),
  m("react-forms","Forms & validation","Formularze i walidacja","Accessible forms, controlled fields, errors, validation and robust submissions.","Dostępne formularze, kontrolowane pola, błędy, walidacja i solidny submit.","premium",["react-forms-controlled"],45),
  m("react-context","Context & state design","Context i projektowanie stanu","State ownership, context boundaries, reducers and avoiding unnecessary global state.","Własność stanu, granice contextu, reducery i unikanie zbędnego globalnego stanu.","premium",["react-context-ownership"],48),
  m("react-data","Server data & async UI","Dane serwerowe i async UI","Loading, errors, caching, invalidation and the lifecycle of remote data.","Loading, błędy, cache, invalidacja i cykl życia danych zdalnych.","premium",["react-data-lifecycle"],55),
  m("react-routing","Routing & application structure","Routing i struktura aplikacji","Routes, layouts, URL state and scalable feature organization.","Trasy, layouty, stan w URL i skalowalna organizacja funkcji.","premium",["react-routing-url"],42),
  m("react-performance","Performance that matters","Wydajność, która ma znaczenie","Profiling, rendering, memoization, code splitting and user-visible latency.","Profilowanie, renderowanie, memoizacja, code splitting i odczuwalne opóźnienia.","premium",["react-performance-measure"],50),
  m("react-testing","Testing React behavior","Testowanie zachowania Reacta","RTL, accessible queries, integration boundaries and E2E confidence.","RTL, dostępne zapytania, granice integracji i pewność E2E.","premium",["react-testing-behavior"],48),
  m("react-project","Final React project","Projekt końcowy React","Build a production feature with explicit state ownership, server data, URL state, a11y and tests.","Zbuduj produkcyjną funkcję z jawną własnością stanu, danymi serwerowymi, stanem URL, a11y i testami.","premium",["react-project-ownership"],90),
];

export const modernCourses: Course[] = [
  {
    id:"typescript",slug:"typescript",title:T("TypeScript","TypeScript"),short:"TS",
    description:T("Make JavaScript contracts explicit. Catch mistakes earlier and scale code with confidence.","Uczyń kontrakty JavaScriptu jawnymi. Łap błędy wcześniej i rozwijaj kod z większą pewnością."),
    category:"web",status:"available",color:"blue",modules:tsModules,
  },
  {
    id:"react",slug:"react",title:T("React","React"),short:"⚛",
    description:T("Build interfaces from components and understand the mental models behind modern React.","Buduj interfejsy z komponentów i poznaj modele myślowe współczesnego Reacta."),
    category:"web",status:"available",color:"cyan",modules:reactModules,
  },
];

const modernQuizExtras: Record<string, Question[]> = {
  "ts-foundations": [
    q("ts-found-extra-1","ts-types",["Which statement about TypeScript is accurate?","Które zdanie o TypeScript jest poprawne?"],[["Types are checked during development","Typy są sprawdzane podczas tworzenia"],["Types validate every API payload at runtime","Typy walidują każdy payload API w runtime"],["Browsers execute type annotations directly","Przeglądarki wykonują adnotacje typów bezpośrednio"],["TypeScript replaces JavaScript runtime","TypeScript zastępuje runtime JavaScript"]],0,["TypeScript performs static checks and emits JavaScript.","TypeScript wykonuje kontrole statyczne i generuje JavaScript."]),
    q("ts-found-extra-2","ts-inference",["When is inference most useful?","Kiedy inferencja jest najbardziej przydatna?"],[["For obvious local values","Dla oczywistych wartości lokalnych"],["When you want to hide all contracts","Gdy chcesz ukryć wszystkie kontrakty"],["Only for CSS","Tylko dla CSS"],["Only when strict is off","Tylko gdy strict jest wyłączony"]],0,["Inference keeps obvious local code concise without losing type information.","Inferencja utrzymuje oczywisty lokalny kod zwięzły bez utraty informacji o typie."]),
    q("ts-found-extra-3","ts-types",["What does any primarily do?","Co przede wszystkim robi any?"],[["Opts out of much type checking","Wyłącza dużą część kontroli typów"],["Adds runtime validation","Dodaje walidację runtime"],["Makes values immutable","Czyni wartości niemutowalnymi"],["Creates a generic relationship","Tworzy relację generyczną"]],0,["any weakens static guarantees and should be used deliberately.","any osłabia gwarancje statyczne i powinno być używane świadomie."]),
    q("ts-found-extra-4","ts-inference",["Why avoid annotating every obvious constant?","Dlaczego nie warto opisywać typem każdej oczywistej stałej?"],[["It adds noise without improving the contract","Dodaje szum bez poprawy kontraktu"],["Annotations are invalid on const","Adnotacje są niepoprawne przy const"],["Inference works only on let","Inferencja działa tylko dla let"],["It makes runtime slower","Spowalnia runtime"]],0,["Useful annotations clarify boundaries; redundant ones can obscure intent.","Przydatne adnotacje wyjaśniają granice, a redundantne mogą zaciemniać intencję."]),
  ],
  "ts-functions": [
    q("ts-fn-extra-1","ts-functions",["What does a parameter type protect?","Co chroni typ parametru?"],[["The function body and its callers","Ciało funkcji i jej wywołujących"],["Only CSS imports","Tylko importy CSS"],["The network cache","Cache sieci"],["DOM layout","Layout DOM"]],0,["The parameter contract is checked at call sites and inside the function.","Kontrakt parametru jest sprawdzany w miejscu wywołania i wewnątrz funkcji."]),
    q("ts-fn-extra-2","ts-optional",["What can an optional parameter be when omitted?","Czym może być opcjonalny parametr, gdy go pominięto?"],[["undefined","undefined"],["never","never"],["Always an empty string","Zawsze pustym stringiem"],["Always null","Zawsze null"]],0,["Optional parameters may be undefined.","Opcjonalne parametry mogą mieć wartość undefined."]),
    q("ts-fn-extra-3","ts-functions",["Why can an explicit return type help an exported function?","Dlaczego jawny typ zwracany pomaga eksportowanej funkcji?"],[["It stabilizes and documents its public contract","Stabilizuje i dokumentuje publiczny kontrakt"],["It automatically tests the function","Automatycznie testuje funkcję"],["It validates network data","Waliduje dane sieciowe"],["It removes JavaScript output","Usuwa wynikowy JavaScript"]],0,["Public boundaries benefit from explicit contracts.","Publiczne granice korzystają z jawnych kontraktów."]),
    q("ts-fn-extra-4","ts-optional",["What should code do before using an optional string as definitely present?","Co kod powinien zrobić przed użyciem opcjonalnego stringa jako na pewno istniejącego?"],[["Handle or narrow the undefined case","Obsłużyć lub zawęzić przypadek undefined"],["Cast everything to any","Rzutować wszystko na any"],["Disable strict","Wyłączyć strict"],["Ignore it","Zignorować to"]],0,["The absent case is part of the contract and should be handled.","Brak wartości jest częścią kontraktu i powinien być obsłużony."]),
  ],
  "ts-objects": [
    q("ts-obj-extra-1","ts-objects",["What does structural typing focus on?","Na czym skupia się typowanie strukturalne?"],[["The shape of a value","Na kształcie wartości"],["The file name","Na nazwie pliku"],["The CSS class","Na klasie CSS"],["The package manager","Na package managerze"]],0,["Compatibility is mainly determined by available properties and their types.","Zgodność jest określana głównie przez dostępne właściwości i ich typy."]),
    q("ts-obj-extra-2","ts-unions",["Why are literal unions useful for application status?","Dlaczego unie literałów są przydatne dla statusu aplikacji?"],[["They restrict values to known states","Ograniczają wartości do znanych stanów"],["They fetch data automatically","Automatycznie pobierają dane"],["They replace conditions","Zastępują warunki"],["They exist at runtime","Istnieją w runtime"]],0,["A literal union models a finite set of valid states.","Unia literałów modeluje skończony zestaw poprawnych stanów."]),
    q("ts-obj-extra-3","ts-unions",["What should happen before reading a property that exists only on one union member?","Co powinno się wydarzyć przed odczytem pola istniejącego tylko w jednym wariancie unii?"],[["Narrow to that member","Zawęzić do tego wariantu"],["Use any","Użyć any"],["Delete the property","Usunąć właściwość"],["Turn strict off","Wyłączyć strict"]],0,["Narrowing proves which union member you currently have.","Narrowing udowadnia, z którym wariantem unii aktualnie pracujesz."]),
    q("ts-obj-extra-4","ts-objects",["What is a drawback of making every domain property optional?","Jaka jest wada robienia każdej właściwości domenowej opcjonalną?"],[["It allows many invalid combinations","Pozwala na wiele niepoprawnych kombinacji"],["It makes objects immutable","Czyni obiekty niemutowalnymi"],["It disables JSX","Wyłącza JSX"],["It prevents inference","Blokuje inferencję"]],0,["Precise shapes or unions model valid states more clearly.","Precyzyjne kształty lub unie czytelniej modelują poprawne stany."]),
  ],
  "react-components": [
    q("react-comp-extra-1","react-components",["Why do component names start with a capital letter?","Dlaczego nazwy komponentów zaczynają się wielką literą?"],[["So React distinguishes components from platform elements","Aby React odróżniał komponenty od elementów platformy"],["To make CSS faster","Aby przyspieszyć CSS"],["Because JavaScript requires it for every function","Bo JavaScript wymaga tego dla każdej funkcji"],["To enable network caching","Aby włączyć cache sieci"]],0,["Capitalized JSX names refer to component variables.","Nazwy JSX z wielkiej litery odnoszą się do zmiennych komponentów."]),
    q("react-comp-extra-2","react-composition",["What is composition in React?","Czym jest kompozycja w React?"],[["Building larger UI from focused components","Budowaniem większego UI z wyspecjalizowanych komponentów"],["Inheriting from every component","Dziedziczeniem z każdego komponentu"],["Copying state globally","Kopiowaniem stanu globalnie"],["A CSS animation","Animacją CSS"]],0,["Composition combines reusable UI pieces.","Kompozycja łączy reużywalne fragmenty UI."]),
    q("react-comp-extra-3","react-components",["What should rendering ideally be?","Jakie powinno być renderowanie?"],[["Pure for the same inputs","Czyste dla tych samych wejść"],["A place for random network writes","Miejscem losowych zapisów sieciowych"],["Dependent on hidden globals","Zależne od ukrytych globali"],["A replacement for event handlers","Zamiennikiem handlerów zdarzeń"]],0,["Pure rendering makes UI predictable and restartable.","Czyste renderowanie czyni UI przewidywalnym i możliwym do ponownego wykonania."]),
    q("react-comp-extra-4","react-composition",["When is extracting a component most meaningful?","Kiedy wydzielenie komponentu ma najwięcej sensu?"],[["When a clear responsibility or reusable boundary emerges","Gdy pojawia się jasna odpowiedzialność lub reużywalna granica"],["Whenever a file reaches exactly 20 lines","Gdy plik ma dokładnie 20 linii"],["For every single span","Dla każdego span"],["Only for performance","Tylko dla wydajności"]],0,["Component boundaries should communicate responsibilities.","Granice komponentów powinny komunikować odpowiedzialności."]),
  ],
  "react-props-state": [
    q("react-state-extra-1","react-props",["How should a child treat props?","Jak dziecko powinno traktować propsy?"],[["As read-only inputs","Jako dane wejściowe tylko do odczytu"],["As mutable global state","Jako mutowalny globalny stan"],["As database rows","Jako rekordy bazy"],["As CSS tokens only","Wyłącznie jako tokeny CSS"]],0,["The parent owns the prop value.","Rodzic jest właścicielem wartości prop."]),
    q("react-state-extra-2","react-state",["When should you use a functional state update?","Kiedy używać funkcyjnej aktualizacji stanu?"],[["When the next value depends on the previous value","Gdy kolejna wartość zależy od poprzedniej"],["Only for strings","Tylko dla stringów"],["Whenever CSS changes","Gdy zmienia się CSS"],["Never","Nigdy"]],0,["Functional updaters receive the latest queued state value.","Funkcyjny updater otrzymuje najnowszą zaplanowaną wartość stanu."]),
    q("react-state-extra-3","react-state",["Should data fully derivable from props and state usually be stored as another state value?","Czy dane w pełni wyliczalne z propsów i stanu zwykle powinny być kolejnym stanem?"],[["No, derive them during render","Nie, wylicz je podczas renderu"],["Always yes","Zawsze tak"],["Only in context","Tylko w context"],["Only with TypeScript","Tylko z TypeScript"]],0,["Avoid duplicate sources of truth when a value can be calculated.","Unikaj duplikowania źródeł prawdy, gdy wartość można wyliczyć."]),
    q("react-state-extra-4","react-props",["What is a useful first question when state is shared?","Jakie jest dobre pierwsze pytanie, gdy stan jest współdzielony?"],[["Who should own this value?","Kto powinien być właścicielem tej wartości?"],["How can I make it global immediately?","Jak od razu zrobić go globalnym?"],["Which animation should I add?","Jaką animację dodać?"],["Can I copy it into every child?","Czy mogę skopiować go do każdego dziecka?"]],0,["Ownership determines the smallest useful state boundary.","Własność określa najmniejszą sensowną granicę stanu."]),
  ],
  "react-events": [
    q("react-event-extra-1","react-events",["What should onClick receive?","Co powinien otrzymać onClick?"],[["A function","Funkcję"],["The result of every function call","Wynik każdego wywołania funkcji"],["A CSS selector","Selektor CSS"],["A database connection","Połączenie z bazą"]],0,["React calls the handler when the interaction occurs.","React wywołuje handler, gdy nastąpi interakcja."]),
    q("react-event-extra-2","react-lists",["Why are stable keys important?","Dlaczego stabilne key są ważne?"],[["They preserve item identity across renders","Zachowują tożsamość elementów między renderami"],["They encrypt data","Szyfrują dane"],["They make API calls","Wykonują requesty API"],["They replace props","Zastępują propsy"]],0,["Keys help React match previous and next list items.","Key pomagają Reactowi dopasować poprzednie i kolejne elementy listy."]),
    q("react-event-extra-3","react-lists",["Why can Math.random() be a poor key?","Dlaczego Math.random() jest słabym key?"],[["It creates a new identity every render","Tworzy nową tożsamość w każdym renderze"],["It is too short","Jest za krótkie"],["React cannot render numbers","React nie potrafi renderować liczb"],["It disables events","Wyłącza zdarzenia"]],0,["Changing keys can force remounts and discard local state.","Zmieniające się key mogą wymuszać remount i utratę lokalnego stanu."]),
    q("react-event-extra-4","react-events",["Which element is normally best for a clickable action?","Który element jest zwykle najlepszy dla klikalnej akcji?"],[["button","button"],["div with only onClick","div tylko z onClick"],["span without keyboard support","span bez obsługi klawiatury"],["img without semantics","img bez semantyki"]],0,["Native buttons provide keyboard and accessibility behaviour by default.","Natywne przyciski zapewniają obsługę klawiatury i dostępność domyślnie."]),
  ],
};

export const modernQuizzes: Quiz[] = [...tsModules, ...reactModules]
  .filter((module) => module.access === "free")
  .map((module) => ({
    id: `checkpoint-${module.id}`,
    moduleId: module.id,
    questions: [
      ...modernLessons
        .filter((lesson) => lesson.moduleId === module.id)
        .flatMap((lesson) => [lesson.prediction, lesson.recall]),
      ...(modernQuizExtras[module.id] ?? []),
    ],
  }));

export const modernConceptNames = {
  "ts-types":T("Type annotations","Adnotacje typów"),
  "ts-inference":T("Type inference","Inferencja typów"),
  "ts-functions":T("Function contracts","Kontrakty funkcji"),
  "ts-optional":T("Optional values","Wartości opcjonalne"),
  "ts-objects":T("Object shapes","Kształty obiektów"),
  "ts-unions":T("Unions & narrowing","Unie i narrowing"),
  "react-components":T("Components","Komponenty"),
  "react-composition":T("Composition","Kompozycja"),
  "react-props":T("Props","Propsy"),
  "react-state":T("State","Stan"),
  "react-events":T("Events","Zdarzenia"),
  "react-lists":T("Lists & keys","Listy i key"),
};
