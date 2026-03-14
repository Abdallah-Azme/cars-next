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

const ProfilePage = () => {

  return (
    <>
      <PageHeader title="My Profile" />
      <div className="container my-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Profile Info */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your name and profile picture.
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
                  Password Management
                </CardTitle>
                <CardDescription>
                  Change your password to keep your account secure.
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

