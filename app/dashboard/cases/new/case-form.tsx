"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/submitButton";

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
  const [caseType, setCaseType] = useState("CRIMINAL");
  const [parties, setParties] = useState<Parties>({});
  const [offences, setOffences] = useState<string[]>([""]);

  const courtLevelOptions = [
    { value: "MAGISTRATES", label: "Magistrates Court" },
    { value: "HIGH_COURT", label: "High Court" },
    { value: "COURT_OF_APPEAL", label: "Court of Appeal" },
    { value: "TRIBUNAL", label: "Tribunal" },
  ];

  const divisionOptions = {
    HIGH_COURT: [
      { value: "CIVIL", label: "Civil Division" },
      { value: "CRIMINAL", label: "Criminal Division" },
      { value: "FAMILY", label: "Family Division" },
    ],
    MAGISTRATES: [
      { value: "CRIMINAL", label: "Criminal Division" },
      { value: "CIVIL", label: "Civil Division" },
    ],
  };

  const caseTypeOptions = [
    { value: "CRIMINAL", label: "Criminal" },
    { value: "CIVIL", label: "Civil" },
    { value: "FAMILY", label: "Family" },
    { value: "EMPLOYMENT", label: "Employment" },
    { value: "LAND", label: "Land" },
    { value: "APPEAL", label: "Appeal" },
  ];

  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "ACTIVE", label: "Active" },
    { value: "CLOSED", label: "Closed" },
    { value: "ARCHIVED", label: "Archived" },
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

  const partiesToShow = caseType === "CRIMINAL" 
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
          
          <FormField
            name="title"
            label="Case Title"
            type="text"
            placeholder="e.g., State v. John Doe"
            required
          />

          <div>
            <Label>Case Type</Label>
            <select
              name="type"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              required
            >
              {caseTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Court Level</Label>
            <select
              name="courtLevel"
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={courtLevel}
              onChange={(e) => setCourtLevel(e.target.value)}
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

          {courtLevel && divisionOptions[courtLevel as keyof typeof divisionOptions] && (
            <FormField
              name="division"
              label="Division"
              type="select"
              options={divisionOptions[courtLevel as keyof typeof divisionOptions]}
            />
          )}

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
                  Add {section === "prosecution" || section === "plaintiff" ? "Party" : "Party"}
                </Button>
              </div>

              {parties[section]?.map((party, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Name</Label>
                        <Input
                          placeholder="Party name"
                          value={party.name}
                          onChange={(e) => updateParty(section, index, "name", e.target.value)}
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
        {caseType === "CRIMINAL" && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Offences</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOffence}
              >
                Add Offence
              </Button>
            </div>

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
                    size="sm"
                    onClick={() => removeOffence(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
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
