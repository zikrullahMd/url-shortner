import React, {useState} from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import banner from "../assets/banner.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";


function LandingPage() {

  const [url,setUrl] = useState();
  const navigate = useNavigate();

  const handleShortening = (event) =>{
    event.preventDefault();
    if(url){
        navigate(`/auth?createNew=${url}`);
    }
  }


  return (
    <div className="flex flex-col items-center">
      <h2 className="m-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold">
        Shorten URLs. Keep it sleek.
      </h2>
      <form onSubmit={handleShortening} className="sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2">
        <Input
          value={url}
          type="url"
          placeholder="Enter you looooong URL"
          onChange={(e)=>setUrl(e.target.value)}
          className="h-full flex-1 py-4 px-4 "
        />
        <Button className="h-full" type="submit" variant="destructive">
          Short it
        </Button>
      </form>
      <img
        src={banner}
        alt="banner"
        className="w-full my-11 md:px-11"
        style={{ height: "500px" }}
      />
      <Accordion type="multiple" collabsable className="w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is this free?</AccordionTrigger>
          <AccordionContent>
            Yes. It is absolutely free of cost.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How does it work?</AccordionTrigger>
          <AccordionContent>
            Just copy the URL you want to short and past it in the input and the shorter url will be generated.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I download and share my QR code?</AccordionTrigger>
          <AccordionContent>
            Yes, you can download by clicking on download button right above the qr code.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Is it safe?</AccordionTrigger>
          <AccordionContent>
            Yes it is.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default LandingPage;
