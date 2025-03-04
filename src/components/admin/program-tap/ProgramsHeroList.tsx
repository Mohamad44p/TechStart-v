"use client";

import { useState } from "react";
import type { ProgramsHero, ProgramsPages } from "@/types/programs-hero";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { deleteProgramsHero } from "@/app/actions/programs-hero-actions";
import Link from "next/link";

interface ProgramsHeroWithProgram extends ProgramsHero {
  programPage: ProgramsPages | null;
}

interface ProgramsHeroListProps {
  initialProgramsHeroes: ProgramsHeroWithProgram[];
}

export default function ProgramsHeroList({
  initialProgramsHeroes,
}: ProgramsHeroListProps) {
  const [programsHeroes, setProgramsHeroes] = useState(initialProgramsHeroes);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this programs hero?")) {
      const result = await deleteProgramsHero(id);
      if (result.success) {
        setProgramsHeroes(programsHeroes.filter((hero) => hero.id !== id));
        toast({
          title: "Programs hero deleted",
          description: "The programs hero has been deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }
  };

  if (programsHeroes.length === 0) {
    return (
      <div>No programs heroes found. Create a new one to get started.</div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Associated Program</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {programsHeroes.map((hero) => (
          <TableRow key={hero.id}>
            <TableCell>{hero.name}</TableCell>
            <TableCell>{hero.programPage?.name_en || "N/A"}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Link href={`/admin/programs-hero/edit/${hero.id}`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(hero.id)}
                >
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
