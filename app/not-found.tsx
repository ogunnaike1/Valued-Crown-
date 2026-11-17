import Btn from "@/components/Btn";

export default function NotFound() {
  return (
    <section data-theme="ink" className="bg-ink text-paper px-page min-h-screen flex flex-col justify-center gap-8">
      <span className="label">404</span>
      <h1 className="m-0 font-display font-medium text-[clamp(36px,5.2vw,72px)] leading-[1.08] tracking-[-0.03em]">Page not found.</h1>
      <div className="flex gap-2 flex-wrap">
        <Btn href="/" label="Back to home" arrow bg="#FAFCFF" fg="#041433" />
        <Btn href="/products" label="Our products" variant="outline" borderColor="#FAFCFF" />
      </div>
    </section>
  );
}
