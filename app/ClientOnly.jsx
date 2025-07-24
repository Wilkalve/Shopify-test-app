export default function ClientOnly({ children, fallback = null }) {
  return typeof window !== 'undefined' ? children() : fallback;
}
