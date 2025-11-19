'use client';

/**
 * Managed List Editor Component
 * 
 * Interactive editor for managing list items
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  updateManagedListItems,
  addManagedListItem,
  type ManagedListItem,
} from "../actions";
import {
  Plus,
  Edit,
  GripVertical,
  Check,
  X,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";

interface ManagedListEditorProps {
  listId: string;
  category: string;
  name: string;
  items: ManagedListItem[];
}

export function ManagedListEditor({ listId, category, name, items: initialItems }: ManagedListEditorProps) {
  const router = useRouter();
  const [items, setItems] = useState<ManagedListItem[]>(
    [...initialItems].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Add new item
  const [newItem, setNewItem] = useState<Omit<ManagedListItem, 'id'>>({
    value: '',
    label: '',
    description: '',
    sortOrder: items.length,
    isActive: true,
  });

  const handleAddItem = async () => {
    if (!newItem.value || !newItem.label) {
      alert('Value and Label are required');
      return;
    }

    setLoading(true);
    const result = await addManagedListItem(listId, newItem);
    
    if (result.success) {
      setShowAddDialog(false);
      setNewItem({
        value: '',
        label: '',
        description: '',
        sortOrder: items.length + 1,
        isActive: true,
      });
      router.refresh();
    } else {
      alert(result.error || 'Failed to add item');
    }
    setLoading(false);
  };

  const handleUpdateItem = (id: string, updates: Partial<ManagedListItem>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    setHasChanges(true);
  };

  const handleDeleteItem = (id: string) => {
    // Instead of deleting, mark as inactive
    handleUpdateItem(id, { isActive: false });
    setShowDeleteConfirm(null);
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const result = await updateManagedListItems(listId, items);
    
    if (result.success) {
      setHasChanges(false);
      router.refresh();
    } else {
      alert(result.error || 'Failed to save changes');
    }
    setLoading(false);
  };

  const handleResetChanges = () => {
    setItems([...initialItems].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
    setHasChanges(false);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex]!, newItems[index]!];
    
    // Update sort order
    newItems.forEach((item, idx) => {
      item.sortOrder = idx;
    });
    
    setItems(newItems);
    setHasChanges(true);
  };

  const activeItems = items.filter(item => item.isActive !== false);
  const inactiveItems = items.filter(item => item.isActive === false);

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Item</DialogTitle>
                    <DialogDescription>
                      Add a new option to the {name.toLowerCase()} list
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="value">Value *</Label>
                      <Input
                        id="value"
                        value={newItem.value}
                        onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                        placeholder="e.g., high_court or PENDING"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Internal code used in database (lowercase with underscores)
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="label">Label *</Label>
                      <Input
                        id="label"
                        value={newItem.label}
                        onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                        placeholder="e.g., High Court or Pending"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Display text shown to users
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Optional additional context"
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="active">Active</Label>
                      <Switch
                        id="active"
                        checked={newItem.isActive}
                        onCheckedChange={(checked) => setNewItem({ ...newItem, isActive: checked })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddDialog(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddItem} disabled={loading}>
                      {loading ? 'Adding...' : 'Add Item'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="text-sm text-muted-foreground">
                {activeItems.length} active • {inactiveItems.length} inactive
              </div>
            </div>

            {hasChanges && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  Unsaved Changes
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetChanges}
                  disabled={loading}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveChanges}
                  disabled={loading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Active Items ({activeItems.length})
          </CardTitle>
          <CardDescription>
            These items are visible to users in dropdowns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No active items. Add items using the button above.
            </p>
          ) : (
            <div className="space-y-2">
              {activeItems.map((item, index) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  index={index}
                  totalItems={activeItems.length}
                  isEditing={editingId === item.id}
                  onEdit={() => setEditingId(item.id)}
                  onCancelEdit={() => setEditingId(null)}
                  onUpdate={(updates) => {
                    handleUpdateItem(item.id, updates);
                    setEditingId(null);
                  }}
                  onDelete={() => setShowDeleteConfirm(item.id)}
                  onMoveUp={() => moveItem(index, 'up')}
                  onMoveDown={() => moveItem(index, 'down')}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inactive Items */}
      {inactiveItems.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EyeOff className="h-5 w-5 text-orange-600" />
              Inactive Items ({inactiveItems.length})
            </CardTitle>
            <CardDescription>
              These items are hidden from users but preserve data integrity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {inactiveItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  isInactive
                  onUpdate={(updates) => handleUpdateItem(item.id, updates)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the item as inactive. It will be hidden from dropdowns but 
              existing data references will be preserved. You can reactivate it later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => showDeleteConfirm && handleDeleteItem(showDeleteConfirm)}>
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface ItemRowProps {
  item: ManagedListItem;
  index?: number;
  totalItems?: number;
  isEditing?: boolean;
  isInactive?: boolean;
  onEdit?: () => void;
  onCancelEdit?: () => void;
  onUpdate: (updates: Partial<ManagedListItem>) => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

function ItemRow({
  item,
  index,
  totalItems,
  isEditing,
  isInactive,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: ItemRowProps) {
  const [editValue, setEditValue] = useState(item.value);
  const [editLabel, setEditLabel] = useState(item.label);
  const [editDescription, setEditDescription] = useState(item.description || '');

  if (isEditing) {
    return (
      <div className="p-4 border rounded-lg space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Value</Label>
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              size-="sm"
            />
          </div>
          <div>
            <Label className="text-xs">Label</Label>
            <Input
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label className="text-xs">Description</Label>
          <Input
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancelEdit}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onUpdate({
                value: editValue,
                label: editLabel,
                description: editDescription,
              });
            }}
          >
            <Check className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 p-3 border rounded-lg ${isInactive ? 'opacity-60 bg-muted' : ''}`}>
      {!isInactive && onMoveUp && onMoveDown && (
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onMoveUp}
            disabled={index === 0}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <code className="text-xs bg-muted px-2 py-1 rounded">
            {item.value}
          </code>
          <span className="font-medium">{item.label}</span>
          {isInactive && (
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              Inactive
            </Badge>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
        )}
      </div>

      <div className="flex items-center gap-1">
        {isInactive ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdate({ isActive: true })}
          >
            <Eye className="mr-2 h-4 w-4" />
            Reactivate
          </Button>
        ) : (
          <>
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
              >
                <EyeOff className="h-4 w-4 text-orange-600" />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
