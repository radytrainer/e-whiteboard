import { useBoardStore } from '../store/boardStore';
import { X, Sigma, Zap, FlaskConical, Dna } from 'lucide-react';

const subjectMeta = {
  math:     { label: 'Math Formula',     icon: Sigma,        color: 'text-purple-600 dark:text-purple-400' },
  physics:  { label: 'Physics Formula',  icon: Zap,          color: 'text-blue-600 dark:text-blue-400' },
  chemistry:{ label: 'Chemistry Formula',icon: FlaskConical, color: 'text-emerald-600 dark:text-emerald-400' },
  biology:  { label: 'Biology Formula',  icon: Dna,          color: 'text-amber-600 dark:text-amber-400' },
};

const formulasBySubject = {
  math: [
    {
      grade: 'Grade 7',
      formulas: [
        { name: 'Area of Rectangle', equation: 'A = l × w' },
        { name: 'Perimeter of Rectangle', equation: 'P = 2(l + w)' },
        { name: 'Volume of Cube', equation: 'V = s³' },
        { name: 'Fraction Addition', equation: 'a/b + c/d = (ad + bc)/bd' },
      ],
    },
    {
      grade: 'Grade 8',
      formulas: [
        { name: 'Pythagorean Theorem', equation: 'a² + b² = c²' },
        { name: 'Slope Formula', equation: 'm = (y₂ − y₁)/(x₂ − x₁)' },
        { name: 'Simple Interest', equation: 'I = PRT/100' },
      ],
    },
    {
      grade: 'Grade 9',
      formulas: [
        { name: 'Quadratic Formula', equation: 'x = (−b ± √(b² − 4ac))/2a' },
        { name: 'Area of Circle', equation: 'A = πr²' },
        { name: 'Volume of Cylinder', equation: 'V = πr²h' },
      ],
    },
    {
      grade: 'Grade 10',
      formulas: [
        { name: 'Sine', equation: 'sin θ = opposite/hypotenuse' },
        { name: 'Cosine', equation: 'cos θ = adjacent/hypotenuse' },
        { name: 'Tangent', equation: 'tan θ = opposite/adjacent' },
        { name: 'Arithmetic Mean', equation: 'x̄ = Σx/n' },
      ],
    },
    {
      grade: 'Grade 11',
      formulas: [
        { name: 'Power Rule', equation: "d/dx(xⁿ) = nxⁿ⁻¹" },
        { name: 'Integration', equation: '∫ xⁿ dx = xⁿ⁺¹/(n+1) + C' },
        { name: 'Logarithm Product', equation: 'logₐ(MN) = logₐM + logₐN' },
      ],
    },
    {
      grade: 'Grade 12',
      formulas: [
        { name: 'Limit Definition', equation: "f'(x) = lim[h→0](f(x+h)−f(x))/h" },
        { name: 'Dot Product', equation: 'a·b = |a||b|cos θ' },
        { name: 'Matrix Multiplication', equation: '(AB)ᵢⱼ = Σₖ AᵢₖBₖⱼ' },
      ],
    },
  ],
  physics: [
    {
      grade: 'Grade 7',
      formulas: [
        { name: 'Speed', equation: 'v = d/t' },
        { name: 'Density', equation: 'ρ = m/V' },
        { name: 'Force', equation: 'F = ma' },
      ],
    },
    {
      grade: 'Grade 8',
      formulas: [
        { name: 'Work', equation: 'W = Fd' },
        { name: 'Power', equation: 'P = W/t' },
        { name: 'Kinetic Energy', equation: 'KE = ½mv²' },
        { name: 'Potential Energy', equation: 'PE = mgh' },
      ],
    },
    {
      grade: 'Grade 9',
      formulas: [
        { name: 'Wave Speed', equation: 'v = fλ' },
        { name: "Ohm's Law", equation: 'V = IR' },
        { name: 'Pressure', equation: 'P = F/A' },
      ],
    },
    {
      grade: 'Grade 10',
      formulas: [
        { name: 'Refractive Index', equation: 'n = sin i/sin r' },
        { name: 'Lens Formula', equation: '1/f = 1/v + 1/u' },
        { name: "Coulomb's Law", equation: 'F = kq₁q₂/r²' },
      ],
    },
    {
      grade: 'Grade 11',
      formulas: [
        { name: "Newton's Second Law", equation: 'F = ma' },
        { name: 'Gravitational Force', equation: 'F = Gm₁m₂/r²' },
        { name: 'Centripetal Force', equation: 'F = mv²/r' },
      ],
    },
    {
      grade: 'Grade 12',
      formulas: [
        { name: "Einstein's Equation", equation: 'E = mc²' },
        { name: 'Photoelectric Effect', equation: 'E = hf' },
        { name: 'Radioactive Decay', equation: 'N = N₀e^(−λt)' },
      ],
    },
  ],
  chemistry: [
    {
      grade: 'Grade 7',
      formulas: [
        { name: 'States of Matter', equation: 'Solid → Liquid → Gas' },
        { name: 'Mass from Density', equation: 'm = ρV' },
      ],
    },
    {
      grade: 'Grade 8',
      formulas: [
        { name: 'Number of Moles', equation: 'n = m/M' },
        { name: 'Empirical Formula', equation: 'Ratio of atoms = mol ratio' },
      ],
    },
    {
      grade: 'Grade 9',
      formulas: [
        { name: 'Concentration', equation: 'C = n/V' },
        { name: 'Percentage Composition', equation: '% = (mass/total mass)×100' },
      ],
    },
    {
      grade: 'Grade 10',
      formulas: [
        { name: 'pH Formula', equation: 'pH = −log[H⁺]' },
        { name: 'Neutralization', equation: 'H⁺ + OH⁻ → H₂O' },
      ],
    },
    {
      grade: 'Grade 11',
      formulas: [
        { name: 'Ideal Gas Law', equation: 'PV = nRT' },
        { name: 'Enthalpy Change', equation: 'ΔH = H(products) − H(reactants)' },
      ],
    },
    {
      grade: 'Grade 12',
      formulas: [
        { name: 'Rate Law', equation: 'Rate = k[A]ⁿ' },
        { name: 'Equilibrium Constant', equation: 'K = [C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ' },
        { name: 'Cell Potential', equation: 'E°cell = E°cathode − E°anode' },
      ],
    },
  ],
  biology: [
    {
      grade: 'Grade 7',
      formulas: [
        { name: 'Magnification', equation: 'M = Image size/Actual size' },
        { name: 'Cell Division', equation: 'Mitosis: 2n → 2n (daughter cells)' },
      ],
    },
    {
      grade: 'Grade 8',
      formulas: [
        { name: 'BMI', equation: 'BMI = weight(kg)/height(m)²' },
        { name: 'Heart Rate', equation: 'HR = beats/time(min)' },
      ],
    },
    {
      grade: 'Grade 9',
      formulas: [
        { name: 'Photosynthesis', equation: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂' },
        { name: 'Cellular Respiration', equation: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP' },
      ],
    },
    {
      grade: 'Grade 10',
      formulas: [
        { name: 'Monohybrid Ratio', equation: 'Phenotype ratio = 3:1' },
        { name: 'Dihybrid Ratio', equation: 'Phenotype ratio = 9:3:3:1' },
        { name: 'Hardy-Weinberg', equation: 'p² + 2pq + q² = 1' },
      ],
    },
    {
      grade: 'Grade 11',
      formulas: [
        { name: 'Population Growth', equation: 'dN/dt = rN(1 − N/K)' },
        { name: 'Carrying Capacity', equation: 'K = maximum population size' },
      ],
    },
    {
      grade: 'Grade 12',
      formulas: [
        { name: 'Chi-Square', equation: 'χ² = Σ(O − E)²/E' },
        { name: 'DNA Base Pairing', equation: 'A=T, G≡C' },
        { name: 'Transcription', equation: 'DNA → mRNA → Protein' },
      ],
    },
  ],
};

export default function FormulaPanel({ subject, onClose }) {
  const { addObject, textColor, textFont, scale, position } = useBoardStore();

  const isOpen = !!subject;
  const meta = subjectMeta[subject];
  const grades = formulasBySubject[subject] || [];

  const insertFormula = (equation) => {
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
        <div className={`flex items-center gap-2 font-semibold ${meta?.color || 'text-purple-600 dark:text-purple-400'}`}>
          {meta?.icon && <meta.icon className="w-5 h-5" />}
          <span>{meta?.label || 'Formula Templates'}</span>
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
        {grades.map((grade) => (
          <div key={grade.grade} className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
              {grade.grade}
            </h3>
            <div className="space-y-2">
              {grade.formulas.map((f) => (
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
