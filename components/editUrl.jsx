import { useState } from "react";
import { Button } from "@components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@components/ui/dialog";
import { Input } from "./ui/input";
import { Save } from "lucide-react";

export function EditUrlDialog({ open, setOpen, urlToEdit, handleEdit }) {
  const [newShortenUrl, setNewShortenUrl] = useState(urlToEdit?.shortenUrl || "");

  const handleCancel = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (newShortenUrl !== urlToEdit.shortenUrl) {
      handleEdit(urlToEdit._id, newShortenUrl);
    }
    setOpen(false); // Close the dialog after saving
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogContent className="max-w-[90%] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Shortened URL</DialogTitle>
          <DialogDescription>
            Modify the shortened URL below. Make sure the new URL is unique and valid.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2">
          <label htmlFor="shortenUrl" className="block text-sm font-medium text-gray-700">Shortened URL</label>
          <Input
            type="text"
            id="shortenUrl"
            value={newShortenUrl}
            onChange={(e) => setNewShortenUrl(e.target.value)}
            className="w-full p-2 mt-2 border rounded-md focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Enter new shortened URL"
          />
        </div>

        <DialogFooter className="gap-2 mx-8 sm:ml-0 sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} variant="outline" className="flex items-center gap-2">
            <Save className="w-4 h-4" />Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
