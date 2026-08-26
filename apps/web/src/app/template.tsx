/**
 * Re-mounts on every navigation, giving each page its entrance: an ink veil
 * with a copper edge sweeps up while the content rises in underneath. Pure
 * CSS animations (see globals.css); reduced motion disables both.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page-veil" aria-hidden="true" />
      <div className="page-enter">{children}</div>
    </>
  );
}
