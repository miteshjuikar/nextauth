'use client'
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"
import dayjs from 'dayjs';

export default function VerifyEmailPage() {
    const [ token, setToken ] = useState("");
    const [ verified, setVerified ] = useState(false);
    const [ error, setError ] = useState(false);
    const [ errorMSG, setErrorMSG ] = useState("");
      const formatted = dayjs().format('dddd, MMMM DD, YYYY [at] h:mm A');
    // const router = useRouter();

    const VerifyUserEmail = async () => {
        if (!token) {
          setError(true);
          setErrorMSG("Missing verification token.");
          return;
        }
      
        try {
          const response = await axios.post("/api/users/verifyemail", { token });
      
          if (response.status >= 200 && response.status < 300) {
            setVerified(true);
      
            toast(response.data.message || "Email verified successfully.", {
              description: formatted,
              action: {
                label: "Undo",
                onClick: () => {},
              },
            });

          } else {
            console.error("Unexpected response:", response);
            setError(true);
            setErrorMSG(response.data?.error || "Unexpected error occurred.");
          }
        } catch (err: any) {
          console.log("Verification failed:", err);
          setError(true);
          setErrorMSG(err.response?.data?.error || "Something went wrong during verification.");
        }
    };
      

    useEffect(()=>{
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || "");
        // const {query} = router;
        // const urlToken: any = query.token
        // setToken(urlToken || "");
    }, []);    
    
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-4xl' >Verify Email</h1>
      <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
            onClick={VerifyUserEmail}
            >
            Click here to verify &rarr;
      </button>
      <h2>
        { token ? `${token}`: "No token" }
      </h2>
      {
        verified && (
            <div className='flex gap-6 items-center mt-5'>
                <h2>Verified</h2>
                <div className='border border-[#aaa] rounded-md p-1 border-rad' >
                    <Link href="/login">Click here to login</Link>
                </div>
            </div>
        )
      }
      {
        error && (
            <div className='flex gap-6 items-center mt-5'>
                <h2>{`Error: ${errorMSG}`}</h2>
            </div>
        )
      }
    </div>
  )
}
