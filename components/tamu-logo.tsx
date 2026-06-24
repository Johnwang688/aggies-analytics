import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Texas A&M logo mark.
 */
export function TamuLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/tamu-logo.png"
      alt="Texas A&M University"
      width={48}
      height={48}
      className={cn("size-9 object-contain", className)}
      priority
    />
  );
}
