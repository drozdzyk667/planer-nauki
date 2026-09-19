import { T, type Exercise, type Localized } from "@/domain/models";

export type CodingCourse = "javascript" | "typescript" | "react";
export type CodingDifficulty = "easy" | "medium" | "hard";

export type GeneratedCodingChallenge = {
  id: string;
  templateId: string;
  title: Localized;
  description: Localized;
  concept: Localized;
  difficulty: CodingDifficulty;
  variantNote: Localized;
  exercise: Exercise;
};

type Rng = () => number;
type Factory = (rng: Rng, seed: number) => GeneratedCodingChallenge;

function hash(input: string) {
  let value = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function rngFor(input: string): Rng {
  let state = hash(input) || 1;
  return () => {
    state += 0x6d2b79f5;
    let next = state;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: Rng, values: readonly T[]) {
  return values[Math.floor(rng() * values.length)];
}

function int(rng: Rng, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function rx(pattern: string) {
  return `new RegExp(${JSON.stringify(pattern)}).test(__source)`;
}

const jsFactories: Factory[] = [
  (rng, seed) => {
    const fn = pick(rng, ["calculateTotal", "orderTotal", "basketValue", "computeCost"]);
    const price = pick(rng, ["price", "unitPrice", "cost"]);
    const quantity = pick(rng, ["quantity", "qty", "units"]);
    const cases = Array.from({ length: 3 }, () => {
      const a = int(rng, 3, 24);
      const b = int(rng, 2, 8);
      return [a, b, a * b] as const;
    });
    return {
      id: `js-total-${seed}`,
      templateId: "js-total",
      title: T("Calculate an order total", "Policz wartość zamówienia"),
      description: T(
        `Implement ${fn} so it returns unit price multiplied by quantity.`,
        `Zaimplementuj ${fn}, aby zwracała cenę jednostkową pomnożoną przez ilość.`,
      ),
      concept: T("Functions · parameters · return", "Funkcje · parametry · return"),
      difficulty: "easy",
      variantNote: T(
        "Function name, parameter names and hidden test values are generated from the seed.",
        "Nazwa funkcji, parametry i ukryte wartości testowe są generowane z seeda.",
      ),
      exercise: {
        task: T(
          `Complete ${fn}(${price}, ${quantity}). Do not hard-code the examples.`,
          `Uzupełnij ${fn}(${price}, ${quantity}). Nie wpisuj wyników testów na sztywno.`,
        ),
        starter: `function ${fn}(${price}, ${quantity}) {\n  // TODO\n}\n`,
        hint: T(
          `Return ${price} * ${quantity}.`,
          `Zwróć ${price} * ${quantity}.`,
        ),
        language: "javascript",
        fileName: "challenge.js",
        tests: cases.map(([a, b, expected]) => ({
          label: T(
            `${fn}(${a}, ${b}) returns ${expected}`,
            `${fn}(${a}, ${b}) zwraca ${expected}`,
          ),
          expression: `${fn}(${a}, ${b}) === ${expected}`,
        })),
      },
    };
  },
  (rng, seed) => {
    const fn = pick(rng, ["countAbove", "countGreaterThan", "countPassing", "itemsAbove"]);
    const list = pick(rng, ["numbers", "values", "scores"]);
    const limit = pick(rng, ["limit", "threshold", "minimum"]);
    const cases = Array.from({ length: 3 }, () => {
      const threshold = int(rng, 3, 10);
      const values = Array.from({ length: 6 }, () => int(rng, 1, 15));
      const expected = values.filter((value) => value > threshold).length;
      return { threshold, values, expected };
    });
    return {
      id: `js-count-${seed}`,
      templateId: "js-count-above",
      title: T("Count values above a limit", "Policz wartości powyżej limitu"),
      description: T(
        "Write a function that counts how many numbers are greater than the supplied limit.",
        "Napisz funkcję liczącą, ile liczb jest większych od podanego limitu.",
      ),
      concept: T("Arrays · iteration · conditions", "Tablice · iteracja · warunki"),
      difficulty: "medium",
      variantNote: T(
        "The identifiers, thresholds and arrays change between variants.",
        "Identyfikatory, progi i tablice zmieniają się pomiędzy wariantami.",
      ),
      exercise: {
        task: T(
          `Implement ${fn}(${list}, ${limit}) and return a number.`,
          `Zaimplementuj ${fn}(${list}, ${limit}) i zwróć liczbę.`,
        ),
        starter: `function ${fn}(${list}, ${limit}) {\n  // TODO\n}\n`,
        hint: T(
          "filter(...).length is one option, but a loop works too.",
          "Jedną z opcji jest filter(...).length, ale zwykła pętla też jest poprawna.",
        ),
        language: "javascript",
        fileName: "challenge.js",
        tests: cases.map(({ threshold, values, expected }) => ({
          label: T(
            `Counts ${expected} values above ${threshold}`,
            `Liczy ${expected} wartości powyżej ${threshold}`,
          ),
          expression: `${fn}(${JSON.stringify(values)}, ${threshold}) === ${expected}`,
        })),
      },
    };
  },
  (rng, seed) => {
    const fn = pick(rng, ["fullName", "formatPerson", "userLabel", "displayName"]);
    const first = pick(rng, ["firstName", "givenName", "name"]);
    const last = pick(rng, ["lastName", "surname", "familyName"]);
    const cases = [
      ["Ada", "Lovelace"],
      ["Alan", "Turing"],
      ["Grace", "Hopper"],
    ].sort(() => rng() - 0.5);
    return {
      id: `js-name-${seed}`,
      templateId: "js-full-name",
      title: T("Build a readable label", "Zbuduj czytelną etykietę"),
      description: T(
        "Combine two arguments into one full name with exactly one space.",
        "Połącz dwa argumenty w pełne imię i nazwisko z dokładnie jedną spacją.",
      ),
      concept: T("Strings · functions", "Stringi · funkcje"),
      difficulty: "easy",
      variantNote: T(
        "Function and parameter names change while tests use different people.",
        "Zmieniają się nazwy funkcji i parametrów, a testy używają różnych osób.",
      ),
      exercise: {
        task: T(
          `Make ${fn}(${first}, ${last}) return "First Last".`,
          `Spraw, aby ${fn}(${first}, ${last}) zwracała "Imię Nazwisko".`,
        ),
        starter: `function ${fn}(${first}, ${last}) {\n  // TODO\n}\n`,
        hint: T(
          "A template literal is the shortest readable solution.",
          "Template literal jest najkrótszym czytelnym rozwiązaniem.",
        ),
        language: "javascript",
        fileName: "challenge.js",
        tests: cases.map(([a, b]) => ({
          label: T(`Formats ${a} ${b}`, `Formatuje ${a} ${b}`),
          expression: `${fn}(${JSON.stringify(a)}, ${JSON.stringify(b)}) === ${JSON.stringify(`${a} ${b}`)}`,
        })),
      },
    };
  },
  (rng, seed) => {
    const fn = pick(rng, ["sumPositive", "positiveTotal", "addPositive", "sumValid"]);
    const list = pick(rng, ["numbers", "values", "items"]);
    const cases = Array.from({ length: 3 }, () => {
      const values = Array.from({ length: 7 }, () => int(rng, -8, 12));
      const expected = values.filter((value) => value > 0).reduce((a, b) => a + b, 0);
      return { values, expected };
    });
    return {
      id: `js-positive-${seed}`,
      templateId: "js-sum-positive",
      title: T("Sum only positive values", "Zsumuj tylko dodatnie wartości"),
      description: T(
        "Ignore zero and negative numbers and return the total of positive values.",
        "Pomiń zero i liczby ujemne, a zwróć sumę wartości dodatnich.",
      ),
      concept: T("Arrays · reduce/filter · edge cases", "Tablice · reduce/filter · przypadki brzegowe"),
      difficulty: "medium",
      variantNote: T(
        "Every variant receives different arrays and identifier names.",
        "Każdy wariant dostaje inne tablice i nazwy identyfikatorów.",
      ),
      exercise: {
        task: T(
          `Implement ${fn}(${list}). Empty or all-negative input should return 0.`,
          `Zaimplementuj ${fn}(${list}). Pusta lub całkowicie ujemna tablica powinna zwrócić 0.`,
        ),
        starter: `function ${fn}(${list}) {\n  // TODO\n}\n`,
        hint: T(
          "Filter positive values first or conditionally add them in reduce.",
          "Najpierw odfiltruj dodatnie wartości albo dodawaj je warunkowo w reduce.",
        ),
        language: "javascript",
        fileName: "challenge.js",
        tests: [
          ...cases.map(({ values, expected }) => ({
            label: T(`Returns ${expected}`, `Zwraca ${expected}`),
            expression: `${fn}(${JSON.stringify(values)}) === ${expected}`,
          })),
          {
            label: T("Handles an empty array", "Obsługuje pustą tablicę"),
            expression: `${fn}([]) === 0`,
          },
        ],
      },
    };
  },
];

const tsFactories: Factory[] = [
  (rng, seed) => {
    const typeName = pick(rng, ["ProductCard", "CourseItem", "UserPreview", "OrderRow"]);
    const textField = pick(rng, ["title", "label", "name"]);
    const numberField = pick(rng, ["price", "score", "amount"]);
    const boolField = pick(rng, ["active", "available", "featured"]);
    return {
      id: `ts-shape-${seed}`,
      templateId: "ts-object-shape",
      title: T("Model an object precisely", "Otypowuj obiekt precyzyjnie"),
      description: T(
        `Complete ${typeName} with the generated field contract.`,
        `Uzupełnij ${typeName} zgodnie z wygenerowanym kontraktem pól.`,
      ),
      concept: T("Object types · primitives", "Typy obiektowe · prymitywy"),
      difficulty: "easy",
      variantNote: T(
        "The type name and property names are generated per variant.",
        "Nazwa typu i właściwości są generowane dla każdego wariantu.",
      ),
      exercise: {
        task: T(
          `Add ${textField}: string, ${numberField}: number and ${boolField}: boolean.`,
          `Dodaj ${textField}: string, ${numberField}: number oraz ${boolField}: boolean.`,
        ),
        starter: `type ${typeName} = {\n  // TODO\n};\n`,
        hint: T(
          "Write one property per line using propertyName: type.",
          "Zapisz po jednej właściwości w linii w formacie nazwaPola: typ.",
        ),
        mode: "source",
        language: "typescript",
        fileName: "challenge.ts",
        tests: [
          { label: T(`${textField} is string`, `${textField} ma typ string`), expression: rx(`\\b${textField}\\s*:\\s*string\\b`) },
          { label: T(`${numberField} is number`, `${numberField} ma typ number`), expression: rx(`\\b${numberField}\\s*:\\s*number\\b`) },
          { label: T(`${boolField} is boolean`, `${boolField} ma typ boolean`), expression: rx(`\\b${boolField}\\s*:\\s*boolean\\b`) },
        ],
      },
    };
  },
  (rng, seed) => {
    const fn = pick(rng, ["addScore", "calculatePoints", "sumAmounts", "mergeCounts"]);
    const left = pick(rng, ["points", "base", "amount"]);
    const right = pick(rng, ["bonus", "extra", "delta"]);
    return {
      id: `ts-function-${seed}`,
      templateId: "ts-typed-function",
      title: T("Type a function boundary", "Otypowuj granicę funkcji"),
      description: T(
        "Add parameter and return types without changing the function behaviour.",
        "Dodaj typy parametrów i wyniku bez zmiany działania funkcji.",
      ),
      concept: T("Function types · return types", "Typy funkcji · typ wyniku"),
      difficulty: "easy",
      variantNote: T(
        "Function and parameter identifiers change between generated variants.",
        "Nazwy funkcji i parametrów zmieniają się pomiędzy wariantami.",
      ),
      exercise: {
        task: T(
          `Make both parameters and the return value of ${fn} explicitly number.`,
          `Nadaj obu parametrom i wynikowi ${fn} jawny typ number.`,
        ),
        starter: `function ${fn}(${left}, ${right}) {\n  return ${left} + ${right};\n}\n`,
        hint: T(
          "Annotate each parameter after its name and add : number after the closing parenthesis.",
          "Dodaj typ po nazwie każdego parametru oraz : number po zamknięciu nawiasu.",
        ),
        mode: "source",
        language: "typescript",
        fileName: "challenge.ts",
        tests: [
          { label: T(`${left} is typed`, `${left} ma typ`), expression: rx(`\\b${left}\\s*:\\s*number\\b`) },
          { label: T(`${right} is typed`, `${right} ma typ`), expression: rx(`\\b${right}\\s*:\\s*number\\b`) },
          { label: T("Return type is number", "Wynik ma typ number"), expression: rx(`function\\s+${fn}\\s*\\([^)]*\\)\\s*:\\s*number`) },
        ],
      },
    };
  },
  (rng, seed) => {
    const typeName = pick(rng, ["RequestStatus", "LoadState", "SaveStatus", "FetchPhase"]);
    const values = pick(rng, [
      ["idle", "loading", "success", "error"],
      ["ready", "pending", "done", "failed"],
      ["initial", "working", "complete", "failed"],
    ]);
    return {
      id: `ts-union-${seed}`,
      templateId: "ts-literal-union",
      title: T("Create a finite state union", "Utwórz skończoną unię stanów"),
      description: T(
        "Represent only the allowed states instead of accepting every string.",
        "Reprezentuj wyłącznie dozwolone stany zamiast akceptować dowolny string.",
      ),
      concept: T("Literal unions · domain modelling", "Unie literałów · modelowanie domeny"),
      difficulty: "medium",
      variantNote: T(
        "The type and allowed state values are selected from generated variants.",
        "Nazwa typu i dozwolone stany są wybierane z generowanych wariantów.",
      ),
      exercise: {
        task: T(
          `Define ${typeName} as a union of: ${values.join(", ")}.`,
          `Zdefiniuj ${typeName} jako unię: ${values.join(", ")}.`,
        ),
        starter: `type ${typeName} = string; // TODO: make this precise\n`,
        hint: T(
          'Use string literals joined with |, for example "one" | "two".',
          'Użyj literałów string połączonych |, np. "one" | "two".',
        ),
        mode: "source",
        language: "typescript",
        fileName: "challenge.ts",
        tests: values.map((value) => ({
          label: T(`Includes "${value}"`, `Zawiera "${value}"`),
          expression: `__source.includes(${JSON.stringify(`"${value}"`)}) || __source.includes(${JSON.stringify(`'${value}'`)})`,
        })),
      },
    };
  },
  (rng, seed) => {
    const fn = pick(rng, ["firstItem", "takeFirst", "head", "firstValue"]);
    const list = pick(rng, ["items", "values", "entries"]);
    return {
      id: `ts-generic-${seed}`,
      templateId: "ts-generic-first",
      title: T("Preserve a type with a generic", "Zachowaj typ przez generyk"),
      description: T(
        "Make the helper work for arrays of any element type without falling back to any.",
        "Spraw, aby helper działał dla tablic dowolnego typu elementu bez uciekania do any.",
      ),
      concept: T("Generics · relationships between types", "Generyki · relacje między typami"),
      difficulty: "hard",
      variantNote: T(
        "The helper identifiers change while the generic contract stays the same.",
        "Identyfikatory helpera zmieniają się, a kontrakt generyczny pozostaje ten sam.",
      ),
      exercise: {
        task: T(
          `Turn ${fn} into a generic function returning T | undefined.`,
          `Zmień ${fn} w funkcję generyczną zwracającą T | undefined.`,
        ),
        starter: `function ${fn}(${list}: unknown[]) {\n  return ${list}[0];\n}\n`,
        hint: T(
          `Add <T>, change ${list} to T[] and annotate the return type.`,
          `Dodaj <T>, zmień ${list} na T[] i opisz typ wyniku.`,
        ),
        mode: "source",
        language: "typescript",
        fileName: "challenge.ts",
        tests: [
          { label: T("Declares generic T", "Deklaruje generyk T"), expression: rx(`function\\s+${fn}\\s*<\\s*T\\s*>`) },
          { label: T(`${list} is T[]`, `${list} ma typ T[]`), expression: rx(`\\b${list}\\s*:\\s*T\\s*\\[\\s*\\]`) },
          { label: T("Returns T | undefined", "Zwraca T | undefined"), expression: rx(`:\\s*T\\s*\\|\\s*undefined`) },
        ],
      },
    };
  },
];

const reactFactories: Factory[] = [
  (rng, seed) => {
    const component = pick(rng, ["WelcomeCard", "UserGreeting", "ProfileTitle", "HelloPanel"]);
    const prop = pick(rng, ["name", "userName", "displayName"]);
    const propsType = `${component}Props`;
    return {
      id: `react-props-${seed}`,
      templateId: "react-props",
      title: T("Build a typed prop component", "Zbuduj komponent z typowanym propsem"),
      description: T(
        "Define a string prop and render it inside the component.",
        "Zdefiniuj prop typu string i wyrenderuj go w komponencie.",
      ),
      concept: T("Components · props · TypeScript", "Komponenty · propsy · TypeScript"),
      difficulty: "easy",
      variantNote: T(
        "Component, props type and prop identifiers are generated.",
        "Nazwa komponentu, typu propsów i propa są generowane.",
      ),
      exercise: {
        task: T(
          `Complete ${propsType} with ${prop}: string and render {${prop}} in ${component}.`,
          `Uzupełnij ${propsType} o ${prop}: string i wyrenderuj {${prop}} w ${component}.`,
        ),
        starter: `type ${propsType} = {\n  // TODO\n};\n\nfunction ${component}({ ${prop} }: ${propsType}) {\n  return <h2>{/* TODO */}</h2>;\n}\n`,
        hint: T(
          `Add ${prop}: string to the props type and place {${prop}} inside h2.`,
          `Dodaj ${prop}: string do typu propsów i umieść {${prop}} wewnątrz h2.`,
        ),
        mode: "source",
        language: "tsx",
        fileName: "challenge.tsx",
        tests: [
          { label: T("Prop is string", "Prop ma typ string"), expression: rx(`\\b${prop}\\s*:\\s*string\\b`) },
          { label: T("Component uses props type", "Komponent używa typu propsów"), expression: `__source.includes(${JSON.stringify(`: ${propsType}`)})` },
          { label: T("Prop is rendered", "Prop jest renderowany"), expression: rx(`\\{\\s*${prop}\\s*\\}`) },
        ],
      },
    };
  },
  (rng, seed) => {
    const component = pick(rng, ["Counter", "ClickCounter", "ScoreCounter", "StepCounter"]);
    const value = pick(rng, ["count", "score", "value"]);
    const setter = `set${value[0].toUpperCase()}${value.slice(1)}`;
    const start = int(rng, 0, 5);
    return {
      id: `react-state-${seed}`,
      templateId: "react-state-counter",
      title: T("Wire a state update", "Podłącz aktualizację stanu"),
      description: T(
        "Use useState and increment the generated state value on button click.",
        "Użyj useState i zwiększ wygenerowaną wartość stanu po kliknięciu przycisku.",
      ),
      concept: T("useState · events", "useState · zdarzenia"),
      difficulty: "medium",
      variantNote: T(
        "Component name, state variable and initial value change by seed.",
        "Nazwa komponentu, zmienna stanu i wartość początkowa zmieniają się zależnie od seeda.",
      ),
      exercise: {
        task: T(
          `Create [${value}, ${setter}] with useState(${start}) and increment it from the button.`,
          `Utwórz [${value}, ${setter}] przez useState(${start}) i zwiększaj wartość z przycisku.`,
        ),
        starter: `function ${component}() {\n  // TODO\n  return <button>Increase</button>;\n}\n`,
        hint: T(
          `const [${value}, ${setter}] = useState(${start}); then use onClick.`,
          `const [${value}, ${setter}] = useState(${start}); następnie użyj onClick.`,
        ),
        mode: "source",
        language: "tsx",
        fileName: "challenge.tsx",
        tests: [
          { label: T("Creates state", "Tworzy stan"), expression: rx(`\\[${value}\\s*,\\s*${setter}\\]\\s*=\\s*useState\\(${start}\\)`) },
          { label: T("Adds an onClick handler", "Dodaje handler onClick"), expression: rx(`onClick\\s*=\\s*\\{`) },
          { label: T("Updates state", "Aktualizuje stan"), expression: `__source.includes(${JSON.stringify(setter)}) && (__source.includes("+ 1") || __source.includes("+1"))` },
        ],
      },
    };
  },
  (rng, seed) => {
    const component = pick(rng, ["UserList", "CourseList", "ResultList", "TaskList"]);
    const list = pick(rng, ["items", "users", "rows"]);
    return {
      id: `react-list-${seed}`,
      templateId: "react-list",
      title: T("Render a list with stable keys", "Wyrenderuj listę ze stabilnymi key"),
      description: T(
        "Map over an array and give every rendered element a stable key from the data.",
        "Przejdź map po tablicy i nadaj każdemu elementowi stabilny key pochodzący z danych.",
      ),
      concept: T("Lists · map · keys", "Listy · map · key"),
      difficulty: "medium",
      variantNote: T(
        "Component and collection names are generated for each variant.",
        "Nazwa komponentu i kolekcji są generowane dla każdego wariantu.",
      ),
      exercise: {
        task: T(
          `Render ${list} with .map(...) and key={item.id}.`,
          `Wyrenderuj ${list} przez .map(...) i key={item.id}.`,
        ),
        starter: `type Item = { id: string; label: string };\n\nfunction ${component}({ ${list} }: { ${list}: Item[] }) {\n  return <ul>{/* TODO */}</ul>;\n}\n`,
        hint: T(
          `Use {${list}.map((item) => <li key={item.id}>{item.label}</li>)}.`,
          `Użyj {${list}.map((item) => <li key={item.id}>{item.label}</li>)}.`,
        ),
        mode: "source",
        language: "tsx",
        fileName: "challenge.tsx",
        tests: [
          { label: T("Maps the collection", "Mapuje kolekcję"), expression: rx(`${list}\\s*\\.\\s*map\\s*\\(`) },
          { label: T("Uses item.id as key", "Używa item.id jako key"), expression: rx(`key\\s*=\\s*\\{\\s*item\\.id\\s*\\}`) },
          { label: T("Renders item.label", "Renderuje item.label"), expression: rx(`\\{\\s*item\\.label\\s*\\}`) },
        ],
      },
    };
  },
  (rng, seed) => {
    const component = pick(rng, ["ResultsPanel", "DataView", "SearchResults", "DashboardBody"]);
    const loading = pick(rng, ["loading", "isLoading", "pending"]);
    return {
      id: `react-conditional-${seed}`,
      templateId: "react-conditional",
      title: T("Handle a loading UI state", "Obsłuż stan ładowania UI"),
      description: T(
        "Use an early return for loading and keep the normal path easy to read.",
        "Użyj early return dla ładowania i utrzymaj normalną ścieżkę czytelną.",
      ),
      concept: T("Conditional rendering · early returns", "Renderowanie warunkowe · early return"),
      difficulty: "easy",
      variantNote: T(
        "The component and loading prop identifiers vary with the seed.",
        "Nazwa komponentu i propa loading zmieniają się wraz z seedem.",
      ),
      exercise: {
        task: T(
          `When ${loading} is true return <p>Loading...</p>; otherwise return <main>Ready</main>.`,
          `Gdy ${loading} jest true zwróć <p>Loading...</p>; w przeciwnym razie <main>Ready</main>.`,
        ),
        starter: `function ${component}({ ${loading} }: { ${loading}: boolean }) {\n  // TODO\n}\n`,
        hint: T(
          `Start with if (${loading}) return <p>Loading...</p>.`,
          `Zacznij od if (${loading}) return <p>Loading...</p>.`,
        ),
        mode: "source",
        language: "tsx",
        fileName: "challenge.tsx",
        tests: [
          { label: T("Checks loading state", "Sprawdza stan ładowania"), expression: rx(`if\\s*\\(\\s*${loading}\\s*\\)`) },
          { label: T("Renders loading UI", "Renderuje loading UI"), expression: `__source.includes("Loading...")` },
          { label: T("Renders ready UI", "Renderuje gotowy UI"), expression: `__source.includes("Ready")` },
        ],
      },
    };
  },
];

const factories: Record<CodingCourse, Factory[]> = {
  javascript: jsFactories,
  typescript: tsFactories,
  react: reactFactories,
};

export function codingChallengeCount(course: CodingCourse) {
  return factories[course].length;
}

export function generateCodingChallenge(
  course: CodingCourse,
  templateIndex: number,
  seed: number,
) {
  const list = factories[course];
  const normalized = ((templateIndex % list.length) + list.length) % list.length;
  const rng = rngFor(`${course}:${normalized}:${seed}`);
  return list[normalized](rng, seed);
}
