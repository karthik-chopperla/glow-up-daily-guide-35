
import React, { useState, useRef } from "react";
import BackButton from "../components/BackButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Stethoscope, Mic, Loader2, ArrowLeft } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { aiHealthService } from "@/services/aiHealthService";
import { useNavigate } from "react-router-dom";

type SymptomResult = {
  summary: string;
  conditions?: { name: string; severity: "Mild" | "Moderate" | "Severe" }[];
  steps?: string[];
  aiText?: string;
  date: string;
  input: string;
};

const parseAIResponse = (aiText: string, rawInput: string): SymptomResult => {
  // Try to extract basic pattern, fallback to generic
  // (In real prod, use NLU/NLP but here we use simple heuristics)
  let conditions: { name: string; severity: "Mild" | "Moderate" | "Severe" }[] = [];
  let steps: string[] = [];
  let summary = "Here are some suggestions based on your input.";
  const lines = aiText.split("\n").map(l => l.trim()).filter(Boolean);
  const conds: string[] = [];
  const sevLevels: ("Mild" | "Moderate" | "Severe")[] = ["Mild", "Moderate", "Severe"];
  lines.forEach(line => {
    // Look for possible conditions e.g., bullet points with disease names
    if (line.match(/cold|fever|flu|migraine|headache|virus|infection|cough|sore|throat/i)) {
      let sev: "Mild" | "Moderate" | "Severe" = "Mild";
      if (/severe|emergency|urgent/i.test(line)) sev = "Severe";
      else if (/moderate|see a doctor/i.test(line)) sev = "Moderate";
      // Grab first "word" as condition name
      let nameMatch = line.match(/[A-Za-z]+\s*[A-Za-z]*/);
      conds.push(nameMatch ? nameMatch[0] : "Symptom");
      conditions.push({ name: nameMatch ? nameMatch[0] : "Symptom", severity: sev });
    }
    // Look for next steps
    if (line.match(/drink|rest|doctor|consult|hydrated|paracetamol|medici/i)) {
      steps.push(line.replace(/^[-•*]\s*/, ''));
    }
    // Look for summary
    if (line.length > 15 && summary === "Here are some suggestions based on your input.") {
      summary = line;
    }
  });
  if (steps.length === 0) {
    steps.push("Stay hydrated and monitor your symptoms.");
  }
  if (conditions.length === 0) {
    conditions.push({ name: "Common cold", severity: "Mild" });
  }
  return {
    summary,
    conditions,
    steps,
    aiText,
    input: rawInput,
    date: new Date().toISOString()
  };
};

const SYMPTOM_HISTORY_KEY = "hm_symptom_history";

