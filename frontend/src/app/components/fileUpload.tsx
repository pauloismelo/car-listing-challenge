'use client'
import { useState, ChangeEvent, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

import ErrorFile from './errorFile'
import ListUpload from './listUpload'
import { Upload } from '../types/types'



const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [link, setLink] = useState<HTMLAnchorElement>()
  const [uploads, setUploads] = useState<Upload>()

  useEffect(() => {
    //mounting component with the list of uploads

    axios.get('http://localhost:4000/uploads')
      .then(response => {
        setUploads(response.data)
      })
      .catch(error => {
        toast.error('Error fetching uploads!')
      })
  }, [link]) //re-ender after user uploaded a file

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
    formData.append('file', file)
    //console.log('formData: ', formData)

    setLoading(true)
    try {
      const response = await axios.post(
        'http://localhost:4000/upload',
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
    <>
      <div className="p-4 border rounded shadow">
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

      {link &&
      (
        <ErrorFile link={link} />
      )
      }

      {uploads && 
      (
        <ListUpload uploads={uploads} />
      )
      }
    </>
  )
}

export default FileUpload;
