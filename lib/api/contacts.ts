import { supabase } from "@/lib/supabase/client";

export interface Contact {
  name: string;
  address: string;
  avatar: string;
}

export async function getRecentContacts(
  walletAddress: string,
): Promise<Contact[]> {
  const { data, error } = await supabase
    .from("contacts")
    .select(
      `
      contact_wallet,
      last_used_at,
      contact:profiles!contacts_contact_wallet_fkey (
        username,
        avatar_url,
        wallet_address
      )
    `,
    )
    .eq("owner_wallet", walletAddress)
    .order("last_used_at", { ascending: false })
    .limit(4);

  if (error) {
    console.error("Error fetching recent contacts:", error);
    return [];
  }

  return (data || []).map((row) => {
    const contact = Array.isArray(row.contact)
      ? row.contact[0]
      : row.contact;
    return {
      name: contact?.username || row.contact_wallet.slice(0, 8) + "...",
      address: row.contact_wallet,
      avatar: contact?.avatar_url || "/placeholder.svg",
    };
  });
}

export async function upsertContact(
  ownerWallet: string,
  contactWallet: string,
): Promise<void> {
  const { error } = await supabase.from("contacts").upsert(
    {
      owner_wallet: ownerWallet,
      contact_wallet: contactWallet,
      last_used_at: new Date().toISOString(),
    },
    { onConflict: "owner_wallet,contact_wallet" },
  );

  if (error) {
    console.error("Error upserting contact:", error);
  }
}
