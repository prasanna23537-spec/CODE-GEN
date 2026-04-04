import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import { Code2, Copy, Download, Sparkles, Loader2, FileText, FileCode } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { savePrompt, getTodayPromptCount } from "@/lib/store";

const languages = [
  { value: "python", label: "Python", ext: ".py" },
  { value: "javascript", label: "JavaScript", ext: ".js" },
  { value: "java", label: "Java", ext: ".java" },
  { value: "cpp", label: "C++", ext: ".cpp" },
  { value: "typescript", label: "TypeScript", ext: ".ts" },
];

export default function GeneratePage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("python");
  const [generatedCode, setGeneratedCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [explaining, setExplaining] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.error("Please enter a prompt"); return; }
    if (!user) return;

    // Check free plan limit
    if (user.plan === "free") {
      const todayCount = getTodayPromptCount(user.id);
      if (todayCount >= 5) {
        toast.error("Daily limit reached! Upgrade to Pro for unlimited prompts.");
        return;
      }
    }

    setLoading(true);
    setExplanation("");

    await new Promise((r) => setTimeout(r, 1500));
    const mockCode = getMockCode(language, prompt);
    setGeneratedCode(mockCode);

    // Save to shared store
    savePrompt({
      id: crypto.randomUUID(),
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      prompt: prompt.trim(),
      language,
      generatedCode: mockCode,
      createdAt: new Date().toISOString(),
    });

    setLoading(false);
    toast.success("Code generated!");
  };

  const handleExplain = async () => {
    if (!generatedCode) return;
    setExplaining(true);
    await new Promise((r) => setTimeout(r, 1000));
    setExplanation(
      `## Code Explanation\n\n**Overview:** This code implements the functionality described in your prompt.\n\n**Step-by-step breakdown:**\n1. The function is defined with appropriate parameters\n2. Input validation is performed\n3. Core logic is executed using efficient algorithms\n4. Results are returned in the expected format\n\n**Time Complexity:** O(n)\n**Space Complexity:** O(1)`
    );
    setExplaining(false);
    toast.success("Explanation ready!");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = (type: "txt" | "code") => {
    const ext = type === "txt" ? ".txt" : languages.find((l) => l.value === language)?.ext || ".txt";
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codegenie-output${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-3xl font-bold">Code Generator</h1>
        <p className="mt-1 text-muted-foreground">Describe what you want and let AI write the code.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Panel */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {languages.map((l) => (
                      <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prompt</Label>
                <Textarea
                  placeholder="e.g., Create a function that sorts an array using merge sort..."
                  rows={6}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="resize-none"
                />
              </div>
              <Button variant="hero" className="w-full gap-2" onClick={handleGenerate} disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Code2 className="h-4 w-4" /> Generate Code</>}
              </Button>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
              <span className="text-sm font-medium">Output</span>
              {generatedCode && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1">
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload("txt")} className="gap-1">
                    <FileText className="h-3.5 w-3.5" /> .txt
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload("code")} className="gap-1">
                    <FileCode className="h-3.5 w-3.5" /> {languages.find((l) => l.value === language)?.ext}
                  </Button>
                </div>
              )}
            </div>
            <div className="h-[400px]">
              {generatedCode ? (
                <Editor
                  height="100%"
                  language={language === "cpp" ? "cpp" : language}
                  value={generatedCode}
                  theme={theme === "dark" ? "vs-dark" : "light"}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "JetBrains Mono, monospace",
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Code2 className="mx-auto mb-3 h-10 w-10 opacity-30" />
                    <p className="text-sm">Your generated code will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {generatedCode && (
            <Button variant="outline" className="w-full gap-2" onClick={handleExplain} disabled={explaining}>
              {explaining ? <><Loader2 className="h-4 w-4 animate-spin" /> Explaining...</> : <><Sparkles className="h-4 w-4" /> Explain this code</>}
            </Button>
          )}

          {explanation && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 animate-slide-up">
              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4 text-primary" /> AI Explanation
              </h3>
              <div className="prose prose-sm text-sm text-muted-foreground whitespace-pre-line">
                {explanation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getMockCode(language: string, prompt: string): string {
  const snippets: Record<string, string> = {
    python: `# ${prompt}\n\ndef solution():\n    \"\"\"\n    AI-generated solution for: ${prompt}\n    \"\"\"\n    data = []\n    \n    for i in range(10):\n        data.append(i * 2)\n    \n    return sorted(data, reverse=True)\n\n\nif __name__ == "__main__":\n    result = solution()\n    print(f"Result: {result}")`,
    javascript: `// ${prompt}\n\nfunction solution() {\n  /**\n   * AI-generated solution for: ${prompt}\n   */\n  const data = [];\n  \n  for (let i = 0; i < 10; i++) {\n    data.push(i * 2);\n  }\n  \n  return data.sort((a, b) => b - a);\n}\n\nconsole.log("Result:", solution());`,
    java: `// ${prompt}\n\npublic class Solution {\n    /**\n     * AI-generated solution for: ${prompt}\n     */\n    public static int[] solution() {\n        int[] data = new int[10];\n        \n        for (int i = 0; i < 10; i++) {\n            data[i] = i * 2;\n        }\n        \n        java.util.Arrays.sort(data);\n        return data;\n    }\n    \n    public static void main(String[] args) {\n        int[] result = solution();\n        System.out.println(java.util.Arrays.toString(result));\n    }\n}`,
    cpp: `// ${prompt}\n\n#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nvector<int> solution() {\n    /**\n     * AI-generated solution for: ${prompt}\n     */\n    vector<int> data;\n    \n    for (int i = 0; i < 10; i++) {\n        data.push_back(i * 2);\n    }\n    \n    sort(data.rbegin(), data.rend());\n    return data;\n}\n\nint main() {\n    auto result = solution();\n    for (int x : result) cout << x << " ";\n    return 0;\n}`,
    typescript: `// ${prompt}\n\nfunction solution(): number[] {\n  /**\n   * AI-generated solution for: ${prompt}\n   */\n  const data: number[] = [];\n  \n  for (let i = 0; i < 10; i++) {\n    data.push(i * 2);\n  }\n  \n  return data.sort((a, b) => b - a);\n}\n\nconsole.log("Result:", solution());`,
  };
  return snippets[language] || snippets.python;
}
