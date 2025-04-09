"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Camera } from "lucide-react"

/**
 * EditCameraModal Component
 *
 * A modal component for editing camera details. It allows users to update the
 * name, model, status, and location of a camera. The changes are submitted to
 * the server via a PUT request.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.camera - The camera object to be edited.
 * @param {string} props.camera.owner - The owner ID of the camera.
 * @param {string} props.camera.camera_Name - The name of the camera.
 * @param {string} props.camera.model - The model of the camera.
 * @param {string} props.camera.status - The current status of the camera (e.g., "Online", "Offline", "Maintenance").
 * @param {string} props.camera.location - The location of the camera.
 * @param {Function} props.onClose - Callback function to close the modal.
 * @param {Function} props.onUpdate - Callback function to handle the updated camera data.
 *
 * @returns {JSX.Element} The rendered EditCameraModal component.
 */
export const EditCameraModal = ({ camera, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    owner: camera.owner,
    camera_Name: camera.camera_Name,
    model: camera.model,
    status: camera.status,
    location: camera.location,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = { // Prepare the payload for the PUT request
      owner: camera.owner,
      camera_Name: formData.camera_Name,
      model: formData.model,
      status: formData.status,
      location: formData.location,
    }

    console.log("Request payload:", payload)

    try {
      const res = await fetch("/api/auth/camerasAPI", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to update camera")
      }

      const data = await res.json()
      onUpdate(data.camera)
      onClose()
      alert("Camera updated successfully")
      window.location.reload() // Reload the page to reflect changes

    } catch (err) {
      console.error("Error updating camera:", err)
      alert(err.message)
    }
  }

return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-gray-200 rounded-lg shadow-lg w-full max-w-lg mx-6 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                        <Camera className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-semibold">Edit Camera</h2>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-5">
                    {/* Camera Name */}
                    <div className="space-y-3">
                        <Label htmlFor="camera_Name" className="block text-sm font-medium">
                            Name
                        </Label>
                        <Input
                            id="camera_Name"
                            type="text"
                            value={formData.camera_Name}
                            onChange={(e) => setFormData({ ...formData, camera_Name: e.target.value })}
                            className="w-full"
                            required
                        />
                    </div>

                    {/* Model */}
                    <div className="space-y-3">
                        <Label htmlFor="model" className="block text-sm font-medium">
                            Model
                        </Label>
                        <Input
                            id="model"
                            type="text"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            className="w-full"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-3">
                        <Label htmlFor="status" className="block text-sm font-medium">
                            Status
                        </Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Online">Online</SelectItem>
                                <SelectItem value="Offline">Offline</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Location */}
                    <div className="space-y-3">
                        <Label htmlFor="location" className="block text-sm font-medium">
                            Location
                        </Label>
                        <Input
                            id="location"
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full"
                            required
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-5">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    </div>
)
}

export default EditCameraModal
