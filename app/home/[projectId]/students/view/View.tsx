'use client'
import {useSearchParams} from 'next/navigation'
export default function ViewStudent(){
    const params = useSearchParams();
    const studentId = params.get('id');
return <p>{studentId}</p>
}