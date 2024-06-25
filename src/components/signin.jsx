import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import {signin} from '../../db/apiAuth';

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
import { Button } from '@/components/ui/button';
import { BeatLoader } from 'react-spinners';

import Error from './error';
import useFetch from '@/hooks/useFetch';
import { UrlState } from '@/context';


function Signin() {

    const [errors,setError] = useState([]);
    const [formData,setFormData] = useState({
        email: "",
        password: "",
    })

    const navigate = useNavigate()
    const [searchParam] = useSearchParams();
    const longLink = searchParam.get("createNew");

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      };

      const {data,error,loading,fn:fnLogin} = useFetch(signin,formData);
      const {fetchUser} = UrlState();
        if(error === null && data){
          console.log("Success ",data);
          navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
          fetchUser();
        }
      useEffect(()=>{

      },[data,error])
       
    const handleLogin = async () =>{
        setError([]);

        try{
            const schema = Yup.object().shape({
                email: Yup.string().email("Invalid email").required("Email is required"),
                password: Yup.string().min(6,"Password must be at least 6 characters").required("Password is required"),
            });

            await schema.validate(formData,{abortEarly : false});
            //api call
            await fnLogin();
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
                <CardDescription>
                  {error && <Error message={error.message}/>}
                </CardDescription>
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
                  {errors.email && <Error message={errors.email}/>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    onChange={handleInputChange}
                />
                  {errors.password && <Error message={errors.password}/>}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleLogin}>
                    {loading ? <BeatLoader size={10} color='#C062FF'/> : "Signin"}
                </Button>
              </CardFooter>
            </Card>
    </div>
  )
}

export default Signin