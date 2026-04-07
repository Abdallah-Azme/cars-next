"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, activateUser, disableUser } from "@/lib/actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2, UserCheck, UserX, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { UsersResponse } from "@/types/users";
import { useLocale, useTranslations } from "next-intl";

export default function UsersPage() {
  const locale = useLocale();
  const t = useTranslations("admin.users");
  const isRtl = locale === 'ar';
  
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ["users", page],
    queryFn: async () => {
      const res = await getUsers(page);
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
  });

  const activateMutation = useMutation({
    mutationFn: (userId: number) => activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(t("success.activated"));
    },
    onError: (err: Error) => toast.error(err.message || t("failed.activated")),
  });

  const disableMutation = useMutation({
    mutationFn: (userId: number) => disableUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(t("success.disabled"));
    },
    onError: (err: Error) => toast.error(err.message || t("failed.disabled")),
  });

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
      </div>
    );
  }

  const users = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className={`space-y-6 container mx-auto py-6 text-start`}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-red-700">{t("title")}</h1>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-lg font-medium">{t("cardTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow >
                <TableHead className="text-start">{t("table.user")}</TableHead>
                <TableHead className="text-start">{t("table.email")}</TableHead>
                <TableHead className="text-start">{t("table.role")}</TableHead>
                <TableHead className="text-start">{t("table.status")}</TableHead>
                <TableHead className="text-end">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id} className={`hover:bg-muted/50 transition-colors`}>
                    <TableCell>
                      <div className={`flex items-center gap-3`}>
                        <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center text-red-700">
                          <UserIcon size={18} />
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-start">{user.email}</TableCell>
                    <TableCell className="text-start">
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-start">
                      <Badge 
                        variant={user.statue === "active" ? "default" : "destructive"}
                        className={user.statue === "active" ? "bg-green-600 hover:bg-green-700 font-bold" : "font-bold"}
                      >
                        {user.statue === "active" ? t("status.active") : t("status.disabled")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-end">
                      {user.statue === "active" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className={`text-red-600 border-red-200 hover:bg-red-50 font-bold`}
                          onClick={() => disableMutation.mutate(user.id)}
                          disabled={disableMutation.isPending}
                        >
                          <UserX className="me-2 h-4 w-4" />
                          {disableMutation.isPending ? t("actions.disabling") : t("actions.disable")}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className={`text-green-600 border-green-200 hover:bg-green-50 font-bold`}
                          onClick={() => activateMutation.mutate(user.id)}
                          disabled={activateMutation.isPending}
                        >
                          <UserCheck className="me-2 h-4 w-4" />
                          {activateMutation.isPending ? t("actions.activating") : t("actions.activate")}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    {t("noUsers")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {pagination && pagination.last_page > 1 && (
        <div className={`flex items-center justify-end space-x-2 py-4`}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <div className="text-sm font-medium">
            {t("pagination", { current: page, total: pagination.last_page })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
            disabled={page === pagination.last_page}
          >
            {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}
