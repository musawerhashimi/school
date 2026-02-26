/**
 * FeesTab Component
 * Displays fee records for parents (static/mock data for now)
 */

import {
  Receipt,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar,
  FileText,
  Download,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, Badge, Button, Alert } from "@mis-components/ui";
import { useChildFees } from "../../hooks/useParents";
import { FEE_STATUS_CONFIG } from "../../constants";
import { format } from "date-fns";
import type { FeeRecord } from "../../types";

interface FeesTabProps {
  studentId: number;
}

// Mock fee data for demonstration
const mockFeeData = {
  total_fees: 25000,
  paid_amount: 18500,
  pending_amount: 6500,
  overdue_amount: 2000,
  records: [
    {
      id: 1,
      fee_type: "Tuition Fee",
      description: "Monthly tuition for January 2024",
      amount: 5000,
      paid_amount: 5000,
      due_date: "2024-01-15",
      paid_date: "2024-01-10",
      status: "paid" as const,
      status_display: "Paid",
      receipt_number: "REC-2024-0123",
    },
    {
      id: 2,
      fee_type: "Tuition Fee",
      description: "Monthly tuition for February 2024",
      amount: 5000,
      paid_amount: 5000,
      due_date: "2024-02-15",
      paid_date: "2024-02-12",
      status: "paid" as const,
      status_display: "Paid",
      receipt_number: "REC-2024-0256",
    },
    {
      id: 3,
      fee_type: "Lab Fee",
      description: "Science lab equipment and materials",
      amount: 2500,
      paid_amount: 2500,
      due_date: "2024-01-20",
      paid_date: "2024-01-18",
      status: "paid" as const,
      status_display: "Paid",
      receipt_number: "REC-2024-0134",
    },
    {
      id: 4,
      fee_type: "Tuition Fee",
      description: "Monthly tuition for March 2024",
      amount: 5000,
      paid_amount: 3000,
      due_date: "2024-03-15",
      paid_date: null,
      status: "partial" as const,
      status_display: "Partial",
      receipt_number: null,
    },
    {
      id: 5,
      fee_type: "Library Fee",
      description: "Annual library subscription",
      amount: 1500,
      paid_amount: 0,
      due_date: "2024-02-28",
      paid_date: null,
      status: "overdue" as const,
      status_display: "Overdue",
      receipt_number: null,
    },
    {
      id: 6,
      fee_type: "Sports Fee",
      description: "Annual sports activities fee",
      amount: 2000,
      paid_amount: 0,
      due_date: "2024-04-01",
      paid_date: null,
      status: "unpaid" as const,
      status_display: "Unpaid",
      receipt_number: null,
    },
    {
      id: 7,
      fee_type: "Exam Fee",
      description: "Mid-term examination fee",
      amount: 1000,
      paid_amount: 1000,
      due_date: "2024-03-01",
      paid_date: "2024-02-28",
      status: "paid" as const,
      status_display: "Paid",
      receipt_number: "REC-2024-0412",
    },
    {
      id: 8,
      fee_type: "Tuition Fee",
      description: "Monthly tuition for April 2024",
      amount: 5000,
      paid_amount: 2000,
      due_date: "2024-04-15",
      paid_date: null,
      status: "partial" as const,
      status_display: "Partial",
      receipt_number: null,
    },
  ] as FeeRecord[],
};

export default function FeesTab({ studentId }: FeesTabProps) {
  // Use mock data for now
  // const { data: feeData, isLoading } = useChildFees(studentId);
  const feeData = mockFeeData;
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const paidRecords = feeData?.records?.filter((r) => r.status === "paid") || [];
  const pendingRecords = feeData?.records?.filter((r) => r.status !== "paid") || [];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Receipt className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">
                  ${feeData?.total_fees?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-text-secondary">Total Fees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">
                  ${feeData?.paid_amount?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-text-secondary">Paid Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">
                  ${feeData?.pending_amount?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-text-secondary">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-error" />
              </div>
              <div>
                <p className="text-2xl font-bold text-error">
                  ${feeData?.overdue_amount?.toLocaleString() || 0}
                </p>
                <p className="text-xs text-text-secondary">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">Payment Progress</h3>
            <span className="text-sm text-text-secondary">
              {((feeData?.paid_amount || 0) / (feeData?.total_fees || 1) * 100).toFixed(0)}% Complete
            </span>
          </div>
          <div className="h-3 bg-bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-success to-success/70 rounded-full transition-all duration-500"
              style={{
                width: `${((feeData?.paid_amount || 0) / (feeData?.total_fees || 1) * 100)}%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-text-secondary">
            <span>Paid: ${feeData?.paid_amount?.toLocaleString()}</span>
            <span>Total: ${feeData?.total_fees?.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Pending/Overdue Fees */}
      {pendingRecords.length > 0 && (
        <Card className="border-warning/30">
          <CardHeader
            title="Pending Payments"
            action={
              <Badge variant="warning">{pendingRecords.length} pending</Badge>
            }
          />
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {pendingRecords.map((record) => {
                const config = FEE_STATUS_CONFIG[record.status];
                const isOverdue = record.status === "overdue";
                return (
                  <div
                    key={record.id}
                    className={`p-4 hover:bg-bg-secondary/50 transition-colors ${
                      isOverdue ? "bg-error/5" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isOverdue ? "bg-error/10" : "bg-warning/10"
                          }`}
                        >
                          {isOverdue ? (
                            <AlertTriangle className="h-6 w-6 text-error" />
                          ) : (
                            <Clock className="h-6 w-6 text-warning" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-text-primary">{record.fee_type}</h4>
                          {record.description && (
                            <p className="text-sm text-text-secondary">{record.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-sm text-text-secondary">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Due: {format(new Date(record.due_date), "MMM d, yyyy")}
                            </span>
                            {record.status === "partial" && (
                              <span className="text-info">
                                Paid: ${record.paid_amount.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-text-primary">
                          ${record.amount.toLocaleString()}
                        </p>
                        <Badge variant={config.variant} className="mt-1">
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader
          title="Payment History"
          action={
            <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>
              Download Statement
            </Button>
          }
        />
        <CardContent className="p-0">
          {paidRecords.length > 0 ? (
            <div className="divide-y divide-border">
              {paidRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 hover:bg-bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{record.fee_type}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {record.paid_date && format(new Date(record.paid_date), "MMM d, yyyy")}
                        </span>
                        {record.receipt_number && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            {record.receipt_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-success">
                      ${record.amount.toLocaleString()}
                    </p>
                    <Badge variant="success">Paid</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4">
              <Receipt className="h-8 w-8 text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary">No payment history yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods Info */}
      <Card>
        <CardHeader title="Payment Information" />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Methods
              </h4>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>• Cash payment at school office</li>
                <li>• Bank transfer to school account</li>
                <li>• Online payment via school portal</li>
                <li>• Mobile money (M-Paisa, etc.)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Bank Details
              </h4>
              <div className="space-y-1 text-sm text-text-secondary">
                <p><strong>Bank:</strong> Afghanistan International Bank</p>
                <p><strong>Account Name:</strong> XYZ School</p>
                <p><strong>Account No:</strong> 1234567890</p>
                <p><strong>Branch:</strong> Main Branch, Kabul</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert */}
      <Alert variant="info" title="Fee Payment Notice">
        Please ensure timely payment of fees to avoid late payment charges. For any queries regarding fee payments, please contact the school administration office.
      </Alert>
    </div>
  );
}
