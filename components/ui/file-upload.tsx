import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

interface FileUploadProps {
  onChange?: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  files?: File[]; // 🆕 دعم ملفات خارجة من parent
}

export const FileUpload = ({
  onChange,
  multiple = false,
  maxFiles = 3,
  files: externalFiles,
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>(externalFiles || []);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // تحديث state إذا تغيرت الـ externalFiles
  useEffect(() => {
    if (externalFiles) {
      setFiles(externalFiles);
      setPreviews(externalFiles.map((f) => URL.createObjectURL(f)));
    }
  }, [externalFiles]);

  // تنظيف روابط الصور عند الخروج
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const handleFileChange = (newFiles: File[]) => {
    if (!newFiles || newFiles.length === 0) return;

    let updatedFiles = multiple ? [...files, ...newFiles] : [newFiles[0]];

    if (multiple && updatedFiles.length > maxFiles) {
      updatedFiles = updatedFiles.slice(0, maxFiles);
    }

    const updatedPreviews = updatedFiles.map((f) => URL.createObjectURL(f));
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    if (onChange) onChange(updatedFiles);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    if (onChange) onChange(updatedFiles);
  };

  const handleClick = () => fileInputRef.current?.click();

  const { getRootProps, isDragActive } = useDropzone({
    multiple,
    accept: { "image/*": [] },
    noClick: true,
    onDrop: handleFileChange,
  });

  return (
    <div
      className='w-full'
      {...getRootProps()}
    >
      <motion.div
        onClick={handleClick}
        whileHover='animate'
        className='p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden'
      >
        <input
          ref={fileInputRef}
          id='file-upload-handle'
          type='file'
          accept='image/*'
          multiple={multiple}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className='hidden'
        />

        <div className='flex flex-col items-center justify-center'>
          {!files.length && (
            <>
              <p className='relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base'>
                Upload file
              </p>
              <p className='relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2'>
                Drag or drop your files here or click to upload
              </p>
              <motion.div
                layoutId='file-upload'
                variants={mainVariant}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
                )}
              >
                {isDragActive ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='text-neutral-600 flex flex-col items-center'
                  >
                    Drop it
                    <IconUpload className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
                  </motion.p>
                ) : (
                  <IconUpload className='h-4 w-4 text-neutral-600 dark:text-neutral-300' />
                )}
              </motion.div>
            </>
          )}

          {files.length > 0 && (
            <div
              className={cn(
                "flex mt-4",
                multiple ? "flex-wrap justify-center gap-4" : "justify-center",
              )}
            >
              {previews.map((src, idx) => (
                <motion.div
                  key={idx}
                  layout
                  className={cn(
                    "relative rounded-lg overflow-hidden border border-gray-700 shadow-md",
                    multiple ? "w-32 h-32" : "w-48 h-48",
                  )}
                >
                  <Image
                    src={src}
                    alt={`preview-${idx}`}
                    fill
                    className='object-cover'
                  />
                  <button
                    type='button'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(idx);
                    }}
                    className='absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full'
                  >
                    <IconX size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {multiple && files.length >= maxFiles && (
            <p className='text-xs text-red-500 mt-2'>
              You can upload up to {maxFiles} images only.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
