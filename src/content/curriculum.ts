import {
  T,
  type Lesson,
  type Question,
  type Course,
  type Quiz,
  type CourseModule,
} from "@/domain/models";
const question = (
  id: string,
  concept: string,
  prompt: ReturnType<typeof T>,
  options: ReturnType<typeof T>[],
  answer: number,
  explanation: ReturnType<typeof T>,
  code?: string,
): Question => ({
  id,
  concept,
  type: code ? "predictOutput" : "singleChoice",
  prompt,
  options: options.map((text, i) => ({ id: String(i), text })),
  answer: String(answer),
  explanation,
  code,
});

export const lessons: Lesson[] = [
  {
    id: "first-program",
    courseId: "javascript",
    moduleId: "introduction",
    title: T("Your first small program", "Twój pierwszy mały program"),
    subtitle: T(
      "A few instructions. A visible result.",
      "Kilka instrukcji. Widoczny rezultat.",
    ),
    minutes: 5,
    concept: "execution",
    blocks: [
      {
        type: "text",
        heading: T(
          "Code is a sequence of instructions.",
          "Kod to sekwencja instrukcji.",
        ),
        body: T(
          "JavaScript can make websites respond to you. Start with console.log(): it displays a value in the console. In these examples, instructions run from top to bottom.",
          "JavaScript sprawia, że strony reagują na Twoje działania. Zacznij od console.log(): wyświetla wartość w konsoli. W tych przykładach instrukcje wykonują się od góry do dołu.",
        ),
      },
      {
        type: "code",
        code: 'console.log("Hello!");\nconsole.log(2 + 3);',
        caption: T(
          "Text uses quotes. Arithmetic does not.",
          "Tekst zapisujemy w cudzysłowie. Działań matematycznych nie.",
        ),
      },
      {
        type: "visual",
        kind: "execution",
        caption: T(
          "Step through the program and watch each output appear.",
          "Przejdź przez program i zobacz wynik każdej instrukcji.",
        ),
      },
      {
        type: "tip",
        body: T(
          "A comment starts with // and explains the code to people. JavaScript ignores it.",
          "Komentarz zaczyna się od // i wyjaśnia kod ludziom. JavaScript go ignoruje.",
        ),
      },
    ],
    prediction: question(
      "intro-predict",
      "execution",
      T("What appears first?", "Co pojawi się jako pierwsze?"),
      [
        T("Hello!", "Hello!"),
        T("5", "5"),
        T("Both at once", "Oba wyniki jednocześnie"),
      ],
      0,
      T(
        "The first console.log runs before the second one. The output is Hello!, then 5.",
        "Pierwsze console.log wykonuje się przed drugim. Najpierw zobaczysz Hello!, potem 5.",
      ),
      'console.log("Hello!");\nconsole.log(2 + 3);',
    ),
    exercise: {
      task: T(
        'Create a constant named greeting with the value "Hello!", then print greeting with console.log.',
        'Utwórz stałą greeting o wartości "Hello!", a potem wyświetl greeting za pomocą console.log.',
      ),
      starter: 'const greeting = "";\nconsole.log(greeting);',
      hint: T(
        "Put Hello! between the quotes. const gives the value a name.",
        "Wpisz Hello! między cudzysłowami. const nadaje wartości nazwę.",
      ),
      tests: [
        {
          label: T('greeting is "Hello!"', 'greeting ma wartość "Hello!"'),
          expression:
            'typeof greeting !== "undefined" && greeting === "Hello!"',
        },
        {
          label: T("The console contains Hello!", "Konsola zawiera Hello!"),
          expression: '__logs.includes("Hello!")',
        },
      ],
    },
    recall: question(
      "intro-recall",
      "execution",
      T("Which line prints the number 8?", "Która linia wyświetli liczbę 8?"),
      [
        T("console.log(3 + 5);", "console.log(3 + 5);"),
        T("// console.log(8);", "// console.log(8);"),
        T('console.log("3 + 5");', 'console.log("3 + 5");'),
      ],
      0,
      T(
        "3 + 5 is evaluated to 8. A comment does not run, and quoted text is printed literally.",
        "3 + 5 daje wynik 8. Komentarz się nie wykonuje, a tekst w cudzysłowie jest wyświetlany dosłownie.",
      ),
    ),
  },
  {
    id: "variables",
    courseId: "javascript",
    moduleId: "variables-types",
    title: T("Give your data a name", "Nadaj swoim danym nazwę"),
    subtitle: T(
      "Meet let. Make your first variable.",
      "Poznaj let. Utwórz swoją pierwszą zmienną.",
    ),
    minutes: 6,
    concept: "variables",
    blocks: [
      {
        type: "text",
        heading: T(
          "A name you can come back to.",
          "Nazwa, do której możesz wrócić.",
        ),
        body: T(
          "A variable connects a name to a value. Use let when that value will change. Here, score starts at 10. Assigning 20 replaces its current value; it does not add to it.",
          "Zmienna łączy nazwę z wartością. Użyj let, gdy wartość będzie się zmieniać. Tutaj score zaczyna od 10. Przypisanie 20 zastępuje obecną wartość — nie dodaje do niej 20.",
        ),
      },
      {
        type: "code",
        code: "let score = 10;\nscore = 20;\nconsole.log(score); // 20",
        caption: T(
          "Declare once. Reassign using the name.",
          "Zadeklaruj raz. Przypisuj ponownie, używając nazwy.",
        ),
      },
      {
        type: "visual",
        kind: "variable",
        caption: T(
          "A label and a value: press Step to see the assignment happen.",
          "Etykieta i wartość: kliknij Krok, aby zobaczyć przypisanie.",
        ),
      },
      {
        type: "tip",
        body: T(
          "The = symbol assigns a value. It is not a question about equality. Variable names are case-sensitive: score and Score are different.",
          "Symbol = przypisuje wartość. Nie sprawdza równości. Wielkość liter ma znaczenie: score i Score to różne nazwy.",
        ),
      },
    ],
    prediction: question(
      "variables-predict",
      "variables",
      T("What will the console show?", "Co pokaże konsola?"),
      [T("10", "10"), T("20", "20"), T("30", "30")],
      1,
      T(
        "score was reassigned to 20. The old value 10 is replaced, not added.",
        "Do score ponownie przypisano 20. Poprzednia wartość 10 jest zastępowana, a nie dodawana.",
      ),
      "let score = 10;\nscore = 20;\nconsole.log(score);",
    ),
    exercise: {
      task: T(
        "Start score at 10. On the next line, reassign it to 20. Print score to check your work.",
        "Ustaw score na 10. W następnej linii przypisz mu 20. Wyświetl score, aby sprawdzić wynik.",
      ),
      starter: "let score = 10;\n// ...\nconsole.log(score);",
      hint: T(
        "Add score = 20; on the second line. Do not declare score with let again.",
        "W drugiej linii dodaj score = 20;. Nie deklaruj score ponownie za pomocą let.",
      ),
      tests: [
        {
          label: T("score ends at 20", "Końcowa wartość score to 20"),
          expression: 'typeof score !== "undefined" && score === 20',
        },
        {
          label: T("The console prints 20", "Konsola wyświetla 20"),
          expression: '__logs.includes("20")',
        },
      ],
    },
    recall: question(
      "variables-recall",
      "variables",
      T(
        "You already declared let lives = 3. How do you change it to 2?",
        "Masz już let lives = 3. Jak zmienisz wartość na 2?",
      ),
      [
        T("let lives = 2;", "let lives = 2;"),
        T("lives = 2;", "lives = 2;"),
        T("lives == 2;", "lives == 2;"),
      ],
      1,
      T(
        "Use the existing name with =. Declaring the same let twice in the same scope causes an error.",
        "Użyj istniejącej nazwy i =. Powtórna deklaracja tego samego let w tym samym zakresie powoduje błąd.",
      ),
    ),
  },
  {
    id: "constants",
    courseId: "javascript",
    moduleId: "variables-types",
    title: T("Some names stay the same", "Niektóre przypisania są stałe"),
    subtitle: T("Choose const with intention.", "Świadomie wybieraj const."),
    minutes: 5,
    concept: "constants",
    blocks: [
      {
        type: "text",
        heading: T(
          "Default to const. Reach for let when needed.",
          "Zacznij od const. Sięgaj po let, gdy trzeba.",
        ),
        body: T(
          "A const declaration must have an initial value. It prevents reassignment of that binding. Choose const for a value you do not plan to replace; choose let for a changing score or counter.",
          "Deklaracja const wymaga wartości początkowej. Blokuje ponowne przypisanie do tej nazwy. Wybierz const, gdy nie planujesz zastępować wartości, a let dla zmiennego wyniku lub licznika.",
        ),
      },
      {
        type: "code",
        code: 'const course = "JavaScript";\n// course = "Python"; → TypeError\nlet lessonsDone = 0;\nlessonsDone = 1;',
        caption: T(
          "The commented line would throw an error if executed.",
          "Linia w komentarzu spowodowałaby błąd po wykonaniu.",
        ),
      },
      {
        type: "visual",
        kind: "constant",
        caption: T(
          "Try changing a constant. The binding stays locked.",
          "Spróbuj zmienić stałą. Przypisanie pozostanie zablokowane.",
        ),
      },
      {
        type: "tip",
        body: T(
          "const does not make objects deeply immutable. Their properties can still change. You will explore this in the Objects module.",
          "const nie sprawia, że obiekt jest całkowicie niezmienny. Jego właściwości nadal mogą się zmieniać. Poznasz to w module Obiekty.",
        ),
      },
    ],
    prediction: question(
      "const-predict",
      "constants",
      T("What happens on line 2?", "Co wydarzy się w drugiej linii?"),
      [
        T('name becomes "Ada"', 'name zmienia się na "Ada"'),
        T("A TypeError is thrown", "Pojawi się TypeError"),
        T("The code prints both names", "Kod wyświetli obie nazwy"),
      ],
      1,
      T(
        "A const binding cannot be reassigned. JavaScript throws a TypeError.",
        "Do nazwy zadeklarowanej przez const nie można ponownie przypisać wartości. JavaScript zgłasza TypeError.",
      ),
      'const name = "Lin";\nname = "Ada";',
    ),
    exercise: {
      task: T(
        'Create const language = "JavaScript" and let completed = 0. Then change completed to 1.',
        'Utwórz const language = "JavaScript" i let completed = 0. Następnie zmień completed na 1.',
      ),
      starter:
        'const language = "";\nlet completed = 0;\n// ...\nconsole.log(language, completed);',
      hint: T(
        'Fill in "JavaScript", then add completed = 1; after the declaration.',
        'Wpisz "JavaScript", a po deklaracji dodaj completed = 1;.',
      ),
      tests: [
        {
          label: T("language is JavaScript", "language ma wartość JavaScript"),
          expression: 'language === "JavaScript"',
        },
        {
          label: T("completed is 1", "completed ma wartość 1"),
          expression: "completed === 1",
        },
      ],
    },
    recall: question(
      "const-recall",
      "constants",
      T(
        "Which declaration needs a value immediately?",
        "Która deklaracja od razu wymaga wartości?",
      ),
      [T("let", "let"), T("const", "const"), T("Neither", "Żadna")],
      1,
      T(
        "const must be initialized when declared. let can be declared without an initial value and then holds undefined.",
        "const musi mieć wartość podczas deklaracji. let bez wartości początkowej ma wartość undefined.",
      ),
    ),
  },
  {
    id: "types",
    courseId: "javascript",
    moduleId: "variables-types",
    title: T(
      "Same shape. Different meaning.",
      "Podobny zapis. Inne znaczenie.",
    ),
    subtitle: T(
      "Numbers, strings, booleans — know your values.",
      "Liczby, tekst, wartości logiczne — poznaj swoje dane.",
    ),
    minutes: 7,
    concept: "types",
    blocks: [
      {
        type: "text",
        heading: T('42 is not "42".', '42 to nie "42".'),
        body: T(
          "A number is used for arithmetic. A string is text in quotes. A boolean is true or false. Use typeof to inspect a value. JavaScript is dynamically typed: a let binding can later refer to a different kind of value.",
          "Liczba służy do obliczeń. String to tekst w cudzysłowie. Boolean ma wartość true lub false. Operator typeof sprawdza typ wartości. JavaScript ma typy dynamiczne: zmiennej let możesz później przypisać wartość innego typu.",
        ),
      },
      {
        type: "code",
        code: 'typeof 42;       // "number"\ntypeof "42";     // "string"\ntypeof true;     // "boolean"\ntypeof undefined; // "undefined"',
        caption: T(
          "typeof returns a string describing the type.",
          "typeof zwraca tekst opisujący typ.",
        ),
      },
      {
        type: "visual",
        kind: "types",
        caption: T(
          "Choose a value. Watch its type and meaning change.",
          "Wybierz wartość. Zobacz, jak zmieniają się jej typ i znaczenie.",
        ),
      },
      {
        type: "tip",
        body: T(
          'Other primitive values include null, bigint and symbol. A historical quirk: typeof null is "object", even though null is a primitive.',
          'Pozostałe wartości prymitywne to m.in. null, bigint i symbol. Historyczna osobliwość: typeof null zwraca "object", chociaż null jest wartością prymitywną.',
        ),
      },
    ],
    prediction: question(
      "types-predict",
      "types",
      T("What is the result?", "Jaki będzie wynik?"),
      [T("number", "number"), T("string", "string"), T("boolean", "boolean")],
      1,
      T(
        'Quotes make "42" a string, even if its characters look like a number.',
        'Cudzysłów sprawia, że "42" jest tekstem, nawet jeśli jego znaki wyglądają jak liczba.',
      ),
      'console.log(typeof "42");',
    ),
    exercise: {
      task: T(
        'Set age to the number 25, name to the string "Ada", and isReady to the boolean true.',
        'Ustaw age na liczbę 25, name na tekst "Ada", a isReady na wartość logiczną true.',
      ),
      starter:
        'const age = "25";\nconst name = "Ada";\nconst isReady = "true";\nconsole.log(typeof age, typeof isReady);',
      hint: T(
        "Remove the quotes around 25 and true. Keep quotes around Ada.",
        "Usuń cudzysłowy wokół 25 i true. Zostaw je wokół Ada.",
      ),
      tests: [
        {
          label: T("age is the number 25", "age jest liczbą 25"),
          expression: "age === 25",
        },
        {
          label: T("name is the string Ada", "name jest tekstem Ada"),
          expression: 'name === "Ada"',
        },
        {
          label: T(
            "isReady is boolean true",
            "isReady jest wartością logiczną true",
          ),
          expression: "isReady === true",
        },
      ],
    },
    recall: question(
      "types-recall",
      "types",
      T("Which value is a boolean?", "Która wartość ma typ boolean?"),
      [T('"false"', '"false"'), T("0", "0"), T("false", "false")],
      2,
      T(
        'false without quotes is a boolean. "false" is a string. 0 is a number.',
        'false bez cudzysłowu to boolean. "false" jest tekstem. 0 jest liczbą.',
      ),
    ),
  },
  {
    id: "operators",
    courseId: "javascript",
    moduleId: "operators",
    title: T("Make values work together", "Połącz wartości w działanie"),
    subtitle: T(
      "Arithmetic, comparison, and one surprising plus.",
      "Arytmetyka, porównania i jeden zaskakujący plus.",
    ),
    minutes: 7,
    concept: "operators",
    blocks: [
      {
        type: "text",
        heading: T(
          "Small symbols. Useful transformations.",
          "Małe symbole. Przydatne przekształcenia.",
        ),
        body: T(
          "Use +, -, * and / for arithmetic. Use === to compare both type and value. With strings, + joins text instead of adding numbers. Convert numeric text with Number() when you want arithmetic.",
          "Używaj +, -, * i / do obliczeń. Operator === porównuje typ i wartość. Dla tekstu + łączy ciągi znaków zamiast dodawać liczby. Zamień tekst liczbowy za pomocą Number(), gdy chcesz wykonać obliczenia.",
        ),
      },
      {
        type: "code",
        code: '2 + 3;             // 5\n"2" + 3;           // "23"\nNumber("2") + 3;   // 5\n5 === "5";         // false',
        caption: T(
          "Type matters as much as the visible value.",
          "Typ ma takie samo znaczenie jak widoczna wartość.",
        ),
      },
      {
        type: "visual",
        kind: "operators",
        caption: T(
          "Switch between addition and text joining.",
          "Przełączaj dodawanie i łączenie tekstu.",
        ),
      },
      {
        type: "tip",
        body: T(
          "Multiplication runs before addition: 2 + 3 * 4 is 14. Parentheses change the order: (2 + 3) * 4 is 20.",
          "Mnożenie wykonuje się przed dodawaniem: 2 + 3 * 4 daje 14. Nawiasy zmieniają kolejność: (2 + 3) * 4 daje 20.",
        ),
      },
    ],
    prediction: question(
      "operators-predict",
      "operators",
      T("What will + do here?", "Co zrobi tutaj +?"),
      [
        T("Print 5", "Wyświetli 5"),
        T('Print "23"', 'Wyświetli "23"'),
        T("Throw an error", "Zgłosi błąd"),
      ],
      1,
      T(
        "One operand is a string, so + converts the other to text and joins them.",
        "Jeden operand jest tekstem, więc + zamienia drugi na tekst i łączy oba ciągi.",
      ),
      'console.log("2" + 3);',
    ),
    exercise: {
      task: T(
        "Convert price to a number and multiply it by quantity. Store the result in total.",
        "Zamień price na liczbę i pomnóż przez quantity. Zapisz wynik w total.",
      ),
      starter:
        'const price = "12";\nconst quantity = 3;\nconst total = 0;\nconsole.log(total);',
      hint: T(
        "Use const total = Number(price) * quantity;",
        "Użyj const total = Number(price) * quantity;",
      ),
      tests: [
        {
          label: T("total is 36", "total ma wartość 36"),
          expression: "total === 36",
        },
        {
          label: T("total has type number", "total ma typ number"),
          expression: 'typeof total === "number"',
        },
      ],
    },
    recall: question(
      "operators-recall",
      "operators",
      T('What does 5 === "5" return?', 'Co zwróci 5 === "5"?'),
      [T("true", "true"), T("false", "false")],
      1,
      T(
        "Strict equality checks type too. A number and a string are different.",
        "Ścisła równość sprawdza też typ. Liczba i tekst są różne.",
      ),
    ),
  },
  {
    id: "conditions",
    courseId: "javascript",
    moduleId: "conditions",
    title: T("Teach your code to choose", "Naucz kod podejmować decyzje"),
    subtitle: T(
      "One condition. Two possible paths.",
      "Jeden warunek. Dwie możliwe ścieżki.",
    ),
    minutes: 7,
    concept: "conditions",
    blocks: [
      {
        type: "text",
        heading: T(
          "Run the right block at the right time.",
          "Uruchom właściwy blok we właściwym momencie.",
        ),
        body: T(
          "An if statement runs its block when the condition is truthy. An else block runs otherwise. Comparisons like score >= 60 produce true or false, making the decision explicit.",
          "Instrukcja if wykonuje blok, gdy warunek jest prawdziwy w kontekście logicznym. W przeciwnym razie wykona się blok else. Porównania takie jak score >= 60 zwracają true lub false i jasno określają decyzję.",
        ),
      },
      {
        type: "code",
        code: 'const score = 75;\nif (score >= 60) {\n  console.log("Pass");\n} else {\n  console.log("Try again");\n}',
        caption: T(
          "Only one of these two blocks runs.",
          "Wykona się tylko jeden z tych dwóch bloków.",
        ),
      },
      {
        type: "visual",
        kind: "condition",
        caption: T(
          "Change the score and follow the active branch.",
          "Zmień wynik i zobacz aktywną gałąź.",
        ),
      },
      {
        type: "tip",
        body: T(
          "Use === for equality checks and = for assignment. Mixing them up in a condition changes a value instead of comparing it.",
          "Używaj === do sprawdzania równości, a = do przypisywania. Pomylenie ich w warunku zmienia wartość zamiast ją porównać.",
        ),
      },
    ],
    prediction: question(
      "conditions-predict",
      "conditions",
      T("Which output do you expect?", "Jakiego wyniku oczekujesz?"),
      [T("Pass", "Pass"), T("Try again", "Try again"), T("Both", "Obu")],
      0,
      T(
        "60 >= 60 is true: the boundary value is included. Only the first block runs.",
        "60 >= 60 to true: wartość graniczna też spełnia warunek. Wykona się tylko pierwszy blok.",
      ),
      'const score = 60;\nif (score >= 60) console.log("Pass");\nelse console.log("Try again");',
    ),
    exercise: {
      task: T(
        'If score is at least 60, set result to "Pass". Otherwise set it to "Try again".',
        'Jeśli score wynosi co najmniej 60, ustaw result na "Pass". W przeciwnym razie ustaw "Try again".',
      ),
      starter:
        'const score = 75;\nlet result = "";\nif (score >= 60) {\n  // ...\n} else {\n  // ...\n}\nconsole.log(result);',
      hint: T(
        'Inside if: result = "Pass";. Inside else: result = "Try again";.',
        'W if: result = "Pass";. W else: result = "Try again";.',
      ),
      tests: [
        {
          label: T("A score of 75 passes", "Wynik 75 oznacza zaliczenie"),
          expression: 'result === "Pass"',
        },
        {
          label: T("The result is printed", "Wynik został wyświetlony"),
          expression: '__logs.includes("Pass")',
        },
      ],
    },
    recall: question(
      "conditions-recall",
      "conditions",
      T("When does the else block run?", "Kiedy wykona się blok else?"),
      [
        T("After every if block", "Po każdym bloku if"),
        T(
          "When the condition is falsy",
          "Gdy warunek jest fałszywy w kontekście logicznym",
        ),
        T("Only when there is an error", "Tylko gdy wystąpi błąd"),
      ],
      1,
      T(
        "else is the alternative path when the if condition is falsy.",
        "else to alternatywna ścieżka, gdy warunek if jest fałszywy w kontekście logicznym.",
      ),
    ),
  },
];

