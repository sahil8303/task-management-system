import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function TaskCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded mt-1 animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
            <div className="flex gap-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32" />
      </CardFooter>
    </Card>
  );
}
