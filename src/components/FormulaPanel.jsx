import { useBoardStore } from '../store/boardStore';
import { BookOpen, X } from 'lucide-react';

export default function FormulaPanel({ isOpen, onClose }) {
  const { addObject, textColor, textFont, scale, position } = useBoardStore();

  const formulaCategories = [
    {
      title: 'Math',
      formulas: [
        { name: 'Pythagorean Theorem', equation: 'a² + b² = c²' },
        { name: 'Quadratic Formula', equation: 'x = (-b ± √(b² − 4ac)) / 2a' },
        { name: 'Circle Area', equation: 'A = πr²' },
        { name: 'Slope Formula', equation: 'm = (y₂ - y₁) / (x₂ - x₁)' },
        { name: 'Derivative', equation: "f'(x) = lim[h→0] (f(x+h) - f(x))/h" },
      ],
    },
    {
      title: 'Physics',
      formulas: [
        { name: "Newton's Second Law", equation: 'F = ma' },
        { name: "Einstein's Equation", equation: 'E = mc²' },
        { name: "Ohm's Law", equation: 'V = IR' },
        { name: 'Gravitational Force', equation: 'F = G(m₁m₂)/r²' },
        { name: 'Kinetic Energy', equation: 'KE = ½mv²' },
      ],
    },
    {
      title: 'Chemistry',
      formulas: [
        { name: 'Ideal Gas Law', equation: 'PV = nRT' },
        { name: 'pH Formula', equation: 'pH = -log[H⁺]' },
        { name: 'Molarity', equation: 'M = mol/L' },
        { name: "Avogadro's Number", equation: 'Nₐ = 6.022 × 10²³' },
        { name: 'Photosynthesis', equation: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂' },
      ],
    },
    {
      title: 'Biology',
      formulas: [
        { name: 'Hardy-Weinberg', equation: 'p² + 2pq + q² = 1' },
        { name: 'Cellular Respiration', equation: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP' },
        { name: 'Surface Area/Volume', equation: 'SA:V = 6 / d' },
        { name: 'Population Growth', equation: 'dN/dt = rN(1 - N/K)' },
      ],
    },
  ];

  const insertFormula = (equation) => {
    // Center coordinates inside active view bounds
    const canvasX = (window.innerWidth / 2 - position.x) / scale;
    const canvasY = (window.innerHeight / 2 - position.y) / scale;

    addObject({
      type: 'text',
      text: equation,
      x: canvasX - 100,
      y: canvasY - 20,
      fontSize: 28,
      fontColor: textColor,
      fontFamily: textFont,
      isBold: false,
      isItalic: false,
      isUnderline: false,
      align: 'left',
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    });
  };

  return (
    <div
      className={`fixed top-4 right-20 bottom-4 w-72 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 z-40 flex flex-col transition-all duration-300 transform ${
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-96 opacity-0 pointer-events-none'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold">
          <BookOpen className="w-5 h-5" />
          <span>Formula Templates</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {formulaCategories.map((category) => (
          <div key={category.title} className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
              {category.title}
            </h3>
            <div className="space-y-2">
              {category.formulas.map((f) => (
                <button
                  key={f.name}
                  onClick={() => insertFormula(f.equation)}
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('source', 'math-formula');
                    e.dataTransfer.setData('text/plain', f.equation);
                    e.dataTransfer.effectAllowed = 'copy';
                  }}
                  className="w-full text-left bg-zinc-50 dark:bg-zinc-950/40 hover:bg-purple-50 dark:hover:bg-purple-950/20 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 group transition-all cursor-grab active:cursor-grabbing"
                >
                  <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {f.name}
                  </div>
                  <div className="mt-1 text-md font-mono font-medium text-zinc-800 dark:text-zinc-200 overflow-x-auto whitespace-nowrap">
                    {f.equation}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
