import { useState, useEffect } from 'react';
import { useBoardStore } from '../store/boardStore';
import { X, Sigma, Zap, FlaskConical, Dna, Grid3x3 } from 'lucide-react';

const ELEMENTS = [
  { sym:'H',  name:'Hydrogen',     num:1,  row:1, col:1  },
  { sym:'He', name:'Helium',       num:2,  row:1, col:18 },
  { sym:'Li', name:'Lithium',      num:3,  row:2, col:1  },
  { sym:'Be', name:'Beryllium',    num:4,  row:2, col:2  },
  { sym:'B',  name:'Boron',        num:5,  row:2, col:13 },
  { sym:'C',  name:'Carbon',       num:6,  row:2, col:14 },
  { sym:'N',  name:'Nitrogen',     num:7,  row:2, col:15 },
  { sym:'O',  name:'Oxygen',       num:8,  row:2, col:16 },
  { sym:'F',  name:'Fluorine',     num:9,  row:2, col:17 },
  { sym:'Ne', name:'Neon',         num:10, row:2, col:18 },
  { sym:'Na', name:'Sodium',       num:11, row:3, col:1  },
  { sym:'Mg', name:'Magnesium',    num:12, row:3, col:2  },
  { sym:'Al', name:'Aluminium',    num:13, row:3, col:13 },
  { sym:'Si', name:'Silicon',      num:14, row:3, col:14 },
  { sym:'P',  name:'Phosphorus',   num:15, row:3, col:15 },
  { sym:'S',  name:'Sulfur',       num:16, row:3, col:16 },
  { sym:'Cl', name:'Chlorine',     num:17, row:3, col:17 },
  { sym:'Ar', name:'Argon',        num:18, row:3, col:18 },
  { sym:'K',  name:'Potassium',    num:19, row:4, col:1  },
  { sym:'Ca', name:'Calcium',      num:20, row:4, col:2  },
  { sym:'Sc', name:'Scandium',     num:21, row:4, col:3  },
  { sym:'Ti', name:'Titanium',     num:22, row:4, col:4  },
  { sym:'V',  name:'Vanadium',     num:23, row:4, col:5  },
  { sym:'Cr', name:'Chromium',     num:24, row:4, col:6  },
  { sym:'Mn', name:'Manganese',    num:25, row:4, col:7  },
  { sym:'Fe', name:'Iron',         num:26, row:4, col:8  },
  { sym:'Co', name:'Cobalt',       num:27, row:4, col:9  },
  { sym:'Ni', name:'Nickel',       num:28, row:4, col:10 },
  { sym:'Cu', name:'Copper',       num:29, row:4, col:11 },
  { sym:'Zn', name:'Zinc',         num:30, row:4, col:12 },
  { sym:'Ga', name:'Gallium',      num:31, row:4, col:13 },
  { sym:'Ge', name:'Germanium',    num:32, row:4, col:14 },
  { sym:'As', name:'Arsenic',      num:33, row:4, col:15 },
  { sym:'Se', name:'Selenium',     num:34, row:4, col:16 },
  { sym:'Br', name:'Bromine',      num:35, row:4, col:17 },
  { sym:'Kr', name:'Krypton',      num:36, row:4, col:18 },
  { sym:'Rb', name:'Rubidium',     num:37, row:5, col:1  },
  { sym:'Sr', name:'Strontium',    num:38, row:5, col:2  },
  { sym:'Y',  name:'Yttrium',      num:39, row:5, col:3  },
  { sym:'Zr', name:'Zirconium',    num:40, row:5, col:4  },
  { sym:'Nb', name:'Niobium',      num:41, row:5, col:5  },
  { sym:'Mo', name:'Molybdenum',   num:42, row:5, col:6  },
  { sym:'Tc', name:'Technetium',   num:43, row:5, col:7  },
  { sym:'Ru', name:'Ruthenium',    num:44, row:5, col:8  },
  { sym:'Rh', name:'Rhodium',      num:45, row:5, col:9  },
  { sym:'Pd', name:'Palladium',    num:46, row:5, col:10 },
  { sym:'Ag', name:'Silver',       num:47, row:5, col:11 },
  { sym:'Cd', name:'Cadmium',      num:48, row:5, col:12 },
  { sym:'In', name:'Indium',       num:49, row:5, col:13 },
  { sym:'Sn', name:'Tin',          num:50, row:5, col:14 },
  { sym:'Sb', name:'Antimony',     num:51, row:5, col:15 },
  { sym:'Te', name:'Tellurium',    num:52, row:5, col:16 },
  { sym:'I',  name:'Iodine',       num:53, row:5, col:17 },
  { sym:'Xe', name:'Xenon',        num:54, row:5, col:18 },
  { sym:'Cs', name:'Caesium',      num:55, row:6, col:1  },
  { sym:'Ba', name:'Barium',       num:56, row:6, col:2  },
  { sym:'La', name:'Lanthanum',    num:57, row:6, col:3, isLan:true },
  { sym:'Ce', name:'Cerium',       num:58, row:6, col:4, isLan:true },
  { sym:'Pr', name:'Praseodymium', num:59, row:6, col:5, isLan:true },
  { sym:'Nd', name:'Neodymium',    num:60, row:6, col:6, isLan:true },
  { sym:'Sm', name:'Samarium',     num:62, row:6, col:8, isLan:true },
  { sym:'Eu', name:'Europium',     num:63, row:6, col:9, isLan:true },
  { sym:'Gd', name:'Gadolinium',   num:64, row:6, col:10, isLan:true },
  { sym:'Tb', name:'Terbium',      num:65, row:6, col:11, isLan:true },
  { sym:'Dy', name:'Dysprosium',   num:66, row:6, col:12, isLan:true },
  { sym:'Ho', name:'Holmium',      num:67, row:6, col:13, isLan:true },
  { sym:'Er', name:'Erbium',       num:68, row:6, col:14, isLan:true },
  { sym:'Tm', name:'Thulium',      num:69, row:6, col:15, isLan:true },
  { sym:'Yb', name:'Ytterbium',    num:70, row:6, col:16, isLan:true },
  { sym:'Lu', name:'Lutetium',     num:71, row:6, col:17, isLan:true },
  { sym:'Hf', name:'Hafnium',      num:72, row:6, col:4  },
  { sym:'Ta', name:'Tantalum',     num:73, row:6, col:5  },
  { sym:'W',  name:'Tungsten',     num:74, row:6, col:6  },
  { sym:'Re', name:'Rhenium',      num:75, row:6, col:7  },
  { sym:'Os', name:'Osmium',       num:76, row:6, col:8  },
  { sym:'Ir', name:'Iridium',      num:77, row:6, col:9  },
  { sym:'Pt', name:'Platinum',     num:78, row:6, col:10 },
  { sym:'Au', name:'Gold',         num:79, row:6, col:11 },
  { sym:'Hg', name:'Mercury',      num:80, row:6, col:12 },
  { sym:'Tl', name:'Thallium',     num:81, row:6, col:13 },
  { sym:'Pb', name:'Lead',         num:82, row:6, col:14 },
  { sym:'Bi', name:'Bismuth',      num:83, row:6, col:15 },
  { sym:'Po', name:'Polonium',     num:84, row:6, col:16 },
  { sym:'At', name:'Astatine',     num:85, row:6, col:17 },
  { sym:'Rn', name:'Radon',        num:86, row:6, col:18 },
  { sym:'Fr', name:'Francium',     num:87, row:7, col:1  },
  { sym:'Ra', name:'Radium',       num:88, row:7, col:2  },
  { sym:'Ac', name:'Actinium',     num:89, row:7, col:3, isAct:true },
  { sym:'Th', name:'Thorium',      num:90, row:7, col:4, isAct:true },
  { sym:'Pa', name:'Protactinium', num:91, row:7, col:5, isAct:true },
  { sym:'U',  name:'Uranium',      num:92, row:7, col:6, isAct:true },
  { sym:'Np', name:'Neptunium',    num:93, row:7, col:7, isAct:true },
  { sym:'Pu', name:'Plutonium',    num:94, row:7, col:8, isAct:true },
  { sym:'Am', name:'Americium',    num:95, row:7, col:9, isAct:true },
  { sym:'Cm', name:'Curium',       num:96, row:7, col:10, isAct:true },
  { sym:'Bk', name:'Berkelium',    num:97, row:7, col:11, isAct:true },
  { sym:'Cf', name:'Californium',  num:98, row:7, col:12, isAct:true },
  { sym:'Es', name:'Einsteinium',  num:99, row:7, col:13, isAct:true },
  { sym:'Fm', name:'Fermium',      num:100,row:7, col:14, isAct:true },
  { sym:'Md', name:'Mendelevium',  num:101,row:7, col:15, isAct:true },
  { sym:'No', name:'Nobelium',     num:102,row:7, col:16, isAct:true },
  { sym:'Lr', name:'Lawrencium',   num:103,row:7, col:17, isAct:true },
  { sym:'Rf', name:'Rutherfordium',num:104,row:7, col:4  },
  { sym:'Db', name:'Dubnium',      num:105,row:7, col:5  },
  { sym:'Sg', name:'Seaborgium',   num:106,row:7, col:6  },
  { sym:'Bh', name:'Bohrium',      num:107,row:7, col:7  },
  { sym:'Hs', name:'Hassium',      num:108,row:7, col:8  },
  { sym:'Mt', name:'Meitnerium',   num:109,row:7, col:9  },
  { sym:'Ds', name:'Darmstadtium', num:110,row:7, col:10 },
  { sym:'Rg', name:'Roentgenium',  num:111,row:7, col:11 },
  { sym:'Cn', name:'Copernicium',  num:112,row:7, col:12 },
  { sym:'Nh', name:'Nihonium',     num:113,row:7, col:13 },
  { sym:'Fl', name:'Flerovium',    num:114,row:7, col:14 },
  { sym:'Mc', name:'Moscovium',    num:115,row:7, col:15 },
  { sym:'Lv', name:'Livermorium',  num:116,row:7, col:16 },
  { sym:'Ts', name:'Tennessine',   num:117,row:7, col:17 },
  { sym:'Og', name:'Oganesson',    num:118,row:7, col:18 },
];

