import Reveal from "../Reveal";
import SplitHeading from "../SplitHeading";
import ProductCard from "../ProductCard";
import { products } from "@/data/products";

/** All four products in one section: a simple card grid. Used on the home page and the Products page. */
export default function ProductGrid({ detailed = false, withHeading = true }: { detailed?: boolean; withHeading?: boolean }) {
  return (
    <section data-theme="paper" className="px-page py-[clamp(40px,5.0vw,75px)]">
      <div className="wrap">
      {withHeading ? (
        <div className="flex flex-col items-center text-center gap-5 mb-[clamp(28px,3.5vw,50px)]">
          <Reveal as="span" className="label opacity-60">Our products</Reveal>
          <SplitHeading
            className="font-display font-medium text-[clamp(30px,3.6vw,52px)] leading-[1.08] tracking-[-0.03em] text-center"
            lines={[{ text: "Software for every", pad: 0.08 }, { text: "kind of business.", pad: 0.08, style: { opacity: 0.45 } }]}
          />
          <Reveal as="p" className="m-0 max-w-[520px] text-[16px] leading-[1.55] opacity-70">
            Hotel, restaurant, retail and laundry management software, each built around the real-world needs of the business it serves.
          </Reveal>
        </div>
      ) : null}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {products.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 100}>
            <ProductCard p={p} detailed={detailed} />
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}
