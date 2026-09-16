import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, Crop } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  fileName = 'cropped.jpeg'
): Promise<File | null> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], fileName, { type: 'image/jpeg' }));
      } else {
        reject(new Error('Canvas is empty'));
      }
    }, 'image/jpeg', 0.9);
  });
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

interface ImageCropperProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropCompleteAction: (croppedFile: File) => void;
  aspectRatio?: number;
}

export function ImageCropper({ isOpen, imageSrc, onClose, onCropCompleteAction, aspectRatio = 16 / 9 }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedFile) {
        onCropCompleteAction(croppedFile);
        onClose();
      }
    } catch (e) {
      console.error(e);
      alert('Error cropping image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && imageSrc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl shadow-2xl flex flex-col h-[85vh] max-h-[800px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1E4BB5]">
                  <Crop size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Adjust Image</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">
                    {croppedAreaPixels ? `${croppedAreaPixels.width} x ${croppedAreaPixels.height} PX` : 'Drag to reposition'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cropper Container */}
            <div className="relative flex-1 bg-gray-50/50">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Footer Controls */}
            <div className="p-6 border-t border-gray-100 bg-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 w-full md:max-w-xs flex items-center gap-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-[#1E4BB5]"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className="flex-1 md:flex-none px-8 py-3 bg-[#1E4BB5] hover:bg-[#153a96] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : (
                    <>
                      <Check size={18} /> Confirm Crop
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
