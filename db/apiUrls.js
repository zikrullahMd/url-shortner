import supabase,{supabaseUrl} from "./supabase"
import UAParcer from "ua-parser-js";


export async function getUrls(user_id){
    const {data, error} = await supabase.from("urls").select("*").eq("user_id",user_id);

    if(error){
        console.error(error.message);
        throw new Error("Unable to load URL's");
    }

    return data;
}

export async function deleteUrl(id){
    const {data, error} = await supabase.from("urls").delete().eq("id",id);

    if(error){
        console.error(error.message);
        throw new Error("Unable to load URL's");
    }

    return data;
}

export async function createUrl({title,longUrl,customUrl,user_id},qrcode){    
    const short_url = Math.random().toString(36).substring(2,6);
    const fileName = `qr-${short_url}`;
    const {error:storageError} = await supabase.storage.from("qrs").upload(fileName,qrcode);

    if(storageError) throw new Error(storageError.message);

    const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;
    const {data, error} = await supabase.from("urls").insert([
        {
            title,
            original_url: longUrl,
            custom_url: customUrl || null,
            user_id,
            short_url,
            qr,
        }
    ])
    .select();

    if(error){
        console.log("URL enter error",error);
        throw new Error("Error creating short url");
    }

    return data;
}


export async function getLongUrl(id){
    const {data, error} = await supabase.from("urls").select("id, original_url").or(`short_url.eq.${id},custom_url.eq.${id}`).single();

    if(error){
        console.error(error.message);
        throw new Error("Unable to load URL's");
    }

    return data;
}

// const parser = new UAParcer();

// export const storeClicks = async ({id, originalUrl}) =>{
//     try{
//         const res = parser.getResult();
//         const device = res.type || "desktop";
//         const response = await fetch("https://ipapi.com/json",{
//             mode: 'cors',
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Access-Control-Allow-Origin': '*',
//             }
//         });
//         const {city, country_name: country} = await response.json();

//         await supabase.from("clicks").insert({
//             url_id: id,
//             city,
//             country,
//             device,
//         })
 
//         window.location.href = originalUrl;
//     }catch(e){

//     }
// }
const parser = new UAParcer();
const apiKey = 'ac7814d24102995fc691d85e93f7e01514a5f2ed715ab3da1f8e8a1e';

export const storeClicks = async ({id, originalUrl}) => {
  try {
    const res = parser.getResult();
    const device = res.type || "desktop";
    const response = await fetch(`https://api.ipdata.co/?api-key=${apiKey}`);
    const { city, country_name: country } = await response.json();
    console.log("API",country);
    

    await supabase.from("clicks").insert({
      url_id: id,
      city:city,
      country:country,
      device:device,
    });

    window.location.href = originalUrl;
  } catch (e) {
    console.error("Error recording clicks: ",error);
  }
};

export async function getUrl({id,user_id}){    
    const {data, error} = await supabase
    .from('urls')
    .select('*')
    .eq('id',id)
    .eq('user_id',user_id)
    .single();

    if(error){
        throw new Error("Short URL not found");
    }

    return data;
}