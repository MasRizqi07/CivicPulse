import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, FileText, Shield, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Report Public Issues. Get Them Resolved.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              CivicPulse connects citizens with government agencies to efficiently report and resolve infrastructure and public service issues in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/reports/new">
                <Button size="lg" className="w-full sm:w-auto">
                  Lapor Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple 3-step process to get your issues resolved
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-status-submitted flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                Submit Report
              </h3>
              <p className="text-muted-foreground">
                Describe the issue with photos and location details
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-status-assigned flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                Officer Assigned
              </h3>
              <p className="text-muted-foreground">
                Government officer reviews and takes action
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-status-resolved flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                Issue Resolved
              </h3>
              <p className="text-muted-foreground">
                Track progress until the issue is fixed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Entry */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Choose Your Role
            </h2>
            <p className="text-muted-foreground text-lg">
              CivicPulse serves different users with tailored experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Citizens */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  For Citizens
                </h3>
                <p className="text-muted-foreground mb-6">
                  Report infrastructure issues and track their progress in real-time
                </p>
                <Link href="/reports/new">
                  <Button className="w-full">
                    Submit a Report
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Officers */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  For Officers
                </h3>
                <p className="text-muted-foreground mb-6">
                  Manage and resolve public service requests efficiently
                </p>
                <Link href="/dashboard">
                  <Button variant="secondary" className="w-full">
                    Officer Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Agencies */}
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-status-resolved/10 flex items-center justify-center mb-4 group-hover:bg-status-resolved/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-status-resolved" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  For Agencies
                </h3>
                <p className="text-muted-foreground mb-6">
                  Analyze reports and optimize public service delivery
                </p>
                <Link href="/admin">
                  <Button variant="outline" className="w-full">
                  Admin Panel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
