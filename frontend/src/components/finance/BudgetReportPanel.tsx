import { useQuery } from "@apollo/client";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { BUDGET_REPORT_QUERY } from "@/graphql/queries/finance";
import type { BudgetReport } from "@/types/finance";
import { formatCurrency } from "@/utils/currency";

type BudgetReportPanelProps = {
  projectId: string;
};

function getDifferenceColor(difference: number): "success" | "error" | "default" {
  if (difference > 0) {
    return "success";
  }

  if (difference < 0) {
    return "error";
  }

  return "default";
}

export function BudgetReportPanel({ projectId }: BudgetReportPanelProps) {
  const { data, loading, error } = useQuery<{ budgetReport: BudgetReport }>(BUDGET_REPORT_QUERY, {
    variables: { projectId },
  });

  const report = data?.budgetReport;

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <AssessmentOutlinedIcon color="primary" />
        <Typography variant="h6">Budget report</Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Aggregated income and expense totals grouped by normalized name.
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error">Failed to load budget report. Please try again.</Alert>
      )}

      {!loading && !error && report && (
        <>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
            <SummaryCard label="Total income" value={report.totalIncome} color="success" />
            <SummaryCard label="Total expense" value={report.totalExpense} color="error" />
            <SummaryCard
              label="Net difference"
              value={report.difference}
              color={getDifferenceColor(report.difference)}
            />
          </Stack>

          {report.items.length === 0 ? (
            <Typography color="text.secondary">
              No income or expense records to report yet.
            </Typography>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Total income</TableCell>
                    <TableCell align="right">Total expense</TableCell>
                    <TableCell align="right">Net difference</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.items.map((item) => (
                    <TableRow key={item.name} hover>
                      <TableCell>
                        <Typography fontWeight={600}>{item.name}</Typography>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(item.totalIncome)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.totalExpense)}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={formatCurrency(item.difference)}
                          size="small"
                          color={getDifferenceColor(item.difference)}
                          variant={item.difference === 0 ? "outlined" : "filled"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow sx={{ bgcolor: "action.hover" }}>
                    <TableCell>
                      <Typography fontWeight={700}>Totals</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={700}>{formatCurrency(report.totalIncome)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={700}>{formatCurrency(report.totalExpense)}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        fontWeight={700}
                        color={
                          report.difference > 0
                            ? "success.main"
                            : report.difference < 0
                              ? "error.main"
                              : "text.primary"
                        }
                      >
                        {formatCurrency(report.difference)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Paper>
  );
}

type SummaryCardProps = {
  label: string;
  value: number;
  color: "success" | "error" | "default";
};

function SummaryCard({ label, value, color }: SummaryCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography
        variant="h6"
        color={
          color === "success" ? "success.main" : color === "error" ? "error.main" : "text.primary"
        }
      >
        {formatCurrency(value)}
      </Typography>
    </Paper>
  );
}
