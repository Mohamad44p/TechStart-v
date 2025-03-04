"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteStat } from "@/app/actions/pages/statActions";
import { useRouter } from "next/navigation";
import { AVAILABLE_ICONS, type IconName } from "@/config/icons";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react";

type Stat = {
  id: string;
  name_en: string;
  name_ar: string;
  value: number;
  icon: string;
  suffix_en: string;
  suffix_ar: string;
};

export function StatsList({ stats }: { stats: Stat[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteStat(id);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>English Name</TableHead>
            <TableHead>Arabic Name</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Icon</TableHead>
            <TableHead>English Suffix</TableHead>
            <TableHead>Arabic Suffix</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.map((stat) => {
            const Icon = AVAILABLE_ICONS[
              stat.icon as IconName
            ] as React.ComponentType<{ className?: string }>;
            return (
              <TableRow key={stat.id}>
                <TableCell>{stat.name_en}</TableCell>
                <TableCell dir="rtl">{stat.name_ar}</TableCell>
                <TableCell>{stat.value.toLocaleString()}</TableCell>
                <TableCell>
                  {Icon &&
                    React.createElement(Icon, {
                      className: "h-6 w-6 text-primary",
                    })}
                </TableCell>
                <TableCell>{stat.suffix_en}</TableCell>
                <TableCell dir="rtl">{stat.suffix_ar}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href={`/admin/pages/stats/${stat.id}`} passHref>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteId(stat.id)}
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the stat and remove it from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteId && handleDelete(deleteId)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {stats.length === 0 && (
        <p className="text-center text-muted-foreground">No stats found.</p>
      )}
    </div>
  );
}
