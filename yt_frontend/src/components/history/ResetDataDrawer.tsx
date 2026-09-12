import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { RESET_COPY } from "@/lib/constants";

interface ResetDataDrawerProps {
  open: boolean;
  isResetting: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ResetDataDrawer({
  open,
  isResetting,
  error,
  onCancel,
  onConfirm,
}: ResetDataDrawerProps) {
  return (
    <Drawer open={open} onClose={isResetting ? () => {} : onCancel} title={RESET_COPY.title}>
      <p className="text-foreground-soft mb-6 text-sm leading-relaxed">{RESET_COPY.body}</p>

      {error && (
        <p
          role="alert"
          className="rounded-card border-danger/20 bg-danger/8 text-foreground-soft mb-6 border px-4 py-3 text-sm leading-relaxed"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isResetting}>
          {RESET_COPY.cancel}
        </Button>
        <Button
          variant="solid"
          onClick={onConfirm}
          disabled={isResetting}
          className="bg-danger hover:bg-danger/90 text-white"
        >
          {isResetting ? RESET_COPY.confirming : RESET_COPY.confirm}
        </Button>
      </div>
    </Drawer>
  );
}
