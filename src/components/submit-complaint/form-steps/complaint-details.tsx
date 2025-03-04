import { useState, FormEvent } from "react"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

interface ComplaintDetailsData {
  facts: string
}

interface ComplaintDetailsProps {
  onNext: (data: ComplaintDetailsData) => void
  onPrevious: () => void
  data?: ComplaintDetailsData
}

export function ComplaintDetails({ onNext, onPrevious, data }: ComplaintDetailsProps) {
  const [formData, setFormData] = useState<ComplaintDetailsData>({
    facts: data?.facts || "",
  })

  const validateForm = () => {
    if (!formData.facts.trim()) {
      toast({
        title: "Error",
        description: "Facts and grounds of the complaint are required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    onNext(formData);
  }

  return (
    <motion.form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="facts">Facts and grounds of the complaint</Label>
        <Textarea
          id="facts"
          rows={6}
          value={formData.facts}
          onChange={(e) => setFormData({ ...formData, facts: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" onClick={onPrevious} variant="outline">Previous</Button>
        <Button type="submit">Next</Button>
      </div>
    </motion.form>
  )
}

