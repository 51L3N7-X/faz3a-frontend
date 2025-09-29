"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

type ProfessionalDialogProps = {
  onSave: (data: {
    name: string
    email: string
    phone: string
    status: string
    yearsOfExp: string
    governorate: string
  }) => void
}

export function ProfessionalDialog({ onSave }: ProfessionalDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active",
    yearsOfExp: "",
    governorate: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    toast.success("Professional created successfully!")
    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "active",
      yearsOfExp: "",
      governorate: ""
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" onClick={() => setOpen(true)}>New Professional</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Professional</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
              id="name" 
              className="col-span-3" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input 
              id="email" 
              type="email" 
              className="col-span-3" 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input 
              id="phone" 
              className="col-span-3" 
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select 
              value={formData.status}
              onValueChange={(value) => setFormData(prev => ({...prev, status: value}))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="yearsOfExp" className="text-right">
              Experience (years)
            </Label>
            <Input 
              id="yearsOfExp" 
              type="number" 
              className="col-span-3" 
              value={formData.yearsOfExp}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="governorate" className="text-right">
              Governorate
            </Label>
            <Input 
              id="governorate" 
              className="col-span-3" 
              value={formData.governorate}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
