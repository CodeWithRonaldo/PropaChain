import { PinataSDK } from "pinata";
import { toast } from "react-hot-toast";

const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: import.meta.env.VITE_GATEWAY_URL,
});

export const uploadImageVideoFile = async (
    e,
    image,
    video,
    document,
    toastId
) => {
    e.preventDefault();

    try {
        if (!image) {
            toast.error("Please upload an image.", { id: toastId });
            return null;
        }

        const uploadPromises = [];

        // Upload Image
        uploadPromises.push(
            pinata.upload.file(image).then((res) => ({ type: "image", cid: res.cid }))
        );

        // Upload Video if exists
        if (video) {
            uploadPromises.push(
                pinata.upload.file(video).then((res) => ({ type: "video", cid: res.cid }))
            );
        }

        // Upload Document if exists
        if (document) {
            uploadPromises.push(
                pinata.upload.file(document).then((res) => ({ type: "document", cid: res.cid }))
            );
        }

        const results = await Promise.all(uploadPromises);
        
        // Construct return object
        const cids = {};
        results.forEach(res => {
            cids[res.type] = res.cid;
        });

        return cids;

    } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Failed to upload files to IPFS.", { id: toastId });
        return null;
    }
};
