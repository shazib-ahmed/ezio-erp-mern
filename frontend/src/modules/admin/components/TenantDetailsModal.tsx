import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/shared/ui/dialog';
import { Badge } from '@/shared/ui/badge';
import { Building2, Mail, Phone, Calendar, User as UserIcon, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';

interface TenantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: any | null;
}

const TenantDetailsModal: React.FC<TenantDetailsModalProps> = ({
  isOpen,
  onClose,
  tenant
}) => {
  if (!tenant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-8 bg-primary/5 border-b border-primary/10 relative">
          <div className="absolute top-0 right-0 p-8">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold px-3 py-1">
              Active
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary overflow-hidden shrink-0">
              {tenant.logo ? (
                <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="h-8 w-8" />
              )}
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight text-foreground">{tenant.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="font-bold bg-indigo-500/5 text-indigo-500 border-indigo-500/10">
                  {tenant.industry?.name || 'N/A'}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest font-black text-muted-foreground/60 flex items-center gap-2">
                <Phone className="h-3 w-3" /> Contact Information
              </h4>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Business Phone</span>
                  <span className="text-sm font-bold">{tenant.phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Joined Date</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span className="text-sm font-bold">{format(new Date(tenant.createdAt), 'MMMM dd, yyyy')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest font-black text-muted-foreground/60 flex items-center gap-2">
                <UserIcon className="h-3 w-3" /> User
              </h4>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 overflow-hidden shrink-0">
                {tenant.users[0]?.user.avatar ? (
                  <img src={tenant.users[0].user.avatar} alt={tenant.users[0].user.name} className="w-full h-full object-cover" />
                ) : (
                  tenant.users[0]?.user.name?.charAt(0) || 'U'
                )}
              </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground line-clamp-1">{tenant.users[0]?.user.name}</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Mail className="h-2.5 w-2.5" />
                    {tenant.users[0]?.user.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modules Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-widest font-black text-muted-foreground/60 flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" /> Active Enterprise Modules
              </h4>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none font-bold">
                {tenant.activeModules.length} Total
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {tenant.activeModules.map((mod: any) => (
                <div 
                  key={mod.id} 
                  className="px-3 py-2 rounded-xl bg-background border border-border flex items-center gap-2 group hover:border-primary/30 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[11px] font-bold text-foreground/80 group-hover:text-primary transition-colors">{mod.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export { TenantDetailsModal };
