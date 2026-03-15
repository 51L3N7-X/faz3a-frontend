"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, UserCheck, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function CategoriesOverview() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage job categories and professional service categories
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Jobs Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Job Categories</CardTitle>
                <CardDescription>
                  3-level hierarchy: المجال → القسم → Job Name
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Manage job categories with main fields, departments, and specific job positions.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">Structure:</span>
                  <br />
                  10 Main Categories → 16 Departments → 53+ Job Positions
                </div>
                <Button asChild>
                  <Link href="/dashboard/categories/jobs">
                    Manage Jobs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professionals Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Professional Services</CardTitle>
                <CardDescription>
                  2-level hierarchy: Main Category → Service
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Manage professional service categories and their subcategories.
              </p>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">Structure:</span>
                  <br />
                  Main Categories → Services
                </div>
                <Button asChild variant="outline">
                  <Link href="/dashboard/categories/professionals">
                    Manage Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">10</div>
            <p className="text-xs text-muted-foreground">Job Main Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">16</div>
            <p className="text-xs text-muted-foreground">Job Departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">53+</div>
            <p className="text-xs text-muted-foreground">Job Positions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">2+</div>
            <p className="text-xs text-muted-foreground">Service Categories</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