function PeriodicTableModal({ onClose, onInsert }) {
  const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(18, minmax(0, 1fr))', gap: '1px' };

  const cellCls = (el) => {
    if (!el) return 'bg-transparent';
    let bg = 'bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-200 dark:hover:bg-purple-800';
    if (el.isLan) bg = 'bg-emerald-100 dark:bg-emerald-900 hover:bg-emerald-200 dark:hover:bg-emerald-700';
    if (el.isAct) bg = 'bg-sky-100 dark:bg-sky-900 hover:bg-sky-200 dark:hover:bg-sky-700';
    if (el.num === 1 || (el.num >= 3 && el.num <= 4) || (el.num >= 11 && el.num <= 12) || (el.num >= 19 && el.num <= 20) || (el.num >= 37 && el.num <= 38) || (el.num >= 55 && el.num <= 56) || (el.num >= 87 && el.num <= 88)) bg = 'bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-700';
    if ((el.num >= 5 && el.num <= 6) || (el.num >= 13 && el.num <= 16) || (el.num >= 31 && el.num <= 34) || (el.num >= 49 && el.num <= 52) || (el.num >= 81 && el.num <= 84) || (el.num >= 113 && el.num <= 116)) bg = 'bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 dark:hover:bg-orange-700';
    if (el.num === 7 || el.num === 8 || el.num === 15 || el.num === 16 || el.num === 34 || el.num === 52 || el.num === 84 || el.num === 116) bg = 'bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-700';
    if ((el.num >= 9 && el.num <= 10) || (el.num >= 17 && el.num <= 18) || (el.num >= 35 && el.num <= 36) || (el.num >= 53 && el.num <= 54) || (el.num >= 85 && el.num <= 86) || el.num === 118) bg = 'bg-cyan-100 dark:bg-cyan-900 hover:bg-cyan-200 dark:hover:bg-cyan-700';
    return bg;
  };

  const rows = [];
  for (let r = 1; r <= 7; r++) {
    const cells = [];
    for (let c = 1; c <= 18; c++) {
      const el = ELEMENTS.find(e => e.row === r && e.col === c && !e.isLan && !e.isAct);
      if (el) {
        cells.push(
          <button key={`${r}-${c}`}
            onClick={() => onInsert(el.sym)}
            title={`${el.name} (${el.num})`}
            className={`w-full aspect-square rounded text-[9px] font-bold border border-zinc-300 dark:border-zinc-600 flex flex-col items-center justify-center leading-tight cursor-pointer transition-all ${cellCls(el)}`}
          >
            <span className="text-[7px] font-normal opacity-50">{el.num}</span>
            <span>{el.sym}</span>
          </button>
        );
      } else {
        cells.push(<div key={`${r}-${c}`} className="w-full aspect-square" />);
      }
    }
    rows.push(<div key={r} style={gridStyle}>{cells}</div>);
  }

  const lanAct = (arr, label) => {
    if (!arr || arr.length === 0) return null;
    return (
      <div style={gridStyle}>
        {arr.map(el => (
          <button key={el.sym}
            onClick={() => onInsert(el.sym)}
            title={`${el.name} (${el.num})`}
            className={`w-full aspect-square rounded text-[9px] font-bold border border-zinc-300 dark:border-zinc-600 flex flex-col items-center justify-center leading-tight cursor-pointer transition-all ${cellCls(el)}`}
          >
            <span className="text-[7px] font-normal opacity-50">{el.num}</span>
            <span>{el.sym}</span>
          </button>
        ))}
        {Array.from({ length: 18 - (arr?.length || 0) }).map((_, i) => <div key={`empty-${i}`} className="w-full aspect-square" />)}
      </div>
    );
  };

  const lanthanides = ELEMENTS.filter(e => e.isLan);
  const actinides = ELEMENTS.filter(e => e.isAct);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-4 max-w-[95vw] max-h-[95vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-200">Periodic Table of Elements</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-[1px] min-w-[600px]">
          {rows}
          <div className="h-2" />
          {lanAct(lanthanides)}
          {lanAct(actinides)}
        </div>
      </div>
    </div>
  );
}

