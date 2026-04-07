
"use client";

import { useMemo, useState } from "react";
import { Camera, MoreHorizontal, Pencil, Plus, Search, Trash2, Upload, UserRound } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

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

const initialStaff: StaffRecord[] = [
  { id: "1", name: "J.M. Hansi Sandamini Bhagya", position: "Chief Cashier", contactInfo: "hansi.bhagya@example.com", status: true, imageUrl: "/images/staff/chief-cashier-j-m-hansi-sandamini-bhagya.jpg", cropLabel: "Centered face crop", updatedAt: "2026-04-05" },
  { id: "2", name: "Prasanna Walukumara", position: "Sales Assistant", contactInfo: "prasanna.walukumara@example.com", status: true, imageUrl: "/images/staff/sales-assistant-prasanna-walukumara.jpg", cropLabel: "Head and shoulders", updatedAt: "2026-04-04" },
  { id: "3", name: "C. Swetha Gimhani Fonseka", position: "Cashier", contactInfo: "swetha.fonseka@example.com", status: true, imageUrl: "/images/staff/cashier-c-swetha-gimhani-fonseka.jpg", cropLabel: "Balanced portrait", updatedAt: "2026-04-03" },
  { id: "4", name: "V. Kishan", position: "Sales Assistant", contactInfo: "kishan@example.com", status: false, imageUrl: "/images/staff/sales-assistant-v-kishan.jpg", cropLabel: "Zoomed profile", updatedAt: "2026-04-02" },
];

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

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffRecord[]>(initialStaff);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffRecord>(emptyStaff);
  const [pendingDelete, setPendingDelete] = useState<StaffRecord | null>(null);
  const [mockUploadName, setMockUploadName] = useState<string>("");

  const filteredStaff = useMemo(() => {
    return staff.filter((member) => {
      const matchesSearch = [member.name, member.position, member.contactInfo].join(" ").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? member.status : !member.status);
      return matchesSearch && matchesStatus;
    });
  }, [search, staff, statusFilter]);

  const openAddDialog = () => {
    setEditingStaff({ ...emptyStaff, id: `mock-${Date.now()}` });
    setMockUploadName("");
    setIsFormOpen(true);
  };

  const openEditDialog = (member: StaffRecord) => {
    setEditingStaff({ ...member });
    setMockUploadName(member.imageUrl ? "Existing profile image" : "");
    setIsFormOpen(true);
  };

  const saveStaff = () => {
    setStaff((current) => {
      const exists = current.some((member) => member.id === editingStaff.id);
      const payload = { ...editingStaff, updatedAt: "2026-04-06" };
      return exists ? current.map((member) => (member.id === payload.id ? payload : member)) : [payload, ...current];
    });
    setIsFormOpen(false);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setStaff((current) => current.filter((member) => member.id !== pendingDelete.id));
    setPendingDelete(null);
    setIsDeleteOpen(false);
  };

  const applyMockCrop = (preset: string) => {
    setEditingStaff((current) => ({
      ...current,
      imageUrl: current.imageUrl || "/images/staff/default-staff.svg",
      cropLabel: preset,
    }));
    setIsCropOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-fit bg-slate-100 text-slate-600">UI Preview</Badge>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">Staff directory</CardTitle>
              <CardDescription className="mt-1 text-sm text-slate-500">
                Hardcoded preview for add, edit, delete, and profile photo crop flow before backend integration.
              </CardDescription>
            </div>
          </div>
          <Button className="h-11 bg-slate-900 text-white shadow-sm hover:bg-slate-800" onClick={openAddDialog}>
            <Plus className="mr-2 size-4" />
            Add Staff
          </Button>
        </CardHeader>
      </Card>

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
          <span>Total preview staff</span>
          <Badge variant="secondary">{filteredStaff.length}</Badge>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="text-xl font-semibold text-slate-900">Staff management list</CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Review profile status and open the add/edit/delete flows from this single list.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                      <p className="text-sm text-slate-500">{member.position}</p>
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
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-[calc(100vw-1.5rem)] sm:max-w-[1100px] overflow-hidden p-0">
          <DialogHeader className="border-b border-slate-200 px-6 py-5 text-left">
            <DialogTitle>{staff.some((member) => member.id === editingStaff.id) ? "Edit staff member" : "Add staff member"}</DialogTitle>
            <DialogDescription>
              UI-only preview flow. This dialog will later connect to the real API and image upload pipeline.
            </DialogDescription>
          </DialogHeader>

          <div className="grid max-h-[82vh] gap-0 overflow-y-auto md:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
            <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-5 md:border-b-0 md:border-r md:px-6 md:py-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="space-y-2 pb-3">
                  <CardTitle className="text-base">Profile picture</CardTitle>
                  <CardDescription>
                    Mock flow for upload, crop, reposition, and preview before we build the backend save flow.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-center">
                    <Avatar className="h-28 w-28 rounded-2xl border border-slate-200">
                      <AvatarImage src={editingStaff.imageUrl || "/images/staff/default-staff.svg"} alt={editingStaff.name || "Preview"} />
                      <AvatarFallback className="rounded-2xl bg-slate-100 text-slate-700">
                        <UserRound className="size-10" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{mockUploadName || "No image uploaded yet"}</p>
                      <p className="text-sm text-slate-500">{editingStaff.cropLabel || "Square crop preview recommended for kiosk staff card."}</p>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
                    <Button variant="outline" onClick={() => { setMockUploadName("new-profile-photo.jpg"); setIsCropOpen(true); }}>
                      <Upload className="mr-2 size-4" /> Upload / Replace image
                    </Button>
                    <Button variant="outline" onClick={() => setIsCropOpen(true)}>
                      <Camera className="mr-2 size-4" /> Adjust crop
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full sm:col-span-2 md:col-span-1 text-slate-600"
                      onClick={() => {
                        setMockUploadName("");
                        setEditingStaff((current) => ({ ...current, imageUrl: "/images/staff/default-staff.svg", cropLabel: "No crop applied yet" }));
                      }}
                    >
                      Remove preview image
                    </Button>
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
                  <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
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
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={saveStaff}>Save Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCropOpen} onOpenChange={setIsCropOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Adjust profile crop</DialogTitle>
            <DialogDescription>
              UI-only crop concept. Later this will become the real crop/position tool before saving a resized profile image.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
              <div className="flex aspect-square items-center justify-center rounded-2xl border border-slate-200 bg-white text-center text-slate-500 whitespace-pre-line">
                Drag / zoom crop area preview
(Facebook-style crop flow will go here)
              </div>
            </div>
            <div className="space-y-4">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Crop presets</CardTitle>
                  <CardDescription>Choose the framing style you want to preview.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => applyMockCrop("Centered face crop")}>Centered face crop</Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => applyMockCrop("Head and shoulders crop")}>Head and shoulders</Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => applyMockCrop("Zoomed portrait crop")}>Zoomed portrait</Button>
                </CardContent>
              </Card>
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Final output</CardTitle>
                  <CardDescription>Store only the kiosk-ready image size later, not the original upload.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Planned export: square image, resized for frontend usage only.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete staff preview item?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete ? `This will remove ${pendingDelete.name} from the UI preview list only.` : "This will remove the selected staff item from the preview list."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-rose-600 hover:bg-rose-700" onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
