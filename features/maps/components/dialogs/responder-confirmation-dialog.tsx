'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2, Navigation, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface ResponderConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  onCancelResponse?: () => Promise<void>;
  onMarkDone?: () => Promise<void>;
}

type DialogState = "confirm" | "loading" | "responding";

export function ResponderConfirmationDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancelResponse,
  onMarkDone,
}: ResponderConfirmationDialogProps) {
  const [state, setState] = useState<DialogState>("confirm");

  const handleConfirm = async () => {
    setState("loading");
    try {
      await onConfirm();
      setState("responding");
    } catch (error) {
      console.error(error);
      setState("confirm");
    }
  };

  const handleCancelResponse = async () => {
    try {
      await onCancelResponse?.();
    } finally {
      setState("confirm");
      onOpenChange(false);
    }
  };

  const handleMarkDone = async () => {
    try {
      await onMarkDone?.();
    } finally {
      setState("confirm");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={state === "responding" ? () => { } : onOpenChange}>
      <DialogContent
        className="max-w-md z-[9999]"
        onInteractOutside={(e) => state === "responding" && e.preventDefault()}
        onEscapeKeyDown={(e) => state === "responding" && e.preventDefault()}
      >
        {(state === "confirm" || state === "loading") && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <DialogTitle>Confirm Response</DialogTitle>
              </div>
              <DialogDescription className="text-sm">
                Are you sure you want to respond to this accident? Once you
                respond, the accident will be marked as responded in the
                database.
              </DialogDescription>
            </DialogHeader>

            {/* Replace DialogFooter with a full-width grid */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={() => onOpenChange(false)}
                disabled={state === "loading"}
                className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={state === "loading"}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {state === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                {state === "loading" ? "Confirming..." : "Yes, Get Directions"}
              </button>
            </div>
          </>
        )}

        {state === "responding" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-5 h-5 text-green-600 animate-pulse" />
                <DialogTitle>Currently Responding</DialogTitle>
              </div>
              <DialogDescription className="text-sm">
                You are currently en route to the accident scene. Once you
                arrive and handle the situation, mark it as done. If you cannot
                continue, cancel your response.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-green-50 border border-green-200 rounded-md p-4 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              <p className="text-sm font-semibold text-green-800">En Route to Accident Scene</p>
              <p className="text-xs text-green-600">Navigation is active — stay safe!</p>
            </div>

            {/* Full-width grid for responding actions */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                onClick={handleCancelResponse}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancel Response
              </button>
              <button
                onClick={handleMarkDone}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Done
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}