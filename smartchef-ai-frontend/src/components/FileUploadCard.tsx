import { useState, useRef } from "react"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FileUploadCardProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onFileRemove: () => void
  isLoading?: boolean
}

export const FileUploadCard = ({ onFileSelect, selectedFile, onFileRemove, isLoading }: FileUploadCardProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onFileSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  if (selectedFile) {
    return (
      <Card className="relative overflow-hidden shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected ingredients"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={onFileRemove}
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-3">
            <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className={cn(
        "border-2 border-dashed transition-all duration-300 cursor-pointer upload-hover",
        isDragOver && "border-primary bg-primary/10 shadow-glow"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Upload Ingredient Photo
        </h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          Drag and drop your ingredient photo here, or click to browse. 
          We'll identify ingredients and generate a recipe for you.
        </p>
        
        <Button variant="upload" size="lg">
          <Upload className="w-4 h-4 mr-2" />
          Choose Photo
        </Button>
        
        <p className="text-xs text-muted-foreground mt-3">
          Supports JPG, PNG, WebP up to 10MB
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}