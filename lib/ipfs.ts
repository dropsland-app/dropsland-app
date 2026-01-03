import axios from "axios";
import {
  PINATA_JWT,
  // PINATA_GATEWAY_URL, -- Unused
  PINATA_GROUP_ID,
} from "@/config/app";

/**
 * Uploads a File (Image/Video) to IPFS via Pinata
 */
export const uploadFileToIPFS = async (file: File) => {
  try {
    if (!PINATA_JWT) throw new Error("Pinata JWT is missing.");

    const formData = new FormData();
    formData.append("file", file);

    // Optional: Add Pinata Metadata
    const metadata = JSON.stringify({
      name: `Asset - ${file.name}`,
      keyvalues: { type: "merch_asset" },
    });
    formData.append("pinataMetadata", metadata);

    // Optional: Add Group ID
    if (PINATA_GROUP_ID) {
      const options = JSON.stringify({
        cidVersion: 1,
        groupId: PINATA_GROUP_ID,
      });
      formData.append("pinataOptions", options);
    }

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          // Axios sets Content-Type: multipart/form-data automatically
        },
      },
    );

    return `ipfs://${res.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw error;
  }
};

/**
 * Uploads a JSON object (Metadata) to IPFS via Pinata
 */
export const uploadJSONToIPFS = async (content: any) => {
  try {
    if (!PINATA_JWT) throw new Error("Pinata JWT is missing.");

    const payload = {
      pinataContent: content,
      pinataMetadata: {
        name: content.name
          ? `Metadata - ${content.name}`
          : "Dropsland Metadata",
        keyvalues: { type: "merch_metadata" },
      },
      pinataOptions: {
        cidVersion: 1,
        groupId: PINATA_GROUP_ID,
      },
    };

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      payload,
      {
        headers: {
          Authorization: `Bearer ${PINATA_JWT}`,
          "Content-Type": "application/json",
        },
      },
    );

    return `ipfs://${res.data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading JSON to IPFS:", error);
    throw error;
  }
};
