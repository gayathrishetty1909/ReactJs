import React, { useState } from 'react';
import ImageUploader from 'react-images-upload';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImageEditor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({});
  const [croppedImage, setCroppedImage] = useState(null);

  const handleFileUpload = (file) => {
    setSelectedFile(URL.createObjectURL(file[0]));
    setCroppedImage(null);
  };

  const handleImageCrop = async () => {
    const croppedImageDataURL = await getCroppedImage(selectedFile, crop);
    setCroppedImage(croppedImageDataURL);
  };

  const getCroppedImage = (image, crop) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;
      const ctx = canvas.getContext('2d');

      const imageElement = new Image();
      imageElement.src = image;
      imageElement.onload = () => {
        ctx.drawImage(
          imageElement,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width * scaleX,
          crop.height * scaleY
        );
        resolve(canvas.toDataURL('image/png'));
      };
    });
  };

  const handleSaveImage = () => {
    const link = document.createElement('a');
    link.download = 'cropped-image.png';
    link.href = croppedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div>
        <ImageUploader
          withIcon={true}
          buttonText='Choose image'
          onChange={handleFileUpload}
          imgExtension={['.jpg', '.gif', '.png', '.gif']}
          maxFileSize={5242880}
        />
      </div>
      <div>
        {selectedFile && (
          <ReactCrop
            src={selectedFile}
            onImageLoaded={(image) => {
              setCrop({
                unit: 'px',
                width: 200,
                aspect: 1 / 1,
              });
            }}
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
          />
        )}
      </div>
      <div>
        <button onClick={handleImageCrop}>Crop & Resize</button>
      </div>
      <div>
        {croppedImage && (
          <div>
            <img
              src={selectedFile}
              alt='Cropped and resized' 
              style={{ maxWidth: '100%' }}
            />
            <button onClick={handleSaveImage}>Save Image</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;
