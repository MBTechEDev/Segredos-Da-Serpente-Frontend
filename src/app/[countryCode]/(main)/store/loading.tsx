import { Skeleton } from "@components/ui/skeleton"

export default function StoreLoading() {
    return (
        <div className="container mx-auto px-4 py-32">
            <div className="flex gap-8">
                {/* Sidebar Skeleton */}
                <div className="hidden lg:block w-64 space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-[400px] w-full" />
                </div>

                {/* Grid Skeleton */}
                <div className="flex-1 space-y-6">
                    <div className="flex justify-between">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-48" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}