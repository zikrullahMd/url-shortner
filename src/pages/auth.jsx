import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "react-router-dom";

import Signin from '../components/signin';
import Signup from '../components/signup';

function Auth() {
  const [searchParams] = useSearchParams();

  return (
    <div className="flex justify-center my-10">
      {searchParams.get("createNew") ? (
        <p className="text-5xl font-extrabold my-10">Kaha chale chichaaa 😏! Pehele swagat toh karle 🙏</p>
      ) : (
        <Tabs defaultValue="signin" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="signin">Signin</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Signin/>
          </TabsContent>
          <TabsContent value="signup">
            <Signup/>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

export default Auth;
