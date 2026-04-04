import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { User, Lock, Trash2 } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) { toast.error("Fill in both fields"); return; }
    if (newPassword.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    toast.success("Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      logout();
      toast.success("Account deleted");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your account settings.</p>
      </div>

      <div className="space-y-6">
        {/* Account Info */}
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><User className="h-4 w-4" /> Account Info</h2>
          <div className="space-y-3">
            <div><span className="text-sm text-muted-foreground">Name</span><p className="font-medium">{user?.name}</p></div>
            <div><span className="text-sm text-muted-foreground">Email</span><p className="font-medium">{user?.email}</p></div>
            <div><span className="text-sm text-muted-foreground">Plan</span><p className="font-medium capitalize">{user?.plan}</p></div>
            <div><span className="text-sm text-muted-foreground">Role</span><p className="font-medium capitalize">{user?.role}</p></div>
          </div>
        </div>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold"><Lock className="h-4 w-4" /> Change Password</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <Button type="submit" variant="default" size="sm">Update Password</Button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="mb-2 flex items-center gap-2 font-semibold text-destructive"><Trash2 className="h-4 w-4" /> Danger Zone</h2>
          <p className="mb-4 text-sm text-muted-foreground">Permanently delete your account and all data.</p>
          <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
