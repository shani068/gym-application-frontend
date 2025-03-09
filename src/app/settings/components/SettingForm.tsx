 
'use client'

import { useState } from 'react'
import { Dumbbell, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SettingForm() {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="gymName">Gym Name</Label>
            <Input
              id="gymName"
              placeholder="Enter gym name"
              defaultValue="Gym Management"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gymLogo">Gym Logo</Label>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="relative"
                onClick={() => document.getElementById('logoInput')?.click()}
              >
                Choose file
                <input
                  id="logoInput"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              <span className="text-sm text-muted-foreground">
                {file ? file.name : 'No file chosen'}
              </span>
            </div>
          </div>

          <div className="flex justify-center py-8">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-16 h-16 text-muted-foreground" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Dumbbell className="w-12 h-12 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency Format</Label>
            <Input
              id="currency"
              placeholder="Enter currency format"
              defaultValue="Rs."
            />
          </div>

          <div className="pt-4">
            <Button className="w-full sm:w-auto" size="lg">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

