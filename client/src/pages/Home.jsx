import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import PageTransition from "../components/PageTransition";
import HeroSection from "../components/HeroSection";
import PromoStrip from "../components/PromoStrip";
import CategoryRow from "../components/CategoryRow";
import ProductCard from "../components/ProductCard";
import SellerBanner from "../components/SellerBanner";

const products = [
  {
    _id: "dummy-camera",
    name: "DSLR Camera Kit 24MP",
    cat: "Electronics",
    price: 28999,
    oldPrice: 47999,
    rating: 4.9,
    sale: "-40%",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80"
  },
  {
    _id: "dummy-laptop",
    name: 'Ultra Slim Laptop 14"',
    cat: "Electronics",
    price: 52499,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80"
  },
  {
    _id: "dummy-bag",
    name: "Leather Tote Bag",
    cat: "Fashion",
    price: 3499,
    rating: 5.0,
    isNew: true,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80"
  },
  {
    _id: "dummy-plant",
    name: "Indoor Plant Set of 3",
    cat: "Home",
    price: 1299,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&q=80"
  },
  {
    _id: "dummy-watch",
    name: "Smart Watch Series 8",
    cat: "Electronics",
    price: 18999,
    oldPrice: 24999,
    rating: 4.8,
    sale: "-23%",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
  },
  {
    _id: "dummy-jogger",
    name: "Men's Jogger Set",
    cat: "Fashion",
    price: 1799,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80"
  },
  {
    _id: "dummy-coffee",
    name: "Pour-Over Coffee Kit",
    cat: "Kitchen",
    price: 2299,
    rating: 4.9,
    isNew: true,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80"
  },
  {
    _id: "dummy-yoga",
    name: "Yoga Mat Premium 6mm",
    cat: "Sports",
    price: 899,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80"
  }
];

const sectionTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1]
};

const grid = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05
    }
  }
};

const gridItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
};

function AnimatedSection({ children, className = "" }) {
  const { ref, inView } = useInView({ threshold: 0.12, triggerOnce: true });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={sectionTransition}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-brand-bg pb-12 text-brand-ink dark:bg-night-bg dark:text-white">
        <HeroSection />
        <PromoStrip />

        <AnimatedSection className="mx-auto max-w-6xl px-6 py-12">
          <CategoryRow />
        </AnimatedSection>

        <AnimatedSection className="mx-auto max-w-6xl px-6 py-4">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">Trending now</p>
            <h2 className="mt-2 font-display text-3xl font-black text-brand-ink dark:text-white">Trending Products</h2>
          </div>
          <motion.div variants={grid} initial="hidden" animate="show" className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <motion.div key={product._id} variants={gridItem}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        <AnimatedSection>
          <SellerBanner />
        </AnimatedSection>
      </main>
    </PageTransition>
  );
}
