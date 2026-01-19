import { useState, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"sections" | "photos">("sections");
  const [isUploading, setIsUploading] = useState(false);
  
  const authenticate = useMutation(api.admin.authenticate);
  const sections = useQuery(api.sections.list) || [];
  const createSection = useMutation(api.sections.create);
  const updateSection = useMutation(api.sections.update);
  const removeSection = useMutation(api.sections.remove);
  const createPhoto = useMutation(api.photos.create);
  const removePhoto = useMutation(api.photos.remove);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const [editingSection, setEditingSection] = useState<any>(null);
  const [newSection, setNewSection] = useState({ name: "", description: "", order: 0 });
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [newPhoto, setNewPhoto] = useState({ title: "", description: "", date: "", order: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await authenticate({ password });
      if (success) {
        setIsAuthenticated(true);
        toast.success("Authenticated successfully");
      } else {
        toast.error("Invalid password");
      }
    } catch (error) {
      toast.error("Authentication failed");
    }
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSection(newSection);
      setNewSection({ name: "", description: "", order: 0 });
      toast.success("Section created");
    } catch (error) {
      toast.error("Failed to create section");
    }
  };

  const handleUpdateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    
    try {
      await updateSection({
        id: editingSection._id,
        name: editingSection.name,
        description: editingSection.description,
        order: editingSection.order,
      });
      setEditingSection(null);
      toast.success("Section updated");
    } catch (error) {
      toast.error("Failed to update section");
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    
    try {
      await removeSection({ id: id as any });
      toast.success("Section deleted");
    } catch (error) {
      toast.error("Failed to delete section");
    }
  };

  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSectionId || !fileInputRef.current?.files?.[0]) {
      toast.error("Please select a section and file");
      return;
    }

    setIsUploading(true);
    try {
      const file = fileInputRef.current.files[0];
      
      // Upload original image
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      const { storageId } = await result.json();
      
      // Create photo record
      await createPhoto({
        ...newPhoto,
        sectionId: selectedSectionId as any,
        imageId: storageId,
      });
      
      setNewPhoto({ title: "", description: "", date: "", order: 0 });
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Photo uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-lg w-96">
          <h1 className="text-2xl font-light mb-6 text-center">Admin Access</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded mb-4 text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-white text-black p-3 rounded hover:bg-gray-200 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-light mb-8">Admin Panel</h1>
        
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab("sections")}
            className={`px-4 py-2 rounded ${
              activeTab === "sections" ? "bg-white text-black" : "bg-gray-800"
            }`}
          >
            Sections
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-4 py-2 rounded ${
              activeTab === "photos" ? "bg-white text-black" : "bg-gray-800"
            }`}
          >
            Photos
          </button>
        </div>

        {activeTab === "sections" && (
          <div className="space-y-8">
            {/* Create Section */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-xl mb-4">Create New Section</h2>
              <form onSubmit={handleCreateSection} className="space-y-4">
                <input
                  type="text"
                  value={newSection.name}
                  onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                  placeholder="Section name"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                  required
                />
                <textarea
                  value={newSection.description}
                  onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                  placeholder="Description"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white h-24"
                  required
                />
                <input
                  type="number"
                  value={newSection.order}
                  onChange={(e) => setNewSection({ ...newSection, order: parseInt(e.target.value) })}
                  placeholder="Order"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition-colors"
                >
                  Create Section
                </button>
              </form>
            </div>

            {/* Existing Sections */}
            <div className="space-y-4">
              <h2 className="text-xl">Existing Sections</h2>
              {sections.map((section) => (
                <div key={section._id} className="bg-gray-900 p-4 rounded-lg">
                  {editingSection?._id === section._id ? (
                    <form onSubmit={handleUpdateSection} className="space-y-4">
                      <input
                        type="text"
                        value={editingSection.name}
                        onChange={(e) => setEditingSection({ ...editingSection, name: e.target.value })}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                      />
                      <textarea
                        value={editingSection.description}
                        onChange={(e) => setEditingSection({ ...editingSection, description: e.target.value })}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white h-20"
                      />
                      <input
                        type="number"
                        value={editingSection.order}
                        onChange={(e) => setEditingSection({ ...editingSection, order: parseInt(e.target.value) })}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                      />
                      <div className="space-x-2">
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSection(null)}
                          className="bg-gray-600 text-white px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">{section.name}</h3>
                        <p className="text-gray-400">{section.description}</p>
                        <p className="text-sm text-gray-500">Order: {section.order}</p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => setEditingSection(section)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "photos" && (
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-xl mb-4">Upload New Photo</h2>
            <form onSubmit={handlePhotoUpload} className="space-y-4">
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                required
              >
                <option value="">Select a section</option>
                {sections.map((section) => (
                  <option key={section._id} value={section._id}>
                    {section.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newPhoto.title}
                onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                placeholder="Photo title"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                required
              />
              <textarea
                value={newPhoto.description}
                onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                placeholder="Description"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white h-24"
                required
              />
              <input
                type="date"
                value={newPhoto.date}
                onChange={(e) => setNewPhoto({ ...newPhoto, date: e.target.value })}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                required
              />
              <input
                type="number"
                value={newPhoto.order}
                onChange={(e) => setNewPhoto({ ...newPhoto, order: parseInt(e.target.value) })}
                placeholder="Order"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                required
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                required
              />
              <button
                type="submit"
                disabled={isUploading}
                className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? "Uploading..." : "Upload Photo"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
