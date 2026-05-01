"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Shield, Sparkles, Swords } from "lucide-react";

type Operator = "+" | "-" | "x" | "/";

type HistoryItem = {
  expression: string;
  result: string;
};

const operatorSymbols: Record<Operator, string> = {
  "+": "+",
  "-": "-",
  x: "x",
  "/": "÷",
};

const formatNumber = (value: number) => {
  if (!Number.isFinite(value)) {
    return "Error";
  }

  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 8,
    useGrouping: false,
  }).format(value);
};

const normalizeNumber = (value: string) => Number(value.replace(",", "."));

const calculate = (firstValue: number, secondValue: number, operator: Operator) => {
  switch (operator) {
    case "+":
      return firstValue + secondValue;
    case "-":
      return firstValue - secondValue;
    case "x":
      return firstValue * secondValue;
    case "/":
      return secondValue === 0 ? Number.NaN : firstValue / secondValue;
    default:
      return secondValue;
  }
};

export default function Home() {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState("Listo para la batalla");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const activeOperatorLabel = useMemo(
    () => (operator ? operatorSymbols[operator] : "Sin operador"),
    [operator],
  );

  const pushHistory = (newExpression: string, result: string) => {
    setHistory((current) => [{ expression: newExpression, result }, ...current].slice(0, 4));
  };

  const clearCalculator = () => {
    setDisplay("0");
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setExpression("Listo para la batalla");
  };

  const inputDigit = (digit: string) => {
    if (display === "Error" || waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
      return;
    }

    setDisplay((current) => (current === "0" ? digit : `${current}${digit}`));
  };

  const inputDecimal = () => {
    if (display === "Error" || waitingForOperand) {
      setDisplay("0,");
      setWaitingForOperand(false);
      return;
    }

    setDisplay((current) => (current.includes(",") ? current : `${current},`));
  };

  const backspace = () => {
    if (display === "Error" || waitingForOperand) {
      setDisplay("0");
      setWaitingForOperand(false);
      return;
    }

    setDisplay((current) => (current.length > 1 ? current.slice(0, -1) : "0"));
  };

  const toggleSign = () => {
    if (display === "0" || display === "Error") {
      return;
    }

    setDisplay((current) => (current.startsWith("-") ? current.slice(1) : `-${current}`));
  };

  const applyInstantOperation = (kind: "square" | "sqrt" | "percent") => {
    const currentValue = normalizeNumber(display);
    let result: number;
    let nextExpression: string;

    if (kind === "square") {
      result = currentValue * currentValue;
      nextExpression = `${display}²`;
    } else if (kind === "sqrt") {
      result = currentValue < 0 ? Number.NaN : Math.sqrt(currentValue);
      nextExpression = `√${display}`;
    } else {
      result = currentValue / 100;
      nextExpression = `${display}%`;
    }

    const formattedResult = formatNumber(result);
    setDisplay(formattedResult);
    setExpression(nextExpression);
    setWaitingForOperand(true);
    pushHistory(nextExpression, formattedResult);
  };

  const chooseOperator = (nextOperator: Operator) => {
    const inputValue = normalizeNumber(display);

    if (storedValue === null) {
      setStoredValue(inputValue);
      setExpression(`${display} ${operatorSymbols[nextOperator]}`);
    } else if (operator) {
      const result = calculate(storedValue, inputValue, operator);
      const formattedResult = formatNumber(result);
      const nextExpression = `${formatNumber(storedValue)} ${operatorSymbols[operator]} ${display}`;

      setStoredValue(result);
      setDisplay(formattedResult);
      setExpression(`${formattedResult} ${operatorSymbols[nextOperator]}`);
      pushHistory(nextExpression, formattedResult);
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  const performCalculation = () => {
    if (operator === null || storedValue === null) {
      return;
    }

    const inputValue = normalizeNumber(display);
    const result = calculate(storedValue, inputValue, operator);
    const formattedResult = formatNumber(result);
    const solvedExpression = `${formatNumber(storedValue)} ${operatorSymbols[operator]} ${display}`;

    setDisplay(formattedResult);
    setExpression(`${solvedExpression} =`);
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    pushHistory(solvedExpression, formattedResult);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (/^\d$/.test(event.key)) {
        inputDigit(event.key);
      } else if (event.key === "," || event.key === ".") {
        inputDecimal();
      } else if (event.key === "Backspace") {
        backspace();
      } else if (event.key === "Escape") {
        clearCalculator();
      } else if (event.key === "Enter" || event.key === "=") {
        performCalculation();
      } else if (event.key === "+") {
        chooseOperator("+");
      } else if (event.key === "-") {
        chooseOperator("-");
      } else if (event.key === "*") {
        chooseOperator("x");
      } else if (event.key === "/") {
        event.preventDefault();
        chooseOperator("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#102a5c] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,218,80,0.28),transparent_30%),radial-gradient(circle_at_top_right,rgba(65,180,255,0.3),transparent_28%),linear-gradient(145deg,#12356d_0%,#071a38_58%,#3f210f_100%)]" />
      <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-yellow-300/20 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,rgba(126,67,24,0.72))]" />

      <section className="relative mx-auto grid min-h-[calc(100dvh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_430px]">
        <motion.div
          className="space-y-7"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-yellow-300/70 bg-blue-950/60 px-4 py-2 text-sm font-black uppercase tracking-[0.2em] text-yellow-200 shadow-[0_8px_0_rgba(29,53,109,0.75)]">
            <Crown className="h-5 w-5" />
            Calculadora Royale
          </div>

          <div className="max-w-2xl space-y-4">
            <h1 className="text-5xl font-black leading-tight tracking-tight drop-shadow-[0_6px_0_rgba(32,51,106,0.9)] sm:text-6xl">
              Suma, resta y conquista la arena.
            </h1>
            <p className="text-lg font-semibold leading-8 text-blue-50/90">
              Una calculadora simple de matematicas con estilo de arena fantastica: escudos,
              oro, azul rey y botones grandes para usarla desde el navegador al correr el
              proyecto en Visual Studio.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Swords, label: "Operaciones", value: "+  -  x  ÷" },
              { icon: Shield, label: "Extras", value: "√  x²  %" },
              { icon: Sparkles, label: "Atajos", value: "Teclado" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-[28px] border-2 border-yellow-200/60 bg-white/12 p-4 shadow-[0_10px_0_rgba(35,54,111,0.65)] backdrop-blur"
              >
                <Icon className="mb-3 h-7 w-7 text-yellow-200" />
                <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-100/70">{label}</p>
                <p className="mt-1 text-xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="rounded-[36px] border-[6px] border-[#f5c542] bg-[#234b93] p-4 shadow-[0_22px_0_#18315f,0_34px_40px_rgba(0,0,0,0.45)]"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <div className="rounded-[28px] border-4 border-blue-950/50 bg-[#10275c] p-4">
            <div className="rounded-[24px] border-4 border-[#6fb6ff] bg-[#091a3f] p-5 text-right shadow-inner">
              <p className="min-h-6 truncate text-sm font-black uppercase tracking-[0.2em] text-yellow-200/80">
                {expression}
              </p>
              <output className="mt-2 block min-h-16 truncate text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.35)]">
                {display}
              </output>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              <CalcButton label="AC" tone="danger" onClick={clearCalculator} />
              <CalcButton label="⌫" tone="royal" onClick={backspace} />
              <CalcButton label="%" tone="royal" onClick={() => applyInstantOperation("percent")} />
              <CalcButton label="÷" tone="operator" active={operator === "/"} onClick={() => chooseOperator("/")} />

              <CalcButton label="7" onClick={() => inputDigit("7")} />
              <CalcButton label="8" onClick={() => inputDigit("8")} />
              <CalcButton label="9" onClick={() => inputDigit("9")} />
              <CalcButton label="x" tone="operator" active={operator === "x"} onClick={() => chooseOperator("x")} />

              <CalcButton label="4" onClick={() => inputDigit("4")} />
              <CalcButton label="5" onClick={() => inputDigit("5")} />
              <CalcButton label="6" onClick={() => inputDigit("6")} />
              <CalcButton label="-" tone="operator" active={operator === "-"} onClick={() => chooseOperator("-")} />

              <CalcButton label="1" onClick={() => inputDigit("1")} />
              <CalcButton label="2" onClick={() => inputDigit("2")} />
              <CalcButton label="3" onClick={() => inputDigit("3")} />
              <CalcButton label="+" tone="operator" active={operator === "+"} onClick={() => chooseOperator("+")} />

              <CalcButton label="+/-" tone="royal" onClick={toggleSign} />
              <CalcButton label="0" onClick={() => inputDigit("0")} />
              <CalcButton label="," onClick={inputDecimal} />
              <CalcButton label="=" tone="equals" onClick={performCalculation} />

              <CalcButton label="√" tone="royal" onClick={() => applyInstantOperation("sqrt")} />
              <CalcButton label="x²" tone="royal" onClick={() => applyInstantOperation("square")} />
              <div className="col-span-2 rounded-2xl border-2 border-blue-200/30 bg-blue-950/45 p-3 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-100/60">
                  Operador
                </p>
                <p className="text-xl font-black text-yellow-200">{activeOperatorLabel}</p>
              </div>
            </div>

            <div className="mt-4 rounded-[22px] border-2 border-yellow-200/40 bg-blue-950/45 p-4">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-200">
                Historial de batalla
              </p>
              {history.length === 0 ? (
                <p className="text-sm font-semibold text-blue-100/70">Aun no hay operaciones.</p>
              ) : (
                <ul className="space-y-2">
                  {history.map((item, index) => (
                    <li
                      key={`${item.expression}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-xl bg-white/8 px-3 py-2 text-sm"
                    >
                      <span className="truncate text-blue-100/75">{item.expression}</span>
                      <span className="font-black text-white">{item.result}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function CalcButton({
  label,
  onClick,
  tone = "number",
  active = false,
}: {
  label: string;
  onClick: () => void;
  tone?: "number" | "operator" | "equals" | "danger" | "royal";
  active?: boolean;
}) {
  const classes = {
    number: "border-blue-100 bg-[#f7fbff] text-[#14336f] shadow-[#96b7db]",
    operator: "border-yellow-200 bg-[#f5b52b] text-[#552b08] shadow-[#9d5b11]",
    equals: "border-emerald-200 bg-[#37c875] text-[#07351e] shadow-[#14753f]",
    danger: "border-red-200 bg-[#ff5f57] text-white shadow-[#9a2421]",
    royal: "border-blue-100 bg-[#6fb6ff] text-[#08295c] shadow-[#27649f]",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-14 rounded-2xl border-2 px-2 text-xl font-black transition duration-150 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-1 active:shadow-none ${classes} ${
        active ? "ring-4 ring-yellow-100" : ""
      }`}
    >
      {label}
    </button>
  );
}
