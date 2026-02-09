import { useGetAllGalleryItems } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Image } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function GalleryPage() {
  const { data: galleryItems, isLoading } = useGetAllGalleryItems();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Gallery</h1>
          <p className="text-muted-foreground text-center mb-12 text-lg">
            Behind the scenes and live moments
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>
          ) : galleryItems && galleryItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer"
                    onClick={() => setSelectedImage(item.image.getDirectURL())}
                  >
                    <img
                      src={item.image.getDirectURL()}
                      alt={item.caption}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    {item.caption && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white text-sm">{item.caption}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-4xl p-0 overflow-hidden">
                  {selectedImage && (
                    <img src={selectedImage} alt="Gallery item" className="w-full h-auto" />
                  )}
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="text-center py-20">
              <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground text-lg">No gallery items yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
