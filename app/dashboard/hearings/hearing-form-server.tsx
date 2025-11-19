/**
 * Hearing Form Component (Server Actions)
 * 
 * Form for creating/editing hearings using server actions with FormData
 */

import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Scale, 
  User, 
  FileText,
  AlertCircle 
} from "lucide-react";
import { FormField, FormActions } from "@/components/forms";

interface Case {
  id: string;
  title: string;
  caseNumber?: string;
}

interface CourtRoom {
  id: string;
  name: string;
  code: string;
  courtLevel: string;
}

interface User {
  id: string;
  name: string;
}

interface HearingFormProps {
  action: (formData: FormData) => Promise<void>;
  initialData?: {
    caseId?: string;
    scheduledDate?: string;
    scheduledTime?: string;
    estimatedDuration?: number | null;
    courtRoomId?: string | null;
    location?: string | null;
    actionType?: string;
    status?: string;
    judgeId?: string | null;
    magistrateId?: string | null;
    clerkId?: string | null;
    bailConsidered?: boolean | null;
    bailDecision?: string | null;
    bailAmount?: number | null;
    bailConditions?: string | null;
    outcome?: string | null;
    nextActionRequired?: string | null;
    notes?: string | null;
  };
  cases: Case[];
  courtrooms: CourtRoom[];
  judges?: User[];
  magistrates?: User[];
  clerks?: User[];
  mode: "create" | "edit";
  cancelHref?: string;
}

const ACTION_TYPES = [
  { value: "MENTION", label: "Mention" },
  { value: "TRIAL", label: "Trial" },
  { value: "CONTINUATION_OF_TRIAL", label: "Continuation of Trial" },
  { value: "VOIR_DIRE_HEARING", label: "Voir Dire Hearing" },
  { value: "PRE_TRIAL_CONFERENCE", label: "Pre-Trial Conference" },
  { value: "RULING", label: "Ruling" },
  { value: "FIRST_CALL", label: "First Call" },
  { value: "BAIL_HEARING", label: "Bail Hearing" },
  { value: "SENTENCING", label: "Sentencing" },
  { value: "CASE_CONFERENCE", label: "Case Conference" },
  { value: "OTHER", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "adjourned", label: "Adjourned" },
  { value: "cancelled", label: "Cancelled" },
];

const BAIL_DECISIONS = [
  { value: "not_decided", label: "Not yet decided" },
  { value: "granted", label: "Granted" },
  { value: "denied", label: "Denied" },
  { value: "continued", label: "Continued" },
  { value: "not_applicable", label: "Not Applicable" },
];

