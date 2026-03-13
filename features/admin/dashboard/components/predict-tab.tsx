'use client'
import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Brain, ChevronRight, Clock, MapPin, Users, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

// ─── Interfaces ─────────────────────────────────────────────────────────────
interface PredictionForm {
  barangay: string;
  incidentType: string;
  lighting: string;
  roadType: string;
  hour: number;
  month: number;
  dayName: string;
  timeOfDay: string;
  motorVehicles: number;
  motorcycles: number;
  personsInvolved: number;
}

interface PredictionResult {
  success: boolean;
  predicted_severity: string;
  severity_code: number;
  confidence: number;
  probabilities: Record<string, number>;
  error?: string;
}

// ─── Field options (mirrors encoder_classes.json from Flask /options) ──────
const OPTIONS = {
  barangay: [
    "Anibongan", "Ban-as", "Banahao", "Bantolinao", "Baucawe",
    "Diatagon", "Ganayon", "Liatimco", "Manyayay", "Payasan",
    "Poblacion", "Saint Christine", "San Pedro"
  ],
  incidentType: ["Collision", "Non-Collision"],
  lighting: ["Dawn", "Day", "Dusk", "Night", "Unknown"],
  roadType: ["Barangay Road", "Bridge", "Highway", "Intersection", "National Highway"],
  timeOfDay: ["Afternoon", "Evening", "Morning", "Night"],
  dayName: ["Friday", "Monday", "Saturday", "Sunday", "Thursday", "Tuesday", "Wednesday"],
}

// ─── Severity config ────────────────────────────────────────────────────────
const SEVERITY_CONFIG: Record<string, { color: string, bar: string, icon: React.ElementType, alert: string }> = {
  Minor: { color: "bg-green-100 text-green-800 border-green-200", bar: "bg-green-500", icon: CheckCircle2, alert: "bg-green-50 border-green-200 text-green-800" },
  Moderate: { color: "bg-amber-100 text-amber-800 border-amber-200", bar: "bg-amber-500", icon: AlertCircle, alert: "bg-amber-50 border-amber-200 text-amber-800" },
  Serious: { color: "bg-orange-100 text-orange-800 border-orange-200", bar: "bg-orange-500", icon: AlertTriangle, alert: "bg-orange-50 border-orange-200 text-orange-800" },
  Fatal: { color: "bg-red-100 text-red-800 border-red-200", bar: "bg-red-500", icon: XCircle, alert: "bg-red-50 border-red-200 text-red-800" },
}

const SEVERITY_ADVICE: Record<string, string> = {
  Minor: "Standard response. Single unit dispatch sufficient. Document and monitor.",
  Moderate: "Priority response recommended. Coordinate with nearest barangay health unit.",
  Serious: "Immediate multi-unit response required. Alert hospital for incoming trauma case.",
  Fatal: "CRITICAL — Deploy all available units. Notify PNP, hospital trauma team, and MDRRMC commander NOW.",
}

// ─── Mock prediction engine (simulates Flask Random Forest output) ──────────
function mockPredict(form: PredictionForm): PredictionResult {
  const riskFactors: Record<string, Record<string, number>> = {
    barangay: { Ganayon: 3, Payasan: 2, Anibongan: 2, Baucawe: 1, Diatagon: 1 },
    incidentType: { Collision: 2, "Non-Collision": 0 },
    lighting: { Night: 3, Dusk: 2, Dawn: 1, Day: 0, Unknown: 1 },
    roadType: { Intersection: 2, "National Highway": 2, Highway: 2, "Barangay Road": 0, Bridge: 1 },
    dayName: { Sunday: 2, Saturday: 1 },
    timeOfDay: { Night: 3, Evening: 2, Morning: 1, Afternoon: 0 },
  }
  let score = 0
  score += (riskFactors.barangay[form.barangay] ?? 0)
  score += (riskFactors.incidentType[form.incidentType] ?? 0)
  score += (riskFactors.lighting[form.lighting] ?? 0)
  score += (riskFactors.roadType[form.roadType] ?? 0)
  score += (riskFactors.dayName[form.dayName] ?? 0)
  score += (riskFactors.timeOfDay[form.timeOfDay] ?? 0)
  score += Math.min(Number(form.personsInvolved) * 0.8, 4)
  score += Math.min(Number(form.motorcycles) * 0.5, 2)

  let predicted: string, probs: Record<string, number>
  if (score <= 3) { predicted = "Minor"; probs = { Minor: 72 + Math.random() * 10, Moderate: 15 + Math.random() * 5, Serious: 8 + Math.random() * 3, Fatal: 2 + Math.random() * 2 } }
  else if (score <= 6) { predicted = "Moderate"; probs = { Minor: 18 + Math.random() * 8, Moderate: 55 + Math.random() * 12, Serious: 18 + Math.random() * 6, Fatal: 5 + Math.random() * 3 } }
  else if (score <= 10) { predicted = "Serious"; probs = { Minor: 8 + Math.random() * 5, Moderate: 20 + Math.random() * 8, Serious: 52 + Math.random() * 12, Fatal: 14 + Math.random() * 5 } }
  else { predicted = "Fatal"; probs = { Minor: 4 + Math.random() * 3, Moderate: 10 + Math.random() * 5, Serious: 22 + Math.random() * 8, Fatal: 58 + Math.random() * 12 } }

  // normalize to 100
  const total = Object.values(probs).reduce((a, b) => a + b, 0)
  Object.keys(probs).forEach(k => probs[k] = Math.round(probs[k] / total * 100 * 10) / 10)

  return {
    success: true,
    predicted_severity: predicted,
    severity_code: ["Minor", "Moderate", "Serious", "Fatal"].indexOf(predicted),
    confidence: probs[predicted],
    probabilities: probs,
  }
}

