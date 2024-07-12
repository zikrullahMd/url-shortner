import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Filter } from 'lucide-react'
import useFetch from '@/hooks/useFetch'
import { getUrls } from '../../db/apiUrls'
import { UrlState } from '@/context'
import Error from '../components/error';
import { getClicks } from '../../db/apiClicks'

import LinkCard from '@/components/link-card'
import CreateLink from '../components/create-link';

function Dashboard() {

  const [searchQuery,setSearchQuery] = useState();

  const {user} = UrlState();

  const {loading,error,data:urls,fn:fnUrls} = useFetch(getUrls,user?.id);

  const {
    loading: loadingClicks,
    data: clicks,
    fn: fnClicks,
  } = useFetch(getClicks, urls?.map((url)=>url.id));

  useEffect(()=>{
    fnUrls();
  },[])

  useEffect(()=>{
    if(urls?.length){
      fnClicks();
      console.log("URL ",filteredUrls);
    }
  },[urls?.length]);

  const filteredUrls = urls?.filter((url) => 
    url?.title?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  return (
    <div className='flex flex-col gap-8'>
      {loadingClicks || loading && <BarLoader width={"100%"} color='#36d7b7'/>}
      <div className='grid grid-cols-2 gap-4'>
      <Card>
      <CardHeader>
        <CardTitle>Links created</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{urls?.length}</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Total clicks</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{clicks?.length}</p>
      </CardContent>
    </Card>
    </div>

    <div className='flex justify-between'>
      <h1 className='text-4xl font-extrabold'>My Links</h1>
      <CreateLink />
    </div>

    <div className='relative'>
      <Input value={searchQuery} type="text" placeholder="Filter Links" onChange={(event)=>{
        setSearchQuery(event.target.value)
      }}/>
      <Filter className="absolute top-2 right-2 p-1" />
    </div>
      {error && <Error message={error?.message} />}
      {(filteredUrls || []).map((url,id)=>{
        return <LinkCard key={id} url={url} fetchUrls={fnUrls}/>
      })}
    </div>
  )
}

export default Dashboard