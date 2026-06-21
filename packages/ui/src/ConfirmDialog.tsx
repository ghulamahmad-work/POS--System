"use client";

import * as React from "react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div 
        className="fixed inset-0" 
        onClick={() => !loading && onCancel()} 
        aria-hidden="true" 
      />
      <div 
        className="relative z-50 w-full max-w-md animate-in fade-in-90 zoom-in-95 rounded-lg border border-[var(--border-subtle)] bg-[var(--panel)] p-6 shadow-lg sm:max-w-lg"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">{description}</p>
        <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button 
            variant={isDestructive ? "destructive" : "primary"} 
            onClick={onConfirm} 
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
