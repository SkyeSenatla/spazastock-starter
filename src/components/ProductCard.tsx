import {Card, CardContent } from "@/components/ui/card";
import {formatCents } from "@/lib/money";
 
type Product =components ["schemas"]["Product"];

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card >
      <CardContent className=""space-y-2 p-4">
      <h3 className="font-semibold break-words">Product</h3>
      <p>{formatCents(product.priceInCents)}</p>
      <p className="text-sm text-muted-foreground"><UpdatedAgo since={since}/></p>
      </CardContent>
    </Card>
  );
}