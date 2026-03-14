"use client";

import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className=" min-h-screen flex items-center justify-center  px-4">
      <div className="text-center space-y-6 max-w-xl">
        {/* 404 Number */}
        <h1 className="text-8xl md:text-9xl font-extrabold  tracking-tight text-red-700">
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-red-700">
          Page Not Found
        </h2>

        {/* Description */}
        <p className=" text-primary">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 pt-4 flex-wrap">
          <Button
            size={"lg"}
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <Button
            asChild
            size={"lg"}
            className="bg-red-700 text-white hover:bg-red-600 hover:text-white"
          >
            <Link href={"/"} >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

