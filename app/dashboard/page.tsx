"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLowStockItems, getItemsToBuy } from "@/app/actions/items";
import { toast } from "sonner";

type LowStockItem = {
  id: number;
  name: string;
  quantity: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  toBuy: boolean;
  categoryName: string;
  locationName: string;
};

type ToBuyItem = {
  id: number;
  name: string;
  categoryName: string;
  locationName: string;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [toBuyItems, setToBuyItems] = useState<ToBuyItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [lowStockResult, toBuyResult] = await Promise.all([
        getLowStockItems(),
        getItemsToBuy(),
      ]);

      if (lowStockResult.success && lowStockResult.data) {
        setLowStockItems(lowStockResult.data);
      } else {
        toast.error(lowStockResult.error || "Failed to load low stock items");
      }

      if (toBuyResult.success && toBuyResult.data) {
        setToBuyItems(toBuyResult.data);
      } else {
        toast.error(toBuyResult.error || "Failed to load items to buy");
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your inventory and shopping needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Low Stock Items
                </CardTitle>
                <CardDescription>
                  Items that need attention
                </CardDescription>
              </div>
              <Link href="/dashboard/inventory">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No low stock items
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.locationName} • {item.categoryName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-destructive">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                {lowStockItems.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{lowStockItems.length - 5} more items
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  To Buy Items
                </CardTitle>
                <CardDescription>
                  Items marked for shopping
                </CardDescription>
              </div>
              <Link href="/dashboard/shopping-list">
                <Button variant="outline" size="sm">
                  View List
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {toBuyItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No items to buy
              </p>
            ) : (
              <div className="space-y-3">
                {toBuyItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.locationName} • {item.categoryName}
                      </p>
                    </div>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
                {toBuyItems.length > 5 && (
                  <p className="text-sm text-muted-foreground text-center">
                    +{toBuyItems.length - 5} more items
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to manage your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/inventory">
              <Button>
                <Package className="mr-2 h-4 w-4" />
                Manage Inventory
              </Button>
            </Link>
            <Link href="/dashboard/shopping-list">
              <Button variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Shopping List
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
