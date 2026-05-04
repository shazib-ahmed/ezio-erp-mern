import React, { useState } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Search, ShoppingCart, User, CreditCard, Banknote, Trash2, Plus, Minus } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';

const products = [
  { id: 1, name: 'Industrial Motor', price: 1200, category: 'Machinery', stock: 15 },
  { id: 2, name: 'Power Drill', price: 85, category: 'Hardware', stock: 45 },
  { id: 3, name: 'Steel Pipe 2"', price: 12, category: 'Construction', stock: 500 },
  { id: 4, name: 'Circuit Breaker', price: 45, category: 'Electronics', stock: 120 },
];

const POS: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">
        {/* Left: Product Selection */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Scan barcode or search products..." className="pl-10 bg-card border-border" />
            </div>
            <Button variant="outline" className="gap-2">
              <User className="h-4 w-4" /> Guest Customer
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2">
            {products.map(product => (
              <Card 
                key={product.id} 
                className="cursor-pointer hover:border-primary/50 transition-colors border-border bg-card"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-bold text-sm truncate w-full">{product.name}</p>
                  <p className="text-primary font-bold">${product.price}</p>
                  <Badge variant="outline" className="text-[10px] bg-muted/50 border-border">Stock: {product.stock}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Cart & Checkout */}
        <div className="w-full lg:w-96 flex flex-col gap-4 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-bold text-xl flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Current Order
            </h2>
            <Badge className="bg-primary/10 text-primary border-primary/20">{cart.length} Items</Badge>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 italic">
                <ShoppingCart className="h-12 w-12 mb-2" />
                <p>Cart is empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg border border-border">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">${item.price} each</p>
                  </div>
                  <div className="flex items-center gap-1 bg-background border border-border rounded-md px-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(item.id, -1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-xs font-bold">{item.qty}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(item.id, 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (5%)</span>
              <span className="font-semibold">${(total * 0.05).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t border-border/50">
              <span>Total</span>
              <span className="text-primary">${(total * 1.05).toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button variant="outline" className="gap-2 h-12">
                <Banknote className="h-4 w-4" /> Cash
              </Button>
              <Button className="gap-2 h-12">
                <CreditCard className="h-4 w-4" /> Card
              </Button>
            </div>
            <Button className="w-full h-14 text-lg font-bold shadow-none" disabled={cart.length === 0}>
              PLACE ORDER
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default POS;
