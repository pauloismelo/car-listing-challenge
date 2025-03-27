import ExcelImage from "./images/excelImage";

function ErrorFile({link}: {link: HTMLAnchorElement}) {
    return (  
        <div className='p-4 mt-4 border rounded shadow text-center'>
          File with errors found:<br/>
          <a className='text-green-950' href='/' onClick={(e) => {
            e.preventDefault();
            link.click();
          }}>
            <ExcelImage /><br/>
            Click to download
          </a>
          
        </div>
    );
}

export default ErrorFile;