// ─── Hour → time of day helper ───────────────────────────────────────────────
function hourToTimeOfDay(h: number) {
  const hr = Number(h)
  if (hr >= 5 && hr < 12) return "Morning"
  if (hr >= 12 && hr < 17) return "Afternoon"
  if (hr >= 17 && hr < 21) return "Evening"
  return "Night"
}

function hourToDisplay(h: number) {
  const hr = Number(h)
  if (hr === 0) return "12:00 AM"
  if (hr < 12) return `${hr}:00 AM`
  if (hr === 12) return "12:00 PM"
  return `${hr - 12}:00 PM`
}

// ─── Animated probability bar ────────────────────────────────────────────────
function ProbBar({ label, value, barClass, delay = 0 }: { label: string, value: number, barClass: string, delay?: number }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${barClass} transition-all duration-700 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({ icon: Icon, label, children }: { icon: React.ElementType, label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-1 border-b border-border">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      {children}
    </div>
  )
}

// ─── Field row ───────────────────────────────────────────────────────────────
function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>
}

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
export function PredictTab() {
  const now = new Date()
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const [form, setForm] = useState<PredictionForm>({
    barangay: "",
    incidentType: "",
    lighting: "",
    roadType: "",
    hour: now.getHours(),
    month: now.getMonth() + 1,
    dayName: dayNames[now.getDay()],
    timeOfDay: hourToTimeOfDay(now.getHours()),
    motorVehicles: 1,
    motorcycles: 0,
    personsInvolved: 1,
  })

  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof PredictionForm, val: string | number) => setForm(f => ({
    ...f,
    [key]: val,
    ...(key === "hour" ? { timeOfDay: hourToTimeOfDay(val as number) } : {})
  }))

  const isComplete = form.barangay && form.incidentType && form.lighting && form.roadType

  // ── Call Flask API (or mock if env not set) ──────────────────────────────
  async function handlePredict() {
    if (!isComplete) return
    setLoading(true)
    setError(null)
    setResult(null)

    const payload = {
      "Barangay": form.barangay,
      "Type of Incident": form.incidentType,
      "Lighting": form.lighting,
      "Road Type": form.roadType,
      "Time_of_Day": form.timeOfDay,
      "DayName": form.dayName,
      "Hour": Number(form.hour),
      "Month": Number(form.month),
      "Motor Vehicles": Number(form.motorVehicles),
      "Motorcycles": Number(form.motorcycles),
      "Persons Involved": Number(form.personsInvolved),
    }

    const apiUrl = process.env.NEXT_PUBLIC_FLASK_API_URL

    try {
      await new Promise(r => setTimeout(r, 900)) // simulate network latency

      let data
      if (apiUrl) {
        const res = await fetch(`${apiUrl}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        data = await res.json()
      } else {
        // ── MOCK: remove this block after connecting Flask ──
        data = mockPredict(form)
      }

      if (data.success) setResult(data)
      else setError(data.error ?? "Prediction failed")
    } catch {
      setError("Could not reach the prediction API. Check your connection.")
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setResult(null)
    setError(null)
  }

  const sev = result ? SEVERITY_CONFIG[result.predicted_severity] : null
  const SevIcon = sev?.icon

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left Side: Form */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 space-y-6">
              {/* Location */}
              <Section icon={MapPin} label="Location">
                <FieldRow>
                  <Field label="Barangay *">
                    <Select value={form.barangay} onValueChange={v => set("barangay", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select barangay" /></SelectTrigger>
                      <SelectContent>
                        {OPTIONS.barangay.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Road type *">
                    <Select value={form.roadType} onValueChange={v => set("roadType", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select road type" /></SelectTrigger>
                      <SelectContent>
                        {OPTIONS.roadType.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldRow>
              </Section>

              {/* Incident details */}
              <Section icon={AlertTriangle} label="Incident details">
                <FieldRow>
                  <Field label="Incident type *">
                    <Select value={form.incidentType} onValueChange={v => set("incidentType", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {OPTIONS.incidentType.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Lighting *">
                    <Select value={form.lighting} onValueChange={v => set("lighting", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select lighting" /></SelectTrigger>
                      <SelectContent>
                        {OPTIONS.lighting.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldRow>
              </Section>

              {/* Time */}
              <Section icon={Clock} label="Time & date">
                <FieldRow>
                  <Field label={`Hour — ${hourToDisplay(form.hour)}`}>
                    <div className="space-y-1">
                      <input
                        type="range" min={0} max={23} step={1}
                        value={form.hour}
                        onChange={e => set("hour", Number(e.target.value))}
                        className="w-full accent-slate-800"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span>
                      </div>
                    </div>
                  </Field>
                  <Field label="Day of week">
                    <Select value={form.dayName} onValueChange={v => set("dayName", v)}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {OPTIONS.dayName.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldRow>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs font-normal">
                    {form.timeOfDay} · Month {form.month}
                  </Badge>
                </div>
              </Section>

              {/* Vehicles & persons */}
              <Section icon={Users} label="Vehicles & persons">
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Motor vehicles">
                    <Input
                      type="number" min={0} max={20}
                      value={form.motorVehicles}
                      onChange={e => set("motorVehicles", Number(e.target.value))}
                      className="h-9 text-sm"
                    />
                  </Field>
                  <Field label="Motorcycles">
                    <Input
                      type="number" min={0} max={20}
                      value={form.motorcycles}
                      onChange={e => set("motorcycles", Number(e.target.value))}
                      className="h-9 text-sm"
                    />
                  </Field>
                  <Field label="Persons involved">
                    <Input
                      type="number" min={1} max={50}
                      value={form.personsInvolved}
                      onChange={e => set("personsInvolved", Number(e.target.value))}
                      className="h-9 text-sm"
                    />
                  </Field>
                </div>
              </Section>

              {/* CTA */}
              {!result && (
                <Button
                  onClick={handlePredict}
                  disabled={!isComplete || loading}
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium shadow-lg shadow-slate-200 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing incident…</>
                  ) : (
                    <><Brain className="h-4 w-4 mr-2" />Predict severity<ChevronRight className="h-4 w-4 ml-auto" /></>
                  )}
                </Button>
              )}

              {!isComplete && !result && (
                <p className="text-xs text-muted-foreground text-center">
                  Fill in barangay, road type, incident type, and lighting to predict.
                </p>
              )}

              {result && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full h-10 text-sm border-dashed"
                >
                  Clear and predict another incident
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Result card */}
          {result && sev ? (
            <Card className={`border shadow-sm overflow-hidden ${sev.alert} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <CardContent className="p-0">
                <div className="p-5 space-y-6">
                  {/* Main result */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-sm ${sev.color}`}>
                        {SevIcon && <SevIcon className="h-7 w-7" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-0.5">Predicted Severity</p>
                        <p className="text-3xl font-bold tracking-tight">{result.predicted_severity}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                          <p className="text-xs font-medium uppercase">{result.confidence}% Confidence</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advice */}
                  <div className={`rounded-xl border-2 px-4 py-3 bg-white/40 border-current/10 shadow-sm`}>
                    <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Recommended action</p>
                    <p className="text-sm font-medium leading-relaxed">{SEVERITY_ADVICE[result.predicted_severity]}</p>
                  </div>

                  {/* Probability bars */}
                  <div className="space-y-3.5">
                    <p className="text-xs font-bold uppercase tracking-wider opacity-60">Probability breakdown</p>
                    <div className="space-y-3">
                      {Object.entries(result.probabilities)
                        .sort((a, b) => b[1] - a[1])
                        .map(([label, val], i) => (
                          <ProbBar
                            key={label}
                            label={label}
                            value={val}
                            barClass={SEVERITY_CONFIG[label].bar}
                            delay={i * 100}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Inputs summary */}
                  <div className="pt-4 border-t border-current/10">
                    <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2.5">Incident Context</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        form.barangay, form.incidentType, form.lighting,
                        form.roadType, form.timeOfDay, form.dayName,
                        `${form.personsInvolved} Persons`
                      ].map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] font-medium bg-white/50 hover:bg-white/80 transition-colors">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer note */}
                {!process.env.NEXT_PUBLIC_FLASK_API_URL && (
                  <div className="bg-black/5 p-2 text-center text-[9px] uppercase tracking-widest font-bold opacity-40">
                    Calculated via Mock Predictive Analysis
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {error && (
                <Card className="border-red-200 bg-red-50 shadow-none overflow-hidden">
                  <div className="h-1 bg-red-500 w-full" />
                  <CardContent className="p-4 flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-red-900">Analysis Error</p>
                      <p className="text-xs text-red-800 mt-0.5 leading-relaxed">{error}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!loading ? (
                <Card className="border-0 shadow-sm bg-white border-dashed border-2 border-slate-200 h-[400px] flex items-center justify-center">
                  <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                      <Brain className="h-8 w-8 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Awaiting Inputs</p>
                      <p className="text-xs text-slate-400 mt-2 max-w-[200px] leading-relaxed italic">
                        &quot;Fill out the incident details to the left and click predict to begin AI analysis.&quot;
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-sm bg-white h-[400px] flex items-center justify-center">
                  <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-slate-100 rounded-full animate-ping opacity-20" />
                      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center relative z-10">
                        <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">Processing Data</p>
                      <p className="text-xs text-slate-400 mt-2 animate-pulse">Running Random Forest calculations...</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
