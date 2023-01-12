import './ImageGallery.css';
import Image from './Image';

function ImageGallery(props) {

    let images = props.images;
    
    return (
        <div className='image-gallery'>
            {images.map((img) => 
                <Image
                    key = {img.id}
                    id = {img.id}
                    source = {img.src}
                    author = {img.photographer}
                    expand = {props.expand}
                />
            )}
        </div>
        );
}

export default ImageGallery;
