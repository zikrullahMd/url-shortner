import { UrlState } from '@/context';
import useFetch from '@/hooks/useFetch';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners';
import {getUrl, deleteUrl} from '../../db/apiUrls';
import {getClicksForUrl} from '../../db/apiClicks';
import { LinkIcon } from 'lucide-react';
import { Button } from '../components/ui/button'
import { Copy, Download, Trash } from 'lucide-react'



function Link() {
  const {id} = useParams();
  const {user} = UrlState();
  const {navigate} = useNavigate();

  const {loading, data:url, fn, error} = useFetch(getUrl,{id,user_id:user?.id});
  const {loading:loadingStats, data: stats, fn: fnStats,} = useFetch(getClicksForUrl,id);

  const {loading:loadingDelete, fn: fnDelete} = useFetch(deleteUrl,id);

  useEffect(()=>{
    fn();
    fnStats()
  },[])

  if(error){
    navigate('/dashboard');
  }
  let link = ""
  if(url){
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  const downloadImage = () =>{
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const anchor = document.createElement("a")
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}


  return (
    <>
    {
      (loading || loadingStats) && (
        <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
      )
    }
    <div className='flex flex-col gap-8 sm:flex-row justify-between'>
      <div className='flex flex-col items-start gap-8 rounded-lg sm:w-2/5'>
        <span className='text-6xl font-extrabold hover:underline cursor-pointer'>{url?.title}</span>
        <a href={`https://trimrr.in/${link}`} target='_blank' className='text-3xl sm:text-4xl text-blue-400 font-bold hover:underline'>
        https://trimrr.in/{link}
        </a>
        <a href={url?.original_url} target='_blank' className='flex items-center gap-1 hover:underline cursor-pointer'>
        <LinkIcon className='p-1' />
        {url?.original_url}
        </a>
        <span className='flex items-end font-extralight text-sm'>{new Date(url?.created_at).toLocaleDateString()}</span>
        
      </div>
      <div className='sm:w-3/5'>
      <div className='flex gap-6'>
            <Button variant="ghost">
                <Copy onClick={()=>{
                    navigator.clipboard.writeText(`https://trimrr.in/${url?.custom_url}`);
                }}/>
            </Button>
            <Button variant="ghost">
                <Download onClick={downloadImage}/>
            </Button>
            <Button variant="ghost" onClick={()=>fnDelete().then(()=>fetchUrls())}>
                {loadingDelete?<BeatLoader size={5} color='white'/> : <Trash />}
            </Button>
        </div>
      </div>
    </div>
    </>
  )
}

export default Link