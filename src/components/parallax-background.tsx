/**
 * Fond parallaxe pastel — version légère en CSS pur.
 * Remplace l'ancien canvas redessiné à 60 fps : les blobs sont animés par le
 * compositeur GPU (transform), aucun travail JS par frame.
 */

const BLOBS = [
  { className: 'parallax-blob blob-1', style: { background: 'rgba(165, 180, 252, 0.45)' } },
  { className: 'parallax-blob blob-2', style: { background: 'rgba(125, 211, 252, 0.4)' } },
  { className: 'parallax-blob blob-3', style: { background: 'rgba(240, 171, 252, 0.35)' } },
  { className: 'parallax-blob blob-4', style: { background: 'rgba(253, 164, 175, 0.35)' } },
  { className: 'parallax-blob blob-5', style: { background: 'rgba(252, 211, 77, 0.3)' } },
];

export function ParallaxBackground() {
  return (
    <div
      aria-hidden="true"
      className="hidden md:block fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      {BLOBS.map((blob) => (
        <div key={blob.className} className={blob.className} style={blob.style} />
      ))}
    </div>
  );
}
