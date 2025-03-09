import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCog, Dumbbell, Store } from 'lucide-react'
import { withAuth } from "./HOC/with-auth"

function DashboardStats() {
    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Member Card */}
                <Card className="bg-emerald-500 text-white">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <div className="mb-4 rounded-full p-3">
                            <Dumbbell className="h-8 w-8" />
                        </div>
                        <h2 className="mb-2 text-4xl font-bold">0</h2>
                        <p className="text-center text-sm">Total Member</p>
                    </CardContent>
                </Card>

                {/* Total Staff Member Card */}
                <Card className="bg-gray-600 text-white">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <div className="mb-4 rounded-full p-3">
                            <UserCog className="h-8 w-8" />
                        </div>
                        <h2 className="mb-2 text-4xl font-bold">3</h2>
                        <p className="text-center text-sm">Total Staff Member</p>
                    </CardContent>
                </Card>

                {/* Total Group Card */}
                <Card className="bg-gray-800 text-white">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <div className="mb-4 rounded-full p-3">
                            <Users className="h-8 w-8" />
                        </div>
                        <h2 className="mb-2 text-4xl font-bold">1</h2>
                        <p className="text-center text-sm">Total Group</p>
                    </CardContent>
                </Card>

                {/* Total Membership Card */}
                <Card className="bg-red-500 text-white">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <div className="mb-4 rounded-full p-3">
                            <Store className="h-8 w-8" />
                        </div>
                        <h2 className="mb-2 text-4xl font-bold">2</h2>
                        <p className="text-center text-sm">Total Membership</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


export default withAuth(DashboardStats)
