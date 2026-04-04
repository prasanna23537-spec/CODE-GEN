import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Code2, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { getPromptsByUser, deletePrompt, type StoredPrompt } from "@/lib/store";

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<StoredPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<StoredPrompt | null>(null);

  useEffect(() => {
    if (user) setHistory(getPromptsByUser(user.id));
  }, [user]);

  const handleDelete = (id: string) => {
    deletePrompt(id);
    if (user) setHistory(getPromptsByUser(user.id));
    toast.success("Prompt deleted");
  };

  const formatDate = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold">Prompt History</h1>
        <p className="mt-1 text-muted-foreground">Browse and manage your past code generations.</p>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card py-16">
          <Code2 className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="text-muted-foreground">No prompts yet. Start generating!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 transition-all hover:shadow-md">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.prompt}</p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{item.language}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setSelectedPrompt(item)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedPrompt} onOpenChange={() => setSelectedPrompt(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg">{selectedPrompt?.prompt}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{selectedPrompt?.language}</span>
          </div>
          <pre className="mt-4 max-h-96 overflow-auto rounded-lg bg-muted p-4 font-mono text-sm">{selectedPrompt?.generatedCode}</pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}
