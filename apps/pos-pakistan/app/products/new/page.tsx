import { AppFrame } from "../../AppFrame";
import { NewProductClient } from "./NewProductClient";

export default function NewProductPage() {
  return (
    <AppFrame pageTitle="Add Product">
      <div className="max-w-lg rounded-xl border border-[var(--border-subtle)] bg-[var(--panel)] p-6 shadow-sm">
        <NewProductClient />
      </div>
    </AppFrame>
  );
}
