"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Package, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { useUpdateItem } from "@/hooks/use-items";
import { useUploadImages } from "@/hooks/use-upload";
import type { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import {
  type UpdateItemFormData,
  updateItemSchema,
} from "@/lib/validations/item";
import type { Item } from "@/types";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type NewImagePreview = {
  kind: "new";
  file: File;
  previewUrl: string;
};

type ExistingImage = {
  kind: "existing";
  url: string;
};

type ImageEntry = NewImagePreview | ExistingImage;

type EditItemDialogProps = {
  item: Item;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditItemDialog({
  item,
  open,
  onOpenChange,
}: EditItemDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateItem = useUpdateItem();
  const uploadImages = useUploadImages();

  const isSubmitting = updateItem.isPending || uploadImages.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateItemFormData>({
    resolver: zodResolver(updateItemSchema),
    defaultValues: {
      name: item.name,
      description: item.description ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: item.name,
        description: item.description ?? "",
      });
      setImages(item.images.map((url) => ({ kind: "existing", url })));
      setError(null);
    }
  }, [open, item, reset]);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newImages: NewImagePreview[] = [];

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
          kind: "new",
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
      const entry = prev[index];
      if (entry?.kind === "new") URL.revokeObjectURL(entry.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

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

  const onSubmit = async (data: UpdateItemFormData) => {
    setError(null);

    try {
      // Extract storage key from pre-signed URLs (API stores keys, returns signed URLs)
      const existingKeys = images
        .filter((img): img is ExistingImage => img.kind === "existing")
        .map((img) => new URL(img.url).pathname.slice(1));

      const newFiles = images
        .filter((img): img is NewImagePreview => img.kind === "new")
        .map((img) => img.file);

      let newImageKeys: string[] = [];
      if (newFiles.length > 0) {
        const uploaded = await uploadImages.mutateAsync(newFiles);
        newImageKeys = uploaded.map((img) => img.key);
      }

      const allImages = [...existingKeys, ...newImageKeys];

      await updateItem.mutateAsync({
        id: item.id,
        input: {
          name: data.name,
          description: data.description || undefined,
          images: allImages.length > 0 ? allImages : undefined,
        },
      });

      toast.success("Item atualizado com sucesso!");
      onOpenChange(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error ?? "Erro ao atualizar item. Tente novamente.");
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      for (const img of images) {
        if (img.kind === "new") URL.revokeObjectURL(img.previewUrl);
      }
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Editar Item</DialogTitle>
          <DialogDescription>
            Atualize as informações do item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-item-name">Nome</Label>
            <div className="relative">
              <Package
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="edit-item-name"
                placeholder="Ex: Furadeira, Livro, Câmera..."
                className="pl-10"
                {...register("name")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "edit-name-error" : undefined}
              />
            </div>
            {errors.name && <FormError message={errors.name.message} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-item-description">
              Descrição{" "}
              <span className="text-muted-foreground font-normal">
                (opcional)
              </span>
            </Label>
            <Textarea
              id="edit-item-description"
              placeholder="Adicione detalhes sobre o item..."
              rows={3}
              {...register("description")}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "edit-description-error" : undefined
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
                    key={img.kind === "existing" ? img.url : img.previewUrl}
                    className="group relative aspect-square rounded-md overflow-hidden border border-border"
                  >
                    {img.kind === "existing" ? (
                      <Image
                        src={img.url}
                        alt={`Imagem ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <img
                        src={img.previewUrl}
                        alt={`Preview ${index + 1}`}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
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
              {uploadImages.isPending ? "Enviando fotos..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