export function HearingFormServer({
  action,
  initialData,
  cases,
  courtrooms,
  judges = [],
  magistrates = [],
  clerks = [],
  mode,
  cancelHref = "/dashboard/hearings",
}: HearingFormProps) {
  return (
    <form action={action} className="space-y-8">
      {/* Basic Details Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Calendar className="h-5 w-5" />
          <h3>Basic Details</h3>
        </div>

        {/* Case Selection */}
        {mode === "create" && (
          <FormField
            label="Case"
            name="caseId"
            type="select"
            placeholder={cases.length > 0 ? "Select a case" : "No cases available"}
            required
            helpText="Select the case for this hearing"
            options={cases.map((c) => ({
              value: c.id,
              label: c.caseNumber ? `${c.caseNumber} - ${c.title}` : c.title,
            }))}
            defaultValue={initialData?.caseId}
          />
        )}

        {mode === "edit" && initialData?.caseId && (
          <input type="hidden" name="caseId" value={initialData.caseId} />
        )}

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Date"
            name="scheduledDate"
            type="date"
            required
            helpText="Select the hearing date"
            min={new Date().toISOString().split('T')[0]}
            defaultValue={initialData?.scheduledDate}
          />

          <FormField
            label="Time"
            name="scheduledTime"
            type="time"
            required
            helpText="Select the hearing time"
            defaultValue={initialData?.scheduledTime}
          />
        </div>

        {/* Estimated Duration */}
        <FormField
          label="Estimated Duration (minutes)"
          name="estimatedDuration"
          type="number"
          placeholder="e.g., 60, 120"
          helpText="Approximate duration in minutes"
          min="1"
          defaultValue={initialData?.estimatedDuration?.toString()}
        />
      </div>

      {/* Hearing Type & Venue Section */}
      <div className="space-y-6 border-t pt-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Scale className="h-5 w-5" />
          <h3>Hearing Type & Venue</h3>
        </div>

        {/* Action Type */}
        <FormField
          label="Action Type"
          name="actionType"
          type="select"
          placeholder="Select action type"
          required
          helpText="Type of hearing action (e.g., Mention, Trial, Bail Hearing)"
          options={ACTION_TYPES}
          defaultValue={initialData?.actionType}
        />

        {/* Status */}
        <FormField
          label="Status"
          name="status"
          type="select"
          placeholder="Select status"
          required
          helpText="Set the hearing status"
          options={STATUS_OPTIONS}
          defaultValue={initialData?.status || "scheduled"}
        />

        {/* Courtroom */}
        <FormField
          label="Courtroom"
          name="courtRoomId"
          type="select"
          placeholder="Select courtroom (optional)"
          helpText="Select a tracked courtroom or use location field below"
          options={courtrooms.map((cr) => ({
            value: cr.id,
            label: `${cr.name} - ${cr.code} (${cr.courtLevel})`,
          }))}
          defaultValue={initialData?.courtRoomId || ""}
        />

        {/* Location (fallback) */}
        <FormField
          label="Location (Alternative)"
          name="location"
          type="text"
          placeholder="e.g., Courtroom 5, High Court Suva"
          helpText="Use this if the courtroom is not tracked in the system"
          defaultValue={initialData?.location || ""}
        />
      </div>

      {/* Personnel Section */}
      <div className="space-y-6 border-t pt-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <User className="h-5 w-5" />
          <h3>Personnel</h3>
        </div>

        {/* Judge */}
        {judges.length > 0 && (
          <FormField
            label="Presiding Judge"
            name="judgeId"
            type="select"
            placeholder="Select judge (optional)"
            options={judges.map((judge) => ({
              value: judge.id,
              label: judge.name,
            }))}
            defaultValue={initialData?.judgeId || ""}
          />
        )}

        {/* Magistrate */}
        {magistrates.length > 0 && (
          <FormField
            label="Presiding Magistrate"
            name="magistrateId"
            type="select"
            placeholder="Select magistrate (optional)"
            options={magistrates.map((mag) => ({
              value: mag.id,
              label: mag.name,
            }))}
            defaultValue={initialData?.magistrateId || ""}
          />
        )}

        {/* Clerk */}
        {clerks.length > 0 && (
          <FormField
            label="Court Clerk"
            name="clerkId"
            type="select"
            placeholder="Select clerk (optional)"
            options={clerks.map((clerk) => ({
              value: clerk.id,
              label: clerk.name,
            }))}
            defaultValue={initialData?.clerkId || ""}
          />
        )}
      </div>

      {/* Bail Section */}
      <div className="space-y-6 border-t pt-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <AlertCircle className="h-5 w-5" />
          <h3>Bail Considerations</h3>
        </div>

        {/* Bail Considered Toggle */}
        <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
          <div className="flex-1">
            <Label htmlFor="bailConsidered" className="text-base font-medium">
              Bail to be considered
            </Label>
            <p className="text-sm text-muted-foreground">
              Check if bail will be considered at this hearing
            </p>
          </div>
          <input
            type="checkbox"
            id="bailConsidered"
            name="bailConsidered"
            defaultChecked={initialData?.bailConsidered || false}
            className="h-10 w-10 rounded"
          />
        </div>

        {/* Bail Decision */}
        <FormField
          label="Bail Decision"
          name="bailDecision"
          type="select"
          placeholder="Select bail decision"
          options={BAIL_DECISIONS}
          defaultValue={initialData?.bailDecision || "not_decided"}
        />

        {/* Bail Amount */}
        <FormField
          label="Bail Amount (FJD)"
          name="bailAmount"
          type="number"
          placeholder="e.g., 5000"
          helpText="Enter bail amount if granted or continued"
          min="0"
          defaultValue={initialData?.bailAmount?.toString()}
        />

        {/* Bail Conditions */}
        <FormField
          label="Bail Conditions"
          name="bailConditions"
          type="textarea"
          placeholder="Enter any bail conditions..."
          defaultValue={initialData?.bailConditions || ""}
        />
      </div>

      {/* Outcome & Notes Section */}
      <div className="space-y-6 border-t pt-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="h-5 w-5" />
          <h3>Outcome & Notes</h3>
        </div>

        {/* Outcome */}
        <FormField
          label="Outcome"
          name="outcome"
          type="textarea"
          placeholder="Brief description of the hearing outcome..."
          helpText="Record the outcome after the hearing concludes"
          defaultValue={initialData?.outcome || ""}
        />

        {/* Next Action Required */}
        <FormField
          label="Next Action Required"
          name="nextActionRequired"
          type="textarea"
          placeholder="e.g., Schedule trial date, File additional documents..."
          helpText="What needs to happen next after this hearing"
          defaultValue={initialData?.nextActionRequired || ""}
        />

        {/* Notes */}
        <FormField
          label="Additional Notes"
          name="notes"
          type="textarea"
          placeholder="Any other important notes or observations..."
          defaultValue={initialData?.notes || ""}
        />
      </div>

      {/* Form Actions */}
      <FormActions
        cancelHref={cancelHref}
        submitLabel={mode === "create" ? "Schedule Hearing" : "Save Changes"}
      />
    </form>
  );
}
