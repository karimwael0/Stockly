"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, CheckCircle2, Package } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { getItemsToBuy, toggleItemToBuy } from "@/app/actions/items";

type ShoppingItem = {
  id: number;
  name: string;
  categoryName: string;
  locationName: string;
  toBuy: boolean;
};

export default function ShoppingListPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const result = await getItemsToBuy();
      if (result.success && result.data) {
        setItems(result.data);
      } else {
        toast.error(result.error || "Failed to load shopping list");
      }
    } catch (error) {
      toast.error("Failed to load shopping list");
    } finally {
      setLoading(false);
    }
  };

  const togglePurchased = async (item: ShoppingItem) => {
    // Toggle the toBuy status (which removes it from the shopping list)
    const result = await toggleItemToBuy(item.id);
    if (result.success) {
      toast.success("Item removed from shopping list");
      await loadItems(); // Reload the list
    } else {
      toast.error(result.error || "Failed to update item");
    }
  };

  const unpurchasedItems = items.filter((item) => item.toBuy);
  const purchasedItems: ShoppingItem[] = []; // Items are removed when toBuy is false

  // Group items by location
  const groupedByLocation = unpurchasedItems.reduce((acc, item) => {
    if (!acc[item.locationName]) {
      acc[item.locationName] = [];
    }
    acc[item.locationName].push(item);
    return acc;
  }, {} as Record<string, typeof unpurchasedItems>);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Shopping List</h1>
          <p className="text-muted-foreground">
            All items marked as "To Buy" across your locations
          </p>
        </div>
      </div>

      {unpurchasedItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Your shopping list is empty</p>
            <p className="text-muted-foreground">
              Mark items as "To Buy" in your inventory to see them here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByLocation).map(([location, locationItems]) => (
            <Card key={location}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  {location}
                </CardTitle>
                <CardDescription>
                  {locationItems.length} item{locationItems.length !== 1 ? "s" : ""} to buy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {locationItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={false}
                          onCheckedChange={() => togglePurchased(item)}
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.categoryName}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">To Purchase</p>
              <p className="text-2xl font-bold">{unpurchasedItems.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
