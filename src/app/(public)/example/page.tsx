/**
 * PUBLIC PAGE TEMPLATE
 * Minimalist template for non-authenticated pages.
 */

export default function PublicExamplePage() {
  return (
    <section>
      <h1>Public Section Template</h1>
      <p>This is where public content goes (e.g., Landing, About, Pricing).</p>
      {/* 
        Collaboration standards:
        - Layout is managed by (public)/layout.tsx
        - UI components go in src/components/ui/
        - Data fetching is done in services
      */}
    </section>
  );
}
