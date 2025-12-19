import { redirect } from "next/navigation";

export default function WalletPage() {
  // Automatically redirect /wallet -> /wallet/events
  redirect("/wallet/events");
}
