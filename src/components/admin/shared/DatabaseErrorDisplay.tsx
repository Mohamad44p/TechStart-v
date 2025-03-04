import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

interface DatabaseErrorDisplayProps {
  title: string;
  error: string;
  createHref?: string;
  createLabel?: string;
}

export function DatabaseErrorDisplay({
  title,
  error,
  createHref,
  createLabel = "Create New",
}: DatabaseErrorDisplayProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        {createHref && (
          <Link href={createHref} passHref>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {createLabel}
            </Button>
          </Link>
        )}
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-amber-800 mb-2">Database Connection Error</h2>
        <p className="text-amber-700 mb-4">
          {error}
        </p>
        <p className="text-sm text-amber-600">
          {createHref 
            ? "You can try creating a new item, but the database connection issue should be resolved first."
            : "The database connection issue should be resolved before you can add or edit items."}
        </p>
      </div>
    </div>
  );
}

export function EmptyDataDisplay({
  title,
  message,
  createHref,
  createLabel = "Create New",
}: {
  title: string;
  message: string;
  createHref: string;
  createLabel?: string;
}) {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Link href={createHref} passHref>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {createLabel}
          </Button>
        </Link>
      </div>
      
      <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">No Data Found</h2>
        <p className="text-gray-600 mb-4">
          {message}
        </p>
        <Link href={createHref} passHref>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {createLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
} 