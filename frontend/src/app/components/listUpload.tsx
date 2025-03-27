import { ListUploadProps } from "../types/types";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@/lib/fontawesome"; 

import { formatDate } from '../utils/functions';

function ListUpload({uploads}:ListUploadProps) {
    const router = useRouter();
    return ( 
        <div className='mt-6 border'>
            <h2 className='text-center text-black font-bold'>Previous Uploads</h2>
          <div className='w-screen flex bg-black text-white'>
                <div className='w-1/3 text-center'>File Name</div>
                <div className='w-1/3 text-center'>Register</div>
                <div className='w-1/3 text-center'>Status</div>
                <div className='w-1/3 text-center'>View</div>
              </div>
          <ul>
            {Object.keys(uploads).map((item) => (
                
              <div key={item} className='w-screen flex'>
                <div className='w-1/3 text-center'>{uploads[item].fileName}</div>
                <div className='w-1/3 text-center'>{formatDate(uploads[item].RegisterDate)}</div>
                <div className='w-1/3 text-center'>
                
                {//Here I could create a component for this, but I think it's not necessary
                uploads[item].status === 'Success' ? (
                    <div className="border rounded-2xl bg-green-950 text-white">{uploads[item].status}</div>
                )
                : 
                    uploads[item].status === 'Pendent' ?
                    (
                    <div className="border rounded-2xl bg-yellow-600 text-white">{uploads[item].status}</div>
                    ):
                    (
                    <div className="border rounded-2xl bg-red-950 text-white">{uploads[item].status}</div>
                    )
                }
                    
                
                </div>
                <div className='w-1/3 text-center'>
                    <FontAwesomeIcon icon="search" className="text-green-950 cursor-pointer" onClick={() => {
                        router.push(`/uploads/${uploads[item].id}`);
                    }} title='View'/>
                </div>
              </div> 

             
            ))}
          </ul>
        </div>
     );
}

export default ListUpload;