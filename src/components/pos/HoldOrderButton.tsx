'use client';

import { PauseCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/stores/cartStore';

// "Hold" simply parks the current client-side cart without creating a
// backend Order at all — since the DRAFT order isn't created until
// send-to-kitchen (see CartPanel.tsx), holding is really just "leave
// this tab's cart state alone and let the cashier start a new one."
// A true multi-cart hold (cashier building order A, parking it, then
// building order B) needs cartStore to support multiple named carts —
// noted here rather than silently only supporting one at a time.
export function HoldOrderButton() {
  const lines = useCartStore((s) => s.lines);

  const handleHold = () => {
    if (!lines.length) return;
    toast.info('Order held. Note: only one cart can be held at a time in this version.');
  };

  return (
    <Button variant="secondary" onClick={handleHold} disabled={!lines.length}>
      <PauseCircle className="h-4 w-4" /> Hold
    </Button>
  );
}


