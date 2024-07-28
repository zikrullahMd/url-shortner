import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import {signup} from '../../db/apiAuth';

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


function Signup() {

    const [errors,setError] = useState([]);
    const [formData,setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profile_pic: null,
    })

    const navigate = useNavigate()
    const [searchParam] = useSearchParams();
    const longLink = searchParam.get("createNew");

    const handleInputChange = (e) => {
        const {name, value, files} = e.target;
        setFormData((prevState) => ({
          ...prevState,
          [name]: files ? files[0] : value,
        }));
      };

      const {data,error,loading,fn:fnSignup} = useFetch(signup,formData);
      const {fetchUser} = UrlState();
        if(error === null && data){
          navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
          fetchUser();
        }
      useEffect(()=>{

      },[error,loading])
       
    const handleSignup = async () =>{
        setError([]);

        try{
            const schema = Yup.object().shape({
                name: Yup.string().required("Name is required"),
                email: Yup.string().email("Invalid email").required("Email is required"),
                password: Yup.string().min(6,"Password must be at least 6 characters").required("Password is required"),
                profile_pic: Yup.mixed().required("Profile picture is required"),
            });

            await schema.validate(formData,{abortEarly : false});
            //api call
            await fnSignup();
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
                <CardTitle className="text-center">Signup</CardTitle>
                <CardDescription>
                  {error && <Error message={error.message}/>}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
              <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    name="name"
                    type="text"
                    placeholder="Enter Name"
                    onChange={handleInputChange}
                />
                  {errors.name && <Error message={errors.name}/>}
                </div>
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
                <div className="space-y-1">
                  <Label htmlFor="profile_pic">Profile picture</Label>
                  <Input
                    name="profile_pic"
                    type="file"
                    accept="image/*"
                    placeholder="Upload profile picture"
                    onChange={handleInputChange}
                />
                  {errors.profile_pic && <Error message={errors.profile_pic}/>}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSignup}>
                    {loading ? <BeatLoader size={10} color='#C062FF'/> : "Signup"}
                </Button>
              </CardFooter>
            </Card>
    </div>
  )
}

export default Signup