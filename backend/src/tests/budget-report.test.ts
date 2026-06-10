import { prisma } from "../config/prisma.js";
import { budgetReportService } from "../modules/budget-report/budget-report.service.js";
import { expenseService } from "../modules/expenses/expense.service.js";
import { incomeService } from "../modules/incomes/income.service.js";
import { cleanDatabase, createTestProject, createTestUser } from "./test-utils.js";

describe("Budget Report", () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("aggregates same names and handles names existing only on one side", async () => {
    const owner = await createTestUser("owner.report@example.com", "Owner");
    const project = await createTestProject(owner.user.id);

    await expenseService.createExpense(
      {
        projectId: project!.id,
        name: "Hotel",
        amount: 500,
      },
      owner.user.id,
    );

    await expenseService.createExpense(
      {
        projectId: project!.id,
        name: "  hotel  ",
        amount: 300,
      },
      owner.user.id,
    );

    await expenseService.createExpense(
      {
        projectId: project!.id,
        name: "Transport",
        amount: 100,
      },
      owner.user.id,
    );

    await incomeService.createIncome(
      {
        projectId: project!.id,
        name: "hotel",
        amount: 1200,
      },
      owner.user.id,
    );

    await incomeService.createIncome(
      {
        projectId: project!.id,
        name: "Tour",
        amount: 400,
      },
      owner.user.id,
    );

    const report = await budgetReportService.getBudgetReport(project!.id, owner.user.id);

    expect(report.totalIncome).toBe(1600);
    expect(report.totalExpense).toBe(900);
    expect(report.difference).toBe(700);

    const hotel = report.items.find((item) => item.name === "hotel");
    const transport = report.items.find((item) => item.name === "transport");
    const tour = report.items.find((item) => item.name === "tour");

    expect(hotel).toEqual({
      name: "hotel",
      totalIncome: 1200,
      totalExpense: 800,
      difference: 400,
    });

    expect(transport).toEqual({
      name: "transport",
      totalIncome: 0,
      totalExpense: 100,
      difference: -100,
    });

    expect(tour).toEqual({
      name: "tour",
      totalIncome: 400,
      totalExpense: 0,
      difference: 400,
    });
  });
});
