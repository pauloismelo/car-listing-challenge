//sample component to display image for I can use in several components
//I created the props for Allow me show different sizes of the image in each component

//Here I could use one interface, like: 

/*
    interface ImageProps {
        widthImage: number
    }
*/



function Image({widthImage}: {widthImage: number}) {
    return ( 
        <img src="/knowtrex_logo.jpeg" width={widthImage} />
     );
}

export default Image;