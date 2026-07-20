import { Button } from "@heroui/react";
import { Camera } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { GalleryGrid, GalleryUploadForm } from "@/components/features/gallery";
import { useDrawerStore } from "@/store/drawerStore";

/**
 * Gallery Manager — curate visual impact assets for the public site.
 */
export default function GalleryManager(): React.ReactElement {
  const openDrawer = useDrawerStore((s) => s.openDrawer);

  function openUploadDrawer(): void {
    openDrawer({
      title: "Add Gallery Media",
      description:
        "Upload multiple photos or videos, then review details before saving.",
      size: "2xl",
      content: <GalleryUploadForm />,
    });
  }

  return (
    <div>
      <PageHeader
        title="Gallery Manager"
        description="Curate and manage visual impact stories"
        actions={
          <Button
            color="primary"
            className="font-semibold tracking-wide"
            startContent={<Camera className="h-4 w-4" />}
            onPress={openUploadDrawer}
          >
            Upload New
          </Button>
        }
      />
      <GalleryGrid />
    </div>
  );
}
