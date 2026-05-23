import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "@/utils/api";

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

interface RootState {
  auth?: {
    accessToken?: string | null;
  };
}

interface UploadedImage {
  url: string;
  publicId: string;
}

export default function ImageUploader({ images, onChange, maxImages = 5 }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);
  const token = useSelector((state: RootState) => state.auth?.accessToken) || localStorage.getItem("zivvo-token");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFiles(fileList: FileList) {
    const files = Array.from(fileList).slice(0, Math.max(maxImages - images.length, 0));
    const invalid = files.find((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 2 * 1024 * 1024);
    if (invalid) {
      setError("Images must be JPG, PNG, or WebP and under 2MB.");
      return;
    }
    if (!files.length) return;

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      const data = await apiRequest<{ images?: UploadedImage[] }>("/upload/images", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData
      });
      onChange([...images, ...(data.images || []).map((image) => image.url)].slice(0, maxImages));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const removeAt = (index: number) => onChange(images.filter((_, current) => current !== index));
  const swap = (from: number, to: number) => {
    const next = [...images];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => { event.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          void uploadFiles(event.dataTransfer.files);
        }}
        className={`grid min-h-36 w-full place-items-center rounded-xl border border-dashed text-sm transition ${dragOver ? "border-[#7C5CFC] bg-[#7C5CFC]/10" : "border-[#7C5CFC]/30"} ${uploading ? "opacity-70" : ""}`}
      >
        {uploading ? "Uploading..." : "Drag images here or click to browse"}
      </button>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(event) => event.target.files && void uploadFiles(event.target.files)} />
      {error && <p className="text-xs text-rose-400">{error}</p>}
      <div className="grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            draggable
            onDragStart={() => { dragIndex.current = index; }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (dragIndex.current !== null) swap(dragIndex.current, index);
              dragIndex.current = null;
            }}
            className="relative aspect-square overflow-hidden rounded-lg border border-[var(--border)]"
          >
            <img src={image} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
            <button type="button" onClick={() => removeAt(index)} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-xs text-white">x</button>
            {index === 0 && <span className="absolute bottom-1 left-1 rounded-full bg-[#7C5CFC] px-2 py-0.5 text-[10px] font-semibold text-white">Main</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
