import supabase from './supabase';

export async function signin({email,password}){
    const {data,error} = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if(error) throw new Error(error.message);

    return data;
}

export async function signup({email,password,profile}){
    const {data,error} = await supabase.auth.signup({
        email,
        password,
        profile,
    })

    if(error) throw new Error(error);

    return data;
}

export async function getCurrentUser(){
    const {data: session, error} = await supabase.auth.getSession();
    if(!session.session) return null;
    if(error) throw new Error(error.message);

    return session.session?.user;
}