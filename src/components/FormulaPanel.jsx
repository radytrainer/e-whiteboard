import { useState, useEffect } from 'react';
import { useBoardStore } from '../store/boardStore';
import { X, Sigma, Zap, FlaskConical, Dna, Grid3x3, Plus } from 'lucide-react';

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
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
    gap: '2px',
  };

  const cellColor = (el) => {
    if (!el) return '';
    if (el.isLan) return 'bg-emerald-100 dark:bg-emerald-900/60 hover:bg-emerald-200 dark:hover:bg-emerald-800 text-emerald-800 dark:text-emerald-200';
    if (el.isAct) return 'bg-sky-100 dark:bg-sky-900/60 hover:bg-sky-200 dark:hover:bg-sky-800 text-sky-800 dark:text-sky-200';
    const n = el.num;
    if (n === 1 || [3,4,11,12,19,20,37,38,55,56,87,88].includes(n)) return 'bg-amber-100 dark:bg-amber-900/60 hover:bg-amber-200 dark:hover:bg-amber-800 text-amber-800 dark:text-amber-200';
    if ([9,10,17,18,35,36,53,54,85,86,118].includes(n)) return 'bg-cyan-100 dark:bg-cyan-900/60 hover:bg-cyan-200 dark:hover:bg-cyan-800 text-cyan-800 dark:text-cyan-200';
    if ((n>=21&&n<=30)||(n>=39&&n<=48)||(n>=72&&n<=80)||(n>=104&&n<=112)) return 'bg-rose-100 dark:bg-rose-900/60 hover:bg-rose-200 dark:hover:bg-rose-800 text-rose-800 dark:text-rose-200';
    return 'bg-zinc-100 dark:bg-zinc-800 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-zinc-800 dark:text-zinc-200';
  };

  const buildRow = (r) => {
    const cells = [];
    for (let c = 1; c <= 18; c++) {
      const el = ELEMENTS.find(e => e.row === r && e.col === c && !e.isLan && !e.isAct);
      if (el) {
        cells.push(
          <button key={`${r}-${c}`}
            onClick={() => onInsert(el.sym)}
            title={`${el.name} (${el.num})`}
            className={`w-full aspect-square rounded text-[9px] font-bold flex flex-col items-center justify-center leading-tight cursor-pointer transition-colors ${cellColor(el)}`}
          >
            <span className="text-[6px] font-normal opacity-60 leading-none">{el.num}</span>
            <span className="leading-none">{el.sym}</span>
          </button>
        );
      } else {
        cells.push(<div key={`${r}-${c}`} />);
      }
    }
    return cells;
  };

  const seriesRow = (filter) =>
    ELEMENTS.filter(filter).map(el => (
      <button key={el.sym}
        onClick={() => onInsert(el.sym)}
        title={`${el.name} (${el.num})`}
        className={`w-full aspect-square rounded text-[9px] font-bold flex flex-col items-center justify-center leading-tight cursor-pointer transition-colors ${cellColor(el)}`}
      >
        <span className="text-[6px] font-normal opacity-60 leading-none">{el.num}</span>
        <span className="leading-none">{el.sym}</span>
      </button>
    ));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-4 max-w-[95vw] max-h-[95vh] overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Grid3x3 className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold text-zinc-700 dark:text-zinc-200">Periodic Table</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {[
            { label: 'Alkali/Alkaline', cls: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300' },
            { label: 'Transition', cls: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300' },
            { label: 'Noble Gas', cls: 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300' },
            { label: 'Lanthanide', cls: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300' },
            { label: 'Actinide', cls: 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300' },
            { label: 'Other', cls: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400' },
          ].map(l => (
            <span key={l.label} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${l.cls}`}>{l.label}</span>
          ))}
        </div>

        <div className="space-y-0.5 min-w-[560px]">
          {[1,2,3,4,5,6,7].map(r => (
            <div key={r} style={gridStyle}>{buildRow(r)}</div>
          ))}
          <div className="h-2" />
          {/* Lanthanides */}
          <div style={gridStyle}>
            <div className="col-span-3" />
            {seriesRow(e => e.isLan)}
            {Array.from({ length: 18 - 3 - ELEMENTS.filter(e => e.isLan).length }, (_, i) => <div key={i} />)}
          </div>
          {/* Actinides */}
          <div style={gridStyle}>
            <div className="col-span-3" />
            {seriesRow(e => e.isAct)}
            {Array.from({ length: 18 - 3 - ELEMENTS.filter(e => e.isAct).length }, (_, i) => <div key={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Subject theme tokens
const SUBJECT_THEME = {
  math:      { label: 'Math',      icon: Sigma,        accent: 'purple',  header: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800',  badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300',  card: 'hover:bg-purple-50 dark:hover:bg-purple-950/20 group-hover:text-purple-600 dark:group-hover:text-purple-400', eq: 'text-purple-800 dark:text-purple-200' },
  physics:   { label: 'Physics',   icon: Zap,          accent: 'blue',    header: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',           badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300',           card: 'hover:bg-blue-50 dark:hover:bg-blue-950/20 group-hover:text-blue-600 dark:group-hover:text-blue-400',       eq: 'text-blue-800 dark:text-blue-200' },
  chemistry: { label: 'Chemistry', icon: FlaskConical, accent: 'emerald', header: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300',card: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400', eq: 'text-emerald-800 dark:text-emerald-200' },
  biology:   { label: 'Biology',   icon: Dna,          accent: 'amber',   header: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',       badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300',       card: 'hover:bg-amber-50 dark:hover:bg-amber-950/20 group-hover:text-amber-600 dark:group-hover:text-amber-400',   eq: 'text-amber-800 dark:text-amber-200' },
  periodic:  { label: 'Elements',  icon: Grid3x3,      accent: 'emerald', header: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800',badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300',card: '', eq: '' },
};

const formulasBySubject = {
  math: [
    { grade: 'Grade 7', formulas: [
      { name: 'Area of Rectangle',    equation: 'A = l × w' },
      { name: 'Perimeter',            equation: 'P = 2(l + w)' },
      { name: 'Volume of Cube',       equation: 'V = s³' },
      { name: 'Fraction Addition',    equation: 'a/b + c/d = (ad + bc)/bd' },
    ]},
    { grade: 'Grade 8', formulas: [
      { name: 'Pythagorean Theorem',  equation: 'a² + b² = c²' },
      { name: 'Slope Formula',        equation: 'm = (y₂ − y₁)/(x₂ − x₁)' },
      { name: 'Simple Interest',      equation: 'I = PRT/100' },
    ]},
    { grade: 'Grade 9', formulas: [
      { name: 'Quadratic Formula',    equation: 'x = (−b ± √(b²−4ac))/2a' },
      { name: 'Area of Circle',       equation: 'A = πr²' },
      { name: 'Volume of Cylinder',   equation: 'V = πr²h' },
    ]},
    { grade: 'Grade 10', formulas: [
      { name: 'Sine',                 equation: 'sin θ = opp/hyp' },
      { name: 'Cosine',               equation: 'cos θ = adj/hyp' },
      { name: 'Tangent',              equation: 'tan θ = opp/adj' },
      { name: 'Arithmetic Mean',      equation: 'x̄ = Σx/n' },
    ]},
    { grade: 'Grade 11', formulas: [
      { name: 'Power Rule',           equation: "d/dx(xⁿ) = nxⁿ⁻¹" },
      { name: 'Integration',          equation: '∫ xⁿ dx = xⁿ⁺¹/(n+1) + C' },
      { name: 'Log Product Rule',     equation: 'logₐ(MN) = logₐM + logₐN' },
    ]},
    { grade: 'Grade 12', formulas: [
      { name: 'Limit Definition',     equation: "f'(x) = lim[h→0](f(x+h)−f(x))/h" },
      { name: 'Dot Product',          equation: 'a·b = |a||b|cos θ' },
      { name: 'Matrix Multiply',      equation: '(AB)ᵢⱼ = Σₖ AᵢₖBₖⱼ' },
    ]},
  ],
  physics: [
    { grade: 'Grade 7', formulas: [
      { name: 'Speed',                equation: 'v = d/t' },
      { name: 'Density',              equation: 'ρ = m/V' },
      { name: 'Force',                equation: 'F = ma' },
    ]},
    { grade: 'Grade 8', formulas: [
      { name: 'Work',                 equation: 'W = Fd' },
      { name: 'Power',                equation: 'P = W/t' },
      { name: 'Kinetic Energy',       equation: 'KE = ½mv²' },
      { name: 'Potential Energy',     equation: 'PE = mgh' },
    ]},
    { grade: 'Grade 9', formulas: [
      { name: 'Wave Speed',           equation: 'v = fλ' },
      { name: "Ohm's Law",            equation: 'V = IR' },
      { name: 'Pressure',             equation: 'P = F/A' },
    ]},
    { grade: 'Grade 10', formulas: [
      { name: 'Refractive Index',     equation: 'n = sin i / sin r' },
      { name: 'Lens Formula',         equation: '1/f = 1/v + 1/u' },
      { name: "Coulomb's Law",        equation: 'F = kq₁q₂/r²' },
    ]},
    { grade: 'Grade 11', formulas: [
      { name: "Newton's 2nd Law",     equation: 'F = ma' },
      { name: 'Gravitational Force',  equation: 'F = Gm₁m₂/r²' },
      { name: 'Centripetal Force',    equation: 'F = mv²/r' },
    ]},
    { grade: 'Grade 12', formulas: [
      { name: "Einstein's Equation",  equation: 'E = mc²' },
      { name: 'Photoelectric Effect', equation: 'E = hf' },
      { name: 'Radioactive Decay',    equation: 'N = N₀e^(−λt)' },
    ]},
  ],
  chemistry: [
    { grade: 'Grade 7', formulas: [
      { name: 'States of Matter',     equation: 'Solid → Liquid → Gas' },
      { name: 'Mass from Density',    equation: 'm = ρV' },
    ]},
    { grade: 'Grade 8', formulas: [
      { name: 'Number of Moles',      equation: 'n = m/M' },
      { name: 'Empirical Formula',    equation: 'Ratio of atoms = mol ratio' },
    ]},
    { grade: 'Grade 9', formulas: [
      { name: 'Concentration',        equation: 'C = n/V' },
      { name: '% Composition',        equation: '% = (mass/total) × 100' },
    ]},
    { grade: 'Grade 10', formulas: [
      { name: 'pH Formula',           equation: 'pH = −log[H⁺]' },
      { name: 'Neutralization',       equation: 'H⁺ + OH⁻ → H₂O' },
    ]},
    { grade: 'Grade 11', formulas: [
      { name: 'Ideal Gas Law',        equation: 'PV = nRT' },
      { name: 'Enthalpy Change',      equation: 'ΔH = H(prod) − H(react)' },
    ]},
    { grade: 'Grade 12', formulas: [
      { name: 'Rate Law',             equation: 'Rate = k[A]ⁿ' },
      { name: 'Equilibrium Constant', equation: 'K = [C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ' },
      { name: 'Cell Potential',       equation: 'E°cell = E°cath − E°an' },
    ]},
  ],
  biology: [
    { grade: 'Grade 7', formulas: [
      { name: 'Magnification',        equation: 'M = image size / actual size' },
      { name: 'Cell Division',        equation: 'Mitosis: 2n → 2n' },
    ]},
    { grade: 'Grade 8', formulas: [
      { name: 'BMI',                  equation: 'BMI = kg / m²' },
      { name: 'Heart Rate',           equation: 'HR = beats / min' },
    ]},
    { grade: 'Grade 9', formulas: [
      { name: 'Photosynthesis',       equation: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂' },
      { name: 'Respiration',          equation: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP' },
    ]},
    { grade: 'Grade 10', formulas: [
      { name: 'Monohybrid Ratio',     equation: 'Phenotype ratio = 3:1' },
      { name: 'Dihybrid Ratio',       equation: 'Phenotype ratio = 9:3:3:1' },
      { name: 'Hardy-Weinberg',       equation: 'p² + 2pq + q² = 1' },
    ]},
    { grade: 'Grade 11', formulas: [
      { name: 'Population Growth',    equation: 'dN/dt = rN(1 − N/K)' },
      { name: 'Carrying Capacity',    equation: 'K = maximum population' },
    ]},
    { grade: 'Grade 12', formulas: [
      { name: 'Chi-Square',           equation: 'χ² = Σ(O − E)²/E' },
      { name: 'DNA Base Pairing',     equation: 'A = T,  G ≡ C' },
      { name: 'Central Dogma',        equation: 'DNA → mRNA → Protein' },
    ]},
  ],
};

export default function FormulaPanel({ subject, onClose }) {
  const [showPeriodic, setShowPeriodic] = useState(false);
  const { addObject, textColor, textFont, scale, position } = useBoardStore();

  const isOpen = !!subject;
  const theme = SUBJECT_THEME[subject] || SUBJECT_THEME.math;
  const SubjectIcon = theme.icon;
  const grades = formulasBySubject[subject] || [];

  useEffect(() => {
    if (subject === 'periodic') setShowPeriodic(true);
  }, [subject]);

  const insertAtCenter = (text) => {
    const canvasX = (window.innerWidth / 2 - position.x) / scale;
    const canvasY = (window.innerHeight / 2 - position.y) / scale;
    addObject({
      type: 'text', text,
      x: canvasX - 100, y: canvasY - 20,
      fontSize: 26, fontColor: textColor, fontFamily: textFont,
      isBold: false, isItalic: false, isUnderline: false,
      align: 'left', rotation: 0, scaleX: 1, scaleY: 1,
    });
  };

  return (
    <>
      {/* Panel — mobile: near top full width; desktop: right sidebar */}
      <div className={`
        fixed z-40 flex flex-col
        bg-white/97 dark:bg-zinc-900/97 backdrop-blur-md
        border border-zinc-200/60 dark:border-zinc-800/60
        shadow-2xl
        transition-all duration-300
        top-16 left-4 right-4 max-h-[calc(100dvh-9rem)] rounded-2xl
        sm:top-4 sm:right-20 sm:bottom-4 sm:left-auto sm:w-72 sm:max-h-none sm:rounded-2xl
        ${isOpen ? 'opacity-100 translate-y-0 sm:translate-x-0' : 'opacity-0 pointer-events-none translate-y-4 sm:translate-y-0 sm:translate-x-8'}
      `}>

        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 ${theme.header} rounded-t-2xl shrink-0`}>
          <div className="flex items-center gap-2">
            <SubjectIcon className="w-4 h-4" />
            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{theme.label}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${theme.badge}`}>
              Formulas
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-4">
          {subject === 'periodic' ? (
            <button
              onClick={() => setShowPeriodic(true)}
              className="w-full group p-4 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all text-left"
            >
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <Grid3x3 className="w-4 h-4" />
                Open Periodic Table
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Browse all 118 elements. Tap any to insert on canvas.
              </p>
            </button>
          ) : (
            grades.map((section) => (
              <div key={section.grade}>
                {/* Grade badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${theme.badge}`}>
                    {section.grade}
                  </span>
                  <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
                </div>

                <div className="space-y-1.5">
                  {section.formulas.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => insertAtCenter(f.equation)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('source', 'math-formula');
                        e.dataTransfer.setData('text/plain', f.equation);
                        e.dataTransfer.effectAllowed = 'copy';
                      }}
                      className={`
                        group w-full text-left
                        bg-white dark:bg-zinc-900/60
                        border border-zinc-100 dark:border-zinc-800
                        rounded-xl px-3 py-2.5
                        transition-all duration-150
                        cursor-grab active:cursor-grabbing
                        ${theme.card}
                        hover:border-transparent hover:shadow-md
                        active:scale-[0.98]
                      `}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 group-hover:text-current transition-colors truncate">
                            {f.name}
                          </p>
                          <p className="mt-0.5 text-sm font-mono font-semibold text-zinc-800 dark:text-zinc-100 truncate">
                            {f.equation}
                          </p>
                        </div>
                        <Plus className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-600 group-hover:text-current shrink-0 mt-0.5 transition-colors" />
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
          onInsert={(sym) => { insertAtCenter(sym); setShowPeriodic(false); }}
        />
      )}
    </>
  );
}
