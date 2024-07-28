import supabase from "./supabase"

export async function getClicks(urlIds){
    const {data, error} = await supabase.from("clicks").select("*").in("url_id",urlIds);

    if(error){
        console.error(error.message);
        throw new Error("Unable to load Click's");
    }

    return data;
}

export async function getClicksForUrl({url_id}) {
    if (url_id === undefined || url_id === null) {
        throw new Error("Invalid url_id provided");
    }

    const { data, error } = await supabase
        .from('clicks')
        .select('*')
        .eq('url_id', url_id);


    if (error) {
        throw new Error("Unable to load stats");
    }

    return data;
}
