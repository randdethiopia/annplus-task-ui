"use client"
import LoginForm from "@/app/datacollector/components/LoginForm";
import { RegisterForm } from "@/app/datacollector/components/register-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { IslandCard } from "@/components/icard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const formStyle = "w-full";

const DatacollectorAuth = () => {
    const router = useRouter();

    return (

        <main className="bg-background  p-4 pt-20 md:pt-32 relative">

            <div className="flex min-h-10 items-center justify-center">
                <IslandCard className="w-full max-w-md">
                    <Tabs defaultValue="login" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <div className={formStyle}>
                                <LoginForm />
                            </div>
                        </TabsContent>
                        <TabsContent value="register">
                            <div className={formStyle}>
                                <RegisterForm />
                            </div>
                        </TabsContent>
                    </Tabs>
                </IslandCard>
            </div>

        </main>

    );
};

export default DatacollectorAuth;