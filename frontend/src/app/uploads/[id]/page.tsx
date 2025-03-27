'use client';
import axios from 'axios';
import { useEffect, ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@/lib/fontawesome"; 
import { toast } from 'react-toastify'

import { ProductPageProps, UploadRegisterProps } from '../../types/types';
import { formatDate } from '../../utils/functions';
import {} from '../../components/errorFile'

function HomeUpload({params}: ProductPageProps) {

    const router = useRouter();

    const [data, setDate] = useState<UploadRegisterProps>();
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [link, setLink] = useState<HTMLAnchorElement>()

    const handleNavigate = () => {
        router.push('/');
    }

    useEffect(()=>{
        axios.get('http://localhost:4000/registers/'+params.id)
        .then(response => {
            setDate(response.data)
        })
        .catch(error => {
            console.error('Error in fetching datas', error)
        })
    },[])

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0])
        }
    }

    const handleUpload = async () => {
        //Verify if the user selected a file
        if (!file) {
          toast.error('Select one file!')
          return
        }
    
        const formData = new FormData()
        formData.append('file', file);

        setLoading(true)
        try {
          const response = await axios.post(
            'http://localhost:4000/resend/'+params.id,
            formData,
            {
              responseType: 'blob' // download file
            }
          )
    
          if (response.headers['content-type'].includes('application/json')) {
            toast.info('No errors found!')
          } else {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'erros.xlsx')
            document.body.appendChild(link)
            
    
            setLink(link);
            //Here, I changed this 2 lines below for the line above. Now, I will use the link in the ErrorFile component
            //link.click() 
            //toast.success('file with errors was downloaded!')
          }
        } catch (error) {
          console.error('Error uploading file: ', error)
          toast.error('Error uploading file!')
        } finally {
          setLoading(false)
        }
    }

    return ( 
        <div className='w-full h-full top-px'>
            <div className='w-full flex top-px bg-gray-300 p-2 mb-2'>
                <div className='w-1/2 text-left'>
                    Upload Details
                    
                </div>
                <div className='w-1/2 text-right text-xs'>
                    <FontAwesomeIcon icon="home" className="text-green-950 cursor-pointer" onClick={handleNavigate} title='Back to home'/> HOME
                </div>
                
               
                
            </div>

            {data && (
                <div>
                    <div className='w-screen grid grid-cols-3'>
                        <div className='w-1/3'>
                            <span className='text-xs'>File Name:</span><br/>
                            {data.filename}
                        </div>
                        <div className='w-1/3'>
                            <span className='text-xs'>Register Date:</span><br/>
                            {formatDate(data.registerDate)}
                        </div>
                        <div className='w-1/3'>
                        <span className='text-xs text-center'>Status:</span><br/>
                        {
                        data.status === 'Success' ? (
                            <div className="border rounded-2xl bg-green-950 text-white text-center">{data.status}</div>
                        )
                        : 
                            data.status === 'Pendent' ?
                            (
                            <div className="border rounded-2xl bg-yellow-600 text-white text-center">{data.status}</div>
                            ):
                            (
                            <div className="border rounded-2xl bg-red-950 text-white text-center">{data.status}</div>
                            )
                        }
                        </div>
                    </div>
                    <div className='text-center border border-green-950 mt-2'>
                        <div className='bg-green-950 text-white text-center'>
                            <h2>Lines</h2>
                        </div>
                        
                        {
                            data.registers.length>0 ? 
                                (
                                    <div className='w-screen flex gap-2 p-1'>
                                        <div className='w-full text-center border'>
                                            <div className='w-full grid grid-cols-7 text-center text-white bg-black'>
                                                <div>Make</div>
                                                <div>Model</div>
                                                <div>Year</div>
                                                <div>Price</div>
                                                <div>Mileage</div>
                                                <div>Color</div>
                                                <div>Vin</div>
                                            </div>
                                            {
                                                data.registers.map((item) => (
                                                    <div className="w-full grid grid-cols-7 text-center">
                                                    <div>{item.make}</div>
                                                    <div>{item.model}</div>
                                                    <div>{item.year}</div>
                                                    <div>{item.price}</div>
                                                    <div>{item.mileage}</div>
                                                    <div>{item.color}</div>
                                                    <div>{item.vin}</div>
                                                </div>
                                                ))
                                            }
                                        </div>
                                        
                                    </div>
                                )
                            :
                            (
                                <div className='w-screen text-red-800 text-center'>
                                    No line found!
                                </div>
                            )
                        }
                        
                    </div>

                    
                    {//Allow the user to re-send the file only if the status is not 'Success'
                        data.status !== 'Success' &&
                        (
                            <div className='text-center border border-green-950 mt-2'>
                                <div className='bg-green-950 text-white text-center'>
                                    <h2>Re-send file with corrections</h2>
                                </div>
                                
                                <div className='w-full text-center'>
                                    <div className="p-4">
                                        <input
                                        type="file"
                                        accept=".xls,.xlsx"
                                        onChange={handleFileChange}
                                        className="mb-2 cursor-pointer"

                                        />
                                        <button
                                        onClick={handleUpload}
                                        disabled={loading}
                                        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                                        >
                                        {loading ? 'Submiting...' : 'Submit'}
                                        </button>
                                    </div>
                                </div>
                                {link &&
                                    (
                                    <ErrorFile link={link} />
                                    )
                                }
                            </div>

                           
                        )
                    }

                    

                </div>

                
            )}
            
            
        </div>
        
     );
}

export default HomeUpload;