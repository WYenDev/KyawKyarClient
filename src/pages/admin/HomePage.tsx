import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2 } from "lucide-react";
import { useGetApiHome, usePostApiHomeImage, usePatchApiHome } from "../../services/api";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  // ----- QUERIES -----
  const { data: homeData, isLoading } = useGetApiHome();
  const image = homeData?.image;

  // ----- LOCAL FORM STATE -----
  const [phoneNo, setPhoneNo] = useState<string>(homeData?.phoneNo ?? "");
  const [viberNo, setViberNo] = useState<string>(homeData?.viberNo ?? "");

  useEffect(() => {
    setPhoneNo(homeData?.phoneNo ?? "");
    setViberNo(homeData?.viberNo ?? "");
  }, [homeData]);

  // ----- MUTATIONS -----
  const { mutate: uploadImage } = usePostApiHomeImage({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/home"] });
      },
      onError: (error) => {
        console.error("Upload failed", error);
        alert("Failed to upload image.");
      },
    },
  });

  const patchOptions = {
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/home"] });
        alert("Home contact info updated.");
      },
      onError: (error: any) => {
        console.error("Failed to update home info", error);
        alert("Failed to save contact info.");
      },
    },
  } as const;

  const { mutate: patchHome, isPending: isPatching } = usePatchApiHome(patchOptions);

  // ----- HANDLERS -----
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setUploading(true);

    uploadImage(
      { data: { image: file } },
      {
        onSettled: () => {
          setUploading(false);
        },
      }
    );
  };

  const handleSaveContact = () => {
    const payload: { phoneNo?: string; viberNo?: string } = {};
    payload.phoneNo = phoneNo?.trim() || undefined;
    payload.viberNo = viberNo?.trim() || undefined;

    patchHome({ data: payload });
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="bg-[#F8F9FB] min-h-full p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Home Page Hero Image</h1>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <p className="text-gray-500 mb-8">Upload the main hero image for the Home page.</p>

            <div className="border rounded-xl p-4 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Current Image</span>
              </div>

              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative group border-2 border-dashed border-gray-300 flex items-center justify-center">
                {image ? (
                  <>
                    <img src={image.url} alt="Home hero" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
                        Replace
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-indigo-600 transition p-4">
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        <Plus size={24} />
                      </div>
                      <span className="text-sm font-medium">Upload Image</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                )}

                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <Loader2 className="animate-spin text-indigo-600" />
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-400">Recommended size: similar aspect ratio to your hero section.</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Home Contact Info</h2>
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-2">Phone Number</span>
                <input
                  type="text"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  placeholder="e.g. +959123456789"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium text-gray-700 mb-2">Viber Number</span>
                <input
                  type="text"
                  value={viberNo}
                  onChange={(e) => setViberNo(e.target.value)}
                  placeholder="e.g. +959123456789"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2"
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveContact}
                disabled={isPatching}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isPatching ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Contact Info</span>
                )}
              </button>
              <button
                onClick={() => {
                  setPhoneNo(homeData?.phoneNo ?? "");
                  setViberNo(homeData?.viberNo ?? "");
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-white"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
