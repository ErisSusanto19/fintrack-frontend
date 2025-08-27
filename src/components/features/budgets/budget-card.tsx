'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Budget } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Target, Gauge } from "lucide-react";
import BudgetActions from "./budget-actions";

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void; 
}

export const BudgetCard = ({ budget, onEdit, onDelete }: BudgetCardProps) => {
  const amountSpent = budget.amountSpent;
  const progressValue = budget.percentageSpent;
  const remainingAmount = budget.remainingAmount;

  const getProgressColor = () => {
    if (progressValue > 90) return "bg-red-500";
    if (progressValue > 70) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">
            {budget.categoryName || 'Overall Budget'}
          </CardTitle>
        </div>
        <BudgetActions
          budget={budget}
          onEdit={() => onEdit(budget)}
          onDelete={() => onDelete(budget)}
        />
      </CardHeader>
      <CardContent>
        {/* <div className="text-2xl font-bold">{formatCurrency(remainingAmount)}</div>
        <p className="text-xs text-muted-foreground">
          {formatCurrency(amountSpent)} spent of {formatCurrency(budget.amountLimit)}
        </p> */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Spent</span>
            <span className="font-medium">{formatCurrency(amountSpent)}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Remaining</span>
            <span className="text-2xl font-bold">{formatCurrency(remainingAmount)}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Limit</span>
            <span className="font-medium">{formatCurrency(budget.amountLimit)}</span>
          </div>
        </div>
        <Progress value={progressValue} className="mt-4" indicatorClassName={getProgressColor()}/>
      </CardContent>
    </Card>
  );
};