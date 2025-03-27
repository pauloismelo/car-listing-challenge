export interface Upload {
    id: number,
    filename: string,
    RegisterDate: Date,
    status: String
  }

export interface ListUploadProps {
    uploads: Upload[]
}

export interface ProductPageProps {
  params: { id: string };
}

export interface Registers{
  id:number,
  idupload:number,
  message:string,
}
export interface RegisterProps{
  registers:Registers[]
}

export interface UploadRegisterProps{
  id:number,
  fileName:string,
  registerDate:Date,
  status:string,
  registers:Registers[]

}