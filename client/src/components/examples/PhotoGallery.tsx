import PhotoGallery from '../PhotoGallery';

export default function PhotoGalleryExample() {
  const mockPhotos = [
    { id: "1", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80", alt: "Mountain view" },
    { id: "2", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", alt: "Trail path" },
    { id: "3", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80", alt: "Forest trail" },
    { id: "4", url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&q=80", alt: "Sunset hike" },
  ];

  return (
    <div className="p-4 max-w-2xl">
      <PhotoGallery 
        photos={mockPhotos} 
        editable={true}
        onUpload={() => console.log('Upload triggered')}
      />
    </div>
  );
}