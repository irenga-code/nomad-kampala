// The club's bottle pictures, exactly as supplied, passing one after another (flat, endless, pure CSS).
const PICS = [
  ["don-julio-reposado-cocktails", "Don Julio Reposado with cocktails"],
  ["don-julio-reposado", "Don Julio Reposado tequila"],
  ["don-julio-1942-box", "Don Julio 1942 tequila with gift box"],
  ["don-julio-1942", "Don Julio 1942 anejo tequila"],
  ["martell-xo-dark", "Martell XO cognac"],
  ["martell-xo", "Martell XO cognac bottle"],
  ["martell-blue-swift", "Martell Blue Swift"],
  ["martell-vs", "Martell VS fine cognac"],
  ["martell-vsop", "Martell VSOP with gift box"],
  ["martell-xo-box", "Martell XO with gift box"],
  ["martell-blue-swift-2", "Martell Blue Swift spirit drink"],
  ["hennessy-vs-1l", "Hennessy VS cognac bottles"],
  ["prosecco", "Prosecco Extra Dry"],
  ["luc-belaire-collection", "Luc Belaire Gold, Rosé, Luxe and Bleu champagne-style bottles"],
  ["luc-belaire-luxe", "Luc Belaire Luxe sparkling wine"],
  ["luc-belaire-rose-alcohol-removed", "Luc Belaire Rare Rosé alcohol-removed sparkling wine"],
  ["clase-azul-reposado", "Clase Azul Reposado tequila"],
  ["hennessy-vs", "Hennessy VS with gift box"],
  ["johnnie-walker-double-black", "Johnnie Walker Double Black"],
  ["johnnie-walker-red", "Johnnie Walker Red Label"],
];
export default function BottleMarquee() {
  const row = (key: string, hidden: boolean) => (
    <div className="bm-row" key={key} aria-hidden={hidden || undefined}>
      {PICS.map(([f, alt]) => (
        <img key={`${key}-${f}`} src={`/images/bottles/${f}.png`} alt={hidden ? "" : `${alt} at NOMAD Kampala`} loading="lazy" />
      ))}
    </div>
  );
  return <div className="bm"><div className="bm-track">{row("a", false)}{row("b", true)}</div></div>;
}
