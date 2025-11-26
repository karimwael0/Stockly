"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, ShoppingCart, Package, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "@/app/actions/locations";
import {
  getCategoriesByLocation,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/actions/categories";
import {
  getItemsByCategory,
  createItem,
  updateItem,
  deleteItem,
  toggleItemToBuy,
} from "@/app/actions/items";

type Location = {
  id: number;
  name: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
};

type Category = {
  id: number;
  name: string;
  locationId: number;
  createdAt: Date;
  updatedAt: Date;
};

type Item = {
  id: number;
  name: string;
  quantity: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  toBuy: boolean;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
};

export default function InventoryPage() {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [itemStatus, setItemStatus] = useState<Item["status"]>("In Stock");

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Load categories when location changes
  useEffect(() => {
    if (selectedLocationId) {
      loadCategories(selectedLocationId);
      setSelectedCategoryId(null);
      setItems([]);
    } else {
      setCategories([]);
      setItems([]);
    }
  }, [selectedLocationId]);

  // Load items when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      loadItems(selectedCategoryId);
    } else {
      setItems([]);
    }
  }, [selectedCategoryId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getLocations();
      if (result.success && result.data) {
        setLocations(result.data);
        if (result.data.length > 0) {
          setSelectedLocationId(result.data[0].id);
        }
      }
    } catch (error) {
      toast.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async (locationId: number) => {
    try {
      const result = await getCategoriesByLocation(locationId);
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const loadItems = async (categoryId: number) => {
    try {
      const result = await getItemsByCategory(categoryId);
      if (result.success && result.data) {
        setItems(result.data);
      }
    } catch (error) {
      toast.error("Failed to load items");
    }
  };

  const handleCreateLocation = async (formData: FormData) => {
    const name = formData.get("name") as string;
    if (!name) {
      toast.error("Location name is required");
      return;
    }

    const result = await createLocation(name);
    if (result.success && result.data) {
      toast.success("Location created successfully");
      setIsLocationDialogOpen(false);
      await loadData();
      if (result.data) {
        setSelectedLocationId(result.data.id);
      }
    } else {
      toast.error(result.error || "Failed to create location");
    }
  };

  const handleUpdateLocation = async (formData: FormData) => {
    if (!editingLocation) return;
    const name = formData.get("name") as string;
    if (!name) {
      toast.error("Location name is required");
      return;
    }

    const result = await updateLocation(editingLocation.id, name);
    if (result.success) {
      toast.success("Location updated successfully");
      setIsLocationDialogOpen(false);
      setEditingLocation(null);
      await loadData();
    } else {
      toast.error(result.error || "Failed to update location");
    }
  };

  const handleDeleteLocation = async (id: number) => {
    if (!confirm("Are you sure you want to delete this location? All categories and items will be deleted.")) {
      return;
    }

    const result = await deleteLocation(id);
    if (result.success) {
      toast.success("Location deleted successfully");
      await loadData();
      if (selectedLocationId === id) {
        setSelectedLocationId(null);
      }
    } else {
      toast.error(result.error || "Failed to delete location");
    }
  };

  const handleCreateCategory = async (formData: FormData) => {
    if (!selectedLocationId) {
      toast.error("Please select a location first");
      return;
    }
    const name = formData.get("name") as string;
    if (!name) {
      toast.error("Category name is required");
      return;
    }

    const result = await createCategory(selectedLocationId, name);
    if (result.success && result.data) {
      toast.success("Category created successfully");
      setIsCategoryDialogOpen(false);
      await loadCategories(selectedLocationId);
      if (result.data) {
        setSelectedCategoryId(result.data.id);
      }
    } else {
      toast.error(result.error || "Failed to create category");
    }
  };

  const handleUpdateCategory = async (formData: FormData) => {
    if (!editingCategory) return;
    const name = formData.get("name") as string;
    if (!name) {
      toast.error("Category name is required");
      return;
    }

    const result = await updateCategory(editingCategory.id, name);
    if (result.success) {
      toast.success("Category updated successfully");
      setIsCategoryDialogOpen(false);
      setEditingCategory(null);
      if (selectedLocationId) {
        await loadCategories(selectedLocationId);
      }
    } else {
      toast.error(result.error || "Failed to update category");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category? All items will be deleted.")) {
      return;
    }

    const result = await deleteCategory(id);
    if (result.success) {
      toast.success("Category deleted successfully");
      if (selectedLocationId) {
        await loadCategories(selectedLocationId);
      }
      if (selectedCategoryId === id) {
        setSelectedCategoryId(null);
      }
    } else {
      toast.error(result.error || "Failed to delete category");
    }
  };

  const handleCreateItem = async (formData: FormData) => {
    if (!selectedCategoryId) {
      toast.error("Please select a category first");
      return;
    }
    const name = formData.get("name") as string;
    const quantity = parseInt(formData.get("quantity") as string) || 0;
    const status = itemStatus;
    const toBuy = formData.get("toBuy") === "on";

    if (!name) {
      toast.error("Item name is required");
      return;
    }

    const result = await createItem(selectedCategoryId, name, quantity, status, toBuy);
    if (result.success) {
      toast.success("Item created successfully");
      setIsItemDialogOpen(false);
      setItemStatus("In Stock");
      await loadItems(selectedCategoryId);
    } else {
      toast.error(result.error || "Failed to create item");
    }
  };

  const handleUpdateItem = async (formData: FormData) => {
    if (!editingItem || !selectedCategoryId) return;
    const name = formData.get("name") as string;
    const quantity = parseInt(formData.get("quantity") as string) || 0;
    const status = itemStatus;
    const toBuy = formData.get("toBuy") === "on";

    if (!name) {
      toast.error("Item name is required");
      return;
    }

    const result = await updateItem(editingItem.id, name, quantity, status, toBuy);
    if (result.success) {
      toast.success("Item updated successfully");
      setIsItemDialogOpen(false);
      setEditingItem(null);
      setItemStatus("In Stock");
      await loadItems(selectedCategoryId);
    } else {
      toast.error(result.error || "Failed to update item");
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    const result = await deleteItem(id);
    if (result.success) {
      toast.success("Item deleted successfully");
      if (selectedCategoryId) {
        await loadItems(selectedCategoryId);
      }
    } else {
      toast.error(result.error || "Failed to delete item");
    }
  };

  const handleToggleToBuy = async (item: Item) => {
    const result = await toggleItemToBuy(item.id);
    if (result.success) {
      toast.success(item.toBuy ? "Removed from shopping list" : "Added to shopping list");
      if (selectedCategoryId) {
        await loadItems(selectedCategoryId);
      }
    } else {
      toast.error(result.error || "Failed to update item");
    }
  };

  const getStatusColor = (status: Item["status"]) => {
    switch (status) {
      case "In Stock":
        return "text-green-600 dark:text-green-400";
      case "Low Stock":
        return "text-yellow-600 dark:text-yellow-400";
      case "Out of Stock":
        return "text-red-600 dark:text-red-400";
    }
  };

  const selectedLocation = locations.find((l) => l.id === selectedLocationId);
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
          <Skeleton className="h-96 lg:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inventory Manager</h1>
          <p className="text-muted-foreground">
            Manage your items across locations and categories
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Locations Sidebar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Locations</CardTitle>
              <Dialog
                open={isLocationDialogOpen}
                onOpenChange={(open) => {
                  setIsLocationDialogOpen(open);
                  if (!open) setEditingLocation(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingLocation(null)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingLocation ? "Edit Location" : "Add New Location"}
                    </DialogTitle>
                    <DialogDescription>
                      Create or edit a storage location
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    action={editingLocation ? handleUpdateLocation : handleCreateLocation}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="location-name">Location Name</Label>
                      <Input
                        id="location-name"
                        name="name"
                        defaultValue={editingLocation?.name}
                        placeholder="e.g., Kitchen Fridge"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      {editingLocation ? "Update Location" : "Create Location"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {locations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No locations yet. Create one to get started!
              </p>
            ) : (
              locations.map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between group"
                >
                  <Button
                    variant={selectedLocationId === location.id ? "secondary" : "ghost"}
                    className="flex-1 justify-start"
                    onClick={() => setSelectedLocationId(location.id)}
                  >
                    {location.name}
                  </Button>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingLocation(location);
                        setIsLocationDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteLocation(location.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Categories Sidebar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Categories</CardTitle>
                <CardDescription>
                  {selectedLocation?.name || "Select a location"}
                </CardDescription>
              </div>
              {selectedLocationId && (
                <Dialog
                  open={isCategoryDialogOpen}
                  onOpenChange={(open) => {
                    setIsCategoryDialogOpen(open);
                    if (!open) setEditingCategory(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCategory(null)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? "Edit Category" : "Add New Category"}
                      </DialogTitle>
                      <DialogDescription>
                        Create or edit a category in {selectedLocation?.name}
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      action={
                        editingCategory ? handleUpdateCategory : handleCreateCategory
                      }
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                          id="category-name"
                          name="name"
                          defaultValue={editingCategory?.name}
                          placeholder="e.g., Dairy"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        {editingCategory ? "Update Category" : "Create Category"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {!selectedLocationId ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Select a location first
              </p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No categories yet. Create one!
              </p>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between group"
                >
                  <Button
                    variant={selectedCategoryId === category.id ? "secondary" : "ghost"}
                    className="flex-1 justify-start"
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    {category.name}
                  </Button>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingCategory(category);
                        setIsCategoryDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Items Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {selectedCategory
                      ? `Items - ${selectedCategory.name}`
                      : "Select a Category"}
                  </CardTitle>
                  <CardDescription>
                    {selectedCategory
                      ? `Items in ${selectedCategory.name} at ${selectedLocation?.name}`
                      : "Choose a category to view items"}
                  </CardDescription>
                </div>
                {selectedCategoryId && (
                  <Dialog
                    open={isItemDialogOpen}
                    onOpenChange={(open) => {
                      setIsItemDialogOpen(open);
                      if (!open) setEditingItem(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setEditingItem(null);
                          setItemStatus("In Stock");
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          {editingItem ? "Edit Item" : "Add New Item"}
                        </DialogTitle>
                        <DialogDescription>
                          {selectedCategory
                            ? `Add an item to ${selectedCategory.name} in ${selectedLocation?.name}`
                            : "Please select a category first"}
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        action={editingItem ? handleUpdateItem : handleCreateItem}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="item-name">Item Name</Label>
                          <Input
                            id="item-name"
                            name="name"
                            defaultValue={editingItem?.name}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-quantity">Quantity</Label>
                          <Input
                            id="item-quantity"
                            name="quantity"
                            type="number"
                            defaultValue={editingItem?.quantity}
                            min="0"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="item-status">Status</Label>
                          <Select
                            value={editingItem ? itemStatus : itemStatus}
                            onValueChange={(value) =>
                              setItemStatus(value as Item["status"])
                            }
                            defaultValue={editingItem?.status || "In Stock"}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="In Stock">In Stock</SelectItem>
                              <SelectItem value="Low Stock">Low Stock</SelectItem>
                              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="toBuy"
                            name="toBuy"
                            defaultChecked={editingItem?.toBuy}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="toBuy">Add to Shopping List</Label>
                        </div>
                        <Button type="submit" className="w-full">
                          {editingItem ? "Update Item" : "Add Item"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedCategoryId ? (
                items.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No items in this category. Add your first item!
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>To Buy</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <span className={getStatusColor(item.status)}>
                              {item.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleToBuy(item)}
                            >
                              <ShoppingCart
                                className={`h-4 w-4 ${
                                  item.toBuy
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingItem(item);
                                  setItemStatus(item.status);
                                  setIsItemDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              ) : (
                <div className="text-center py-12">
                  <FolderPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Please select a category to view items
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
