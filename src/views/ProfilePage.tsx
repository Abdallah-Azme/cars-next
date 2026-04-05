"use client";

import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import ProfileInfoForm from "@/components/profile/ProfileInfoForm";
import EmailSubscription from "@/components/shared/EmailBox";
import LogoutBtn from "@/components/shared/LogoutBtn";
import PageHeader from "@/components/shared/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocale, useTranslations } from "next-intl";

const ProfilePage = () => {
  const locale = useLocale();
  const t = useTranslations("profile");
  const isRtl = locale === 'ar';

  return (
    <>
      <PageHeader title={t("title")} />
      <div className={`container my-12 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Profile Info */}
          <Card className="h-full">
            <CardHeader className={`${isRtl ? 'items-start' : 'items-start'}`}>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                {t("info.title")}
              </CardTitle>
              <CardDescription>
                {t("info.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileInfoForm />
            </CardContent>
          </Card>

          {/* Change Password */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {t("security.title")}
                </CardTitle>
                <CardDescription>
                  {t("security.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChangePasswordForm />
              </CardContent>
            </Card>
            <LogoutBtn size="lg" />
          </div>
        </div>
      </div>
      <EmailSubscription />
    </>
  );
};

export default ProfilePage;

