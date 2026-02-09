import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetAllUserPlans, useGetCurrentUserPlan } from '@/hooks/useQueries';
import { useAssignUserPlan } from '@/hooks/useAdminMutations';
import { Loader2, Check, LogIn } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PlansPage() {
  const { identity, login } = useInternetIdentity();
  const { data: plans, isLoading: plansLoading, error: plansError } = useGetAllUserPlans();
  const { data: currentPlan, isLoading: currentPlanLoading } = useGetCurrentUserPlan();
  const assignPlan = useAssignUserPlan();

  const isAuthenticated = !!identity;

  const handleSelectPlan = async (planId: string) => {
    await assignPlan.mutateAsync(planId);
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Choose Your Plan</CardTitle>
            <CardDescription>Please login to view and select a plan</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={handleLogin} size="lg" className="gap-2">
              <LogIn className="h-5 w-5" />
              Login to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (plansLoading || currentPlanLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (plansError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Error Loading Plans</CardTitle>
            <CardDescription>
              {plansError instanceof Error ? plansError.message : 'Failed to load plans'}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>No Plans Available</CardTitle>
            <CardDescription>There are currently no plans available. Please check back later.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-muted-foreground text-lg">
              Select the plan that best fits your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = currentPlan?.id === plan.id;
              const isSelecting = assignPlan.isPending;

              return (
                <Card
                  key={plan.id}
                  className={`relative ${isCurrentPlan ? 'border-amber-500 border-2' : ''}`}
                >
                  {isCurrentPlan && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500">
                      Current Plan
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="min-h-[3rem]">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="text-4xl font-bold">
                        ${Number(plan.price)}
                        <span className="text-lg font-normal text-muted-foreground">/month</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={isCurrentPlan || isSelecting}
                      className="w-full gap-2"
                      variant={isCurrentPlan ? 'outline' : 'default'}
                    >
                      {isSelecting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Selecting...
                        </>
                      ) : isCurrentPlan ? (
                        <>
                          <Check className="h-4 w-4" />
                          Selected
                        </>
                      ) : (
                        'Select Plan'
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
