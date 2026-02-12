"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Package, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormError } from "@/components/forms/form-error";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateItem } from "@/hooks/use-items";
import { useUploadImages } from "@/hooks/use-upload";
import type { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import {
  type CreateItemFormData,
  createItemSchema,
} from "@/lib/validations/item";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type ImagePreview = {
  file: File;
  previewUrl: string;
};

type CreateItemDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateItemDialog({
  open,
  onOpenChange,
}: CreateItemDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createItem = useCreateItem();
  const uploadImages = useUploadImages();

  const isSubmitting = createItem.isPending || uploadImages.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateItemFormData>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newImages: ImagePreview[] = [];

      for (const file of files) {
        if (images.length + newImages.length >= MAX_FILES) {
          toast.error(`Máximo de ${MAX_FILES} imagens permitidas.`);
          break;
        }

        if (!ACCEPTED_TYPES.includes(file.type)) {
          toast.error(
            `${file.name}: formato não suportado. Use JPG, PNG ou WebP.`
          );
          continue;
        }

        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name}: tamanho máximo de 10MB.`);
          continue;
        }

        newImages.push({
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }

      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages]);
      }
    },
    [images.length]
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const item = prev[index];
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const clearImages = useCallback(() => {
    for (const img of images) {
      URL.revokeObjectURL(img.previewUrl);
    }
    setImages([]);
  }, [images]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const onSubmit = async (data: CreateItemFormData) => {
    setError(null);

    try {
      let imageUrls: string[] = [];

      if (images.length > 0) {
        const uploaded = await uploadImages.mutateAsync(
          images.map((img) => img.file)
        );
        imageUrls = uploaded.map((img) => img.key);
      }

      await createItem.mutateAsync({
        name: data.name,
        description: data.description || undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      });

      toast.success("Item cadastrado com sucesso!");
      reset();
      clearImages();
      onOpenChange(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error ?? "Erro ao cadastrar item. Tente novamente.");
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      reset();
      clearImages();
      setError(null);
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Novo Item</DialogTitle>
          <DialogDescription>
            Cadastre um item para poder emprestá-lo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item-name">Nome</Label>
            <div className="relative">
              <Package
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="item-name"
                placeholder="Ex: Furadeira, Livro, Câmera..."
                className="pl-10"
                {...register("name")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
            </div>
            {errors.name && <FormError message={errors.name.message} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="item-description">
              Descrição{" "}
              <span className="text-muted-foreground font-normal">
                (opcional)
              </span>
            </Label>
            <Textarea
              id="item-description"
              placeholder="Adicione detalhes sobre o item..."
              rows={3}
              {...register("description")}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
            />
            {errors.description && (
              <FormError message={errors.description.message} />
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>
              Fotos{" "}
              <span className="text-muted-foreground font-normal">
                (opcional, máx. {MAX_FILES})
              </span>
            </Label>

            {images.length < MAX_FILES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-sm transition-colors cursor-pointer",
                  isDragging
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                <ImagePlus className="size-8" />
                <span>
                  Arraste imagens ou{" "}
                  <span className="text-primary font-medium">clique aqui</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG ou WebP (máx. 10MB)
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  addFiles(e.target.files);
                  e.target.value = "";
                }
              }}
            />

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, index) => (
                  <div
                    key={img.previewUrl}
                    className="group relative aspect-square rounded-md overflow-hidden border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.previewUrl}
                      alt={`Preview ${index + 1}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                      aria-label={`Remover imagem ${index + 1}`}
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <FormError message={error} />}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {uploadImages.isPending ? "Enviando fotos..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
