import Image from "next/image";
import Link from "next/link";
import { toSlug } from "./slug";

export default function DishCard({ dish, isFirst = false }) {
  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900">
      <Link href={`/menu/${toSlug(dish.name)}`} className="block">
        
        {/* 
          next/image optimizations:
          - `fill` + relative parent = responsive without layout shift
          - `sizes` tells the browser the correct image width for each breakpoint
          - `priority={true}` ONLY for the first above-the-fold image (LCP)
          - `object-cover` keeps aspect ratio while filling the box
        */}
        <div className="relative w-full h-48">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={isFirst}
          />
        </div>

        <div className="p-4">
          <h3 className="font-serif font-medium text-lg text-neutral-100 mb-1">
            {dish.name}
          </h3>
          <p className="text-neutral-400 text-sm">
            {dish.price} Birr
          </p>
        </div>
      </Link>
    </div>
  );
}