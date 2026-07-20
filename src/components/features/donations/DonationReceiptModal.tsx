import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { Church } from "lucide-react";
import { Badge } from "@/components/ui";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { Donation } from "@/lib/types";

interface DonationReceiptModalProps {
  donation: Donation | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Maps donation status to a badge variant.
 */
function statusVariant(
  status: Donation["status"],
): "success" | "warning" | "error" {
  if (status === "success") return "success";
  if (status === "pending") return "warning";
  return "error";
}

/**
 * Receipt-style modal for a single donation record.
 */
export function DonationReceiptModal({
  donation,
  isOpen,
  onClose,
}: DonationReceiptModalProps): React.ReactElement {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      backdrop="blur"
      placement="center"
      size="md"
      classNames={{
        base: "bg-white",
        header: "border-b border-slate-200/80",
        footer: "border-t border-slate-200/80",
      }}
    >
      <ModalContent>
        {() =>
          donation ? (
            <>
              <ModalHeader className="flex flex-col gap-1 pb-4">
                <div className="flex items-end justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-white">
                      <Church className="size-5" aria-hidden />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-display text-xl font-semibold text-primary">
                        Donation Receipt
                      </span>
                    </div>
                  </div>
                </div>
              </ModalHeader>

              <ModalBody className="gap-0 px-0 py-0 relative">
                <div className="absolute top-0 right-0 px-10 py-3">
                  <Badge
                    variant={statusVariant(donation.status)}
                    className="rounded-full px-3 text-[11px] font-bold uppercase tracking-tight"
                  >
                    {donation.status}
                  </Badge>
                </div>
                <div className="bg-slate-50/80 px-6 py-8 text-center sm:px-8">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Amount received
                  </p>
                  <p className="mt-2 font-display text-4xl font-semibold tracking-tight text-primary">
                    {formatCurrency(donation.amount, donation.currency)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {formatDateTime(donation.createdAt)}
                  </p>
                </div>

                <div className="space-y-4 px-6 py-6 sm:px-8">
                  <ReceiptRow label="Donor" value={donation.donorName} />
                  <ReceiptRow label="Email" value={donation.email} />
                  <ReceiptRow
                    label="Visibility"
                    value={donation.isAnonymous ? "Anonymous" : "Public name"}
                  />
                  <ReceiptRow
                    label="Reference"
                    value={donation.transactionId}
                    mono
                  />
                  <ReceiptRow label="Currency" value={donation.currency} />
                </div>

                <div className="border-t border-dashed border-slate-200 px-6 py-4 sm:px-8">
                  <p className="text-center text-xs leading-relaxed text-slate-400">
                    Thank you for supporting Divine Gospel Delight Foundation.
                    This record confirms the contribution details on file.
                  </p>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="primary" className="w-full" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          ) : null
        }
      </ModalContent>
    </Modal>
  );
}

function ReceiptRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}): React.ReactElement {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </span>
      <span
        className={
          mono
            ? "break-all text-right text-xs font-medium text-primary"
            : "text-right text-sm font-semibold text-primary"
        }
      >
        {value}
      </span>
    </div>
  );
}
