import React, { useState } from 'react'
import * as Yup from 'yup';

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
import { BeatLoader } from 'react-spinners';

import Error from './error';


function Signin() {
    const [error,setError] = useState([]);
    const [formData,setFormData] = useState({
        email: "",
        password: "",
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };

    const handleLogin = async () =>{
        setError([]);

        try{
            const schema = Yup.object().shape({
                email: Yup.string().email("Invalid email").required("Email is required"),
                password: Yup.string().min(6,"Password must be at least 6 characters").required("Password is required"),
            });

            await schema.validate(formData,{abortEarly : false});
            //api call
        }catch(e){
            const newErrors = {};
            e?.inner?.forEach((err)=>{
                newErrors[err.path] = err.message;
            })
            setError(newErrors);
        }
    }
  return (
    <div>
        <Card>
              <CardHeader>
                <CardTitle className="text-center">Signin</CardTitle>
                {<Error message={'some error'}/>}
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    onChange={handleInputChange}
                />
                  {error.email && <Error message={error.email}/>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    onChange={handleInputChange}
                />
                  {error.password && <Error message={error.password}/>}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleLogin}>
                    {false ? <BeatLoader size={10} color='#C062FF'/> : "Signin"}
                </Button>
              </CardFooter>
            </Card>
    </div>
  )
}

export default Signin