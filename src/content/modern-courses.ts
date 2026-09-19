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
): Question => ({
  id,
  concept,
  type: code ? "predictOutput" : "singleChoice",
  prompt: T(...prompt),
  options: options.map((text, index) => ({ id: String(index), text: T(...text) })),
  answer: String(answer),
  explanation: T(...explanation),
  code,
});

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
  minutes: 9,
  concept: s.concept,
  blocks: [
    {
      type: "text",
      heading: T("Build the mental model first.", "Najpierw zbuduj model w głowie."),
      body: T(...s.body),
    },
    { type: "code", code: s.code, caption: T("Read the contract, then the implementation.", "Najpierw przeczytaj kontrakt, potem implementację.") },
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
});

export const modernLessons: Lesson[] = [
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
    tests:[{label:["uses idle","używa idle"],expression:'__source.includes('"idle"')'},{label:["uses loading and done","używa loading i done"],expression:'__source.includes('"loading"') && __source.includes('"done"')'},{label:["uses union","używa unii"],expression:'__source.includes("|")'}],language:"typescript",fileName:"status.ts",
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

const m = (
  id:string,en:string,pl:string,descEn:string,descPl:string,
  access:"free"|"premium",lessonIds:string[]=[],minutes=40,
): CourseModule => ({
  id,title:T(en,pl),description:T(descEn,descPl),access,lessonIds,minutes,
});

const tsModules: CourseModule[] = [
  m("ts-foundations","Type system foundations","Podstawy systemu typów","Inference, primitive types, and the TypeScript mental model.","Inferencja, typy proste i model myślowy TypeScriptu.","free",["ts-why-types","ts-inference"],18),
  m("ts-functions","Functions as contracts","Funkcje jako kontrakty","Parameters, return types and optional inputs.","Parametry, typy zwracane i opcjonalne dane.","free",["ts-functions","ts-optional"],18),
  m("ts-objects","Objects, unions & narrowing","Obiekty, unie i narrowing","Model real domain data and valid states precisely.","Precyzyjnie modeluj dane domenowe i poprawne stany.","free",["ts-objects","ts-unions"],18),
  m("ts-generics","Generics","Generyki","Reusable types that preserve information without any.","Reużywalne typy zachowujące informację bez any.","premium"),
  m("ts-narrowing","Advanced narrowing","Zaawansowany narrowing","Type guards, discriminated unions, never and exhaustive checks.","Type guardy, unie dyskryminowane, never i pełne sprawdzanie.","premium"),
  m("ts-utility","Utility & mapped types","Utility i mapped types","keyof, indexed access, Pick, Omit and mapped types.","keyof, indexed access, Pick, Omit i mapped types.","premium"),
  m("ts-async","Typed async data","Typowane dane async","Promises, API responses, unknown data and safe parsing.","Promise, odpowiedzi API, unknown i bezpieczne parsowanie.","premium"),
  m("ts-dom","Browser & DOM typing","Typowanie DOM","Events, elements, nullability and browser APIs.","Zdarzenia, elementy, nullowalność i API przeglądarki.","premium"),
  m("ts-react","TypeScript with React","TypeScript z Reactem","Props, events, refs, children, hooks and generic components.","Propsy, zdarzenia, refy, children, hooki i generyczne komponenty.","premium"),
  m("ts-config","tsconfig strategy","Strategia tsconfig","Strictness, modules, targets, aliases and project references.","Strict mode, moduły, targety, aliasy i project references.","premium"),
  m("ts-architecture","Large-scale TypeScript","TypeScript w dużej aplikacji","Domain boundaries, public types and maintainable contracts.","Granice domeny, publiczne typy i utrzymywalne kontrakty.","premium"),
  m("ts-project","Final TypeScript project","Projekt końcowy TypeScript","Type a realistic application from API boundary to UI.","Otypuj realistyczną aplikację od API po UI.","premium",[],90),
];

const reactModules: CourseModule[] = [
  m("react-components","Components & JSX","Komponenty i JSX","Component model, JSX and composition.","Model komponentowy, JSX i kompozycja.","free",["react-components","react-composition"],18),
  m("react-props-state","Props & state","Propsy i stan","One-way data flow, state and data ownership.","Jednokierunkowy przepływ, stan i własność danych.","free",["react-props","react-state"],18),
  m("react-events","Events, lists & identity","Zdarzenia, listy i tożsamość","Handlers, list rendering, keys and predictable updates.","Handlery, listy, key i przewidywalne aktualizacje.","free",["react-events","react-lists"],18),
  m("react-hooks","Hooks deeply understood","Hooki bez magii","Rules of Hooks, refs, reducers and custom hooks.","Reguły Hooków, refy, reducery i custom hooki.","premium"),
  m("react-effects","Effects & synchronization","Effecty i synchronizacja","Dependencies, cleanup and synchronization with external systems.","Zależności, cleanup i synchronizacja z systemami zewnętrznymi.","premium"),
  m("react-forms","Forms & validation","Formularze i walidacja","Accessible forms, validation and robust submissions.","Dostępne formularze, walidacja i solidny submit.","premium"),
  m("react-context","Context & state design","Context i projektowanie stanu","State placement, context boundaries and reducers.","Umiejscowienie stanu, granice contextu i reducery.","premium"),
  m("react-data","Server data & async UI","Dane serwerowe i async UI","Loading, error, optimistic states and caching.","Loading, error, optimistic UI i cache.","premium"),
  m("react-routing","Routing & application structure","Routing i struktura aplikacji","Routes, layouts, URL state and scalable features.","Trasy, layouty, stan w URL i skalowalne funkcje.","premium"),
  m("react-performance","Performance that matters","Wydajność, która ma znaczenie","Rendering, memoization, code splitting and Web Vitals.","Renderowanie, memoizacja, code splitting i Web Vitals.","premium"),
  m("react-testing","Testing React behavior","Testowanie zachowania Reacta","RTL, integration boundaries and E2E confidence.","RTL, granice integracji i E2E.","premium"),
  m("react-project","Final React project","Projekt końcowy React","Build a production-style interface with a11y, data and tests.","Zbuduj produkcyjny interfejs z a11y, danymi i testami.","premium",[],90),
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

export const modernQuizzes: Quiz[] = [...tsModules, ...reactModules]
  .filter((module) => module.access === "free")
  .map((module) => ({
    id: `checkpoint-${module.id}`,
    moduleId: module.id,
    questions: modernLessons
      .filter((lesson) => lesson.moduleId === module.id)
      .flatMap((lesson) => [lesson.prediction, lesson.recall]),
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
