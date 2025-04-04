
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value?: string | number;
  icon: LucideIcon;
  description: string;
  to: string;
  actionLink?: string;
  actionText?: string;
}

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  description,
  to,
  actionLink,
  actionText,
}: DashboardCardProps) => {
  return (
    <Link to={to}>
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {value !== undefined && <p className="text-2xl font-bold">{value}</p>}
          <p className="text-xs text-muted-foreground">{description}</p>
          
          {actionLink && actionText && (
            <Link to={actionLink} className="text-xs text-blue-500 hover:underline mt-2 block">
              {actionText}
            </Link>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default DashboardCard;
