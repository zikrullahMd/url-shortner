import React from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';

function Signup() {
  return (
    <div>
        <Card>
              <CardHeader>
                <CardTitle className="text-center">Signup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="example@gmail.com" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Password</Label>
                  <Input id="email" placeholder="********" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="profile">Profile picture</Label>
                  <Input id="profile" type="file" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Signup</Button>
              </CardFooter>
            </Card>
    </div>
  )
}

export default Signup