import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Search, ShoppingCart, User, CreditCard, Banknote, Trash2, Plus, Minus, Loader2 } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchPOSData, createSale } from '@/modules/sales/slice/salesSlice';
import { fetchAccounts } from '@/modules/finance/slice/accountSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';

const POS: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, customers, loading, isSubmitting } = useAppSelector((state) => state.sales);
  const { accounts } = useAppSelector((state) => state.accounts);
  const { user } = useAppSelector((state) => state.auth);
  const currencySymbol = user?.tenant?.currencySymbol || '$';
  const taxRate = Number(user?.tenant?.taxRate || 0);
  
  const [cart, setCart] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('guest');
  const [paymentMethod, setPaymentMethod] = useState<string>('CASH');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  useEffect(() => {
    dispatch(fetchPOSData());
    dispatch(fetchAccounts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return Array.isArray(products) ? products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toString() === searchQuery
    ) : [];
  }, [products, searchQuery]);

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

  const getProductPrice = (product: any) => {
    const attrs = product.attributes || {};
    // Look for price-related keys in a case-insensitive way
    const priceKey = Object.keys(attrs).find(k => 
      ['price', 'saleprice', 'mrp', 'rate', 'unit price'].includes(k.toLowerCase())
    );
    
    if (priceKey) return Number(attrs[priceKey]);
    return Number(product.price || 0);
  };

  const getProductStock = (product: any) => {
    const attrs = product.attributes || {};
    // Case-insensitive check for stock
    const stockKey = Object.keys(attrs).find(k => 
      ['stock', 'quantity', 'qty', 'stock count'].includes(k.toLowerCase())
    );
    return Number(stockKey ? attrs[stockKey] : (product.stock || 0));
  };

  const subtotal = cart.reduce((acc, item) => acc + (getProductPrice(item) * item.qty), 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const handleCheckout = async () => {
    const saleData = {
      customerId: selectedCustomerId === 'guest' ? undefined : Number(selectedCustomerId),
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.qty,
        unitPrice: getProductPrice(item),
      })),
      paidAmount: Number(paidAmount) || total,
      paymentMethod,
      accountId: selectedAccountId ? Number(selectedAccountId) : undefined,
    };

    const result = await dispatch(createSale(saleData));
    if (createSale.fulfilled.match(result)) {
      setCart([]);
      setIsCheckoutOpen(false);
      setPaidAmount('');
      setSelectedCustomerId('guest');
    }
  };

  const getProductImage = (product: any) => {
    if (product.thumb) return product.thumb;
    
    const attrs = product.attributes || {};
    // Look for any value that starts with http and looks like an image in attributes
    const imageUrl = Object.values(attrs).find(val => 
      typeof val === 'string' && val.startsWith('http') && 
      (val.match(/\.(jpeg|jpg|gif|png|webp)/i) || val.includes('cloudinary'))
    );
    return imageUrl as string | undefined;
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)] overflow-hidden animate-in fade-in duration-500">
        {/* Left: Product Selection */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 bg-card border-border h-12" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
              <SelectTrigger className="w-full md:w-64 h-12 bg-card">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select Customer" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guest">Guest Customer</SelectItem>
                {Array.isArray(customers) && customers.map(c => (
                  <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-4 flex-1">
            {loading && products.length === 0 ? (
              [...Array(12)].map((_, i) => (
                <div key={i} className="h-48 rounded-xl border border-border/50 bg-card/50 p-6 flex flex-col items-center justify-between">
                  <Skeleton className="h-12 w-12 rounded-xl bg-muted/50" />
                  <div className="space-y-2 w-full flex flex-col items-center">
                    <Skeleton className="h-4 w-3/4 bg-muted/50" />
                    <Skeleton className="h-4 w-1/2 bg-muted/50" />
                  </div>
                  <Skeleton className="h-5 w-20 bg-muted/50" />
                </div>
              ))
            ) : Array.isArray(filteredProducts) && filteredProducts.map(product => {
              const imageUrl = getProductImage(product);
              return (
                <Card 
                  key={product.id} 
                  className="h-48 cursor-pointer hover:border-primary/50 transition-all border-border bg-card group shadow-none"
                  onClick={() => addToCart(product)}
                >
                  <CardContent className="p-5 flex flex-col items-center text-center justify-between h-full">
                    <div className="w-16 h-16 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-all overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingCart className="h-7 w-7 text-primary" />
                      )}
                    </div>
                    <div className="space-y-1 w-full">
                      <p className="font-bold text-sm line-clamp-2 w-full px-1 leading-tight">{product.name}</p>
                      <p className="text-primary font-bold text-base">{currencySymbol}{getProductPrice(product)}</p>
                    </div>
                    <Badge variant="outline" className="h-6 text-[10px] bg-muted/50 border-border px-2">Stock: {getProductStock(product)}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right: Cart & Summary */}
        <div className="w-full lg:w-96 flex flex-col gap-4 bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="font-bold text-xl flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Current Order
            </h2>
            <Badge className="bg-primary/10 text-primary border-primary/20">{cart.length} Items</Badge>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
            {loading && cart.length === 0 ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3 bg-muted/20 p-2 rounded-lg border border-border/50">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24 bg-muted/50" />
                    <Skeleton className="h-3 w-16 bg-muted/50" />
                  </div>
                  <Skeleton className="h-8 w-16 bg-muted/50" />
                </div>
              ))
            ) : cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 italic">
                <ShoppingCart className="h-12 w-12 mb-2" />
                <p>Cart is empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg border border-border">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{currencySymbol}{getProductPrice(item)} each</p>
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
              <span className="font-semibold">{currencySymbol}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax ({taxRate}%)</span>
              <span className="font-semibold">{currencySymbol}{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t border-border/50">
              <span>Total</span>
              <span className="text-primary">{currencySymbol}{total.toFixed(2)}</span>
            </div>

            <Button 
              className="w-full h-14 text-lg font-bold shadow-none mt-4" 
              disabled={cart.length === 0 || isSubmitting}
              onClick={() => {
                setPaidAmount(total.toFixed(2));
                setIsCheckoutOpen(true);
              }}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              CHECKOUT
            </Button>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Order</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex justify-between items-center bg-primary/5 p-4 rounded-lg border border-primary/10 mb-2">
              <span className="font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-primary">{currencySymbol}{total.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'CASH', icon: Banknote, label: 'Cash' },
                  { id: 'CARD', icon: CreditCard, label: 'Card' },
                  { id: 'MOBILE_BANKING', icon: CreditCard, label: 'Mobile Banking' },
                ].map((method) => (
                  <Button
                    key={method.id}
                    type="button"
                    variant={paymentMethod === method.id ? 'default' : 'outline'}
                    className="flex flex-col h-16 gap-1"
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <method.icon className="h-4 w-4" />
                    <span className="text-[10px]">{method.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deposit to Account</label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Account" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(accounts) && accounts.map(acc => (
                    <SelectItem key={acc.id} value={acc.id.toString()}>{acc.name} (${Number(acc.balance).toFixed(2)})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Paid</label>
              <Input 
                type="number" 
                value={paidAmount} 
                onChange={(e) => setPaidAmount(e.target.value)}
                placeholder="Enter paid amount"
                className="h-12 text-lg font-bold"
              />
              {Number(paidAmount) < total && (
                <p className="text-xs text-destructive font-medium">
                  Remaining {currencySymbol}{(total - (Number(paidAmount) || 0)).toFixed(2)} will be added to Customer's Due.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>Cancel</Button>
            <Button onClick={handleCheckout} disabled={isSubmitting} className="px-8">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              CONFIRM ORDER
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default POS;