const roadmap: [string, string, string][] = [
  ["introduction", "Introduction", "Wprowadzenie"],
  ["variables-types", "Variables & types", "Zmienne i typy"],
  ["operators", "Operators", "Operatory"],
  ["conditions", "Conditions", "Warunki"],
  ["functions", "Functions", "Funkcje"],
  ["scope", "Scope", "Zakres"],
  ["arrays", "Arrays", "Tablice"],
  ["objects", "Objects", "Obiekty"],
  ["loops", "Loops", "Pętle"],
  ["array-methods", "Array methods", "Metody tablic"],
  ["higher-order", "Higher-order functions", "Funkcje wyższego rzędu"],
  ["closures", "Closures", "Domknięcia"],
  ["async", "Async JavaScript", "Asynchroniczny JavaScript"],
  ["promises", "Promises", "Obietnice"],
  ["async-await", "async / await", "async / await"],
  ["modules", "Modules", "Moduły"],
  ["errors", "Error handling", "Obsługa błędów"],
  ["dom", "DOM basics", "Podstawy DOM"],
  ["project", "Final project", "Projekt końcowy"],
  ["assessment", "Final assessment", "Test końcowy"],
];
const modules: CourseModule[] = roadmap.map(([id, en, pl], i) => ({
  id,
  title: T(en, pl),
  description:
    i < 4
      ? T(
          "Learn, visualise, code, and check your understanding.",
          "Poznaj, zobacz, zaprogramuj i sprawdź zrozumienie.",
        )
      : T(
          "Planned for the full learning path.",
          "W planie pełnej ścieżki nauki.",
        ),
  access: i < 4 ? "free" : "premium",
  lessonIds: lessons.filter((l) => l.moduleId === id).map((l) => l.id),
  minutes: lessons
    .filter((l) => l.moduleId === id)
    .reduce((n, l) => n + l.minutes, 0),
}));
export const courses: Course[] = [
  {
    id: "javascript",
    slug: "javascript",
    title: T("JavaScript", "JavaScript"),
    short: "JS",
    description: T(
      "Make the web come alive. Build a foundation that stays with you.",
      "Ożyw strony internetowe. Zbuduj solidne podstawy na przyszłość.",
    ),
    category: "web",
    status: "available",
    color: "yellow",
    modules,
  },
  {
    id: "typescript",
    slug: "typescript",
    title: T("TypeScript", "TypeScript"),
    short: "TS",
    description: T(
      "More confidence. Fewer surprises. Give your code a type system.",
      "Więcej pewności. Mniej niespodzianek. Poznaj system typów.",
    ),
    category: "web",
    status: "soon",
    color: "blue",
    modules: [],
  },
  {
    id: "react",
    slug: "react",
    title: T("React", "React"),
    short: "⚛",
    description: T(
      "Think in components. Create interfaces people love using.",
      "Myśl komponentami. Twórz interfejsy przyjemne w użyciu.",
    ),
    category: "web",
    status: "soon",
    color: "cyan",
    modules: [],
  },
  {
    id: "nextjs",
    slug: "nextjs",
    title: T("Next.js", "Next.js"),
    short: "N",
    description: T(
      "From your first route to a complete web application.",
      "Od pierwszej trasy do kompletnej aplikacji internetowej.",
    ),
    category: "web",
    status: "soon",
    color: "neutral",
    modules: [],
  },
  {
    id: "python",
    slug: "python",
    title: T("Python", "Python"),
    short: "Py",
    description: T(
      "Turn a few lines into automation, insights, and ideas.",
      "Zamień kilka linii w automatyzację, wnioski i pomysły.",
    ),
    category: "data",
    status: "soon",
    color: "green",
    modules: [],
  },
  {
    id: "sql",
    slug: "sql",
    title: T("SQL", "SQL"),
    short: "DB",
    description: T(
      "Ask better questions. Find the story inside your data.",
      "Zadawaj lepsze pytania. Odkryj historię ukrytą w danych.",
    ),
    category: "data",
    status: "soon",
    color: "orange",
    modules: [],
  },
  {
    id: "ai",
    slug: "ai",
    title: T("AI Development", "Programowanie AI"),
    short: "AI",
    description: T(
      "Build thoughtful tools with models, prompts, and real code.",
      "Twórz przydatne narzędzia z modelami, promptami i kodem.",
    ),
    category: "ai",
    status: "soon",
    color: "purple",
    modules: [],
  },
];
export const quizzes: Quiz[] = modules
  .filter((m) => m.access === "free")
  .map((m) => ({
    id: `checkpoint-${m.id}`,
    moduleId: m.id,
    questions: lessons
      .filter((l) => l.moduleId === m.id)
      .flatMap((l) => [l.prediction, l.recall]),
  }));
export const conceptNames: Record<string, ReturnType<typeof T>> = {
  execution: T("Program execution", "Wykonywanie programu"),
  variables: T("Variables", "Zmienne"),
  constants: T("Constants", "Stałe"),
  types: T("Data types", "Typy danych"),
  operators: T("Operators", "Operatory"),
  conditions: T("Conditions", "Warunki"),
};