const subjectMeta = {
  math:     { label: 'Math Formula',     icon: Sigma,        color: 'text-purple-600 dark:text-purple-400' },
  physics:  { label: 'Physics Formula',  icon: Zap,          color: 'text-blue-600 dark:text-blue-400' },
  chemistry:{ label: 'Chemistry Formula',icon: FlaskConical, color: 'text-emerald-600 dark:text-emerald-400' },
  biology:  { label: 'Biology Formula',  icon: Dna,          color: 'text-amber-600 dark:text-amber-400' },
  periodic: { label: 'Periodic Table',   icon: Grid3x3,      color: 'text-emerald-600 dark:text-emerald-400' },
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
  const [showPeriodic, setShowPeriodic] = useState(false);
  const { addObject, textColor, textFont, scale, position } = useBoardStore();

  const isOpen = !!subject;
  const meta = subjectMeta[subject];
  const grades = formulasBySubject[subject] || [];

  useEffect(() => {
    if (subject === 'periodic') setShowPeriodic(true);
  }, [subject]);

  const handleElementInsert = (sym) => {
    const canvasX = (window.innerWidth / 2 - position.x) / scale;
    const canvasY = (window.innerHeight / 2 - position.y) / scale;
    addObject({
      type: 'text',
      text: sym,
      x: canvasX - 15,
      y: canvasY - 15,
      fontSize: 28,
      fontColor: textColor,
      fontFamily: textFont,
      isBold: false, isItalic: false, isUnderline: false,
      align: 'left', rotation: 0, scaleX: 1, scaleY: 1,
    });
  };

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
    <>
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
        {subject === 'periodic' ? (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
              Reference
            </h3>
            <button
              onClick={() => setShowPeriodic(true)}
              className="w-full text-left p-3 rounded-xl border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 cursor-pointer transition-all group"
            >
              <div className="text-xs font-semibold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 transition-colors">
                <Grid3x3 className="w-3.5 h-3.5" />
                Open Periodic Table
              </div>
              <div className="mt-1 text-md font-mono font-medium text-emerald-700 dark:text-emerald-300">
                View all 118 elements →
              </div>
            </button>
          </div>
        ) : (
          grades.map((grade) => (
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
          ))
        )}
      </div>
    </div>

    {showPeriodic && (
      <PeriodicTableModal
        onClose={() => setShowPeriodic(false)}
        onInsert={(sym) => {
          handleElementInsert(sym);
          setShowPeriodic(false);
        }}
      />
    )}
    </>
  );
}
