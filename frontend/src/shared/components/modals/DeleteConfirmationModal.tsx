import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isDeleting?: boolean;
  itemName?: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  isDeleting = false,
  itemName
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isDeleting && !open && onClose()}>
      <DialogContent className="md:max-w-[400px]">
        <DialogHeader className="flex flex-col items-center gap-3 pt-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-center">{title}</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {description}
            {itemName && (
              <span className="block mt-2 font-bold text-foreground">
                "{itemName}"
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-row gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1 h-11" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            className="flex-1 h-11 font-bold" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