const SymptomChecker = () => {
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [history, setHistory] = useState<SymptomResult[]>(() => {
    // Try to load from localStorage:
    try {
      const raw = window.localStorage.getItem(SYMPTOM_HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();

  // Voice handling
  const { isListening, isSupported, startListening } = useSpeechRecognition((txt) => {
    setInput(inp => (inp ? inp + " " : "") + txt);
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    setAiLoading(true);
    setError(null);
    setResult(null);
    try {
      const aiText: string = await aiHealthService.getHealthAdvice(input.trim());
      const parsed = parseAIResponse(aiText, input.trim());
      setResult(parsed);
      setInput("");
      // Store to history (most recent first), max 10
      setHistory(prev => {
        const updated = [parsed, ...prev].slice(0, 10);
        window.localStorage.setItem(SYMPTOM_HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (err: any) {
      setError("Unable to get AI advice. Try again later.");
    } finally {
      setAiLoading(false);
    }
  };

  // Allows user to click history to fill input
  const handleHistoryClick = (entry: SymptomResult) => {
    setResult(entry);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-1 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-md mx-auto">
        <BackButton label="Home" />
        <h1 className="text-2xl font-bold mb-2 text-green-700 flex items-center gap-2">
          <Stethoscope className="w-6 h-6 text-green-500" strokeWidth={2.2} /> Symptom Checker
        </h1>
        <p className="text-gray-600 mb-3">Describe your symptoms to get quick advice powered by AI.</p>
        <form
          className="bg-white rounded-xl shadow p-4 mb-3 flex flex-col gap-2"
          onSubmit={handleSubmit}
          aria-label="Symptom Input"
        >
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={4}
            placeholder="e.g., sore throat, fever, headache..."
            className="text-base min-h-[90px] resize-y"
            aria-label="Symptom description"
            disabled={aiLoading}
            autoFocus
          />
          <div className="flex items-center gap-2 mt-2">
            {isSupported && (
              <Button
                type="button"
                variant={isListening ? "secondary" : "ghost"}
                size="icon"
                aria-label="Voice input"
                onClick={startListening}
                disabled={aiLoading}
                className={"transition"}
              >
                <Mic className={isListening ? "text-green-600 animate-pulse" : "text-gray-700"} />
              </Button>
            )}
            <div className="flex-1"></div>
            <Button
              type="submit"
              disabled={aiLoading || !input.trim()}
              aria-busy={aiLoading}
              size="lg"
              className="rounded-lg px-5 shadow font-semibold gap-2"
            >
              {aiLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Stethoscope className="w-5 h-5" />} 
              Check Symptoms
            </Button>
          </div>
        </form>
        {/* Result card */}
        {error && (
          <div className="bg-red-100 rounded-lg text-red-800 text-center py-2 mb-3">{error}</div>
        )}
        {result && (
          <Card className="mb-5 animate-in fade-in duration-500">
            <CardHeader>
              <CardTitle className="text-green-800 text-lg mb-1 flex items-center gap-1">
                🤖 Based on your symptoms, here are some possibilities...
              </CardTitle>
              <div className="text-gray-500 text-xs">
                Checked on {new Date(result.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-gray-800">{result.summary}</div>
              <div className="mb-1">
                <span className="font-semibold text-gray-700">Possible conditions:</span>
                <ul className="ml-4 mt-1 list-disc">
                  {result.conditions?.map((cond, i) => (
                    <li key={i} className="flex items-center gap-2 mb-1">
                      <span>{cond.name}</span>
                      <span
                        className={
                          "px-2 py-0.5 rounded-full text-xs font-semibold " +
                          (cond.severity === "Severe"
                            ? "bg-red-100 text-red-700"
                            : cond.severity === "Moderate"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-700")
                        }
                      >
                        {cond.severity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Recommended next steps:</span>
                <ol className="ml-4 mt-1 list-decimal">
                  {result.steps?.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
              <Button
                className="mt-2 w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold shadow gap-2"
                onClick={() => nav("/doctor-booking")}
                size="lg"
              >
                Book Doctor
              </Button>
            </CardContent>
          </Card>
        )}
        {/* Symptom History */}
        {history.length > 0 && (
          <Card className="mb-5">
            <CardHeader>
              <CardTitle className="text-base text-blue-700 flex gap-2 items-center">Symptom History</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {history.map((entry, i) => (
                  <li
                    key={i}
                    className="py-2 cursor-pointer hover:bg-blue-50 rounded transition"
                    tabIndex={0}
                    aria-label={`Check taken at ${new Date(entry.date).toLocaleString()}`}
                    onClick={() => handleHistoryClick(entry)}
                  >
                    <div className="flex gap-2 items-center text-sm">
                      <span className="font-medium text-gray-800">{entry.input}</span>
                      <span className="ml-auto text-gray-400 text-xs">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">{entry.summary}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {/* Disclaimer */}
        <div className="text-xs text-gray-500 mt-3 mb-20">
          <span className="font-semibold">Disclaimer:</span> This is not a diagnosis. For emergencies, please consult a doctor or use the <span className="text-red-500 font-bold">SOS</span> button.
        </div>
      </div>
      {/* The floating red SOS button is already included globally via FabSOS in App.tsx. */}
    </div>
  );
};

export default SymptomChecker;

