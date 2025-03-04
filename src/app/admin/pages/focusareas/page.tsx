import { columns } from "./columns";
import { focusareasTableConfig } from "./config";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/admin/Gallary/tabel/data-table";
import { getFocusareas } from "@/app/actions/pages/focusareas-actions";
import { Focusarea } from "@/types/focusarea";

export default async function Focusareas() {
  const focusareas: Focusarea[] = await getFocusareas();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Focus Areas</h1>
        <Link href="/admin/pages/focusareas/create" passHref prefetch>
          <Button>Create New Focus Area</Button>
        </Link>
      </div>
      <DataTable 
        columns={columns} 
        data={focusareas} 
        config={focusareasTableConfig}
      />
    </div>
  );
}
