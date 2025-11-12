"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Info, Plus, X } from "lucide-react";
import SubmitButton from "@/components/submitButton";
import { getCaseNumberFormat } from "@/lib/utils/case-number-format";

interface Party {
  name: string;
  role: string;
  counsel?: string;
  firm?: string;
}

interface Parties {
  prosecution?: Party[];
  defense?: Party[];
  plaintiff?: Party[];
  defendant?: Party[];
}

interface CaseFormProps {
  courts: any[];
}

export function CaseForm({ courts }: CaseFormProps) {
  const [courtLevel, setCourtLevel] = useState("");
  const [division, setDivision] = useState("");
  const [caseType, setCaseType] = useState("criminal");
  const [parties, setParties] = useState<Parties>({});
  const [offences, setOffences] = useState<string[]>([""]);
  const [caseNumberFormat, setCaseNumberFormat] = useState("");

  // Update case number format preview when court level or division changes
  useEffect(() => {
    if (courtLevel) {
      const format = getCaseNumberFormat(courtLevel, division || undefined);
      setCaseNumberFormat(format);
    } else {
      setCaseNumberFormat("");
    }
  }, [courtLevel, division]);

  const courtLevelOptions = [
    { value: "high_court", label: "High Court" },
    { value: "magistrates", label: "Magistrates Court" },
    { value: "court_of_appeal", label: "Court of Appeal" },
    { value: "tribunal", label: "Tribunal" },
  ];

  const divisionOptions: Record<string, { value: string; label: string }[]> = {
    high_court: [
      { value: "criminal", label: "Criminal Division" },
      { value: "civil", label: "Civil Division" },
      { value: "family", label: "Family Division" },
    ],
    magistrates: [
      { value: "criminal", label: "Criminal" },
      { value: "civil", label: "Civil" },
    ],
    tribunal: [
      { value: "agricultural", label: "Agricultural" },
      { value: "small_claims", label: "Small Claims" },
    ],
  };

  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "ACTIVE", label: "Active" },
    { value: "CLOSED", label: "Closed" },
    { value: "ARCHIVED", label: "Archived" },
  ];

  const COMMON_OFFENCES = [
    "Theft contrary to section 291 of the Crimes Act",
    "Assault Causing Actual Bodily Harm",
    "Aggravated Robbery",
    "Rape contrary to section 207 of the Crimes Act",
    "Murder contrary to section 237 of the Crimes Act",
    "Dangerous Driving Occasioning Death",
    "Possession of Illicit Drugs",
    "Breach of Trust",
  ];

  const addParty = (section: keyof Parties) => {
    setParties(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), { name: "", role: "" }],
    }));
  };

  const updateParty = (section: keyof Parties, index: number, field: string, value: string) => {
    setParties(prev => {
      const updated = { ...prev };
      if (!updated[section]) updated[section] = [];
      updated[section]![index] = { ...updated[section]![index], [field]: value };
      return updated;
    });
  };

  const removeParty = (section: keyof Parties, index: number) => {
    setParties(prev => {
      const updated = { ...prev };
      updated[section] = updated[section]?.filter((_, i) => i !== index);
      return updated;
    });
  };

  const addOffence = () => {
    setOffences([...offences, ""]);
  };

  const updateOffence = (index: number, value: string) => {
    const updated = [...offences];
    updated[index] = value;
    setOffences(updated);
  };

  const removeOffence = (index: number) => {
    setOffences(offences.filter((_, i) => i !== index));
  };

  const partiesToShow = caseType === "criminal" 
    ? (["prosecution", "defense"] as const)
    : (["plaintiff", "defendant"] as const);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Information</CardTitle>
        <CardDescription>
          Fill in the details below to create a new case
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          
          {/* Court Level */}
          <div className="space-y-2">
            <Label>Court Level *</Label>
            <select
              name="courtLevel"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
              value={courtLevel}
              onChange={(e) => {
                setCourtLevel(e.target.value);
                setDivision(""); // Reset division when court level changes
              }}
              required
            >
              <option value="">Select court level</option>
              {courtLevelOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Division (if applicable) */}
          {courtLevel && divisionOptions[courtLevel] && (
            <div className="space-y-2">
              <Label>Division *</Label>
              <select
                name="caseType"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
                value={division}
                onChange={(e) => {
                  setDivision(e.target.value);
                  setCaseType(e.target.value); // Sync case type with division
                }}
                required
              >
                <option value="">Select division</option>
                {divisionOptions[courtLevel].map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Case Number Format Preview */}
          {caseNumberFormat && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Case Number Format</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Case numbers will be generated in the format: <Badge variant="secondary" className="ml-1">{caseNumberFormat}</Badge>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    The system will automatically assign the next available number
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Case Title */}
          <FormField
            name="title"
            label="Case Title"
            type="text"
            placeholder={caseType === "criminal" ? "e.g., State v. John Doe" : "e.g., Smith v. Jones"}
            required
          />

          {/* Case Type (hidden, synced with division) */}
          <input type="hidden" name="type" value={caseType} />

          {/* Status */}
          <FormField
            name="status"
            label="Status"
            type="select"
            options={statusOptions}
            defaultValue="PENDING"
            required
          />
        </div>

        {/* Parties Section */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium">Parties</h3>
          
          {partiesToShow.map((section) => (
            <div key={section} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base capitalize">{section}</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addParty(section)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add {section === "prosecution" || section === "plaintiff" ? "Party" : "Party"}
                </Button>
              </div>

              {parties[section]?.map((party, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Name *</Label>
                        <Input
                          placeholder="Party name"
                          value={party.name}
                          onChange={(e) => updateParty(section, index, "name", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Input
                          placeholder="e.g., Lead Prosecutor, Defendant"
                          value={party.role}
                          onChange={(e) => updateParty(section, index, "role", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Counsel (Optional)</Label>
                        <Input
                          placeholder="Legal representative"
                          value={party.counsel || ""}
                          onChange={(e) => updateParty(section, index, "counsel", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Firm (Optional)</Label>
                        <Input
                          placeholder="Law firm"
                          value={party.firm || ""}
                          onChange={(e) => updateParty(section, index, "firm", e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeParty(section, index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ))}

          {/* Hidden field to pass parties as JSON */}
          <input type="hidden" name="parties" value={JSON.stringify(parties)} />
        </div>

        {/* Offences Section (for criminal cases) */}
        {caseType === "criminal" && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Offences</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOffence}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Offence
              </Button>
            </div>

            {/* Common Offences Quick Add */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Quick Add Common Offences</Label>
              <div className="flex flex-wrap gap-2">
                {COMMON_OFFENCES.map((offence) => (
                  <Button
                    key={offence}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Add if not already present
                      if (!offences.includes(offence)) {
                        const emptyIndex = offences.findIndex(o => !o);
                        if (emptyIndex >= 0) {
                          updateOffence(emptyIndex, offence);
                        } else {
                          setOffences([...offences, offence]);
                        }
                      }
                    }}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {offence.split(" contrary to")[0]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Offence Inputs */}
            {offences.map((offence, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="e.g., Theft contrary to section 291 of the Crimes Act"
                  value={offence}
                  onChange={(e) => updateOffence(index, e.target.value)}
                  className="flex-1"
                />
                {offences.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOffence(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {/* Hidden field to pass offences as comma-separated */}
            <input
              type="hidden"
              name="offences"
              value={offences.filter(Boolean).join(",")}
            />
          </div>
        )}

        {/* Assigned Judge */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium">Assignment</h3>
          <FormField
            name="assignedJudgeId"
            label="Assigned Judge (Optional)"
            type="text"
            placeholder="Judge ID or name"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <SubmitButton text="Create Case" />
        </div>
      </CardContent>
    </Card>
  );
}
