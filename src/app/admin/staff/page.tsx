"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Minus, MoreHorizontal, Pencil, Plus, RotateCcw, RotateCw, Search, Trash2, Upload, UserRound, ZoomIn, ZoomOut } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { getCroppedImg } from "@/lib/image-crop";

interface StaffRecord {
  id: string;
  name: string;
  position: string;
  contactInfo: string;
  status: boolean;
  imageUrl?: string;
  cropLabel?: string;
  updatedAt: string;
}

interface DeleteResponse {
  message: string;
  mode: "deleted" | "deactivated";
  feedbackCount: number;
  staff: StaffRecord;
}

const emptyStaff: StaffRecord = {
  id: "",
  name: "",
  position: "",
  contactInfo: "",
  status: true,
  imageUrl: "",
  cropLabel: "No crop applied yet",
  updatedAt: "",
};

const defaultCrop: Point = { x: 0, y: 0 };
const defaultZoom = 1;
const defaultRotation = 0;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

async function parseJsonSafe(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [deleteMessage, setDeleteMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffRecord>(emptyStaff);
  const [pendingDelete, setPendingDelete] = useState<StaffRecord | null>(null);

  const [uploadedFileName, setUploadedFileName] = useState("");
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [savedImageSrc, setSavedImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>(defaultCrop);
  const [zoom, setZoom] = useState(defaultZoom);
  const [rotation, setRotation] = useState(defaultRotation);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isImageDirty, setIsImageDirty] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [imageError, setImageError] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const tempObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (tempObjectUrlRef.current) {
        URL.revokeObjectURL(tempObjectUrlRef.current);
      }
    };
  }, []);

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesSearch = [member.name, member.position, member.contactInfo].join(" ").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? member.status : !member.status);
      return matchesSearch && matchesStatus;
    });
  }, [search, staff, statusFilter]);

  const hasSavedImage = Boolean(savedImageSrc);
  const showUploadAction = !selectedImageSrc && !hasSavedImage && !isImageDirty;
  const showPendingImageActions = Boolean(selectedImageSrc) && isImageDirty;
  const showRemoveAction = hasSavedImage && !isImageDirty;
  const isEditingExisting = Boolean(editingStaff.id && staff.some((member) => member.id === editingStaff.id));

  const resetImageEditor = (options?: { keepSavedImage?: boolean }) => {
    if (!options?.keepSavedImage) {
      setSavedImageSrc(null);
    }
    if (tempObjectUrlRef.current) {
      URL.revokeObjectURL(tempObjectUrlRef.current);
      tempObjectUrlRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSelectedImageSrc(null);
    setUploadedFileName("");
    setCrop(defaultCrop);
    setZoom(defaultZoom);
    setRotation(defaultRotation);
    setCroppedAreaPixels(null);
    setIsImageDirty(false);
    setIsSavingImage(false);
    setImageError("");
  };

  const seedSavedImageState = (member: StaffRecord) => {
    setSavedImageSrc(member.imageUrl || null);
    setSelectedImageSrc(null);
    setUploadedFileName(member.imageUrl ? "Existing profile image" : "");
    setCrop(defaultCrop);
    setZoom(defaultZoom);
    setRotation(defaultRotation);
    setCroppedAreaPixels(null);
    setIsImageDirty(false);
    setIsSavingImage(false);
    setImageError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fetchStaff = async (showSkeleton = false) => {
    if (showSkeleton) setIsLoading(true);
    setIsRefreshing(!showSkeleton);
    setLoadError("");

    try {
      const response = await fetch("/api/admin/staff", { cache: "no-store" });
      const data = await parseJsonSafe(response);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load staff list");
      }

      setStaff(Array.isArray(data) ? data : []);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Failed to load staff list");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void fetchStaff(true);
  }, []);

  const openAddDialog = () => {
    setSubmitError("");
    setDeleteMessage("");
    setEditingStaff({ ...emptyStaff });
    resetImageEditor();
    setIsFormOpen(true);
  };

  const openEditDialog = (member: StaffRecord) => {
    setSubmitError("");
    setDeleteMessage("");
    setEditingStaff({ ...member });
    resetImageEditor();
    seedSavedImageState(member);
    setIsFormOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      resetImageEditor();
      setEditingStaff(emptyStaff);
      setSubmitError("");
    }
  };

  const saveStaff = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        name: editingStaff.name,
        position: editingStaff.position,
        contactInfo: editingStaff.contactInfo,
        status: editingStaff.status,
        imageUrl: editingStaff.imageUrl || undefined,
        cropLabel: editingStaff.cropLabel || undefined,
      };

      const response = await fetch(isEditingExisting ? `/api/admin/staff/${editingStaff.id}` : "/api/admin/staff", {
        method: isEditingExisting ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await parseJsonSafe(response);
      if (!response.ok) {
        throw new Error(data?.error || "Failed to save staff member");
      }

      await fetchStaff();
      handleDialogOpenChange(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to save staff member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    setIsDeleting(true);
    setSubmitError("");
    setDeleteMessage("");

    try {
      const response = await fetch(`/api/admin/staff/${pendingDelete.id}`, {
        method: "DELETE",
      });
      const data = (await parseJsonSafe(response)) as DeleteResponse | null;

      if (!response.ok) {
        throw new Error((data as { error?: string } | null)?.error || "Failed to delete staff member");
      }

      setDeleteMessage(data?.message || "Staff member updated");
      await fetchStaff();
      setPendingDelete(null);
      setIsDeleteOpen(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to delete staff member");
    } finally {
      setIsDeleting(false);
    }
  };

  const openFilePicker = () => {
    setImageError("");
    fileInputRef.current?.click();
  };

  const handleImageSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.");
      return;
    }

    if (tempObjectUrlRef.current) {
      URL.revokeObjectURL(tempObjectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    tempObjectUrlRef.current = objectUrl;

    setSelectedImageSrc(objectUrl);
    setUploadedFileName(file.name);
    setCrop(defaultCrop);
    setZoom(defaultZoom);
    setRotation(defaultRotation);
    setCroppedAreaPixels(null);
    setIsImageDirty(true);
    setSavedImageSrc(null);
    setImageError("");
  };

  const handleSaveImage = async () => {
    if (!selectedImageSrc || !croppedAreaPixels) return;

    try {
      setIsSavingImage(true);
      setImageError("");
      const croppedDataUrl = await getCroppedImg({
        imageSrc: selectedImageSrc,
        pixelCrop: croppedAreaPixels,
        rotation,
        outputWidth: 320,
        outputHeight: 320,
      });

      const uploadResponse = await fetch("/api/admin/staff/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageDataUrl: croppedDataUrl,
          staffId: editingStaff.id || undefined,
        }),
      });
      const uploadData = await parseJsonSafe(uploadResponse);

      if (!uploadResponse.ok) {
        throw new Error(uploadData?.error || "Failed to upload cropped image");
      }

      setSavedImageSrc(uploadData?.imageUrl || croppedDataUrl);
      setSelectedImageSrc(null);
      setIsImageDirty(false);
      setEditingStaff((current) => ({
        ...current,
        imageUrl: uploadData?.imageUrl || croppedDataUrl,
        cropLabel: `Custom crop · Zoom ${zoom.toFixed(1)}x · Rotation ${Math.round(rotation)}°`,
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (tempObjectUrlRef.current) {
        URL.revokeObjectURL(tempObjectUrlRef.current);
        tempObjectUrlRef.current = null;
      }
    } catch (error) {
      console.error("Failed to generate cropped image preview", error);
      setImageError(error instanceof Error ? error.message : "Could not generate the cropped preview. Please try another image.");
    } finally {
      setIsSavingImage(false);
    }
  };

  const handleClearPendingImage = () => {
    resetImageEditor({ keepSavedImage: false });
    setEditingStaff((current) => ({
      ...current,
      imageUrl: "",
      cropLabel: "No crop applied yet",
    }));
  };

  const handleRemoveSavedImage = () => {
    resetImageEditor({ keepSavedImage: false });
    setEditingStaff((current) => ({
      ...current,
      imageUrl: "",
      cropLabel: "No crop applied yet",
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-fit bg-slate-100 text-slate-600">Live Admin</Badge>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">Staff directory</CardTitle>
              <CardDescription className="mt-1 text-sm text-slate-500">
                Real staff records from the database. Add, edit, deactivate, or delete staff from this admin view.
              </CardDescription>
            </div>
          </div>
          <Button className="h-11 bg-slate-900 text-white shadow-sm hover:bg-slate-800" onClick={openAddDialog}>
            <Plus className="mr-2 size-4" />
            Add Staff
          </Button>
        </CardHeader>
      </Card>

      {loadError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {loadError}
        </div>
      ) : null}

      {deleteMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {deleteMessage}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, position, or contact info" className="h-11 pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
          <SelectTrigger className="h-11 w-full lg:w-44">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active only</SelectItem>
            <SelectItem value="inactive">Inactive only</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center justify-end gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-600 shadow-sm">
          <span>{isRefreshing ? "Refreshing..." : "Total staff"}</span>
          <Badge variant="secondary">{filteredStaff.length}</Badge>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="text-xl font-semibold text-slate-900">Staff management list</CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Review profile status and manage real staff records from this single list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              Loading staff records...
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              No staff records found for the current filter.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Profile</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Staff</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Contact</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Crop Preview</TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow key={member.id} className="border-slate-100 hover:bg-slate-50/70">
                    <TableCell>
                      <Avatar className="h-12 w-12 rounded-xl border border-slate-200">
                        <AvatarImage src={member.imageUrl} alt={member.name} />
                        <AvatarFallback className="rounded-xl bg-slate-100 text-slate-700">{initials(member.name)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900">{member.name}</p>
                        <p className="text-sm text-slate-500">{member.position || "—"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{member.contactInfo || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={member.status ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}>
                        {member.status ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{member.cropLabel || "No crop set"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(member)}>
                            <Pencil className="mr-2 size-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-rose-600 focus:text-rose-600"
                            onClick={() => {
                              setPendingDelete(member);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 size-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="max-w-[calc(100vw-1.5rem)] sm:max-w-[1100px] overflow-hidden p-0">
          <DialogHeader className="border-b border-slate-200 px-6 py-5 text-left">
            <DialogTitle>{isEditingExisting ? "Edit staff member" : "Add staff member"}</DialogTitle>
            <DialogDescription>
              Save real staff records to the database. Cropped staff images are now uploaded to backend storage and saved as reusable URLs.
            </DialogDescription>
          </DialogHeader>

          <div className="grid max-h-[82vh] gap-0 overflow-y-auto md:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
            <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-5 md:border-b-0 md:border-r md:px-6 md:py-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="space-y-2 pb-3">
                  <CardTitle className="text-base">Profile picture</CardTitle>
                  <CardDescription>
                    Upload an image, adjust the crop inline, then save the image preview before saving the full staff record.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelected} />

                  <div className="overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white p-4">
                    <div className="space-y-3">
                      <div className="relative mx-auto flex aspect-square w-full max-w-[220px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        {selectedImageSrc ? (
                          <Cropper
                            image={selectedImageSrc}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={1}
                            cropShape="rect"
                            showGrid
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onRotationChange={setRotation}
                            onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                          />
                        ) : hasSavedImage ? (
                          <img src={savedImageSrc ?? undefined} alt={editingStaff.name || "Saved preview"} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-3 px-4 text-center text-slate-500">
                            <Avatar className="h-20 w-20 rounded-2xl border border-slate-200">
                              <AvatarFallback className="rounded-2xl bg-slate-100 text-slate-700">
                                <UserRound className="size-8" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-700">No image uploaded yet</p>
                              <p className="text-xs text-slate-500">Upload a photo to crop, zoom, rotate, and save it here.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 text-center">
                        <p className="font-medium text-slate-900">{uploadedFileName || (hasSavedImage ? "Saved profile image" : "Ready for upload")}</p>
                        <p className="text-sm text-slate-500">{selectedImageSrc ? "Unsaved image changes" : editingStaff.cropLabel || "No crop applied yet"}</p>
                      </div>
                    </div>
                  </div>

                  {selectedImageSrc ? (
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                          <span>Zoom</span>
                          <span>{zoom.toFixed(1)}x</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button type="button" variant="outline" size="icon" className="size-9" onClick={() => setZoom((current) => Math.max(1, +(current - 0.1).toFixed(2)))}>
                            <ZoomOut className="size-4" />
                          </Button>
                          <Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={(value) => setZoom(value[0] ?? 1)} className="flex-1" />
                          <Button type="button" variant="outline" size="icon" className="size-9" onClick={() => setZoom((current) => Math.min(3, +(current + 0.1).toFixed(2)))}>
                            <ZoomIn className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                          <span>Rotation</span>
                          <span>{Math.round(rotation)}°</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button type="button" variant="outline" size="icon" className="size-9" onClick={() => setRotation((current) => current - 90)}>
                            <RotateCcw className="size-4" />
                          </Button>
                          <Slider value={[rotation]} min={-180} max={180} step={1} onValueChange={(value) => setRotation(value[0] ?? 0)} className="flex-1" />
                          <Button type="button" variant="outline" size="icon" className="size-9" onClick={() => setRotation((current) => current + 90)}>
                            <RotateCw className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                        Drag the image inside the square frame to reposition it. This crop matches the frontend staff card image ratio.
                      </div>
                    </div>
                  ) : null}

                  {imageError ? (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">{imageError}</div>
                  ) : null}

                  <div className="grid gap-2">
                    {showUploadAction ? (
                      <Button type="button" variant="outline" onClick={openFilePicker}>
                        <Upload className="mr-2 size-4" /> Upload / Replace image
                      </Button>
                    ) : null}

                    {showPendingImageActions ? (
                      <>
                        <Button type="button" onClick={handleSaveImage} disabled={isSavingImage || !croppedAreaPixels}>
                          {isSavingImage ? "Saving image..." : "Save image"}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleClearPendingImage}>
                          <Minus className="mr-2 size-4" /> Clear
                        </Button>
                      </>
                    ) : null}

                    {showRemoveAction ? (
                      <Button type="button" variant="ghost" className="w-full text-slate-600" onClick={handleRemoveSavedImage}>
                        Remove image
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="px-5 py-5 md:px-6 md:py-6">
              <Card className="border-slate-200 shadow-none">
                <CardHeader className="space-y-2 pb-4">
                  <CardTitle className="text-base">Staff details</CardTitle>
                  <CardDescription>Basic information shown in the staff directory and customer flow.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {submitError ? (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {submitError}
                    </div>
                  ) : null}

                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2 lg:col-span-2">
                      <Label htmlFor="staff-name">Staff name</Label>
                      <Input
                        id="staff-name"
                        value={editingStaff.name}
                        onChange={(e) => setEditingStaff((current) => ({ ...current, name: e.target.value }))}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-position">Position</Label>
                      <Input
                        id="staff-position"
                        value={editingStaff.position}
                        onChange={(e) => setEditingStaff((current) => ({ ...current, position: e.target.value }))}
                        placeholder="e.g. Cashier"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="staff-contact">Contact info</Label>
                      <Input
                        id="staff-contact"
                        value={editingStaff.contactInfo}
                        onChange={(e) => setEditingStaff((current) => ({ ...current, contactInfo: e.target.value }))}
                        placeholder="email or phone"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="staff-status" className="text-sm font-medium text-slate-900">Show in customer flow</Label>
                      <p className="text-sm text-slate-500">Control whether this staff member appears in the kiosk selection list.</p>
                    </div>
                    <Switch
                      id="staff-status"
                      checked={editingStaff.status}
                      onCheckedChange={(checked) => setEditingStaff((current) => ({ ...current, status: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staff-notes">Photo prep notes</Label>
                    <Textarea
                      id="staff-notes"
                      value={editingStaff.cropLabel ?? ""}
                      onChange={(e) => setEditingStaff((current) => ({ ...current, cropLabel: e.target.value }))}
                      placeholder="Describe crop intent or preview note"
                      className="min-h-[140px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter className="border-t border-slate-200 bg-white px-5 py-4 sm:px-6 sm:justify-end">
            <Button variant="outline" onClick={() => handleDialogOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={saveStaff} disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Preview"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete staff member?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `If ${pendingDelete.name} already has feedback history, the system will deactivate them instead of permanently deleting the record.`
                : "This will remove the selected staff item from the system."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={confirmDelete} disabled={isDeleting}>
              {isDeleting ? "Processing..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
